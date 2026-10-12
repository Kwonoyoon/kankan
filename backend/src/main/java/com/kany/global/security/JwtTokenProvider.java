package com.kany.global.security;

import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Date;
import java.util.Optional;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Component;

import com.kany.user.User;
import com.kany.user.UserRole;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

/** 토큰을 만들고(issue) 검증한다(parse). 서버는 로그인 상태를 저장하지 않고, 서명이 맞는 토큰이면 로그인한 것으로 본다. */
@Component
public class JwtTokenProvider {

	// HS256은 키가 256비트(32바이트) 미만이면 라이브러리가 거부한다. 서버를 띄울 때 바로 알리려고 직접 검사한다.
	private static final int MIN_SECRET_BYTES = 32;

	private final SecretKey key;
	private final Duration accessTokenTtl;

	public JwtTokenProvider(JwtProperties properties) {
		String secret = properties.secret();
		if (secret == null || secret.getBytes(StandardCharsets.UTF_8).length < MIN_SECRET_BYTES) {
			throw new IllegalStateException("JWT_SECRET은 32바이트 이상이어야 합니다. .env를 확인하세요.");
		}
		this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
		this.accessTokenTtl = Duration.ofMinutes(properties.accessTokenMinutes());
	}

	public String issue(User user) {
		Date now = new Date();
		return Jwts.builder()
				.subject(user.getId())
				// 역할을 토큰에 넣으면 요청마다 DB를 읽지 않아도 된다. 대신 역할이 바뀌어도 토큰이 만료될 때까지는 옛 역할이 쓰인다.
				.claim("role", user.getRole().name())
				.issuedAt(now)
				.expiration(new Date(now.getTime() + accessTokenTtl.toMillis()))
				.signWith(key)
				.compact();
	}

	public long getAccessTokenSeconds() {
		return accessTokenTtl.toSeconds();
	}

	/** 서명이 틀렸거나 만료됐거나 형식이 깨진 토큰이면 비어 있는 값을 돌려준다. 원인은 구분하지 않는다. */
	public Optional<AuthUser> parse(String token) {
		try {
			Claims claims = Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
			return Optional.of(new AuthUser(claims.getSubject(), UserRole.valueOf(claims.get("role", String.class))));
		} catch (JwtException | IllegalArgumentException e) {
			return Optional.empty();
		}
	}
}
