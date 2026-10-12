package com.kany.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

// 로그인에는 비밀번호 길이 규칙(8자 이상)을 걸지 않는다. 규칙이 바뀌기 전에 가입한 사람이 로그인하지 못하게 되기 때문이다.
public record LoginRequest(
		@NotBlank @Size(max = 255) String email,
		@NotBlank @Size(max = 72) String password) {
}
