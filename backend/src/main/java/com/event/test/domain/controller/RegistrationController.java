package com.event.test.domain.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.event.test.domain.dto.registration.RegistrationResponse;
import com.event.test.domain.service.RegistrationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class RegistrationController {

	private final RegistrationService registrationService;

	@GetMapping("/events/{eventId}/registrations")
	public List<RegistrationResponse> listRegistrations(@PathVariable String eventId) {
		return registrationService.listByEvent(eventId);
	}

	@DeleteMapping("/registrations/{id}")
	public ResponseEntity<Void> deleteRegistration(@PathVariable String id) {
		registrationService.delete(id);
		return ResponseEntity.ok().build();
	}
}
