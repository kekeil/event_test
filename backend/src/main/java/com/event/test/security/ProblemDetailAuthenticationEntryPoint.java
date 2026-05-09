package com.event.test.security;

import java.io.IOException;
import java.net.URI;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ProblemDetail;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ProblemDetailAuthenticationEntryPoint implements AuthenticationEntryPoint {

	private final ObjectMapper objectMapper;

	@Override
	public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException)
			throws IOException {
		HttpStatus status = HttpStatus.UNAUTHORIZED;
		String detail = "Authentification requise.";
		if (authException instanceof BadCredentialsException) {
			detail = "Identifiants invalides.";
		}
		ProblemDetail problem = ProblemDetail.forStatusAndDetail(status, detail);
		problem.setTitle("Unauthorized");
		problem.setType(URI.create("about:blank"));
		problem.setInstance(URI.create(request.getRequestURI()));
		problem.setProperty("code", "INVALID_CREDENTIALS");
		response.setStatus(status.value());
		response.setContentType(MediaType.APPLICATION_PROBLEM_JSON_VALUE);
		objectMapper.writeValue(response.getOutputStream(), problem);
	}
}
