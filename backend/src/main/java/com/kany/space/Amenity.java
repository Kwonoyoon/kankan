package com.kany.space;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "amenities")
public class Amenity {

	@Id
	@Column(length = 40)
	private String id;

	@Column(nullable = false, length = 100)
	private String name;

	protected Amenity() {
	}

	// 관리자가 공간을 등록할 때 새 편의시설 이름을 적으면 그 자리에서 만든다. id는 사람이 짓지 않고 무작위로 정한다.
	public static Amenity create(String name) {
		Amenity a = new Amenity();
		a.id = "am-" + java.util.UUID.randomUUID().toString().substring(0, 8);
		a.name = name;
		return a;
	}

	public String getId() {
		return id;
	}

	public String getName() {
		return name;
	}
}
