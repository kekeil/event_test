package com.event.test.domain.dto.event;

import java.time.OffsetDateTime;

import io.swagger.v3.oas.annotations.media.Schema;

public record EventResponse(

		@Schema(description = "Identifiant unique (UUID).", example = "0f8b4a1c-9d2e-4a3f-b5c6-7d8e9f0a1b2c")
		String id,

		@Schema(description = "Titre de l'évènement.", example = "Conférence DevTalks 2030")
		String title,

		@Schema(description = "Description.", example = "Une journée pour échanger autour des pratiques modernes du dev.", nullable = true)
		String description,

		@Schema(description = "Date et heure ISO-8601.", example = "2030-06-15T18:00:00Z")
		OffsetDateTime date,

		@Schema(description = "Lieu.", example = "Ouagadougou, Burkina Faso")
		String location,

		@Schema(description = "Capacité totale.", example = "100")
		Integer capacity,

		@Schema(description = "Date de création (ISO-8601, générée par le serveur).", example = "2026-05-09T14:32:11Z")
		OffsetDateTime createdAt,

		@Schema(description = "Nombre de places encore disponibles. Calculé par le serveur (`capacity` - inscriptions actives).", example = "42")
		int remainingSeats,

		@Schema(description = "`true` si toutes les places sont prises.", example = "false")
		boolean isFull) {
}
