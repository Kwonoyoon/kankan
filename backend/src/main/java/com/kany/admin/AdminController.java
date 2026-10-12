package com.kany.admin;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.kany.admin.dto.AdminReservationResponse;
import com.kany.admin.dto.AdminSpaceResponse;
import com.kany.admin.dto.AdminStatsResponse;
import com.kany.admin.dto.AdminUserResponse;
import com.kany.admin.dto.BlockSlotsRequest;
import com.kany.admin.dto.BlockedSlotResponse;
import com.kany.admin.dto.CreateBranchRequest;
import com.kany.admin.dto.CreateSpaceRequest;
import com.kany.admin.dto.UpdateSpaceRequest;
import com.kany.branch.dto.BranchResponse;
import com.kany.inquiry.InquiryStatus;
import com.kany.inquiry.dto.AdminInquiryResponse;
import com.kany.inquiry.dto.AnswerInquiryRequest;

import jakarta.validation.Valid;

/** /api/admin/** 은 SecurityConfig에서 ADMIN 역할만 통과시킨다. 여기서는 권한 검사를 다시 하지 않는다. */
@RestController
public class AdminController {

	private final AdminService adminService;

	public AdminController(AdminService adminService) {
		this.adminService = adminService;
	}

	@GetMapping("/api/admin/stats")
	public AdminStatsResponse stats() {
		return adminService.getStats();
	}

	@GetMapping("/api/admin/users")
	public List<AdminUserResponse> users() {
		return adminService.getUsers();
	}

	@GetMapping("/api/admin/users/{userId}/reservations")
	public List<AdminReservationResponse> userReservations(@PathVariable String userId) {
		return adminService.getUserReservations(userId);
	}

	@GetMapping("/api/admin/reservations")
	public List<AdminReservationResponse> reservations(
			@RequestParam(required = false) String userId,
			@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
			@RequestParam(defaultValue = "100") int size) {
		return adminService.getReservations(userId, date, size);
	}

	@DeleteMapping("/api/admin/reservations/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void cancel(@PathVariable String id) {
		adminService.cancelReservation(id);
	}

	@GetMapping("/api/admin/spaces")
	public List<AdminSpaceResponse> spaces() {
		return adminService.getSpaces();
	}

	@PostMapping("/api/admin/spaces")
	@ResponseStatus(HttpStatus.CREATED)
	public AdminSpaceResponse createSpace(@Valid @RequestBody CreateSpaceRequest request) {
		return adminService.createSpace(request);
	}

	@PostMapping("/api/admin/branches")
	@ResponseStatus(HttpStatus.CREATED)
	public BranchResponse createBranch(@Valid @RequestBody CreateBranchRequest request) {
		return adminService.createBranch(request);
	}

	@GetMapping("/api/admin/inquiries")
	public List<AdminInquiryResponse> inquiries(@RequestParam(required = false) InquiryStatus status) {
		return adminService.getInquiries(status);
	}

	@PutMapping("/api/admin/inquiries/{id}/answer")
	public AdminInquiryResponse answerInquiry(@PathVariable String id, @Valid @RequestBody AnswerInquiryRequest request) {
		return adminService.answerInquiry(id, request.answer());
	}

	@PutMapping("/api/admin/spaces/{id}")
	public AdminSpaceResponse updateSpace(@PathVariable String id, @Valid @RequestBody UpdateSpaceRequest request) {
		return adminService.updateSpace(id, request);
	}

	@GetMapping("/api/admin/blocked-slots")
	public List<BlockedSlotResponse> blockedSlots() {
		return adminService.getBlockedSlots();
	}

	@PostMapping("/api/admin/blocked-slots")
	@ResponseStatus(HttpStatus.CREATED)
	public List<BlockedSlotResponse> blockSlots(@Valid @RequestBody BlockSlotsRequest request) {
		return adminService.blockSlots(request);
	}

	@DeleteMapping("/api/admin/blocked-slots/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void unblock(@PathVariable String id) {
		adminService.unblock(id);
	}
}
