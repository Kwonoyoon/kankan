package com.kany.branch;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kany.branch.dto.BranchResponse;

@Service
@Transactional(readOnly = true)
public class BranchService {

	private final BranchRepository branchRepository;

	public BranchService(BranchRepository branchRepository) {
		this.branchRepository = branchRepository;
	}

	public List<BranchResponse> getBranches() {
		return branchRepository.findAllByOrderByName().stream().map(BranchResponse::from).toList();
	}
}
