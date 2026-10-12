package com.kany.admin.dto;

import java.util.List;

/**
 * 관리자 통계. 금액은 "확정 예약의 공간 가격 합계"다. 쿠폰 할인이 아직 서버에 없고 결제 기능도 없어서,
 * 실제로 받은 돈(매출)이 아니라 예약 기준 예상 금액이다. 화면에서도 매출이라고 부르지 않는다.
 */
public record AdminStatsResponse(
		long totalUsers,
		long confirmedReservations,
		long todayReservations,
		long confirmedAmount,
		long openInquiries,
		List<SpaceStat> spaces) {

	/** 생성자 순서와 타입은 ReservationRepository.findSpaceStats 의 select new 와 같아야 한다. */
	public record SpaceStat(String spaceId, String spaceName, String branchName, long reservations, long amount) {
	}
}
