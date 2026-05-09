package com.event.test.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.event.test.domain.entity.Event;

public interface EventRepository extends JpaRepository<Event, String>, JpaSpecificationExecutor<Event> {
}
