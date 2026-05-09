package com.event.test.domain.dto.registration;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record RegistrationCreateRequest(
		@NotBlank String firstName,
		@NotBlank String lastName,
		@NotBlank @Email String email) {
}
