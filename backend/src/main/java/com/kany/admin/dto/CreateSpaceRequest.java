package com.kany.admin.dto;

import java.util.List;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CreateSpaceRequest(
		@NotBlank String branchId,
		@NotBlank @Size(max = 100) String name,
		@Size(max = 1000) String description,
		@NotNull @Min(1) @Max(200) Integer capacity,
		@NotNull @Min(0) @Max(500_000) Integer pricePerHour,
		// 한 공간이 여러 컨셉을 가질 수 있다. 너무 많이 붙이면 필터가 의미가 없어서 3개까지만 받는다.
		@NotEmpty @Size(max = 3) List<String> conceptIds,
		// 이미 있는 이름이면 그 편의시설을 쓰고, 없으면 새로 만든다.
		@Size(max = 12) List<@NotBlank @Size(max = 30) String> amenities,
		// 사이트 안의 경로(/rooms/...)나 https 주소만 허용한다. javascript: 같은 값이 화면 배경 주소로 들어가는 걸 막으려는 것이다.
		@NotBlank @Size(max = 500) @Pattern(regexp = "^(/[A-Za-z0-9._/-]+|https://[^\\s]+)$") String image) {
}
