package com.event.test.config;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import lombok.extern.slf4j.Slf4j;

/**
 * CORS avec {@link CorsConfiguration#setAllowedOriginPatterns} : compatible {@code allowCredentials=true}
 * (wildcards possibles) et correspondance exacte des origines sans slash final indésirable.
 * Les pré-flights {@code OPTIONS} sont aussi autorisés côté sécurité et court-circuités dans le filtre JWT.
 */
@Configuration
@Slf4j
public class CorsConfig {

	@Value("${app.cors.allowed-origins}")
	private String allowedOrigins;

	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration configuration = new CorsConfiguration();

		List<String> origins = Arrays.stream(allowedOrigins.split(","))
				.map(String::trim)
				.filter(s -> !s.isEmpty())
				.map(s -> s.endsWith("/") ? s.substring(0, s.length() - 1) : s)
				.toList();

		configuration.setAllowedOriginPatterns(origins);

		configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
		configuration.setAllowedHeaders(List.of("*"));
		configuration.setExposedHeaders(List.of("Location"));
		configuration.setAllowCredentials(true);
		configuration.setMaxAge(3600L);

		log.info("CORS configured with allowed origins: {}", origins);

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);
		return source;
	}
}
