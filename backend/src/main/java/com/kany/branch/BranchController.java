package com.kany.branch;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kany.branch.dto.BranchResponse;

@RestController
public class BranchController {

	private final BranchService branchService;

	public BranchController(BranchService branchService) {
		this.branchService = branchService;
	}

	@GetMapping("/api/branches")
	public List<BranchResponse> getBranches() {
		return branchService.getBranches();
	}
}
