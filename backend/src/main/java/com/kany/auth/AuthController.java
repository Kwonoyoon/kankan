package com.kany.auth;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.kany.auth.dto.LoginRequest;
import com.kany.auth.dto.LoginResponse;
import com.kany.auth.dto.SignupRequest;
import com.kany.auth.dto.UserResponse;
import com.kany.global.security.AuthUser;

import jakarta.validation.Valid;

@RestController
public class AuthController {

	private final AuthService authService;

	public AuthController(AuthService authService) {
		this.authService = authService;
	}

	@PostMapping("/api/auth/signup")
	@ResponseStatus(HttpStatus.CREATED)
	public LoginResponse signup(@Valid @RequestBody SignupRequest request) {
		return authService.signup(request);
	}

	@PostMapping("/api/auth/login")
	public LoginResponse login(@Valid @RequestBody LoginRequest request) {
		return authService.login(request);
	}

	@GetMapping("/api/auth/me")
	public UserResponse me(@AuthenticationPrincipal AuthUser authUser) {
		return authService.getMe(authUser.id());
	}
}
