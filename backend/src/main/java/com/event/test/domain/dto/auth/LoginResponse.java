package com.event.test.domain.dto.auth;

public record LoginResponse(String token, String role, String email) {
}
