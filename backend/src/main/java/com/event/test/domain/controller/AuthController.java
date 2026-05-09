package com.event.test.domain.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.event.test.domain.dto.auth.LoginRequest;
import com.event.test.domain.dto.auth.LoginResponse;
import com.event.test.domain.service.AuthService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Auth", description = "Authentification administrateur (JWT)")
public class AuthController {

	private final AuthService authService;

	@PostMapping("/login")
	@Operation(summary = "Connexion administrateur", description = "Retourne un JWT valide 24h pour un compte ADMIN.")
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "Authentification réussie"),
			@ApiResponse(responseCode = "400", description = "Corps de requête invalide", content = @Content(schema = @Schema(implementation = Object.class))),
			@ApiResponse(responseCode = "401", description = "Identifiants invalides", content = @Content(schema = @Schema(implementation = Object.class)))
	})
	public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
		return ResponseEntity.ok(authService.login(request));
	}
}
