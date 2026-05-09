package com.event.test.domain.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.event.test.domain.dto.auth.LoginRequest;
import com.event.test.domain.dto.auth.LoginResponse;
import com.event.test.domain.service.AuthService;
import com.event.test.exception.ProblemDetailResponse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
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
			@ApiResponse(
					responseCode = "400",
					description = "Corps de requête invalide",
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
													  "instance": "/api/auth/login",
													  "code": "VALIDATION_ERROR",
													  "errors": [
													    { "field": "email", "message": "must be a well-formed email address" },
													    { "field": "password", "message": "must not be blank" }
													  ]
													}
													"""),
									@ExampleObject(
											name = "malformed-json",
											summary = "JSON mal formé",
											value = """
													{
													  "type": "about:blank",
													  "title": "Malformed JSON",
													  "status": 400,
													  "detail": "Corps JSON invalide ou mal formé.",
													  "instance": "/api/auth/login",
													  "code": "MALFORMED_JSON"
													}
													""")
							})),
			@ApiResponse(
					responseCode = "401",
					description = "Identifiants invalides",
					content = @Content(
							mediaType = "application/problem+json",
							schema = @Schema(implementation = ProblemDetailResponse.class),
							examples = {
									@ExampleObject(
											name = "invalid-credentials",
											summary = "Email inconnu ou mot de passe incorrect",
											value = """
													{
													  "type": "about:blank",
													  "title": "Unauthorized",
													  "status": 401,
													  "detail": "Identifiants invalides.",
													  "instance": "/api/auth/login",
													  "code": "INVALID_CREDENTIALS"
													}
													""")
							}))
	})
	public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
		return ResponseEntity.ok(authService.login(request));
	}
}
