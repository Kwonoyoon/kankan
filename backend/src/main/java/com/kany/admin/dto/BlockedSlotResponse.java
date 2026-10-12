package com.kany.admin.dto;

import java.time.LocalDate;

import com.kany.reservation.BlockedSlot;

public record BlockedSlotResponse(
		String id,
		String spaceId,
		String spaceName,
		String branchName,
		LocalDate date,
		int hour,
		String reason) {

	public static BlockedSlotResponse from(BlockedSlot b) {
		return new BlockedSlotResponse(b.getId(), b.getSpace().getId(), b.getSpace().getName(),
				b.getSpace().getBranch().getName(), b.getBlockDate(), b.getStartHour(), b.getReason());
	}
}
