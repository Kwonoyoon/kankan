package com.kany.concept;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/** 공간의 용도 분류(밴드 합주, 스터디 등). 프론트의 컨셉 필터 버튼이 된다. */
@Entity
@Table(name = "concept_tags")
public class ConceptTag {

	@Id
	@Column(length = 40)
	private String id;

	@Column(nullable = false, length = 100)
	private String name;

	protected ConceptTag() {
	}

	public String getId() {
		return id;
	}

	public String getName() {
		return name;
	}
}
