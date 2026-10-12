package com.kany.reservation;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

import com.kany.space.Space;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

/**
 * 관리자가 "이 공간 이 시간은 받지 않는다"고 닫아 둔 칸(점검·휴무 등).
 * 예약(Reservation)과 같은 한 시간 한 칸 단위라서, 칸이 찼는지 판단할 때 두 테이블을 같은 방식으로 본다.
 */
@Entity
@Table(name = "blocked_slots")
public class BlockedSlot {

	@Id
	@Column(length = 40)
	private String id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "space_id")
	private Space space;

	@Column(name = "block_date", nullable = false)
	private LocalDate blockDate;

	@Column(name = "start_hour", nullable = false)
	private int startHour;

	private String reason;

	@Column(name = "created_at", nullable = false, updatable = false)
	private LocalDateTime createdAt;

	protected BlockedSlot() {
	}

	public static BlockedSlot create(Space space, LocalDate date, int startHour, String reason) {
		BlockedSlot b = new BlockedSlot();
		b.id = UUID.randomUUID().toString();
		b.space = space;
		b.blockDate = date;
		b.startHour = startHour;
		b.reason = reason;
		b.createdAt = LocalDateTime.now();
		return b;
	}

	public String getId() {
		return id;
	}

	public Space getSpace() {
		return space;
	}

	public LocalDate getBlockDate() {
		return blockDate;
	}

	public int getStartHour() {
		return startHour;
	}

	public String getReason() {
		return reason;
	}
}
