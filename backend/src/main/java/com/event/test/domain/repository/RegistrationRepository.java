package com.event.test.domain.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.event.test.domain.entity.Registration;

public interface RegistrationRepository extends JpaRepository<Registration, String> {

	long countByEvent_Id(String eventId);

	boolean existsByEvent_IdAndEmail(String eventId, String email);

	List<Registration> findByEvent_IdOrderByRegisteredAtAsc(String eventId);
}
