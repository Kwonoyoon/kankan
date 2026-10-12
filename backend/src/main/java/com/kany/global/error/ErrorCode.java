package com.kany.global.error;

import org.springframework.http.HttpStatus;

public enum ErrorCode {

	INVALID_INPUT(HttpStatus.BAD_REQUEST, "입력값이 올바르지 않습니다."),
	NOT_FOUND(HttpStatus.NOT_FOUND, "요청한 리소스를 찾을 수 없습니다."),
	METHOD_NOT_ALLOWED(HttpStatus.METHOD_NOT_ALLOWED, "지원하지 않는 요청 방식입니다."),
	SPACE_NOT_FOUND(HttpStatus.NOT_FOUND, "공간을 찾을 수 없습니다."),
	UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다."),
	FORBIDDEN(HttpStatus.FORBIDDEN, "접근 권한이 없습니다."),
	// 이메일이 없는 경우와 비밀번호가 틀린 경우를 같은 코드·문구로 응답한다.
	// 구분해서 알려주면 "이 이메일은 가입돼 있다"를 공격자가 알아낼 수 있다.
	INVALID_CREDENTIALS(HttpStatus.UNAUTHORIZED, "이메일 또는 비밀번호가 올바르지 않습니다."),
	EMAIL_DUPLICATED(HttpStatus.CONFLICT, "이미 가입된 이메일입니다."),
	USER_NOT_FOUND(HttpStatus.NOT_FOUND, "회원을 찾을 수 없습니다."),
	RESERVATION_NOT_FOUND(HttpStatus.NOT_FOUND, "예약을 찾을 수 없습니다."),
	ALREADY_CANCELED(HttpStatus.CONFLICT, "이미 취소된 예약입니다."),
	SLOT_ALREADY_BOOKED(HttpStatus.CONFLICT, "이미 예약된 시간이 포함되어 있습니다."),
	SLOT_BLOCKED(HttpStatus.CONFLICT, "예약할 수 없도록 막아 둔 시간이 포함되어 있습니다."),
	ALREADY_BLOCKED(HttpStatus.CONFLICT, "이미 막아 둔 시간이 포함되어 있습니다."),
	BLOCKED_SLOT_NOT_FOUND(HttpStatus.NOT_FOUND, "막아 둔 시간을 찾을 수 없습니다."),
	INQUIRY_NOT_FOUND(HttpStatus.NOT_FOUND, "문의를 찾을 수 없습니다."),
	BRANCH_NOT_FOUND(HttpStatus.NOT_FOUND, "지점을 찾을 수 없습니다."),
	CONCEPT_NOT_FOUND(HttpStatus.NOT_FOUND, "존재하지 않는 컨셉이 포함되어 있습니다."),
	PAST_SLOT(HttpStatus.BAD_REQUEST, "이미 지난 시간은 예약할 수 없습니다."),
	OUT_OF_OPERATING_HOURS(HttpStatus.BAD_REQUEST, "운영 시간 밖의 시간이 포함되어 있습니다."),
	INTERNAL_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "서버 오류가 발생했습니다.");

	private final HttpStatus status;
	private final String message;

	ErrorCode(HttpStatus status, String message) {
		this.status = status;
		this.message = message;
	}

	public HttpStatus getStatus() {
		return status;
	}

	public String getMessage() {
		return message;
	}
}
