package com.kany.global.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.kany.global.error.ErrorCode;

@Configuration
public class SecurityConfig {

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http, JwtTokenProvider tokenProvider) throws Exception {
		http
				// CSRF는 "브라우저가 쿠키를 자동으로 붙여 보내는 것"을 노린 공격이다.
				// 이 서버는 쿠키가 아니라 직접 붙이는 Authorization 헤더로 인증하므로 막을 대상이 없어서 끈다.
				.csrf(csrf -> csrf.disable())
				.httpBasic(basic -> basic.disable())
				.formLogin(form -> form.disable())
				// 세션을 만들지 않는다. 요청마다 토큰만 보고 판단하므로 서버가 늘어나도 로그인 상태를 공유할 필요가 없다.
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.authorizeHttpRequests(auth -> auth
						// 둘러보기는 로그인 없이 가능해야 한다. (예약만 로그인 필요)
						.requestMatchers(HttpMethod.GET, "/api/branches", "/api/concepts", "/api/spaces",
								"/api/spaces/*", "/api/reservations/booked", "/api/actuator/health")
						.permitAll()
						.requestMatchers(HttpMethod.POST, "/api/auth/signup", "/api/auth/login").permitAll()
						// 관리자 API는 URL 규칙으로 한 번에 막는다. 컨트롤러마다 검사를 빼먹는 실수를 줄이려는 것이다.
						.requestMatchers("/api/admin/**").hasRole("ADMIN")
						// 위에 적지 않은 나머지는 전부 로그인 필요. 새 API를 만들고 규칙을 깜빡해도 열려 있지 않게 하는 기본값이다.
						.anyRequest().authenticated())
				.exceptionHandling(handling -> handling
						.authenticationEntryPoint(
								(request, response, e) -> JsonErrorWriter.write(response, ErrorCode.UNAUTHORIZED))
						.accessDeniedHandler(
								(request, response, e) -> JsonErrorWriter.write(response, ErrorCode.FORBIDDEN)))
				// @Component로 등록하지 않고 여기서 직접 만든다. 빈으로 두면 시큐리티 체인과 서블릿 컨테이너에 두 번 등록된다.
				.addFilterBefore(new JwtAuthenticationFilter(tokenProvider), UsernamePasswordAuthenticationFilter.class);
		return http.build();
	}

	// 이 빈이 없으면 스프링 부트가 user/임시 비밀번호 계정을 자동으로 만들고 로그에 비밀번호를 찍는다.
	// 우리는 폼 로그인 대신 AuthService가 직접 비밀번호를 비교하고 JWT로 인증하므로 이 경로로 로그인할 사용자는 없다.
	// 자동 계정이 살아 있는 채로 두면 "쓰지 않는데 존재하는 로그인 수단"이 되므로 빈 UserDetailsService로 대체한다.
	@Bean
	public UserDetailsService userDetailsService() {
		return username -> {
			throw new UsernameNotFoundException("폼 로그인은 사용하지 않습니다.");
		};
	}

	// BCrypt는 같은 비밀번호도 매번 다른 해시가 나오고(솔트), 일부러 느리게 계산해서 무차별 대입을 어렵게 한다.
	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
}
