package com.lesha.bubble_tickets.controllers;

import com.lesha.bubble_tickets.domain.dtos.ListTicketResponseDto;
import com.lesha.bubble_tickets.mappers.TicketMapper;
import com.lesha.bubble_tickets.services.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static com.lesha.bubble_tickets.util.JwtUtil.parseUserId;

@RestController
@RequestMapping(path ="/api/v1/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;
    private final TicketMapper ticketMapper;

    @GetMapping
    public Page<ListTicketResponseDto> listTickets(
            @AuthenticationPrincipal Jwt jwt,
            Pageable pageable
            ) {
        return ticketService.listTicketsForUser(parseUserId(jwt),pageable)
                .map(ticketMapper::toListTicketResponseDto);

    }
}
