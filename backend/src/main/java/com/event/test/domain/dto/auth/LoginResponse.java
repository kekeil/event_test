package com.event.test.domain.dto.auth;

import io.swagger.v3.oas.annotations.media.Schema;

public record LoginResponse(

		@Schema(description = "JWT à renvoyer dans le header `Authorization: Bearer <token>` pour les routes admin. Valide 24h.",
				example = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBldmVudC5sb2NhbCIsInJvbGUiOiJBRE1JTiIsImV4cCI6MTczMTUwMDAwMH0.signature")
		String token,

		@Schema(description = "Rôle de l'utilisateur authentifié.", example = "ADMIN", allowableValues = { "ADMIN", "USER" })
		String role,

		@Schema(description = "Email du compte authentifié.", example = "admin@event.local")
		String email) {
}
