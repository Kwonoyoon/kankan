package com.kany.inquiry;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.kany.global.security.AuthUser;
import com.kany.inquiry.dto.CreateInquiryRequest;
import com.kany.inquiry.dto.InquiryResponse;

import jakarta.validation.Valid;

@RestController
public class InquiryController {

	private final InquiryService inquiryService;

	public InquiryController(InquiryService inquiryService) {
		this.inquiryService = inquiryService;
	}

	@PostMapping("/api/inquiries")
	@ResponseStatus(HttpStatus.CREATED)
	public InquiryResponse create(@AuthenticationPrincipal AuthUser authUser,
			@Valid @RequestBody CreateInquiryRequest request) {
		return inquiryService.create(authUser.id(), request);
	}

	// 본인 id는 URL이 아니라 토큰에서 꺼낸다. (/api/reservations/me 와 같은 이유)
	@GetMapping("/api/inquiries/me")
	public List<InquiryResponse> mine(@AuthenticationPrincipal AuthUser authUser) {
		return inquiryService.getMine(authUser.id());
	}
}
