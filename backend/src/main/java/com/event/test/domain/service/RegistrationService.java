package com.event.test.domain.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.event.test.domain.dto.registration.RegistrationCreateRequest;
import com.event.test.domain.dto.registration.RegistrationResponse;
import com.event.test.domain.entity.Event;
import com.event.test.domain.entity.Registration;
import com.event.test.domain.mapper.RegistrationMapper;
import com.event.test.domain.repository.RegistrationRepository;
import com.event.test.exception.CapacityReachedException;
import com.event.test.exception.DuplicateEmailException;
import com.event.test.exception.ResourceNotFoundException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class RegistrationService {

	private final EventService eventService;
	private final RegistrationRepository registrationRepository;
	private final MailService mailService;

	@Transactional
	public RegistrationResponse register(String eventId, RegistrationCreateRequest request) {
		Event event = eventService.getEntityById(eventId);
		long count = registrationRepository.countByEvent_Id(eventId);
		if (count >= event.getCapacity()) {
			throw new CapacityReachedException();
		}
		if (registrationRepository.existsByEvent_IdAndEmail(eventId, request.email())) {
			throw new DuplicateEmailException();
		}
		Registration registration = new Registration();
		registration.setEvent(event);
		registration.setFirstName(request.firstName());
		registration.setLastName(request.lastName());
		registration.setEmail(request.email());
		Registration saved = registrationRepository.save(registration);
		try {
			mailService.sendRegistrationConfirmation(saved, event);
		} catch (Exception e) {
			log.warn("Échec lors de l'envoi du mail de confirmation (inscription conservée)", e);
		}
		return RegistrationMapper.toResponse(saved);
	}

	@Transactional(readOnly = true)
	public List<RegistrationResponse> listByEvent(String eventId) {
		eventService.getEntityById(eventId);
		return registrationRepository.findByEvent_IdOrderByRegisteredAtAsc(eventId).stream()
				.map(RegistrationMapper::toResponse)
				.toList();
	}

	@Transactional
	public void delete(String registrationId) {
		Registration registration = registrationRepository.findById(registrationId)
				.orElseThrow(() -> new ResourceNotFoundException("Inscription", registrationId));
		registrationRepository.delete(registration);
	}
}
