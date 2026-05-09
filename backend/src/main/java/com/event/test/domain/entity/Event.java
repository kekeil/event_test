package com.event.test.domain.entity;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "events")
@Getter
@Setter
@NoArgsConstructor
public class Event {

	@Id
	@Column(length = 36)
	private String id;

	@Column(nullable = false, length = 100)
	private String title;

	@Lob
	private String description;

	@Column(nullable = false)
	private OffsetDateTime date;

	@Column(nullable = false)
	private String location;

	@Column(nullable = false)
	private Integer capacity;

	@Column(nullable = false)
	private OffsetDateTime createdAt;

	@OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Registration> registrations = new ArrayList<>();

	@PrePersist
	public void prePersist() {
		if (id == null) {
			id = UUID.randomUUID().toString();
		}
		if (createdAt == null) {
			createdAt = OffsetDateTime.now();
		}
	}
}
