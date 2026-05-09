package com.event.test.domain.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.event.test.domain.dto.event.EventCreateRequest;
import com.event.test.domain.dto.event.EventResponse;
import com.event.test.domain.dto.event.EventUpdateRequest;
import com.event.test.domain.dto.event.PageResponse;
import com.event.test.domain.entity.Event;
import com.event.test.domain.mapper.EventMapper;
import com.event.test.domain.repository.EventRepository;
import com.event.test.domain.repository.RegistrationRepository;
import com.event.test.exception.ResourceNotFoundException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EventService {

	private final EventRepository eventRepository;
	private final RegistrationRepository registrationRepository;

	@Transactional(readOnly = true)
	public PageResponse<EventResponse> search(String search, String date, int page, int limit) {
		int safeLimit = Math.min(Math.max(limit, 1), 100);
		int safePage = Math.max(page, 0);
		Pageable pageable = PageRequest.of(safePage, safeLimit, Sort.by(Sort.Direction.ASC, "date"));
		Specification<Event> spec = Specification.where(EventSpecifications.search(search))
				.and(EventSpecifications.onDay(date));
		Page<Event> result = eventRepository.findAll(spec, pageable);
		var items = result.getContent().stream()
				.map(e -> EventMapper.toResponse(e, registrationRepository.countByEvent_Id(e.getId())))
				.toList();
		return new PageResponse<>(items, result.getNumber(), result.getSize(), result.getTotalElements(),
				result.getTotalPages());
	}

	@Transactional(readOnly = true)
	public EventResponse getById(String id) {
		Event event = eventRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Evenement", id));
		long count = registrationRepository.countByEvent_Id(id);
		return EventMapper.toResponse(event, count);
	}

	@Transactional
	public EventResponse create(EventCreateRequest request) {
		Event event = EventMapper.toEntity(request);
		Event saved = eventRepository.save(event);
		return EventMapper.toResponse(saved, 0L);
	}

	@Transactional
	public EventResponse update(String id, EventUpdateRequest request) {
		Event event = eventRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Evenement", id));
		EventMapper.apply(event, request);
		Event saved = eventRepository.save(event);
		return EventMapper.toResponse(saved, registrationRepository.countByEvent_Id(id));
	}

	@Transactional
	public void delete(String id) {
		if (!eventRepository.existsById(id)) {
			throw new ResourceNotFoundException("Evenement", id);
		}
		eventRepository.deleteById(id);
	}

	@Transactional(readOnly = true)
	public Event getEntityById(String id) {
		return eventRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Evenement", id));
	}
}
