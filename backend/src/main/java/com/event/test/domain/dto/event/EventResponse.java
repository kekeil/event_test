package com.event.test.domain.dto.event;

import java.time.OffsetDateTime;

public record EventResponse(
		String id,
		String title,
		String description,
		OffsetDateTime date,
		String location,
		Integer capacity,
		OffsetDateTime createdAt,
		int remainingSeats,
		boolean isFull) {
}
