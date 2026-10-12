package com.kany.concept;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kany.concept.dto.ConceptResponse;

@RestController
public class ConceptController {

	private final ConceptService conceptService;

	public ConceptController(ConceptService conceptService) {
		this.conceptService = conceptService;
	}

	@GetMapping("/api/concepts")
	public List<ConceptResponse> getConcepts() {
		return conceptService.getConcepts();
	}
}
