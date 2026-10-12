package com.kany.space.dto;

import java.util.Arrays;
import java.util.Comparator;
import java.util.List;

import com.kany.concept.ConceptTag;
import com.kany.space.Amenity;
import com.kany.space.Space;

public record SpaceResponse(
		String id,
		String branchId,
		String branchName,
		String name,
		String description,
		int capacity,
		int pricePerHour,
		List<String> images,
		List<String> concepts,
		List<String> amenities) {

	public static SpaceResponse from(Space space) {
		return new SpaceResponse(
				space.getId(),
				space.getBranch().getId(),
				space.getBranch().getName(),
				space.getName(),
				space.getDescription(),
				space.getCapacity(),
				space.getPrice(),
				splitImages(space.getImages()),
				// Set은 순서가 없어서 정렬하지 않으면 요청마다 응답 순서가 달라질 수 있다.
				space.getTags().stream().map(ConceptTag::getId).sorted().toList(),
				space.getAmenities().stream().map(Amenity::getName).sorted(Comparator.naturalOrder()).toList());
	}

	private static List<String> splitImages(String images) {
		if (images == null || images.isBlank()) {
			return List.of();
		}
		return Arrays.stream(images.split(",")).map(String::trim).filter(s -> !s.isEmpty()).toList();
	}
}
