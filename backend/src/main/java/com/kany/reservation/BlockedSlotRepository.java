package com.kany.reservation;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.kany.reservation.dto.BookedSlotResponse;

public interface BlockedSlotRepository extends JpaRepository<BlockedSlot, String> {

	@Query("select b.startHour from BlockedSlot b where b.space.id = :spaceId and b.blockDate = :date")
	List<Integer> findHours(@Param("spaceId") String spaceId, @Param("date") LocalDate date);

	// 사이트의 "그날 찬 칸" 조회에 예약과 함께 섞어 내려주기 위한 것. 사유(reason)는 공개하지 않는다.
	@Query("select new com.kany.reservation.dto.BookedSlotResponse(b.space.id, b.startHour) from BlockedSlot b where b.blockDate = :date")
	List<BookedSlotResponse> findSlotsByDate(@Param("date") LocalDate date);

	// 관리자 목록. 지난 날짜의 막힘은 의미가 없어서 오늘 이후만 보여준다.
	@Query("""
			select b from BlockedSlot b
			join fetch b.space s
			join fetch s.branch
			where b.blockDate >= :from
			order by b.blockDate, s.id, b.startHour
			""")
	List<BlockedSlot> findUpcoming(@Param("from") LocalDate from);
}
