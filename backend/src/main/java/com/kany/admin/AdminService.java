package com.kany.admin;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.TreeSet;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kany.admin.dto.AdminReservationResponse;
import com.kany.admin.dto.AdminSpaceResponse;
import com.kany.admin.dto.AdminStatsResponse;
import com.kany.admin.dto.AdminUserResponse;
import com.kany.admin.dto.BlockSlotsRequest;
import com.kany.admin.dto.BlockedSlotResponse;
import com.kany.admin.dto.CreateBranchRequest;
import com.kany.admin.dto.CreateSpaceRequest;
import com.kany.admin.dto.UpdateSpaceRequest;
import com.kany.branch.Branch;
import com.kany.branch.BranchRepository;
import com.kany.branch.dto.BranchResponse;
import com.kany.concept.ConceptTag;
import com.kany.concept.ConceptTagRepository;
import com.kany.global.error.BusinessException;
import com.kany.global.error.ErrorCode;
import com.kany.inquiry.InquiryService;
import com.kany.inquiry.InquiryStatus;
import com.kany.inquiry.dto.AdminInquiryResponse;
import com.kany.reservation.BlockedSlot;
import com.kany.reservation.BlockedSlotRepository;
import com.kany.reservation.ReservationRepository;
import com.kany.reservation.ReservationService;
import com.kany.reservation.ReservationStatus;
import com.kany.space.Amenity;
import com.kany.space.AmenityRepository;
import com.kany.space.Space;
import com.kany.space.SpaceRepository;
import com.kany.user.UserRepository;

@Service
@Transactional(readOnly = true)
public class AdminService {

	// 한 번에 가져올 수 있는 최대 건수. 클라이언트가 size=1000000 을 보내도 이 값을 넘지 못하게 한다.
	private static final int MAX_PAGE_SIZE = 200;

	private final UserRepository userRepository;
	private final ReservationRepository reservationRepository;
	private final ReservationService reservationService;
	private final SpaceRepository spaceRepository;
	private final BlockedSlotRepository blockedSlotRepository;
	private final InquiryService inquiryService;
	private final BranchRepository branchRepository;
	private final ConceptTagRepository conceptTagRepository;
	private final AmenityRepository amenityRepository;

	public AdminService(UserRepository userRepository, ReservationRepository reservationRepository,
			ReservationService reservationService, SpaceRepository spaceRepository,
			BlockedSlotRepository blockedSlotRepository, InquiryService inquiryService,
			BranchRepository branchRepository, ConceptTagRepository conceptTagRepository,
			AmenityRepository amenityRepository) {
		this.userRepository = userRepository;
		this.reservationRepository = reservationRepository;
		this.reservationService = reservationService;
		this.spaceRepository = spaceRepository;
		this.blockedSlotRepository = blockedSlotRepository;
		this.inquiryService = inquiryService;
		this.branchRepository = branchRepository;
		this.conceptTagRepository = conceptTagRepository;
		this.amenityRepository = amenityRepository;
	}

	public List<AdminUserResponse> getUsers() {
		return userRepository.findAllWithReservationCounts();
	}

	public List<AdminReservationResponse> getReservations(String userId, LocalDate date, int size) {
		int limit = Math.max(1, Math.min(size, MAX_PAGE_SIZE));
		return reservationRepository.searchForAdmin(userId, date, PageRequest.of(0, limit)).stream()
				.map(AdminReservationResponse::from).toList();
	}

	public List<AdminReservationResponse> getUserReservations(String userId) {
		// 없는 회원과 "예약이 없는 회원"을 구분하려고 먼저 회원 존재를 확인한다. 안 하면 둘 다 빈 목록이라 오타를 알아채기 어렵다.
		if (!userRepository.existsById(userId)) {
			throw new BusinessException(ErrorCode.USER_NOT_FOUND);
		}
		return getReservations(userId, null, MAX_PAGE_SIZE);
	}

	@Transactional
	public void cancelReservation(String reservationId) {
		reservationService.cancelByAdmin(reservationId);
	}

	// ---- 통계 ----

	public AdminStatsResponse getStats() {
		return new AdminStatsResponse(
				userRepository.count(),
				reservationRepository.countByStatus(ReservationStatus.CONFIRMED),
				reservationRepository.countByStatusAndResDate(ReservationStatus.CONFIRMED, LocalDate.now()),
				reservationRepository.sumConfirmedAmount(),
				inquiryService.countOpen(),
				reservationRepository.findSpaceStats());
	}

	// ---- 공간 관리 ----

	public List<AdminSpaceResponse> getSpaces() {
		return spaceRepository.findAllForAdmin().stream().map(AdminSpaceResponse::from).toList();
	}

	@Transactional
	public AdminSpaceResponse updateSpace(String spaceId, UpdateSpaceRequest request) {
		Space space = spaceRepository.findById(spaceId)
				.orElseThrow(() -> new BusinessException(ErrorCode.SPACE_NOT_FOUND));
		// 가격을 바꿔도 이미 한 예약의 금액은 변하지 않는다. 예약은 예약 시점의 가격을 따로 복사해서 갖고 있기 때문이다.
		space.update(request.pricePerHour(), request.active());
		// 응답에 지점 이름이 필요한데 findById는 지점을 가져오지 않는다. 같은 트랜잭션 안이라 접근하면 지연 로딩으로 읽힌다.
		return AdminSpaceResponse.from(space);
	}

	@Transactional
	public AdminSpaceResponse createSpace(CreateSpaceRequest request) {
		Branch branch = branchRepository.findById(request.branchId())
				.orElseThrow(() -> new BusinessException(ErrorCode.BRANCH_NOT_FOUND));

		Set<String> conceptIds = new LinkedHashSet<>(request.conceptIds());
		List<ConceptTag> tags = conceptTagRepository.findAllById(conceptIds);
		// 요청한 컨셉 중 하나라도 없으면 거절한다. 조용히 빼고 저장하면 관리자는 컨셉이 붙은 줄 알고 필터에서 안 나온다.
		if (tags.size() != conceptIds.size()) {
			throw new BusinessException(ErrorCode.CONCEPT_NOT_FOUND);
		}

		Set<Amenity> amenities = resolveAmenities(request.amenities());
		Space space = Space.create(branch, request.name().trim(),
				request.description() == null ? null : request.description().trim(), request.capacity(),
				request.pricePerHour(), request.image(), new LinkedHashSet<>(tags), amenities);
		spaceRepository.save(space);
		return AdminSpaceResponse.from(space);
	}

	// 같은 이름을 대소문자·공백 차이로 또 만들지 않도록 다듬어서 비교한다. (이미 있으면 재사용, 없으면 생성)
	private Set<Amenity> resolveAmenities(List<String> names) {
		Set<Amenity> result = new LinkedHashSet<>();
		if (names == null) {
			return result;
		}
		Set<String> wanted = new LinkedHashSet<>();
		names.forEach(n -> wanted.add(n.trim()));
		wanted.remove("");
		List<Amenity> existing = amenityRepository.findByNameIn(wanted);
		Set<String> existingNames = new HashSet<>();
		for (Amenity a : existing) {
			existingNames.add(a.getName());
			result.add(a);
		}
		for (String name : wanted) {
			if (!existingNames.contains(name)) {
				result.add(amenityRepository.save(Amenity.create(name)));
			}
		}
		return result;
	}

	@Transactional
	public BranchResponse createBranch(CreateBranchRequest request) {
		if (request.closeHour() <= request.openHour()) {
			throw new BusinessException(ErrorCode.INVALID_INPUT);
		}
		Branch branch = branchRepository.save(Branch.create(request.name().trim(), request.address().trim(),
				request.openHour(), request.closeHour()));
		return BranchResponse.from(branch);
	}

	// ---- 예약 막기 ----

	public List<BlockedSlotResponse> getBlockedSlots() {
		return blockedSlotRepository.findUpcoming(LocalDate.now()).stream().map(BlockedSlotResponse::from).toList();
	}

	@Transactional
	public List<BlockedSlotResponse> blockSlots(BlockSlotsRequest request) {
		Space space = spaceRepository.findById(request.spaceId())
				.orElseThrow(() -> new BusinessException(ErrorCode.SPACE_NOT_FOUND));
		Set<Integer> hours = new TreeSet<>(request.hours());
		LocalDateTime now = LocalDateTime.now();
		for (int hour : hours) {
			if (hour < space.getBranch().getOpenHour() || hour >= space.getBranch().getCloseHour()) {
				throw new BusinessException(ErrorCode.OUT_OF_OPERATING_HOURS);
			}
			// 이미 지난 시간은 막아도 의미가 없다.
			if (!LocalDateTime.of(request.date(), LocalTime.of(hour, 0)).isAfter(now)) {
				throw new BusinessException(ErrorCode.PAST_SLOT);
			}
		}

		// 이미 확정된 예약이 있는 칸은 막을 수 없다. 막아 버리면 예약자는 있는데 칸은 "닫힘"인 모순이 생긴다.
		// 먼저 그 예약을 취소한 뒤에 막도록 거절한다.
		Set<Integer> reserved = new HashSet<>(reservationRepository.findBookedHours(space.getId(), request.date()));
		Set<Integer> alreadyBlocked = new HashSet<>(blockedSlotRepository.findHours(space.getId(), request.date()));
		for (int hour : hours) {
			if (reserved.contains(hour)) {
				throw new BusinessException(ErrorCode.SLOT_ALREADY_BOOKED);
			}
			if (alreadyBlocked.contains(hour)) {
				throw new BusinessException(ErrorCode.ALREADY_BLOCKED);
			}
		}

		String reason = request.reason() == null || request.reason().isBlank() ? null : request.reason().trim();
		List<BlockedSlot> slots = hours.stream()
				.map(hour -> BlockedSlot.create(space, request.date(), hour, reason)).toList();
		try {
			// 위 확인과 저장 사이에 같은 칸이 막힐 수 있어서, blocked_slots의 UNIQUE가 최종으로 막는다.
			blockedSlotRepository.saveAllAndFlush(slots);
		} catch (DataIntegrityViolationException e) {
			throw new BusinessException(ErrorCode.ALREADY_BLOCKED);
		}
		return slots.stream().map(BlockedSlotResponse::from).toList();
	}

	@Transactional
	public void unblock(String blockedSlotId) {
		if (!blockedSlotRepository.existsById(blockedSlotId)) {
			throw new BusinessException(ErrorCode.BLOCKED_SLOT_NOT_FOUND);
		}
		blockedSlotRepository.deleteById(blockedSlotId);
	}

	// ---- 문의 ----

	public List<AdminInquiryResponse> getInquiries(InquiryStatus status) {
		return inquiryService.search(status);
	}

	@Transactional
	public AdminInquiryResponse answerInquiry(String inquiryId, String answer) {
		return inquiryService.answer(inquiryId, answer);
	}
}
