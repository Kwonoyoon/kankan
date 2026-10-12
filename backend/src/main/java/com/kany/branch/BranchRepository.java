package com.kany.branch;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface BranchRepository extends JpaRepository<Branch, String> {

	List<Branch> findAllByOrderByName();
}
