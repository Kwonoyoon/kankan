package com.kany.user;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * 서버가 뜰 때 관리자 계정이 없으면 만든다. 관리자 비밀번호를 SQL(마이그레이션)에 적으면 public 저장소에 그대로 올라가서,
 * 환경변수(ADMIN_PASSWORD)로 받아 BCrypt로 해시한 뒤 저장한다.
 */
@Component
public class AdminInitializer implements ApplicationRunner {

	private static final Logger log = LoggerFactory.getLogger(AdminInitializer.class);
	private static final String ADMIN_NICKNAME = "관리자";

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final AdminProperties properties;

	public AdminInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder, AdminProperties properties) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
		this.properties = properties;
	}

	@ConfigurationProperties(prefix = "app.admin")
	public record AdminProperties(String email, String password) {
	}

	@Override
	@Transactional
	public void run(ApplicationArguments args) {
		if (properties.password() == null || properties.password().isBlank()) {
			log.warn("ADMIN_PASSWORD가 비어 있어 관리자 계정을 만들지 않았습니다.");
			return;
		}
		String email = properties.email().trim().toLowerCase();
		if (userRepository.existsByEmail(email)) {
			// 이미 있으면 비밀번호를 덮어쓰지 않는다. 관리자가 바꾼 비밀번호가 재시작할 때마다 .env 값으로 되돌아가면 안 된다.
			return;
		}
		userRepository.save(User.create(email, passwordEncoder.encode(properties.password()), ADMIN_NICKNAME, UserRole.ADMIN));
		log.info("관리자 계정을 만들었습니다: {}", email);
	}
}
