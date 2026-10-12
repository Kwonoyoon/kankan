package com.kany.reservation.dto;

/** "누가"는 빼고 "어느 공간 몇 시가 찼는지"만 공개한다. 로그인 없이 호출되는 API라 개인정보가 섞이면 안 된다. */
public record BookedSlotResponse(String spaceId, int hour) {
}
