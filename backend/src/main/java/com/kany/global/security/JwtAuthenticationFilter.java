package com.kany.global.security;

import java.io.IOException;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * "Authorization: Bearer 토큰" 헤더가 있으면 검증해서 로그인 상태로 만든다.
 * 토큰이 없거나 틀려도 여기서 막지 않는다. 막는 건 SecurityConfig의 접근 규칙이고,
 * 로그인 없이 열려 있는 API(공간 목록 등)는 토큰이 깨져 있어도 그대로 볼 수 있어야 하기 때문이다.
 */
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	private static final String BEARER_PREFIX = "Bearer ";

	private final JwtTokenProvider tokenProvider;

	public JwtAuthenticationFilter(JwtTokenProvider tokenProvider) {
		this.tokenProvider = tokenProvider;
	}

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
			throws ServletException, IOException {
		String header = request.getHeader("Authorization");
		if (header != null && header.startsWith(BEARER_PREFIX)) {
			tokenProvider.parse(header.substring(BEARER_PREFIX.length())).ifPresent(authUser -> {
				// hasRole("ADMIN")은 내부적으로 "ROLE_ADMIN" 권한을 찾는다. 그래서 접두사 ROLE_을 붙여 준다.
				var authentication = new UsernamePasswordAuthenticationToken(authUser, null,
						List.of(new SimpleGrantedAuthority("ROLE_" + authUser.role().name())));
				SecurityContextHolder.getContext().setAuthentication(authentication);
			});
		}
		chain.doFilter(request, response);
	}
}
