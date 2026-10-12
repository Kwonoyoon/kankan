package com.kany.branch.dto;

import com.kany.branch.Branch;

public record BranchResponse(String id, String name, String address, int openHour, int closeHour) {

	public static BranchResponse from(Branch branch) {
		return new BranchResponse(branch.getId(), branch.getName(), branch.getAddress(), branch.getOpenHour(),
				branch.getCloseHour());
	}
}
