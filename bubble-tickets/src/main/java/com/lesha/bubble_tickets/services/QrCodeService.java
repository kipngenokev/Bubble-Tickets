package com.lesha.bubble_tickets.services;

import com.lesha.bubble_tickets.domain.entities.QrCode;
import com.lesha.bubble_tickets.domain.entities.Ticket;
import org.springframework.stereotype.Service;

@Service
public interface QrCodeService {
    QrCode generateQrCode(Ticket ticket);
}
