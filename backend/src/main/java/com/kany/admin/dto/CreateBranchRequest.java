package com.kany.admin.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateBranchRequest(
		@NotBlank @Size(max = 100) String name,
		@NotBlank @Size(max = 255) String address,
		@NotNull @Min(0) @Max(23) Integer openHour,
		@NotNull @Min(1) @Max(24) Integer closeHour) {
}
