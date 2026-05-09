package com.event.test.domain.dto.auth;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(

		@Schema(description = "Email du compte admin.", example = "admin@event.local", requiredMode = Schema.RequiredMode.REQUIRED)
		@NotBlank @Email String email,

		@Schema(description = "Mot de passe en clair (vérifié contre BCrypt côté serveur).", example = "Admin123!", requiredMode = Schema.RequiredMode.REQUIRED)
		@NotBlank String password) {
}
