package com.event.test.domain.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.event.test.domain.dto.auth.LoginRequest;
import com.event.test.domain.dto.auth.LoginResponse;
import com.event.test.domain.entity.User;
import com.event.test.domain.repository.UserRepository;
import com.event.test.security.JwtService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

	private final AuthenticationManager authenticationManager;
	private final UserRepository userRepository;
	private final JwtService jwtService;

	@Transactional(readOnly = true)
	public LoginResponse login(LoginRequest request) {
		authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(request.email(), request.password()));
		User user = userRepository.findByEmail(request.email()).orElseThrow();
		String token = jwtService.generateToken(user);
		return new LoginResponse(token, user.getRole().name(), user.getEmail());
	}
}
