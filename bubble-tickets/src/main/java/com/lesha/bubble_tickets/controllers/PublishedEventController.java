package com.lesha.bubble_tickets.controllers;

import com.lesha.bubble_tickets.domain.dtos.ListPublishedEventsResponseDto;
import com.lesha.bubble_tickets.domain.entities.Event;
import com.lesha.bubble_tickets.mappers.EventMapper;
import com.lesha.bubble_tickets.services.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/api/v1/published-events")
@RequiredArgsConstructor
public class PublishedEventController {

    private final EventService eventService;

    private final EventMapper eventMapper;

    @GetMapping
    public ResponseEntity<Page<ListPublishedEventsResponseDto>>  listPublishedEvents(
            @RequestParam(required = false) String q,
            Pageable pageable) {

        Page<Event> events;
        if(null != q && !q.trim().isEmpty()) {
            events = eventService.searchPublishedEvents(q, pageable);
        } else {
            events = eventService.listPublishedEvents(pageable);
        }

        return ResponseEntity.ok(
                 events.map(eventMapper::toListPublishedEventsResponseDto));
    }
}
