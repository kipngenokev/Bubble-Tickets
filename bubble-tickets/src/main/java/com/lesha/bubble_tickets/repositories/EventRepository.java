package com.lesha.bubble_tickets.repositories;

import com.lesha.bubble_tickets.domain.entities.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface EventRepository extends JpaRepository<Event, UUID> {
   Page<Event> findByOrganizerId(UUID organizerId, Pageable pageable);
}
