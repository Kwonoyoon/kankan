package com.kany.auth;

import java.util.Locale;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kany.auth.dto.LoginRequest;
import com.kany.auth.dto.LoginResponse;
import com.kany.auth.dto.SignupRequest;
import com.kany.auth.dto.UserResponse;
import com.kany.global.error.BusinessException;
import com.kany.global.error.ErrorCode;
import com.kany.global.security.JwtTokenProvider;
import com.kany.user.User;
import com.kany.user.UserRepository;
import com.kany.user.UserRole;

@Service
public class AuthService {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtTokenProvider tokenProvider;

	// 없는 이메일로 로그인해도 BCrypt 비교를 한 번 하게 하려는 가짜 해시.
	// 이메일이 없을 때만 즉시 응답하면 "응답이 빠르다 = 가입 안 된 이메일"로 가입 여부를 알아낼 수 있다.
	private final String dummyHash;

	public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtTokenProvider tokenProvider) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
		this.tokenProvider = tokenProvider;
		this.dummyHash = passwordEncoder.encode("dummy-password-for-timing");
	}

	@Transactional
	public LoginResponse signup(SignupRequest request) {
		String email = normalizeEmail(request.email());
		if (userRepository.existsByEmail(email)) {
			throw new BusinessException(ErrorCode.EMAIL_DUPLICATED);
		}
		User user = User.create(email, passwordEncoder.encode(request.password()), request.nickname().trim(),
				UserRole.USER);
		try {
			// flush까지 해서 UNIQUE 위반을 여기서 잡는다. 위의 exists 확인과 저장 사이에 같은 이메일이 먼저 들어올 수 있다.
			userRepository.saveAndFlush(user);
		} catch (DataIntegrityViolationException e) {
			throw new BusinessException(ErrorCode.EMAIL_DUPLICATED);
		}
		return toLoginResponse(user);
	}

	@Transactional(readOnly = true)
	public LoginResponse login(LoginRequest request) {
		User user = userRepository.findByEmail(normalizeEmail(request.email())).orElse(null);
		String hash = user != null ? user.getPasswordHash() : dummyHash;
		boolean matches = passwordEncoder.matches(request.password(), hash);
		if (user == null || !matches) {
			throw new BusinessException(ErrorCode.INVALID_CREDENTIALS);
		}
		return toLoginResponse(user);
	}

	@Transactional(readOnly = true)
	public UserResponse getMe(String userId) {
		// 토큰은 유효한데 그 사이 회원이 삭제된 경우도 로그인 안 된 것으로 취급한다.
		return userRepository.findById(userId).map(UserResponse::from)
				.orElseThrow(() -> new BusinessException(ErrorCode.UNAUTHORIZED));
	}

	// 이메일은 대소문자 구분 없이 같은 주소로 본다. 정규화하지 않으면 A@x.com 과 a@x.com 이 서로 다른 회원으로 가입된다.
	static String normalizeEmail(String email) {
		return email.trim().toLowerCase(Locale.ROOT);
	}

	private LoginResponse toLoginResponse(User user) {
		return new LoginResponse(tokenProvider.issue(user), tokenProvider.getAccessTokenSeconds(), UserResponse.from(user));
	}
}
