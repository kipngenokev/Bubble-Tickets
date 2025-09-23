package com.lesha.bubble_tickets.services;

import com.fasterxml.jackson.databind.deser.std.UUIDDeserializer;
import com.lesha.bubble_tickets.domain.entities.Ticket;

import java.util.UUID;

public interface TicketTypeService {
    Ticket purchaseTicket(UUID userId, UUID ticketTypeId);
}
