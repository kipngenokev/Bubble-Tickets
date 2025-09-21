package com.lesha.bubble_tickets.mappers;

import com.lesha.bubble_tickets.domain.CreateEventRequest;
import com.lesha.bubble_tickets.domain.CreateTicketTypeRequest;
import com.lesha.bubble_tickets.domain.dtos.*;
import com.lesha.bubble_tickets.domain.entities.Event;
import com.lesha.bubble_tickets.domain.entities.TicketType;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface EventMapper {

    CreateTicketTypeRequest fromDto(CreateTicketTypeRequestDto dto);
    CreateEventRequest fromDto(CreateEventRequestDto dto);

    CreateEventResponseDto toDto(Event event);

    ListEventTicketTypeResponseDto toDto(TicketType ticketType);

    ListEventResponseDto toListEventResponseDto(Event event);

    GetEventDetailsTicketTypeResponseDto toGetEventDetailsTicketTypeResponseDto(TicketType ticketTpe);

    GetEventDetailsResponseDto toGetEventDetailsResponseDto(Event event);


}
