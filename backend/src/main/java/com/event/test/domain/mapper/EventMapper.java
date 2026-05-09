package com.event.test.domain.mapper;

import com.event.test.domain.dto.event.EventCreateRequest;
import com.event.test.domain.dto.event.EventResponse;
import com.event.test.domain.dto.event.EventUpdateRequest;
import com.event.test.domain.entity.Event;

public final class EventMapper {

	private EventMapper() {
	}

	public static Event toEntity(EventCreateRequest request) {
		Event event = new Event();
		event.setTitle(request.title());
		event.setDescription(request.description());
		event.setDate(request.date());
		event.setLocation(request.location());
		event.setCapacity(request.capacity());
		return event;
	}

	public static void apply(Event event, EventUpdateRequest request) {
		event.setTitle(request.title());
		event.setDescription(request.description());
		event.setDate(request.date());
		event.setLocation(request.location());
		event.setCapacity(request.capacity());
	}

	public static EventResponse toResponse(Event event, long registrationCount) {
		int capacity = event.getCapacity();
		int remaining = (int) Math.max(0, capacity - registrationCount);
		boolean full = remaining <= 0;
		return new EventResponse(
				event.getId(),
				event.getTitle(),
				event.getDescription(),
				event.getDate(),
				event.getLocation(),
				event.getCapacity(),
				event.getCreatedAt(),
				remaining,
				full);
	}
}
