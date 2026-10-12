package com.kany.branch;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "branches")
public class Branch {

	@Id
	@Column(length = 40)
	private String id;

	@Column(nullable = false, length = 100)
	private String name;

	@Column(nullable = false)
	private String address;

	/** 영업 시작 시각(시). 예약 가능한 시간대의 하한 */
	@Column(nullable = false)
	private int openHour;

	/** 영업 종료 시각(시). 24면 자정까지 */
	@Column(nullable = false)
	private int closeHour;

	protected Branch() {
	}

	public String getId() {
		return id;
	}

	public String getName() {
		return name;
	}

	public String getAddress() {
		return address;
	}

	public int getOpenHour() {
		return openHour;
	}

	public int getCloseHour() {
		return closeHour;
	}
}
