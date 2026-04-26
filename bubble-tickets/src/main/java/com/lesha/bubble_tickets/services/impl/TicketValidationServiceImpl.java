package com.lesha.bubble_tickets.services.impl;

import com.lesha.bubble_tickets.domain.entities.*;
import com.lesha.bubble_tickets.exceptions.QrCodeNotFoundException;
import com.lesha.bubble_tickets.exceptions.TicketNotFoundException;
import com.lesha.bubble_tickets.repositories.QrCodeRepository;
import com.lesha.bubble_tickets.repositories.TicketRepository;
import com.lesha.bubble_tickets.repositories.TicketValidationRepository;
import com.lesha.bubble_tickets.services.TicketValidationService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class TicketValidationServiceImpl implements TicketValidationService {

    private final QrCodeRepository qrCodeRepository;
    private final TicketValidationRepository ticketValidationRepository;
    private final TicketRepository ticketRepository;

    @Override
    public TicketValidation validateTicketByQrCode(UUID qrCodeId) {
        QrCode qrCode = qrCodeRepository.findByIdAndStatus(qrCodeId, QRCodeStatusEnum.ACTIVE)
                .orElseThrow(() ->new QrCodeNotFoundException(
                        String.format("QR Code with ID %s was not found", qrCodeId)
                ));

        Ticket ticket = qrCode.getTicket();

        return validateTicket(ticket, TicketValidationMethodEnum.QR_SCAN);
    }

    private TicketValidation validateTicket(Ticket ticket, TicketValidationMethodEnum method) {
        TicketValidation ticketValidation = new TicketValidation();
        ticketValidation.setTicket(ticket);
        ticketValidation.setValidationMethod(method);

        ticketValidation.setStatus(resolveValidationStatus(ticket));

        return ticketValidationRepository.save(ticketValidation);
    }

    private TicketValidationStatusEnum resolveValidationStatus(Ticket ticket) {
        if (ticket.getStatus() != TicketStatusEnum.PURCHASED) {
            return TicketValidationStatusEnum.INVALID;
        }

        Event event = ticket.getTicketType().getEvent();
        if (event.getStatus() == EventStatusEnum.CANCELLED) {
            return TicketValidationStatusEnum.INVALID;
        }
        if (event.getStatus() == EventStatusEnum.COMPLETED
                || (event.getEnd() != null && LocalDateTime.now().isAfter(event.getEnd()))) {
            return TicketValidationStatusEnum.EXPIRED;
        }

        boolean alreadyValidated = ticket.getValidations().stream()
                .anyMatch(v -> TicketValidationStatusEnum.VALID.equals(v.getStatus()));
        if (alreadyValidated) {
            return TicketValidationStatusEnum.INVALID;
        }

        return TicketValidationStatusEnum.VALID;
    }

    @Override
    public TicketValidation validateTicketManually(UUID ticketId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(TicketNotFoundException::new);

        return validateTicket(ticket, TicketValidationMethodEnum.MANUAL);
    }
}
