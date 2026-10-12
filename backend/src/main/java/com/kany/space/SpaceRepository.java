package com.kany.space;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SpaceRepository extends JpaRepository<Space, String> {

	// 지점·태그·편의시설을 join fetch로 한 번에 가져온다. 안 그러면 공간 N개를 읽은 뒤
	// 각 공간마다 지점/태그/편의시설을 따로 조회해서 쿼리가 1 + N*3번 나간다.
	// 조건 값이 null이면 그 조건은 건너뛴다. (필터를 안 걸었을 때 전체 조회)
	// 태그 조건을 join이 아니라 exists로 건 이유: 태그에 join해서 걸러내면
	// 가져온 공간의 tags에 조건에 맞는 태그만 남아서, 응답에서 다른 태그가 사라진다.
	@Query("""
			select distinct s from Space s
			join fetch s.branch
			left join fetch s.tags
			left join fetch s.amenities
			where s.active = true
			  and (:branchId is null or s.branch.id = :branchId)
			  and (:conceptId is null or exists (select t.id from s.tags t where t.id = :conceptId))
			order by s.id
			""")
	List<Space> search(@Param("branchId") String branchId, @Param("conceptId") String conceptId);

	@Query("""
			select s from Space s
			join fetch s.branch
			left join fetch s.tags
			left join fetch s.amenities
			where s.id = :id and s.active = true
			""")
	Optional<Space> findActiveById(@Param("id") String id);

	// 관리자 목록은 숨긴(active=false) 공간도 보여야 한다. 태그·편의시설은 필요 없어서 지점만 join fetch 한다.
	@Query("""
			select s from Space s
			join fetch s.branch
			order by s.branch.id, s.id
			""")
	List<Space> findAllForAdmin();
}
