package com.kany.reservation;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

import com.kany.space.Space;
import com.kany.user.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

/**
 * 예약 한 건 = 한 시간 한 칸. 3시간을 예약하면 3행이 생기고 같은 groupId로 묶인다.
 * 칸 단위로 쪼갠 이유: "이 공간 이 시간이 찼는가"를 행 하나로 판단할 수 있어서 중복 방지(UNIQUE)가 단순해진다.
 * (active_slot 컬럼은 DB가 계산하는 값이라 엔티티에 매핑하지 않는다.)
 */
@Entity
@Table(name = "reservations")
public class Reservation {

	@Id
	@Column(length = 40)
	private String id;

	@Column(name = "group_id", length = 40)
	private String groupId;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "user_id")
	private User user;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "space_id")
	private Space space;

	@Column(name = "res_date", nullable = false)
	private LocalDate resDate;

	@Column(name = "start_hour", nullable = false)
	private int startHour;

	/** 예약 시점의 가격. 공간 가격이 나중에 바뀌어도 이미 한 예약의 금액은 변하면 안 되므로 복사해서 저장한다. */
	@Column(nullable = false)
	private int price;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 20)
	private ReservationStatus status;

	@Column(name = "created_at", nullable = false, updatable = false)
	private LocalDateTime createdAt;

	protected Reservation() {
	}

	public static Reservation create(User user, Space space, LocalDate date, int startHour, String groupId) {
		Reservation r = new Reservation();
		r.id = UUID.randomUUID().toString();
		r.groupId = groupId;
		r.user = user;
		r.space = space;
		r.resDate = date;
		r.startHour = startHour;
		r.price = space.getPrice();
		r.status = ReservationStatus.CONFIRMED;
		r.createdAt = LocalDateTime.now();
		return r;
	}

	public void cancel() {
		this.status = ReservationStatus.CANCELED;
	}

	public String getId() {
		return id;
	}

	public String getGroupId() {
		return groupId;
	}

	public User getUser() {
		return user;
	}

	public Space getSpace() {
		return space;
	}

	public LocalDate getResDate() {
		return resDate;
	}

	public int getStartHour() {
		return startHour;
	}

	public int getPrice() {
		return price;
	}

	public ReservationStatus getStatus() {
		return status;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}
}
