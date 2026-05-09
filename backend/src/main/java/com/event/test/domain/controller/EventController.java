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

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
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
			@ApiResponse(responseCode = "200", description = "Liste retournée"),
			@ApiResponse(responseCode = "400", description = "Paramètres invalides", content = @Content(schema = @Schema(implementation = Object.class)))
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
			@ApiResponse(responseCode = "404", description = "Évènement introuvable", content = @Content(schema = @Schema(implementation = Object.class)))
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
			@ApiResponse(responseCode = "201", description = "Évènement créé"),
			@ApiResponse(responseCode = "400", description = "Validation", content = @Content(schema = @Schema(implementation = Object.class))),
			@ApiResponse(responseCode = "401", description = "Non authentifié", content = @Content(schema = @Schema(implementation = Object.class))),
			@ApiResponse(responseCode = "403", description = "Accès refusé", content = @Content(schema = @Schema(implementation = Object.class)))
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
			@ApiResponse(responseCode = "200", description = "Mise à jour effectuée"),
			@ApiResponse(responseCode = "400", description = "Validation", content = @Content(schema = @Schema(implementation = Object.class))),
			@ApiResponse(responseCode = "401", description = "Non authentifié", content = @Content(schema = @Schema(implementation = Object.class))),
			@ApiResponse(responseCode = "403", description = "Accès refusé", content = @Content(schema = @Schema(implementation = Object.class))),
			@ApiResponse(responseCode = "404", description = "Introuvable", content = @Content(schema = @Schema(implementation = Object.class)))
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
			@ApiResponse(responseCode = "200", description = "Suppression effectuée"),
			@ApiResponse(responseCode = "401", description = "Non authentifié", content = @Content(schema = @Schema(implementation = Object.class))),
			@ApiResponse(responseCode = "403", description = "Accès refusé", content = @Content(schema = @Schema(implementation = Object.class))),
			@ApiResponse(responseCode = "404", description = "Introuvable", content = @Content(schema = @Schema(implementation = Object.class)))
	})
	public ResponseEntity<Void> deleteEvent(@PathVariable String id) {
		eventService.delete(id);
		return ResponseEntity.ok().build();
	}

	@PostMapping("/{id}/register")
	@Tag(name = "Events — Public")
	@Operation(summary = "S'inscrire à un évènement")
	@ApiResponses({
			@ApiResponse(responseCode = "201", description = "Inscription créée"),
			@ApiResponse(responseCode = "400", description = "Validation", content = @Content(schema = @Schema(implementation = Object.class))),
			@ApiResponse(responseCode = "404", description = "Évènement introuvable", content = @Content(schema = @Schema(implementation = Object.class))),
			@ApiResponse(responseCode = "409", description = "Email déjà inscrit", content = @Content(schema = @Schema(implementation = Object.class))),
			@ApiResponse(responseCode = "422", description = "Capacité atteinte", content = @Content(schema = @Schema(implementation = Object.class)))
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
