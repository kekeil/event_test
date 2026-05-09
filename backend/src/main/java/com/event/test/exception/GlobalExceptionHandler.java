package com.event.test.exception;

import java.net.URI;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

	private static final String APPLICATION_PROBLEM_JSON = "application/problem+json";

	private static ResponseEntity<ProblemDetail> problem(ApiException ex, WebRequest request) {
		ProblemDetail detail = ProblemDetail.forStatusAndDetail(ex.getStatus(), ex.getMessage());
		detail.setTitle(titleForException(ex));
		detail.setType(URI.create("about:blank"));
		detail.setInstance(URI.create(request.getDescription(false).replace("uri=", "")));
		detail.setProperty("code", ex.getCode());
		return ResponseEntity.status(ex.getStatus()).contentType(MediaType.parseMediaType(APPLICATION_PROBLEM_JSON))
				.body(detail);
	}

	private static String titleForException(ApiException ex) {
		return switch (ex.getCode()) {
			case "DUPLICATE_EMAIL" -> "Duplicate email";
			case "CAPACITY_REACHED" -> "Capacity reached";
			case "NOT_FOUND" -> "Not Found";
			default -> titleFor(ex.getStatus());
		};
	}

	private static String titleFor(HttpStatus status) {
		return switch (status) {
			case BAD_REQUEST -> "Bad Request";
			case UNAUTHORIZED -> "Unauthorized";
			case FORBIDDEN -> "Forbidden";
			case NOT_FOUND -> "Not Found";
			case CONFLICT -> "Conflict";
			case UNPROCESSABLE_ENTITY -> "Unprocessable Entity";
			case INTERNAL_SERVER_ERROR -> "Internal Server Error";
			default -> status.getReasonPhrase();
		};
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ProblemDetail> handleValidation(MethodArgumentNotValidException ex, WebRequest request) {
		List<Map<String, String>> errors = ex.getBindingResult().getAllErrors().stream()
				.filter(FieldError.class::isInstance)
				.map(FieldError.class::cast)
				.map(err -> Map.of("field", err.getField(), "message", err.getDefaultMessage() == null ? "" : err.getDefaultMessage()))
				.collect(Collectors.toList());
		ProblemDetail detail = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST,
				"One or more fields are invalid.");
		detail.setTitle("Validation failed");
		detail.setType(URI.create("about:blank"));
		detail.setInstance(URI.create(request.getDescription(false).replace("uri=", "")));
		detail.setProperty("code", "VALIDATION_ERROR");
		detail.setProperty("errors", errors);
		return ResponseEntity.badRequest().contentType(MediaType.parseMediaType(APPLICATION_PROBLEM_JSON)).body(detail);
	}

	@ExceptionHandler(ConstraintViolationException.class)
	public ResponseEntity<ProblemDetail> handleConstraint(ConstraintViolationException ex, WebRequest request) {
		List<Map<String, String>> errors = ex.getConstraintViolations().stream()
				.map(v -> Map.of("field", v.getPropertyPath().toString(), "message", v.getMessage()))
				.collect(Collectors.toList());
		ProblemDetail detail = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, ex.getMessage());
		detail.setTitle("Validation failed");
		detail.setType(URI.create("about:blank"));
		detail.setInstance(URI.create(request.getDescription(false).replace("uri=", "")));
		detail.setProperty("code", "VALIDATION_ERROR");
		detail.setProperty("errors", errors);
		return ResponseEntity.badRequest().contentType(MediaType.parseMediaType(APPLICATION_PROBLEM_JSON)).body(detail);
	}

	@ExceptionHandler(HttpMessageNotReadableException.class)
	public ResponseEntity<ProblemDetail> handleNotReadable(HttpMessageNotReadableException ex, WebRequest request) {
		ProblemDetail detail = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, "Corps JSON invalide ou mal formé.");
		detail.setTitle("Malformed JSON");
		detail.setType(URI.create("about:blank"));
		detail.setInstance(URI.create(request.getDescription(false).replace("uri=", "")));
		detail.setProperty("code", "MALFORMED_JSON");
		return ResponseEntity.badRequest().contentType(MediaType.parseMediaType(APPLICATION_PROBLEM_JSON)).body(detail);
	}

	@ExceptionHandler(ResourceNotFoundException.class)
	public ResponseEntity<ProblemDetail> handleNotFound(ResourceNotFoundException ex, WebRequest request) {
		return problem(ex, request);
	}

	@ExceptionHandler(DuplicateEmailException.class)
	public ResponseEntity<ProblemDetail> handleDuplicate(DuplicateEmailException ex, WebRequest request) {
		return problem(ex, request);
	}

	@ExceptionHandler(CapacityReachedException.class)
	public ResponseEntity<ProblemDetail> handleCapacity(CapacityReachedException ex, WebRequest request) {
		return problem(ex, request);
	}

	@ExceptionHandler(BadCredentialsException.class)
	public ResponseEntity<ProblemDetail> handleBadCredentials(BadCredentialsException ex, WebRequest request) {
		ProblemDetail detail = ProblemDetail.forStatusAndDetail(HttpStatus.UNAUTHORIZED, "Identifiants invalides.");
		detail.setTitle("Unauthorized");
		detail.setType(URI.create("about:blank"));
		detail.setInstance(URI.create(request.getDescription(false).replace("uri=", "")));
		detail.setProperty("code", "INVALID_CREDENTIALS");
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
				.contentType(MediaType.parseMediaType(APPLICATION_PROBLEM_JSON)).body(detail);
	}

	@ExceptionHandler(AuthenticationException.class)
	public ResponseEntity<ProblemDetail> handleAuthentication(AuthenticationException ex, WebRequest request) {
		if (ex instanceof BadCredentialsException bad) {
			return handleBadCredentials(bad, request);
		}
		ProblemDetail detail = ProblemDetail.forStatusAndDetail(HttpStatus.UNAUTHORIZED, "Authentification requise.");
		detail.setTitle("Unauthorized");
		detail.setType(URI.create("about:blank"));
		detail.setInstance(URI.create(request.getDescription(false).replace("uri=", "")));
		detail.setProperty("code", "INVALID_CREDENTIALS");
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
				.contentType(MediaType.parseMediaType(APPLICATION_PROBLEM_JSON)).body(detail);
	}

	@ExceptionHandler(AccessDeniedException.class)
	public ResponseEntity<ProblemDetail> handleAccessDenied(AccessDeniedException ex, WebRequest request) {
		ProblemDetail detail = ProblemDetail.forStatusAndDetail(HttpStatus.FORBIDDEN, "Accès refusé.");
		detail.setTitle("Forbidden");
		detail.setType(URI.create("about:blank"));
		detail.setInstance(URI.create(request.getDescription(false).replace("uri=", "")));
		detail.setProperty("code", "ACCESS_DENIED");
		return ResponseEntity.status(HttpStatus.FORBIDDEN).contentType(MediaType.parseMediaType(APPLICATION_PROBLEM_JSON))
				.body(detail);
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<ProblemDetail> handleGeneric(Exception ex, WebRequest request) {
		log.error("Erreur interne", ex);
		ProblemDetail detail = ProblemDetail.forStatusAndDetail(HttpStatus.INTERNAL_SERVER_ERROR,
				"Une erreur interne s'est produite.");
		detail.setTitle("Internal Server Error");
		detail.setType(URI.create("about:blank"));
		detail.setInstance(URI.create(request.getDescription(false).replace("uri=", "")));
		detail.setProperty("code", "INTERNAL_ERROR");
		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.contentType(MediaType.parseMediaType(APPLICATION_PROBLEM_JSON)).body(detail);
	}
}
