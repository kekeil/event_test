package com.event.test.domain.dto.event;

import java.time.OffsetDateTime;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record EventUpdateRequest(
		@NotBlank @Size(max = 100) String title,
		String description,
		@NotNull @Future OffsetDateTime date,
		@NotBlank String location,
		@NotNull @Min(1) Integer capacity) {
}
