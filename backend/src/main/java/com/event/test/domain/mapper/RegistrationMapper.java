package com.event.test.domain.mapper;

import com.event.test.domain.dto.registration.RegistrationResponse;
import com.event.test.domain.entity.Registration;

public final class RegistrationMapper {

	private RegistrationMapper() {
	}

	public static RegistrationResponse toResponse(Registration registration) {
		return new RegistrationResponse(
				registration.getId(),
				registration.getEvent().getId(),
				registration.getFirstName(),
				registration.getLastName(),
				registration.getEmail(),
				registration.getRegisteredAt());
	}
}
