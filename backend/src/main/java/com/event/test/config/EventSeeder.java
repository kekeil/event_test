package com.event.test.config;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import com.event.test.domain.entity.Event;
import com.event.test.domain.repository.EventRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
@Order(2)
public class EventSeeder implements CommandLineRunner {

	private final EventRepository eventRepository;

	@Override
	public void run(String... args) {
		if (eventRepository.count() > 0) {
			log.info("EventSeeder: events table not empty, skipping seed.");
			return;
		}

		OffsetDateTime base = OffsetDateTime.now(ZoneOffset.UTC).plusDays(7).withHour(18).withMinute(0).withSecond(0)
				.withNano(0);

		List<Event> events = List.of(
				buildEvent(
						"Conférence DevTalks 2030 — L'avenir du Web",
						"""
								Une journée entière dédiée aux pratiques modernes du développement web.

								Au programme :
								- Keynote d'ouverture sur l'évolution des frameworks JavaScript
								- Atelier pratique : architecture micro-frontends en production
								- Table ronde : sécurité, performance et accessibilité
								- Networking autour d'un cocktail dînatoire en fin de journée

								Public visé : développeurs front-end et full-stack avec au moins 2 ans d'expérience.
								Pensez à apporter votre laptop pour les ateliers pratiques.
								""",
						base.plusDays(0),
						"Centre de Conférences, Ouagadougou",
						120),
				buildEvent(
						"Workshop Spring Boot avancé",
						"""
								Atelier intensif de 4 heures pour aller plus loin avec Spring Boot.

								Couverture :
								- Configuration avancée et profils Spring
								- Sécurité avec JWT, OAuth 2.0 et OpenID Connect
								- Tests d'intégration avec Testcontainers
								- Observabilité : Actuator, Micrometer, traces distribuées

								Prérequis : connaissance de base de Spring Boot et Java 17+.
								Un environnement de développement opérationnel sera nécessaire.
								""",
						base.plusDays(3).withHour(14),
						"Coworking Innov'Space, Bobo-Dioulasso",
						25),
				buildEvent(
						"Meetup Cloud Native — Kubernetes en pratique",
						"""
								Soirée meetup décontractée autour de Kubernetes et de l'écosystème cloud-native.

								Trois retours d'expérience de 20 minutes :
								1. Migration d'une plateforme legacy vers K8s — leçons apprises
								2. GitOps avec ArgoCD : du commit au déploiement
								3. Sécurité runtime avec Falco et OPA Gatekeeper

								Pizzas et boissons offertes ! Inscription obligatoire pour la logistique.
								""",
						base.plusDays(5).withHour(19),
						"TechHub Café, Ouagadougou",
						60),
				buildEvent(
						"Hackathon Civic Tech — 24h pour innover",
						"""
								Un week-end pour construire des solutions concrètes au service de l'intérêt général.

								Thèmes proposés :
								- Accès à l'éducation et au savoir
								- Mobilité urbaine durable
								- Transparence et données publiques ouvertes

								Équipes de 3 à 5 personnes. Mentors présents tout au long de l'événement.
								Trois prix décernés : Innovation, Impact social, Coup de cœur du jury.
								Repas et boissons fournis. Prévoyez de quoi dormir si vous restez sur place !
								""",
						base.plusDays(10).withHour(9),
						"Université Joseph Ki-Zerbo, Ouagadougou",
						80),
				buildEvent(
						"Atelier Design System & Tailwind 4",
						"""
								Demi-journée pratique pour construire un design system durable avec Tailwind CSS 4.

								Vous repartirez avec :
								- Une palette de tokens cohérente (couleurs, typo, espacements)
								- Des composants UI réutilisables prêts pour la prod
								- Une stratégie de versionnement et de documentation

								Ordinateur indispensable. Connaissance de base de HTML/CSS attendue.
								""",
						base.plusDays(14).withHour(14),
						"WebStudio, Ouagadougou",
						20),
				buildEvent(
						"Soirée Startups — Pitch & Networking",
						"""
								Cinq jeunes pousses présentent leur projet en 5 minutes chrono devant un jury d'investisseurs.

								Au menu :
								- Pitchs des startups sélectionnées
								- Questions / réponses avec le jury
								- Vote du public pour le prix coup de cœur
								- Cocktail de networking après la session

								Idéal pour les entrepreneurs, business angels et passionnés d'écosystème tech.
								""",
						base.plusDays(21).withHour(18).withMinute(30),
						"Hôtel Laïco, Ouagadougou",
						100));

		eventRepository.saveAll(events);
		log.info("EventSeeder: {} demo events created.", events.size());
	}

	private Event buildEvent(String title, String description, OffsetDateTime date, String location, int capacity) {
		Event e = new Event();
		e.setTitle(title);
		e.setDescription(description.strip());
		e.setDate(date);
		e.setLocation(location);
		e.setCapacity(capacity);
		return e;
	}
}
