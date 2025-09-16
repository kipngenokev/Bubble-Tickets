package com.lesha.bubble_tickets.services;

import com.lesha.bubble_tickets.domain.CreateEventRequest;
import com.lesha.bubble_tickets.domain.entities.Event;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public interface EventService {
    Event createEvent(UUID organizerId, CreateEventRequest event);
}
