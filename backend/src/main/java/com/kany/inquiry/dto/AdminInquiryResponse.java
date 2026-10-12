package com.kany.inquiry.dto;

import java.time.LocalDateTime;

import com.kany.inquiry.Inquiry;
import com.kany.inquiry.InquiryCategory;
import com.kany.inquiry.InquiryStatus;

/** 관리자용: 일반 문의 응답에 작성자(회원) 정보를 더했다. */
public record AdminInquiryResponse(
		String id,
		String userId,
		String userEmail,
		String userNickname,
		InquiryCategory category,
		String spaceId,
		String spaceName,
		String title,
		String content,
		InquiryStatus status,
		String answer,
		LocalDateTime answeredAt,
		LocalDateTime createdAt) {

	public static AdminInquiryResponse from(Inquiry i) {
		return new AdminInquiryResponse(i.getId(), i.getUser().getId(), i.getUser().getEmail(),
				i.getUser().getNickname(), i.getCategory(),
				i.getSpace() == null ? null : i.getSpace().getId(),
				i.getSpace() == null ? null : i.getSpace().getName(),
				i.getTitle(), i.getContent(), i.getStatus(), i.getAnswer(), i.getAnsweredAt(), i.getCreatedAt());
	}
}
