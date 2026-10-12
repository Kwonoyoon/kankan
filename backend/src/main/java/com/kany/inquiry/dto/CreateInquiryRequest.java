package com.kany.inquiry.dto;

import com.kany.inquiry.InquiryCategory;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

// 작성자(user)는 받지 않는다. 토큰에서 서버가 정한다. 그렇지 않으면 남의 이름으로 문의를 올릴 수 있다.
public record CreateInquiryRequest(
		@NotNull InquiryCategory category,
		// 공간 문의일 때만 보낸다. 일반 문의는 비워 둔다.
		@Size(max = 40) String spaceId,
		@NotBlank @Size(max = 100) String title,
		@NotBlank @Size(max = 2000) String content) {
}
