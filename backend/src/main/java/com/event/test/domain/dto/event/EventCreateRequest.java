package com.event.test.domain.dto.event;

import java.time.OffsetDateTime;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record EventCreateRequest(

		@Schema(description = "Titre de l'évènement.", example = "Conférence DevTalks 2030", maxLength = 100, requiredMode = Schema.RequiredMode.REQUIRED)
		@NotBlank @Size(max = 100) String title,

		@Schema(description = "Description optionnelle. Texte libre.", example = "Une journée pour échanger autour des pratiques modernes du dev.")
		String description,

		@Schema(description = "Date et heure de l'évènement (ISO-8601, doit être future).", example = "2030-06-15T18:00:00Z", requiredMode = Schema.RequiredMode.REQUIRED)
		@NotNull @Future OffsetDateTime date,

		@Schema(description = "Lieu de l'évènement.", example = "Ouagadougou, Burkina Faso", requiredMode = Schema.RequiredMode.REQUIRED)
		@NotBlank String location,

		@Schema(description = "Nombre maximum de participants (≥ 1).", example = "100", minimum = "1", requiredMode = Schema.RequiredMode.REQUIRED)
		@NotNull @Min(1) Integer capacity) {
}
