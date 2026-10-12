package com.kany.user;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.kany.admin.dto.AdminUserResponse;

public interface UserRepository extends JpaRepository<User, String> {

	Optional<User> findByEmail(String email);

	boolean existsByEmail(String email);

	// 회원마다 예약 수를 세려고 users를 기준으로 reservations를 left join 한다. (예약이 0건인 회원도 목록에 나와야 해서)
	// inner join이면 예약 없는 회원이 사라진다. 한 번의 group by 쿼리로 끝내서, 회원 N명에 대해 count 쿼리를 N번 보내지 않는다.
	@Query("""
			select new com.kany.admin.dto.AdminUserResponse(
				u.id, u.email, u.nickname, u.role, u.createdAt,
				count(r.id),
				count(case when r.status = com.kany.reservation.ReservationStatus.CONFIRMED then 1 end))
			from User u
			left join Reservation r on r.user = u
			group by u.id, u.email, u.nickname, u.role, u.createdAt
			order by u.createdAt desc
			""")
	List<AdminUserResponse> findAllWithReservationCounts();
}
