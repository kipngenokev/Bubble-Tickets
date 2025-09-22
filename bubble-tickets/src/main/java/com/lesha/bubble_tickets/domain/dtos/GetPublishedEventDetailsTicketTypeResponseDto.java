package com.lesha.bubble_tickets.domain.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetPublishedEventDetailsTicketTypeResponseDto {

    private UUID id;
    private String name;
    private Double price;
    private String description;
}
