package com.kany.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

// role 필드를 일부러 두지 않았다. 요청 본문에서 권한을 받으면 가입하면서 "ADMIN"을 보내 관리자가 될 수 있다.
public record SignupRequest(
		@NotBlank @Email @Size(max = 255) String email,
		// 72자 상한: BCrypt는 72바이트 뒤를 무시하므로 그보다 긴 값은 받아도 보안상 의미가 없다.
		@NotBlank @Size(min = 8, max = 72) String password,
		@NotBlank @Size(max = 20) String nickname) {
}
