package com.kany.inquiry;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface InquiryRepository extends JpaRepository<Inquiry, String> {

	// 응답에 공간 이름이 들어가므로 left join fetch 한다. 공간이 없는 일반 문의도 나와야 해서 inner join이 아니라 left다.
	@Query("""
			select i from Inquiry i
			left join fetch i.space
			where i.user.id = :userId
			order by i.createdAt desc
			""")
	List<Inquiry> findByUser(@Param("userId") String userId);

	// 관리자 목록. status가 null이면 전체. 작성자와 공간 정보를 한 번에 가져온다.
	@Query("""
			select i from Inquiry i
			join fetch i.user
			left join fetch i.space
			where (:status is null or i.status = :status)
			order by i.createdAt desc
			""")
	List<Inquiry> searchForAdmin(@Param("status") InquiryStatus status, Pageable pageable);

	@Query("""
			select i from Inquiry i
			join fetch i.user
			left join fetch i.space
			where i.id = :id
			""")
	Optional<Inquiry> findDetailById(@Param("id") String id);

	long countByStatus(InquiryStatus status);
}
