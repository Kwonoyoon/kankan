package com.kany.concept;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kany.concept.dto.ConceptResponse;

@Service
@Transactional(readOnly = true)
public class ConceptService {

	private final ConceptTagRepository conceptTagRepository;

	public ConceptService(ConceptTagRepository conceptTagRepository) {
		this.conceptTagRepository = conceptTagRepository;
	}

	public List<ConceptResponse> getConcepts() {
		return conceptTagRepository.findAllByOrderById().stream().map(ConceptResponse::from).toList();
	}
}
