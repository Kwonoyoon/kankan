package com.kany.reservation.dto;

import java.time.LocalDate;
import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

// 가격·사용자는 받지 않는다. 가격은 DB의 공간 가격, 사용자는 토큰에서 서버가 정한다. 클라이언트가 보낸 값은 믿을 수 없다.
public record CreateReservationRequest(
		@NotBlank String spaceId,
		@NotNull LocalDate date,
		// 하루치(17칸)보다 많이 보내는 요청을 걸러 낸다.
		@NotEmpty @Size(max = 24) List<Integer> hours) {
}
