package com.event.test.domain.dto.event;

import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;

public record PageResponse<T>(

		@Schema(description = "Éléments de la page courante.")
		List<T> items,

		@Schema(description = "Index de la page courante (0-based).", example = "0")
		int page,

		@Schema(description = "Taille de page (max 100).", example = "10")
		int limit,

		@Schema(description = "Nombre total d'éléments correspondant aux filtres.", example = "42")
		long total,

		@Schema(description = "Nombre total de pages.", example = "5")
		int totalPages) {
}
