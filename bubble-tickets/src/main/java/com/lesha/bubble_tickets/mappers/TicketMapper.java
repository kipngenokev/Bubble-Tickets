package com.lesha.bubble_tickets.mappers;

import com.lesha.bubble_tickets.domain.dtos.ListTicketResponseDto;
import com.lesha.bubble_tickets.domain.dtos.ListTicketTicketTypeResponseDto;
import com.lesha.bubble_tickets.domain.entities.Ticket;
import com.lesha.bubble_tickets.domain.entities.TicketType;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface TicketMapper {
    ListTicketTicketTypeResponseDto toListTicketTicketTypeResponseDto(TicketType ticketType);

    ListTicketResponseDto toListTicketResponseDto(Ticket ticket);
}
