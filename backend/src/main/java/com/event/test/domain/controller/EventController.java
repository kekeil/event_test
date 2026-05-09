package com.event.test.domain.controller;

import java.net.URI;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.event.test.domain.dto.event.EventCreateRequest;
import com.event.test.domain.dto.event.EventResponse;
import com.event.test.domain.dto.event.EventUpdateRequest;
import com.event.test.domain.dto.event.PageResponse;
import com.event.test.domain.dto.registration.RegistrationCreateRequest;
import com.event.test.domain.dto.registration.RegistrationResponse;
import com.event.test.domain.service.EventService;
import com.event.test.domain.service.RegistrationService;
import com.event.test.exception.ProblemDetailResponse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

	private final EventService eventService;
	private final RegistrationService registrationService;

	@GetMapping
	@Tag(name = "Events — Public")
	@Operation(summary = "Lister les évènements", description = "Pagination, recherche texte (titre + lieu) et filtre par date (YYYY-MM-DD).")
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "Liste paginée retournée"),
			@ApiResponse(
					responseCode = "400",
					description = "Paramètres de pagination ou filtre invalides",
					content = @Content(
							mediaType = "application/problem+json",
							schema = @Schema(implementation = ProblemDetailResponse.class),
							examples = {
									@ExampleObject(
											name = "validation-error",
											summary = "Paramètre de date invalide",
											value = """
													{
													  "type": "about:blank",
													  "title": "Validation failed",
													  "status": 400,
													  "detail": "One or more fields are invalid.",
													  "instance": "/api/events",
													  "code": "VALIDATION_ERROR",
													  "errors": [
													    { "field": "date", "message": "format attendu: YYYY-MM-DD" }
													  ]
													}
													""")
							}))
	})
	public PageResponse<EventResponse> listEvents(
			@RequestParam(required = false) String search,
			@RequestParam(required = false) String date,
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "10") int limit) {
		return eventService.search(search, date, page, limit);
	}

	@GetMapping("/{id}")
	@Tag(name = "Events — Public")
	@Operation(summary = "Détail d'un évènement")
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "Évènement trouvé"),
			@ApiResponse(
					responseCode = "404",
					description = "Évènement introuvable",
					content = @Content(
							mediaType = "application/problem+json",
							schema = @Schema(implementation = ProblemDetailResponse.class),
							examples = {
									@ExampleObject(
											name = "not-found",
											summary = "ID inconnu",
											value = """
													{
													  "type": "about:blank",
													  "title": "Not Found",
													  "status": 404,
													  "detail": "Évènement introuvable.",
													  "instance": "/api/events/unknown-id",
													  "code": "NOT_FOUND"
													}
													""")
							}))
	})
	public EventResponse getEvent(@PathVariable String id) {
		return eventService.getById(id);
	}

	@PostMapping
	@PreAuthorize("hasRole('ADMIN')")
	@SecurityRequirement(name = "bearerAuth")
	@Tag(name = "Events — Admin")
	@Operation(summary = "Créer un évènement")
	@ApiResponses({
			@ApiResponse(responseCode = "201", description = "Évènement créé. Le header `Location` contient l'URI du nouvel évènement."),
			@ApiResponse(
					responseCode = "400",
					description = "Validation échouée",
					content = @Content(
							mediaType = "application/problem+json",
							schema = @Schema(implementation = ProblemDetailResponse.class),
							examples = {
									@ExampleObject(
											name = "validation-error",
											summary = "Champs manquants ou invalides",
											value = """
													{
													  "type": "about:blank",
													  "title": "Validation failed",
													  "status": 400,
													  "detail": "One or more fields are invalid.",
													  "instance": "/api/events",
													  "code": "VALIDATION_ERROR",
													  "errors": [
													    { "field": "title", "message": "must not be blank" },
													    { "field": "capacity", "message": "must be greater than or equal to 1" },
													    { "field": "date", "message": "must be a future date" }
													  ]
													}
													"""),
									@ExampleObject(
											name = "malformed-json",
											summary = "Corps JSON mal formé",
											value = """
													{
													  "type": "about:blank",
													  "title": "Malformed JSON",
													  "status": 400,
													  "detail": "Corps JSON invalide ou mal formé.",
													  "instance": "/api/events",
													  "code": "MALFORMED_JSON"
													}
													""")
							})),
			@ApiResponse(
					responseCode = "401",
					description = "JWT manquant ou invalide",
					content = @Content(
							mediaType = "application/problem+json",
							schema = @Schema(implementation = ProblemDetailResponse.class),
							examples = {
									@ExampleObject(
											name = "unauthorized",
											value = """
													{
													  "type": "about:blank",
													  "title": "Unauthorized",
													  "status": 401,
													  "detail": "Authentification requise.",
													  "instance": "/api/events",
													  "code": "INVALID_CREDENTIALS"
													}
													""")
							})),
			@ApiResponse(
					responseCode = "403",
					description = "Token valide mais rôle insuffisant",
					content = @Content(
							mediaType = "application/problem+json",
							schema = @Schema(implementation = ProblemDetailResponse.class),
							examples = {
									@ExampleObject(
											name = "access-denied",
											value = """
													{
													  "type": "about:blank",
													  "title": "Forbidden",
													  "status": 403,
													  "detail": "Accès refusé.",
													  "instance": "/api/events",
													  "code": "ACCESS_DENIED"
													}
													""")
							}))
	})
	public ResponseEntity<EventResponse> createEvent(@Valid @RequestBody EventCreateRequest request) {
		EventResponse body = eventService.create(request);
		URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(body.id())
				.toUri();
		return ResponseEntity.created(location).body(body);
	}

	@PutMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	@SecurityRequirement(name = "bearerAuth")
	@Tag(name = "Events — Admin")
	@Operation(summary = "Mettre à jour un évènement")
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "Évènement mis à jour"),
			@ApiResponse(
					responseCode = "400",
					description = "Validation échouée",
					content = @Content(
							mediaType = "application/problem+json",
							schema = @Schema(implementation = ProblemDetailResponse.class),
							examples = {
									@ExampleObject(
											name = "validation-error",
											value = """
													{
													  "type": "about:blank",
													  "title": "Validation failed",
													  "status": 400,
													  "detail": "One or more fields are invalid.",
													  "instance": "/api/events/abc-123",
													  "code": "VALIDATION_ERROR",
													  "errors": [
													    { "field": "title", "message": "size must be between 0 and 100" }
													  ]
													}
													""")
							})),
			@ApiResponse(
					responseCode = "401",
					description = "Non authentifié",
					content = @Content(
							mediaType = "application/problem+json",
							schema = @Schema(implementation = ProblemDetailResponse.class))),
			@ApiResponse(
					responseCode = "403",
					description = "Accès refusé",
					content = @Content(
							mediaType = "application/problem+json",
							schema = @Schema(implementation = ProblemDetailResponse.class))),
			@ApiResponse(
					responseCode = "404",
					description = "Évènement introuvable",
					content = @Content(
							mediaType = "application/problem+json",
							schema = @Schema(implementation = ProblemDetailResponse.class),
							examples = {
									@ExampleObject(
											name = "not-found",
											value = """
													{
													  "type": "about:blank",
													  "title": "Not Found",
													  "status": 404,
													  "detail": "Évènement introuvable.",
													  "instance": "/api/events/unknown-id",
													  "code": "NOT_FOUND"
													}
													""")
							}))
	})
	public EventResponse updateEvent(@PathVariable String id, @Valid @RequestBody EventUpdateRequest request) {
		return eventService.update(id, request);
	}

	@DeleteMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	@SecurityRequirement(name = "bearerAuth")
	@Tag(name = "Events — Admin")
	@Operation(summary = "Supprimer un évènement")
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "Évènement supprimé. Les inscriptions associées sont supprimées par cascade."),
			@ApiResponse(
					responseCode = "401",
					description = "Non authentifié",
					content = @Content(mediaType = "application/problem+json",
							schema = @Schema(implementation = ProblemDetailResponse.class))),
			@ApiResponse(
					responseCode = "403",
					description = "Accès refusé",
					content = @Content(mediaType = "application/problem+json",
							schema = @Schema(implementation = ProblemDetailResponse.class))),
			@ApiResponse(
					responseCode = "404",
					description = "Évènement introuvable",
					content = @Content(
							mediaType = "application/problem+json",
							schema = @Schema(implementation = ProblemDetailResponse.class),
							examples = {
									@ExampleObject(
											name = "not-found",
											value = """
													{
													  "type": "about:blank",
													  "title": "Not Found",
													  "status": 404,
													  "detail": "Évènement introuvable.",
													  "instance": "/api/events/unknown-id",
													  "code": "NOT_FOUND"
													}
													""")
							}))
	})
	public ResponseEntity<Void> deleteEvent(@PathVariable String id) {
		eventService.delete(id);
		return ResponseEntity.ok().build();
	}

	@PostMapping("/{id}/register")
	@Tag(name = "Events — Public")
	@Operation(summary = "S'inscrire à un évènement")
	@ApiResponses({
			@ApiResponse(responseCode = "201", description = "Inscription créée. Le header `Location` pointe vers `/api/registrations/{id}`."),
			@ApiResponse(
					responseCode = "400",
					description = "Validation échouée",
					content = @Content(
							mediaType = "application/problem+json",
							schema = @Schema(implementation = ProblemDetailResponse.class),
							examples = {
									@ExampleObject(
											name = "validation-error",
											summary = "Email invalide ou champs manquants",
											value = """
													{
													  "type": "about:blank",
													  "title": "Validation failed",
													  "status": 400,
													  "detail": "One or more fields are invalid.",
													  "instance": "/api/events/abc-123/register",
													  "code": "VALIDATION_ERROR",
													  "errors": [
													    { "field": "firstName", "message": "must not be blank" },
													    { "field": "email", "message": "must be a well-formed email address" }
													  ]
													}
													""")
							})),
			@ApiResponse(
					responseCode = "404",
					description = "Évènement introuvable",
					content = @Content(
							mediaType = "application/problem+json",
							schema = @Schema(implementation = ProblemDetailResponse.class),
							examples = {
									@ExampleObject(
											name = "not-found",
											value = """
													{
													  "type": "about:blank",
													  "title": "Not Found",
													  "status": 404,
													  "detail": "Évènement introuvable.",
													  "instance": "/api/events/unknown-id/register",
													  "code": "NOT_FOUND"
													}
													""")
							})),
			@ApiResponse(
					responseCode = "409",
					description = "Email déjà inscrit pour cet évènement",
					content = @Content(
							mediaType = "application/problem+json",
							schema = @Schema(implementation = ProblemDetailResponse.class),
							examples = {
									@ExampleObject(
											name = "duplicate-email",
											summary = "Le même email est déjà enregistré sur cet évènement",
											value = """
													{
													  "type": "about:blank",
													  "title": "Duplicate email",
													  "status": 409,
													  "detail": "Cette adresse email est deja enregistree pour cet evenement.",
													  "instance": "/api/events/abc-123/register",
													  "code": "DUPLICATE_EMAIL"
													}
													""")
							})),
			@ApiResponse(
					responseCode = "422",
					description = "Capacité atteinte",
					content = @Content(
							mediaType = "application/problem+json",
							schema = @Schema(implementation = ProblemDetailResponse.class),
							examples = {
									@ExampleObject(
											name = "capacity-reached",
											summary = "Toutes les places sont prises",
											value = """
													{
													  "type": "about:blank",
													  "title": "Capacity reached",
													  "status": 422,
													  "detail": "Cet evenement est complet.",
													  "instance": "/api/events/abc-123/register",
													  "code": "CAPACITY_REACHED"
													}
													""")
							}))
	})
	public ResponseEntity<RegistrationResponse> register(
			@PathVariable String id,
			@Valid @RequestBody RegistrationCreateRequest request) {
		RegistrationResponse body = registrationService.register(id, request);
		URI location = ServletUriComponentsBuilder.fromCurrentContextPath()
				.path("/api/registrations/{registrationId}")
				.buildAndExpand(body.id())
				.toUri();
		return ResponseEntity.created(location).body(body);
	}
}
