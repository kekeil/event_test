package com.event.test.domain.controller;

import java.net.URI;

import org.springframework.http.ResponseEntity;
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

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

	private final EventService eventService;
	private final RegistrationService registrationService;

	@GetMapping
	public PageResponse<EventResponse> listEvents(
			@RequestParam(required = false) String search,
			@RequestParam(required = false) String date,
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "10") int limit) {
		return eventService.search(search, date, page, limit);
	}

	@GetMapping("/{id}")
	public EventResponse getEvent(@PathVariable String id) {
		return eventService.getById(id);
	}

	@PostMapping
	public ResponseEntity<EventResponse> createEvent(@Valid @RequestBody EventCreateRequest request) {
		EventResponse body = eventService.create(request);
		URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(body.id())
				.toUri();
		return ResponseEntity.created(location).body(body);
	}

	@PutMapping("/{id}")
	public EventResponse updateEvent(@PathVariable String id, @Valid @RequestBody EventUpdateRequest request) {
		return eventService.update(id, request);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteEvent(@PathVariable String id) {
		eventService.delete(id);
		return ResponseEntity.ok().build();
	}

	@PostMapping("/{id}/register")
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
