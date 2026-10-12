package com.kany.inquiry.dto;

import java.time.LocalDateTime;

import com.kany.inquiry.Inquiry;
import com.kany.inquiry.InquiryCategory;
import com.kany.inquiry.InquiryStatus;

/** 회원이 보는 본인 문의. 다른 회원의 정보는 들어 있지 않다. */
public record InquiryResponse(
		String id,
		InquiryCategory category,
		String spaceId,
		String spaceName,
		String title,
		String content,
		InquiryStatus status,
		String answer,
		LocalDateTime answeredAt,
		LocalDateTime createdAt) {

	public static InquiryResponse from(Inquiry i) {
		return new InquiryResponse(i.getId(), i.getCategory(),
				i.getSpace() == null ? null : i.getSpace().getId(),
				i.getSpace() == null ? null : i.getSpace().getName(),
				i.getTitle(), i.getContent(), i.getStatus(), i.getAnswer(), i.getAnsweredAt(), i.getCreatedAt());
	}
}
