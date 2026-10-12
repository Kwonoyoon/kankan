package com.kany.space;

import java.util.Comparator;
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

	// "sp-2" 가 "sp-10" 보다 먼저 나오도록 id를 길이 먼저, 그다음 글자 순으로 정렬한다. (자연스러운 등록 순서)
	// 글자 순(order by s.id)으로만 정렬하면 sp-1, sp-10, sp-11, ..., sp-2 로 섞인다.
	// 쿼리가 아니라 자바에서 정렬하는 이유: 이 쿼리는 select distinct라서, select에 없는 length(s.id)로 order by 하면
	// MySQL이 오류를 낸다. 공간 수가 수십 개 수준이라 자바 정렬 비용은 무시할 만하다.
	// 관리자가 추가한 공간의 id(sp-xxxxxxxx)는 길어서 자연스럽게 맨 뒤에 붙는다.
	private static final Comparator<Space> NATURAL_ORDER =
			Comparator.comparingInt((Space s) -> s.getId().length()).thenComparing(Space::getId);

	public List<SpaceResponse> search(String branchId, String conceptId) {
		return spaceRepository.search(blankToNull(branchId), blankToNull(conceptId)).stream()
				.sorted(NATURAL_ORDER)
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
