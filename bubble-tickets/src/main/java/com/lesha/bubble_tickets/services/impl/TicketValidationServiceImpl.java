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

        return validateTicket(ticket);
    }

    private TicketValidation validateTicket(Ticket ticket) {
        TicketValidation ticketValidation = new TicketValidation();
        ticketValidation.setTicket(ticket);
        //sets the validation method to QR_SCAN, even when called from validateTicketManually
        //passing the method type as a parameter to reflect the actual validation method
        ticketValidation.setValidationMethod(TicketValidationMethodEnum.QR_SCAN);

        TicketValidationStatusEnum ticketValidationStatus = ticket.getValidations().stream()
                .filter(v -> TicketValidationStatusEnum.VALID.equals(
                        v.getStatus())).findFirst()
                .map( v -> TicketValidationStatusEnum.INVALID)
                .orElse(TicketValidationStatusEnum.VALID);

        ticketValidation.setStatus(ticketValidationStatus);

        return ticketValidationRepository.save(ticketValidation);
    }

    @Override
    public TicketValidation validateTicketManually(UUID ticketId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(TicketNotFoundException::new);

        return validateTicket(ticket);
    }
}
