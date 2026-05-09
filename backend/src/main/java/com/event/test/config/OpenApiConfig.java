package com.event.test.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import io.swagger.v3.oas.models.tags.Tag;

@Configuration
public class OpenApiConfig {

	@Bean
	public OpenAPI eventOpenAPI() {
		return new OpenAPI()
				.info(new Info()
						.title("Event Management API")
						.version("1.0.0")
						.description("""
								API REST de gestion d'évènements et d'inscriptions en ligne.

								## Authentification
								Les endpoints **admin** requièrent un JWT Bearer obtenu via `POST /api/auth/login`.
								Cliquer sur le bouton **Authorize** en haut à droite et coller le token (sans préfixe `Bearer`).

								## Format des erreurs
								Toutes les erreurs sont au format **RFC 7807** (`application/problem+json`).
								Le champ `code` permet de brancher la logique d'erreur côté client de façon stable.

								| Code HTTP | `code`              | Quand                                                      |
								|-----------|---------------------|------------------------------------------------------------|
								| 400       | VALIDATION_ERROR    | Champs manquants ou invalides (liste détaillée dans `errors`) |
								| 400       | MALFORMED_JSON      | Corps JSON illisible ou mal formé                          |
								| 401       | INVALID_CREDENTIALS | Authentification requise ou identifiants invalides         |
								| 403       | ACCESS_DENIED       | Token valide mais rôle insuffisant                         |
								| 404       | NOT_FOUND           | Ressource introuvable                                      |
								| 409       | DUPLICATE_EMAIL     | Email déjà inscrit pour cet évènement                      |
								| 422       | CAPACITY_REACHED    | Évènement complet                                          |
								| 500       | INTERNAL_ERROR      | Erreur inattendue côté serveur                             |
								""")
						.contact(new Contact().name("Event API"))
						.license(new License().name("Internal use")))
				.servers(List.of(
						new Server().url("/").description("Serveur courant")))
				.tags(List.of(
						new Tag().name("Auth")
								.description("Authentification administrateur (JWT)"),
						new Tag().name("Events — Public")
								.description("Routes publiques : consultation et inscription. Aucune authentification requise."),
						new Tag().name("Events — Admin")
								.description("Routes administrateur : création, modification, suppression d'évènements et gestion des inscriptions. JWT Bearer requis (rôle ADMIN).")))
				.components(new Components().addSecuritySchemes("bearerAuth",
						new SecurityScheme()
								.type(SecurityScheme.Type.HTTP)
								.scheme("bearer")
								.bearerFormat("JWT")
								.description("JWT obtenu via POST /api/auth/login")));
	}
}
