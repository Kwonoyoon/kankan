package com.kany.admin.dto;

import java.time.LocalDateTime;

import com.kany.user.UserRole;

/** 관리자 회원 목록의 한 줄. 생성자 순서와 타입은 UserRepository.findAllWithReservationCounts의 select new 와 같아야 한다. */
public record AdminUserResponse(
		String id,
		String email,
		String nickname,
		UserRole role,
		LocalDateTime createdAt,
		long totalReservations,
		long activeReservations) {
}
