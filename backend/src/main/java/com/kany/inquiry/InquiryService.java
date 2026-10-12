package com.kany.inquiry;

import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kany.global.error.BusinessException;
import com.kany.global.error.ErrorCode;
import com.kany.inquiry.dto.AdminInquiryResponse;
import com.kany.inquiry.dto.CreateInquiryRequest;
import com.kany.inquiry.dto.InquiryResponse;
import com.kany.space.Space;
import com.kany.space.SpaceRepository;
import com.kany.user.User;
import com.kany.user.UserRepository;

@Service
public class InquiryService {

	// 한 번에 가져올 최대 건수. 문의가 쌓여도 응답이 무한히 커지지 않게 한다.
	private static final int MAX_LIST_SIZE = 200;

	private final InquiryRepository inquiryRepository;
	private final UserRepository userRepository;
	private final SpaceRepository spaceRepository;

	public InquiryService(InquiryRepository inquiryRepository, UserRepository userRepository,
			SpaceRepository spaceRepository) {
		this.inquiryRepository = inquiryRepository;
		this.userRepository = userRepository;
		this.spaceRepository = spaceRepository;
	}

	@Transactional
	public InquiryResponse create(String userId, CreateInquiryRequest request) {
		User user = userRepository.findById(userId).orElseThrow(() -> new BusinessException(ErrorCode.UNAUTHORIZED));
		Space space = null;
		if (request.spaceId() != null && !request.spaceId().isBlank()) {
			// 숨긴 공간에 대한 문의도 받아야 하므로 active 여부는 보지 않고 존재만 확인한다.
			space = spaceRepository.findById(request.spaceId())
					.orElseThrow(() -> new BusinessException(ErrorCode.SPACE_NOT_FOUND));
		}
		Inquiry inquiry = Inquiry.create(user, space, request.category(), request.title().trim(),
				request.content().trim());
		inquiryRepository.save(inquiry);
		return InquiryResponse.from(inquiry);
	}

	@Transactional(readOnly = true)
	public List<InquiryResponse> getMine(String userId) {
		return inquiryRepository.findByUser(userId).stream().map(InquiryResponse::from).toList();
	}

	@Transactional(readOnly = true)
	public List<AdminInquiryResponse> search(InquiryStatus status) {
		return inquiryRepository.searchForAdmin(status, PageRequest.of(0, MAX_LIST_SIZE)).stream()
				.map(AdminInquiryResponse::from).toList();
	}

	@Transactional
	public AdminInquiryResponse answer(String inquiryId, String answer) {
		Inquiry inquiry = inquiryRepository.findDetailById(inquiryId)
				.orElseThrow(() -> new BusinessException(ErrorCode.INQUIRY_NOT_FOUND));
		inquiry.answer(answer.trim());
		return AdminInquiryResponse.from(inquiry);
	}

	@Transactional(readOnly = true)
	public long countOpen() {
		return inquiryRepository.countByStatus(InquiryStatus.OPEN);
	}
}
