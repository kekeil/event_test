package com.event.test.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.event.test.domain.entity.Role;
import com.event.test.domain.entity.User;
import com.event.test.domain.repository.UserRepository;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
@Order(1)
public class DataSeeder implements CommandLineRunner {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final String adminEmail;
	private final String adminPassword;

	public DataSeeder(
			UserRepository userRepository,
			PasswordEncoder passwordEncoder,
			@Value("${app.admin.default-email}") String adminEmail,
			@Value("${app.admin.default-password}") String adminPassword) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
		this.adminEmail = adminEmail;
		this.adminPassword = adminPassword;
	}

	@Override
	public void run(String... args) {
		if (userRepository.count() == 0) {
			User admin = new User();
			admin.setEmail(adminEmail);
			admin.setPassword(passwordEncoder.encode(adminPassword));
			admin.setRole(Role.ADMIN);
			userRepository.save(admin);
			log.warn("Default admin created: {}. CHANGE THIS PASSWORD.", adminEmail);
		}
	}
}
