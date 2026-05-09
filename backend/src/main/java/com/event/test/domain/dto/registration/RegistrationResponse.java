package com.event.test.domain.dto.registration;

import java.time.OffsetDateTime;

public record RegistrationResponse(
		String id,
		String eventId,
		String firstName,
		String lastName,
		String email,
		OffsetDateTime registeredAt) {
}
