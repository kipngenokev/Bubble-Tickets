package com.lesha.bubble_tickets.mappers;

import com.lesha.bubble_tickets.domain.CreateEventRequest;
import com.lesha.bubble_tickets.domain.CreateTicketTypeRequest;
import com.lesha.bubble_tickets.domain.dtos.CreateEventRequestDto;
import com.lesha.bubble_tickets.domain.dtos.CreateEventResponseDto;
import com.lesha.bubble_tickets.domain.dtos.CreateTicketTypeRequestDto;
import com.lesha.bubble_tickets.domain.entities.Event;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface EventMapper {

    CreateTicketTypeRequest fromDto(CreateTicketTypeRequestDto dto);
    CreateEventRequest fromDto(CreateEventRequestDto dto);

    CreateEventResponseDto tDto(Event event);
}
