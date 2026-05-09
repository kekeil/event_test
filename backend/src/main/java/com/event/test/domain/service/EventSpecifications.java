package com.event.test.domain.service;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;

import org.springframework.data.jpa.domain.Specification;

import com.event.test.domain.entity.Event;

public final class EventSpecifications {

	private EventSpecifications() {
	}

	public static Specification<Event> search(String search) {
		return (root, query, cb) -> {
			if (search == null || search.isBlank()) {
				return cb.conjunction();
			}
			String pattern = "%" + search.toLowerCase().trim() + "%";
			return cb.or(
					cb.like(cb.lower(root.get("title")), pattern),
					cb.like(cb.lower(root.get("location")), pattern));
		};
	}

	public static Specification<Event> onDay(String dateParam) {
		return (root, query, cb) -> {
			if (dateParam == null || dateParam.isBlank()) {
				return cb.conjunction();
			}
			LocalDate day = LocalDate.parse(dateParam);
			ZoneOffset zone = ZoneOffset.UTC;
			OffsetDateTime start = day.atStartOfDay().atOffset(zone);
			OffsetDateTime end = day.plusDays(1).atStartOfDay().atOffset(zone).minusNanos(1);
			return cb.between(root.get("date"), start, end);
		};
	}
}
