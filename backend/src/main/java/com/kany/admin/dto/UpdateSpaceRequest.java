package com.kany.admin.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

// Integer/Boolean(객체형)을 쓴 이유: int/boolean은 값이 안 오면 0/false로 채워져서 "가격 0원, 숨김"으로 저장된다.
// 객체형이면 안 온 값이 null로 남아 @NotNull이 걸러낸다.
public record UpdateSpaceRequest(
		// 상한은 실수로 0을 더 붙이는 입력(12000 → 1200000)을 막으려는 안전장치다.
		@NotNull @Min(0) @Max(500_000) Integer pricePerHour,
		@NotNull Boolean active) {
}
