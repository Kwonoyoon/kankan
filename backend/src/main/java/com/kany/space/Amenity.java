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

	public String getId() {
		return id;
	}

	public String getName() {
		return name;
	}
}
