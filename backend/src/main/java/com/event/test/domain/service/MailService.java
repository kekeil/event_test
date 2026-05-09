package com.event.test.domain.service;

import java.time.format.DateTimeFormatter;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.event.test.domain.entity.Event;
import com.event.test.domain.entity.Registration;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class MailService {

	private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

	private final JavaMailSender javaMailSender;

	@Value("${app.mail.enabled:false}")
	private boolean mailEnabled;

	@Value("${app.mail.from}")
	private String mailFrom;

	public void sendRegistrationConfirmation(Registration registration, Event event) {
		if (!mailEnabled) {
			log.info("Mail disabled, skipping confirmation for {}", registration.getEmail());
			return;
		}
		try {
			MimeMessage message = javaMailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
			helper.setFrom(mailFrom);
			helper.setTo(registration.getEmail());
			helper.setSubject("Confirmation de votre inscription — " + event.getTitle());
			String html = """
					<!doctype html><html><body style="font-family:system-ui,sans-serif;color:#111">
					  <h2>Inscription confirmée</h2>
					  <p>Bonjour <b>%s %s</b>,</p>
					  <p>Votre inscription à l'évènement <b>%s</b> est bien enregistrée.</p>
					  <ul>
					    <li>📅 %s</li>
					    <li>📍 %s</li>
					  </ul>
					  <p>À bientôt !</p>
					</body></html>
					"""
					.formatted(
							registration.getFirstName(),
							registration.getLastName(),
							event.getTitle(),
							DATE_FMT.format(event.getDate()),
							event.getLocation());
			helper.setText(html, true);
			javaMailSender.send(message);
		} catch (Exception e) {
			log.warn("Impossible d'envoyer l'email de confirmation à {}", registration.getEmail(), e);
		}
	}
}
