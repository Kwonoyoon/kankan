package com.kany.reservation;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.kany.global.security.AuthUser;
import com.kany.reservation.dto.BookedSlotResponse;
import com.kany.reservation.dto.CreateReservationRequest;
import com.kany.reservation.dto.ReservationResponse;

import jakarta.validation.Valid;

@RestController
public class ReservationController {

	private final ReservationService reservationService;

	public ReservationController(ReservationService reservationService) {
		this.reservationService = reservationService;
	}

	@PostMapping("/api/reservations")
	@ResponseStatus(HttpStatus.CREATED)
	public List<ReservationResponse> create(@AuthenticationPrincipal AuthUser authUser,
			@Valid @RequestBody CreateReservationRequest request) {
		return reservationService.create(authUser.id(), request);
	}

	// 본인 id는 URL로 받지 않고 토큰에서 꺼낸다. /users/{id}/reservations 형태면 id만 바꿔서 남의 예약을 볼 수 있다.
	@GetMapping("/api/reservations/me")
	public List<ReservationResponse> mine(@AuthenticationPrincipal AuthUser authUser) {
		return reservationService.getMine(authUser.id());
	}

	@DeleteMapping("/api/reservations/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void cancel(@AuthenticationPrincipal AuthUser authUser, @PathVariable String id) {
		reservationService.cancelMine(authUser.id(), id);
	}

	@GetMapping("/api/reservations/booked")
	public List<BookedSlotResponse> booked(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
		return reservationService.getBookedSlots(date);
	}
}
