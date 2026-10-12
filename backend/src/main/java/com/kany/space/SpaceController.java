package com.kany.space;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kany.space.dto.SpaceResponse;

@RestController
public class SpaceController {

	private final SpaceService spaceService;

	public SpaceController(SpaceService spaceService) {
		this.spaceService = spaceService;
	}

	@GetMapping("/api/spaces")
	public List<SpaceResponse> getSpaces(
			@RequestParam(required = false) String branchId,
			@RequestParam(required = false) String concept) {
		return spaceService.search(branchId, concept);
	}

	@GetMapping("/api/spaces/{id}")
	public SpaceResponse getSpace(@PathVariable String id) {
		return spaceService.getSpace(id);
	}
}
