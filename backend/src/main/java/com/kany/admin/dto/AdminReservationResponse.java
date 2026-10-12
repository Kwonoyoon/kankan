package com.kany.admin.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.kany.reservation.Reservation;
import com.kany.reservation.ReservationStatus;

/** 일반 예약 응답에 "누가 예약했는지"(회원 정보)를 더한 관리자용 응답 */
public record AdminReservationResponse(
		String id,
		String groupId,
		String userId,
		String userEmail,
		String userNickname,
		String spaceId,
		String spaceName,
		String branchName,
		LocalDate date,
		int hour,
		int price,
		ReservationStatus status,
		LocalDateTime createdAt) {

	public static AdminReservationResponse from(Reservation r) {
		return new AdminReservationResponse(r.getId(), r.getGroupId(), r.getUser().getId(), r.getUser().getEmail(),
				r.getUser().getNickname(), r.getSpace().getId(), r.getSpace().getName(),
				r.getSpace().getBranch().getName(), r.getResDate(), r.getStartHour(), r.getPrice(), r.getStatus(),
				r.getCreatedAt());
	}
}
