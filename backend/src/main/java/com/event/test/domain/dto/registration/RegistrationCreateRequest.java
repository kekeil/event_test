package com.event.test.domain.dto.registration;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record RegistrationCreateRequest(

		@Schema(description = "Prénom du participant.", example = "Aminata", requiredMode = Schema.RequiredMode.REQUIRED)
		@NotBlank String firstName,

		@Schema(description = "Nom du participant.", example = "Ouedraogo", requiredMode = Schema.RequiredMode.REQUIRED)
		@NotBlank String lastName,

		@Schema(description = "Adresse email valide. Doit être unique pour cet évènement (sinon 409).", example = "aminata@example.com", requiredMode = Schema.RequiredMode.REQUIRED)
		@NotBlank @Email String email) {
}
