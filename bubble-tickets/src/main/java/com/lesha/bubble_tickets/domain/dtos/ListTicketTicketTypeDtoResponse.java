package com.lesha.bubble_tickets.domain.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ListTicketTicketTypeDtoResponse {
    private UUID id;
    private String name;
    private Double price;
}
