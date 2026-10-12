package com.kany.reservation;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.TreeSet;
import java.util.UUID;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kany.branch.Branch;
import com.kany.global.error.BusinessException;
import com.kany.global.error.ErrorCode;
import com.kany.reservation.dto.BookedSlotResponse;
import com.kany.reservation.dto.CreateReservationRequest;
import com.kany.reservation.dto.ReservationResponse;
import com.kany.space.Space;
import com.kany.space.SpaceRepository;
import com.kany.user.User;
import com.kany.user.UserRepository;

@Service
public class ReservationService {

	private final ReservationRepository reservationRepository;
	private final SpaceRepository spaceRepository;
	private final UserRepository userRepository;
	private final BlockedSlotRepository blockedSlotRepository;

	public ReservationService(ReservationRepository reservationRepository, SpaceRepository spaceRepository,
			UserRepository userRepository, BlockedSlotRepository blockedSlotRepository) {
		this.reservationRepository = reservationRepository;
		this.blockedSlotRepository = blockedSlotRepository;
		this.spaceRepository = spaceRepository;
		this.userRepository = userRepository;
	}

	/** 여러 시간을 한 번에 예약한다. 하나라도 안 되면 전체가 취소된다(@Transactional). 일부만 잡히는 상태를 만들지 않으려는 것이다. */
	@Transactional
	public List<ReservationResponse> create(String userId, CreateReservationRequest request) {
		User user = userRepository.findById(userId).orElseThrow(() -> new BusinessException(ErrorCode.UNAUTHORIZED));
		Space space = spaceRepository.findActiveById(request.spaceId())
				.orElseThrow(() -> new BusinessException(ErrorCode.SPACE_NOT_FOUND));

		// 같은 시간을 두 번 보내도 한 번만 예약한다. TreeSet은 중복을 없애고 시간순으로 정렬해 준다.
		Set<Integer> hours = new TreeSet<>(request.hours());
		validateHours(space.getBranch(), request.date(), hours);

		Set<Integer> taken = new HashSet<>(reservationRepository.findBookedHours(space.getId(), request.date()));
		Set<Integer> blocked = new HashSet<>(blockedSlotRepository.findHours(space.getId(), request.date()));
		for (int hour : hours) {
			if (taken.contains(hour)) {
				throw new BusinessException(ErrorCode.SLOT_ALREADY_BOOKED);
			}
			if (blocked.contains(hour)) {
				throw new BusinessException(ErrorCode.SLOT_BLOCKED);
			}
		}

		String groupId = UUID.randomUUID().toString();
		List<Reservation> reservations = hours.stream()
				.map(hour -> Reservation.create(user, space, request.date(), hour, groupId)).toList();
		try {
			// 위의 "이미 찼는지" 확인은 친절한 에러 메시지용일 뿐이다. 확인과 저장 사이에 다른 요청이 끼어들 수 있으므로,
			// 최종 방어는 DB의 UNIQUE(active_slot)다. flush로 저장을 지금 실행해서 위반을 여기서 잡는다.
			reservationRepository.saveAllAndFlush(reservations);
		} catch (DataIntegrityViolationException e) {
			throw new BusinessException(ErrorCode.SLOT_ALREADY_BOOKED);
		}
		return reservations.stream().map(ReservationResponse::from).toList();
	}

	@Transactional(readOnly = true)
	public List<ReservationResponse> getMine(String userId) {
		return reservationRepository.findByUser(userId).stream().map(ReservationResponse::from).toList();
	}

	@Transactional
	public void cancelMine(String userId, String reservationId) {
		Reservation reservation = reservationRepository.findDetailById(reservationId)
				.orElseThrow(() -> new BusinessException(ErrorCode.RESERVATION_NOT_FOUND));
		// 남의 예약은 "권한 없음"이 아니라 "없음"으로 응답한다. 권한 없음이라고 하면 그 id의 예약이 존재한다는 걸 알려주게 된다.
		if (!reservation.getUser().getId().equals(userId)) {
			throw new BusinessException(ErrorCode.RESERVATION_NOT_FOUND);
		}
		cancel(reservation);
	}

	@Transactional
	public void cancelByAdmin(String reservationId) {
		Reservation reservation = reservationRepository.findDetailById(reservationId)
				.orElseThrow(() -> new BusinessException(ErrorCode.RESERVATION_NOT_FOUND));
		cancel(reservation);
	}

	/** 그날 이미 찬 칸(예약 + 막아 둔 시간). 로그인 없이 호출되므로 누가 예약했는지는 담지 않는다. */
	@Transactional(readOnly = true)
	public List<BookedSlotResponse> getBookedSlots(LocalDate date) {
		List<BookedSlotResponse> slots = new ArrayList<>(reservationRepository.findBookedSlots(date));
		slots.addAll(blockedSlotRepository.findSlotsByDate(date));
		return slots;
	}

	private void cancel(Reservation reservation) {
		if (reservation.getStatus() == ReservationStatus.CANCELED) {
			throw new BusinessException(ErrorCode.ALREADY_CANCELED);
		}
		// 행을 지우지 않고 상태만 바꾼다. 관리자가 "누가 예약했다가 취소했는지" 기록을 볼 수 있어야 하기 때문이다.
		// 상태가 CANCELED가 되면 DB의 active_slot이 NULL이 되어 그 시간은 다시 예약할 수 있다.
		reservation.cancel();
	}

	private void validateHours(Branch branch, LocalDate date, Set<Integer> hours) {
		LocalDateTime now = LocalDateTime.now();
		for (int hour : hours) {
			if (hour < branch.getOpenHour() || hour >= branch.getCloseHour()) {
				throw new BusinessException(ErrorCode.OUT_OF_OPERATING_HOURS);
			}
			// 이미 시작한 시간도 막는다. 프론트의 isPastSlot과 같은 기준을 서버에서도 적용해야 하는 이유는,
			// 프론트 검사는 API를 직접 호출하면 우회되기 때문이다.
			if (!LocalDateTime.of(date, LocalTime.of(hour, 0)).isAfter(now)) {
				throw new BusinessException(ErrorCode.PAST_SLOT);
			}
		}
	}
}
