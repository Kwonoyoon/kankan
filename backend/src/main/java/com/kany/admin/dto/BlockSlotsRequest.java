package com.kany.admin.dto;

import java.time.LocalDate;
import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record BlockSlotsRequest(
		@NotBlank String spaceId,
		@NotNull LocalDate date,
		@NotEmpty @Size(max = 24) List<Integer> hours,
		@Size(max = 255) String reason) {
}
