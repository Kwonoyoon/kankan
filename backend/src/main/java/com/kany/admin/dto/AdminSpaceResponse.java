package com.kany.admin.dto;

import com.kany.space.Space;

/** 관리자 공간 목록의 한 줄. 사이트용 SpaceResponse와 달리 숨김 여부(active)가 들어 있다. */
public record AdminSpaceResponse(
		String id,
		String branchId,
		String branchName,
		String name,
		int capacity,
		int pricePerHour,
		boolean active) {

	public static AdminSpaceResponse from(Space s) {
		return new AdminSpaceResponse(s.getId(), s.getBranch().getId(), s.getBranch().getName(), s.getName(),
				s.getCapacity(), s.getPrice(), s.isActive());
	}
}
