package com.kany.global.error;

/** 서비스 계층이 "이 요청은 처리할 수 없다"고 알릴 때 던진다. GlobalExceptionHandler가 ErrorCode의 상태코드로 바꿔 응답한다. */
public class BusinessException extends RuntimeException {

	private final ErrorCode errorCode;

	public BusinessException(ErrorCode errorCode) {
		super(errorCode.getMessage());
		this.errorCode = errorCode;
	}

	public ErrorCode getErrorCode() {
		return errorCode;
	}
}
