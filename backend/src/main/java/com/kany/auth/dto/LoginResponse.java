package com.kany.auth.dto;

public record LoginResponse(String accessToken, long expiresInSeconds, UserResponse user) {
}
