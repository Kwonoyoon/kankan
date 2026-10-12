package com.kany.reservation.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.kany.reservation.Reservation;
import com.kany.reservation.ReservationStatus;

public record ReservationResponse(
		String id,
		String groupId,
		String spaceId,
		String spaceName,
		String branchName,
		LocalDate date,
		int hour,
		int price,
		ReservationStatus status,
		LocalDateTime createdAt) {

	public static ReservationResponse from(Reservation r) {
		return new ReservationResponse(r.getId(), r.getGroupId(), r.getSpace().getId(), r.getSpace().getName(),
				r.getSpace().getBranch().getName(), r.getResDate(), r.getStartHour(), r.getPrice(), r.getStatus(),
				r.getCreatedAt());
	}
}
