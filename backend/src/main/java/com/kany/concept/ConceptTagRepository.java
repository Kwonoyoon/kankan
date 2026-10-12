package com.kany.concept;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ConceptTagRepository extends JpaRepository<ConceptTag, String> {

	List<ConceptTag> findAllByOrderById();
}
