package com.lesha.bubble_tickets.services;

import com.lesha.bubble_tickets.domain.entities.Ticket;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface TicketService {
    Page<Ticket> listTicketsForUser(UUID userId, Pageable pageable);
}
