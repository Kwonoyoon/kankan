-- 3단계: 로그인과 예약 API를 위한 스키마 변경.

-- 비밀번호는 평문이 아니라 BCrypt 해시(60자)만 저장한다. DB가 유출돼도 원래 비밀번호를 바로 알 수 없게 하려는 것이다.
-- users가 비어 있는 시점이라 NOT NULL을 바로 걸 수 있다. (데이터가 있었다면 기본값을 거쳐야 한다)
ALTER TABLE users ADD COLUMN password_hash VARCHAR(100) NOT NULL AFTER email;

-- 중복 예약 방지는 앱 코드(exists 확인 후 insert)만으로는 막을 수 없다.
-- 두 사람이 동시에 요청하면 둘 다 "비어 있음"을 보고 둘 다 insert 하기 때문이다.
-- 그래서 DB가 최종으로 막게 한다. 단, V1 주석처럼 (공간, 날짜, 시간)에 UNIQUE를 그대로 걸면
-- 취소된 예약 행이 남아 있어 재예약이 막힌다.
-- 해결: 확정(CONFIRMED) 상태일 때만 값이 생기고 취소되면 NULL이 되는 컬럼을 만들고 거기에 UNIQUE를 건다.
-- MySQL은 UNIQUE 컬럼에 NULL이 여러 개 있는 것을 허용하므로 취소 행은 몇 개든 남을 수 있다.
ALTER TABLE reservations
    ADD COLUMN active_slot VARCHAR(80)
        GENERATED ALWAYS AS (
            IF(status = 'CONFIRMED', CONCAT(space_id, '|', res_date, '|', start_hour), NULL)
        ) STORED,
    ADD UNIQUE KEY uk_reservations_active_slot (active_slot);

-- 관리자 화면에서 "회원별 예약 기록"을 최신순으로 보는 쿼리를 위한 인덱스.
-- 기존 idx_reservations_user(user_id)는 이 인덱스의 앞부분과 같아서 중복이므로 지운다.
ALTER TABLE reservations
    DROP INDEX idx_reservations_user,
    ADD KEY idx_reservations_user_created (user_id, created_at);
