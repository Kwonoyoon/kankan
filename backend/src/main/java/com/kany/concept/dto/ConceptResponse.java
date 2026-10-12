package com.kany.concept.dto;

import com.kany.concept.ConceptTag;

public record ConceptResponse(String id, String name) {

	public static ConceptResponse from(ConceptTag tag) {
		return new ConceptResponse(tag.getId(), tag.getName());
	}
}
