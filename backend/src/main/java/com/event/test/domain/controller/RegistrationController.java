package com.event.test.domain.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.event.test.domain.dto.registration.RegistrationResponse;
import com.event.test.domain.service.RegistrationService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Events — Admin", description = "Gestion des inscriptions (admin)")
public class RegistrationController {

	private final RegistrationService registrationService;

	@GetMapping("/events/{eventId}/registrations")
	@Operation(summary = "Lister les inscriptions d'un évènement")
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "Liste des inscrits"),
			@ApiResponse(responseCode = "401", description = "Non authentifié", content = @Content(schema = @Schema(implementation = Object.class))),
			@ApiResponse(responseCode = "403", description = "Accès refusé", content = @Content(schema = @Schema(implementation = Object.class))),
			@ApiResponse(responseCode = "404", description = "Évènement introuvable", content = @Content(schema = @Schema(implementation = Object.class)))
	})
	public List<RegistrationResponse> listRegistrations(@PathVariable String eventId) {
		return registrationService.listByEvent(eventId);
	}

	@DeleteMapping("/registrations/{id}")
	@Operation(summary = "Annuler une inscription")
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "Inscription supprimée"),
			@ApiResponse(responseCode = "401", description = "Non authentifié", content = @Content(schema = @Schema(implementation = Object.class))),
			@ApiResponse(responseCode = "403", description = "Accès refusé", content = @Content(schema = @Schema(implementation = Object.class))),
			@ApiResponse(responseCode = "404", description = "Inscription introuvable", content = @Content(schema = @Schema(implementation = Object.class)))
	})
	public ResponseEntity<Void> deleteRegistration(@PathVariable String id) {
		registrationService.delete(id);
		return ResponseEntity.ok().build();
	}
}
