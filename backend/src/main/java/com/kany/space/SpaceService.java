package com.kany.space;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kany.global.error.BusinessException;
import com.kany.global.error.ErrorCode;
import com.kany.space.dto.SpaceResponse;

@Service
@Transactional(readOnly = true)
public class SpaceService {

	private final SpaceRepository spaceRepository;

	public SpaceService(SpaceRepository spaceRepository) {
		this.spaceRepository = spaceRepository;
	}

	public List<SpaceResponse> search(String branchId, String conceptId) {
		return spaceRepository.search(blankToNull(branchId), blankToNull(conceptId)).stream()
				.map(SpaceResponse::from)
				.toList();
	}

	public SpaceResponse getSpace(String id) {
		return spaceRepository.findActiveById(id)
				.map(SpaceResponse::from)
				.orElseThrow(() -> new BusinessException(ErrorCode.SPACE_NOT_FOUND));
	}

	// ?concept= 처럼 값이 빈 채로 오면 "필터 없음"으로 본다. 빈 문자열로 조회하면 결과가 항상 0건이 된다.
	private static String blankToNull(String value) {
		return value == null || value.isBlank() ? null : value;
	}
}
