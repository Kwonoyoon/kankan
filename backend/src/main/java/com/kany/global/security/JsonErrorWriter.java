package com.kany.global.security;

import java.io.IOException;

import org.springframework.http.MediaType;

import com.kany.global.error.ErrorCode;

import jakarta.servlet.http.HttpServletResponse;

/**
 * 시큐리티 필터 단계에서 나는 401/403은 컨트롤러에 도달하기 전이라 GlobalExceptionHandler가 못 잡는다.
 * 프론트가 에러를 한 가지 형식({code,message})으로 다루도록 여기서도 같은 모양으로 직접 쓴다.
 * ErrorCode의 메시지는 고정 문구라 따옴표가 없다. 사용자 입력이 섞이는 값이라면 JSON 이스케이프가 필요하다.
 */
final class JsonErrorWriter {

	private JsonErrorWriter() {
	}

	static void write(HttpServletResponse response, ErrorCode errorCode) throws IOException {
		response.setStatus(errorCode.getStatus().value());
		response.setContentType(MediaType.APPLICATION_JSON_VALUE);
		response.setCharacterEncoding("UTF-8");
		response.getWriter().write("{\"code\":\"" + errorCode.name() + "\",\"message\":\"" + errorCode.getMessage() + "\"}");
	}
}
