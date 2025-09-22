package com.lesha.bubble_tickets.services.impl;

import com.lesha.bubble_tickets.domain.entities.QrCode;
import com.lesha.bubble_tickets.domain.entities.Ticket;
import com.lesha.bubble_tickets.services.QrCodeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class QrCodeServiceImpl implements QrCodeService {
    @Override
    public QrCode generateQrCode(Ticket ticket) {
        return null;
    }
}
