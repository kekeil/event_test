package com.event.test.exception;

import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(
		name = "ProblemDetail",
		description = "Réponse d'erreur au format RFC 7807 (application/problem+json). "
				+ "Toutes les erreurs renvoyées par l'API suivent ce schéma. "
				+ "Le champ `code` est un identifiant stable utilisable côté client pour brancher la logique d'erreur. "
				+ "Le champ `errors` n'est présent que pour les erreurs de validation (code VALIDATION_ERROR).")
public record ProblemDetailResponse(

		@Schema(
				description = "Type d'erreur (URI). Toujours `about:blank` pour cette API.",
				example = "about:blank")
		String type,

		@Schema(
				description = "Titre court de l'erreur, lisible humainement.",
				example = "Capacity reached")
		String title,

		@Schema(
				description = "Code HTTP de la réponse.",
				example = "422")
		Integer status,

		@Schema(
				description = "Description détaillée de l'erreur, en français, destinée à être affichée à l'utilisateur final.",
				example = "Cet evenement est complet.")
		String detail,

		@Schema(
				description = "URI de la ressource ayant déclenché l'erreur.",
				example = "/api/events/abc-123/register")
		String instance,

		@Schema(
				description = "Code d'erreur stable, indépendant de la langue. "
						+ "Valeurs possibles : VALIDATION_ERROR, MALFORMED_JSON, INVALID_CREDENTIALS, "
						+ "ACCESS_DENIED, NOT_FOUND, DUPLICATE_EMAIL, CAPACITY_REACHED, INTERNAL_ERROR.",
				example = "CAPACITY_REACHED")
		String code,

		@Schema(
				description = "Liste des erreurs de validation, présente uniquement quand `code = VALIDATION_ERROR`.",
				nullable = true)
		List<FieldErrorEntry> errors) {

	@Schema(name = "ProblemDetail.FieldError", description = "Erreur de validation sur un champ.")
	public record FieldErrorEntry(

			@Schema(description = "Nom du champ en erreur.", example = "title")
			String field,

			@Schema(description = "Message de validation.", example = "must not be blank")
			String message) {
	}
}
