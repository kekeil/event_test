package com.event.test.domain.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.OffsetDateTime;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.event.test.domain.dto.registration.RegistrationCreateRequest;
import com.event.test.domain.dto.registration.RegistrationResponse;
import com.event.test.domain.entity.Event;
import com.event.test.domain.entity.Registration;
import com.event.test.domain.repository.RegistrationRepository;
import com.event.test.exception.CapacityReachedException;
import com.event.test.exception.DuplicateEmailException;

@ExtendWith(MockitoExtension.class)
class RegistrationServiceTest {

	@Mock
	private EventService eventService;

	@Mock
	private RegistrationRepository registrationRepository;

	@Mock
	private MailService mailService;

	@InjectMocks
	private RegistrationService registrationService;

	@Test
	void register_success() {
		Event event = new Event();
		event.setId("evt-1");
		event.setTitle("Conf");
		event.setCapacity(10);
		when(eventService.getEntityById("evt-1")).thenReturn(event);
		when(registrationRepository.countByEvent_Id("evt-1")).thenReturn(2L);
		when(registrationRepository.existsByEvent_IdAndEmail("evt-1", "a@b.com")).thenReturn(false);
		when(registrationRepository.save(any(Registration.class))).thenAnswer(invocation -> {
			Registration r = invocation.getArgument(0);
			r.setId("reg-1");
			r.setRegisteredAt(OffsetDateTime.parse("2025-11-12T09:00:00Z"));
			return r;
		});

		RegistrationCreateRequest req = new RegistrationCreateRequest("A", "B", "a@b.com");
		RegistrationResponse res = registrationService.register("evt-1", req);

		assertNotNull(res.id());
		assertEquals("evt-1", res.eventId());
		verify(mailService).sendRegistrationConfirmation(any(Registration.class), any(Event.class));
	}

	@Test
	void register_capacityReached() {
		Event event = new Event();
		event.setId("evt-1");
		event.setCapacity(1);
		when(eventService.getEntityById("evt-1")).thenReturn(event);
		when(registrationRepository.countByEvent_Id("evt-1")).thenReturn(1L);

		RegistrationCreateRequest req = new RegistrationCreateRequest("A", "B", "a@b.com");
		assertThrows(CapacityReachedException.class, () -> registrationService.register("evt-1", req));
		verify(registrationRepository, never()).save(any());
	}

	@Test
	void register_duplicateEmail() {
		Event event = new Event();
		event.setId("evt-1");
		event.setCapacity(5);
		when(eventService.getEntityById("evt-1")).thenReturn(event);
		when(registrationRepository.countByEvent_Id("evt-1")).thenReturn(1L);
		when(registrationRepository.existsByEvent_IdAndEmail("evt-1", "dup@b.com")).thenReturn(true);

		RegistrationCreateRequest req = new RegistrationCreateRequest("A", "B", "dup@b.com");
		assertThrows(DuplicateEmailException.class, () -> registrationService.register("evt-1", req));
		verify(registrationRepository, never()).save(any());
	}
}
