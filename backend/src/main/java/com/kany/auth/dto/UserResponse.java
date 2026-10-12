package com.kany.auth.dto;

import com.kany.user.User;
import com.kany.user.UserRole;

/** 화면에 내려주는 회원 정보. User 엔티티를 그대로 내리면 passwordHash까지 응답에 실리므로 필요한 값만 옮긴다. */
public record UserResponse(String id, String email, String nickname, UserRole role) {

	public static UserResponse from(User user) {
		return new UserResponse(user.getId(), user.getEmail(), user.getNickname(), user.getRole());
	}
}
