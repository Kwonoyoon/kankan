package com.kany.global.security;

import com.kany.user.UserRole;

/** 토큰 검증을 통과한 요청의 로그인 정보. 컨트롤러가 @AuthenticationPrincipal로 받는다. */
public record AuthUser(String id, UserRole role) {
}
