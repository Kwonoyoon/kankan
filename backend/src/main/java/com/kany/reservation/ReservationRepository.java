package com.kany.reservation;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.kany.admin.dto.AdminStatsResponse;
import com.kany.reservation.dto.BookedSlotResponse;

public interface ReservationRepository extends JpaRepository<Reservation, String> {

	// 응답에 공간·지점 이름이 들어가므로 join fetch로 한 번에 읽는다. 안 그러면 예약 N건마다 공간과 지점을 따로 조회한다.
	@Query("""
			select r from Reservation r
			join fetch r.space s
			join fetch s.branch
			where r.user.id = :userId
			order by r.resDate desc, r.startHour desc
			""")
	List<Reservation> findByUser(@Param("userId") String userId);

	@Query("""
			select r from Reservation r
			join fetch r.user
			join fetch r.space s
			join fetch s.branch
			where r.id = :id
			""")
	Optional<Reservation> findDetailById(@Param("id") String id);

	// 관리자 목록. 조건 값이 null이면 그 조건은 건너뛴다. (SpaceRepository.search 와 같은 방식)
	// 한 번에 최대 N건만 가져오도록 Pageable을 받는다. 제한이 없으면 예약이 쌓일수록 응답이 무한히 커진다.
	@Query("""
			select r from Reservation r
			join fetch r.user
			join fetch r.space s
			join fetch s.branch
			where (:userId is null or r.user.id = :userId)
			  and (:date is null or r.resDate = :date)
			order by r.createdAt desc
			""")
	List<Reservation> searchForAdmin(@Param("userId") String userId, @Param("date") LocalDate date, Pageable pageable);

	@Query("""
			select new com.kany.reservation.dto.BookedSlotResponse(r.space.id, r.startHour)
			from Reservation r
			where r.resDate = :date and r.status = com.kany.reservation.ReservationStatus.CONFIRMED
			""")
	List<BookedSlotResponse> findBookedSlots(@Param("date") LocalDate date);

	@Query("""
			select r.startHour from Reservation r
			where r.space.id = :spaceId and r.resDate = :date
			  and r.status = com.kany.reservation.ReservationStatus.CONFIRMED
			""")
	List<Integer> findBookedHours(@Param("spaceId") String spaceId, @Param("date") LocalDate date);

	long countByStatus(ReservationStatus status);

	long countByStatusAndResDate(ReservationStatus status, LocalDate resDate);

	// 합계는 DB가 계산한다. 예약 전체를 자바로 가져와서 더하면 예약이 쌓일수록 느려지고 메모리를 쓴다.
	// 예약이 하나도 없으면 sum이 null이라 coalesce로 0을 돌려준다.
	@Query("select coalesce(sum(r.price), 0L) from Reservation r where r.status = com.kany.reservation.ReservationStatus.CONFIRMED")
	long sumConfirmedAmount();

	// 공간별 확정 예약 건수와 금액. 예약이 없는 공간은 목록에 나오지 않는다. (inner join)
	@Query("""
			select new com.kany.admin.dto.AdminStatsResponse$SpaceStat(
				s.id, s.name, b.name, count(r.id), coalesce(sum(r.price), 0L))
			from Reservation r
			join r.space s
			join s.branch b
			where r.status = com.kany.reservation.ReservationStatus.CONFIRMED
			group by s.id, s.name, b.name
			order by count(r.id) desc, s.id
			""")
	List<AdminStatsResponse.SpaceStat> findSpaceStats();
}
