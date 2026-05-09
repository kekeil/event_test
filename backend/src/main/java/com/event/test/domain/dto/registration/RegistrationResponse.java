package com.event.test.domain.dto.registration;

import java.time.OffsetDateTime;

import io.swagger.v3.oas.annotations.media.Schema;

public record RegistrationResponse(

		@Schema(description = "Identifiant unique de l'inscription.", example = "11111111-2222-3333-4444-555555555555")
		String id,

		@Schema(description = "ID de l'évènement parent.", example = "0f8b4a1c-9d2e-4a3f-b5c6-7d8e9f0a1b2c")
		String eventId,

		@Schema(description = "Prénom.", example = "Aminata")
		String firstName,

		@Schema(description = "Nom.", example = "Ouedraogo")
		String lastName,

		@Schema(description = "Email.", example = "aminata@example.com")
		String email,

		@Schema(description = "Date d'inscription (ISO-8601, générée par le serveur).", example = "2026-05-09T14:35:42Z")
		OffsetDateTime registeredAt) {
}
