-- ERD(branches, spaces, concept_tags, amenities, space_tags, space_amenities,
-- blocked_slots, users, reservations)를 MySQL로 옮긴 초기 스키마.
-- Oracle 기준 타입은 clob -> TEXT, number -> INT, 불리언 성격의 number -> TINYINT(1)로 바꿨다.
-- 정기권(plans, subscriptions)은 ERD에 아직 없어서 다음 마이그레이션(V2)에서 추가한다.

CREATE TABLE branches (
    id          VARCHAR(40)  NOT NULL,
    name        VARCHAR(100) NOT NULL,
    address     VARCHAR(255) NOT NULL,
    open_hour   INT          NOT NULL,
    close_hour  INT          NOT NULL,
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE concept_tags (
    id          VARCHAR(40)  NOT NULL,
    name        VARCHAR(100) NOT NULL,
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE amenities (
    id    VARCHAR(40)  NOT NULL,
    name  VARCHAR(100) NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 로그인 식별자가 email이라 중복되면 안 되므로 UNIQUE를 걸었다.
CREATE TABLE users (
    id          VARCHAR(40)  NOT NULL,
    email       VARCHAR(255) NOT NULL,
    nickname    VARCHAR(100) NOT NULL,
    phone       VARCHAR(30),
    role        VARCHAR(20)  NOT NULL DEFAULT 'USER',
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE spaces (
    id           VARCHAR(40)  NOT NULL,
    branch_id    VARCHAR(40)  NOT NULL,
    name         VARCHAR(100) NOT NULL,
    description  TEXT,
    capacity     INT          NOT NULL,
    price        INT          NOT NULL,
    images       TEXT,
    is_active    TINYINT(1)   NOT NULL DEFAULT 1,
    created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_spaces_branch FOREIGN KEY (branch_id) REFERENCES branches (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 공간 <-> 컨셉 태그, 공간 <-> 편의시설은 다대다라서 연결 테이블을 둔다.
CREATE TABLE space_tags (
    space_id  VARCHAR(40) NOT NULL,
    tag_id    VARCHAR(40) NOT NULL,
    PRIMARY KEY (space_id, tag_id),
    CONSTRAINT fk_space_tags_space FOREIGN KEY (space_id) REFERENCES spaces (id),
    CONSTRAINT fk_space_tags_tag   FOREIGN KEY (tag_id)   REFERENCES concept_tags (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE space_amenities (
    space_id    VARCHAR(40) NOT NULL,
    amenity_id  VARCHAR(40) NOT NULL,
    PRIMARY KEY (space_id, amenity_id),
    CONSTRAINT fk_space_amenities_space   FOREIGN KEY (space_id)   REFERENCES spaces (id),
    CONSTRAINT fk_space_amenities_amenity FOREIGN KEY (amenity_id) REFERENCES amenities (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 같은 공간·날짜·시간을 두 번 막을 수 없으므로 UNIQUE.
CREATE TABLE blocked_slots (
    id          VARCHAR(40)  NOT NULL,
    space_id    VARCHAR(40)  NOT NULL,
    block_date  DATE         NOT NULL,
    start_hour  INT          NOT NULL,
    reason      VARCHAR(255),
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_blocked_slot (space_id, block_date, start_hour),
    CONSTRAINT fk_blocked_slots_space FOREIGN KEY (space_id) REFERENCES spaces (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 취소된 예약도 status로 남겨두는 설계라 (공간, 날짜, 시간)에 UNIQUE를 걸면
-- 취소 후 재예약이 막힌다. 중복 예약 방지 방식은 예약 API를 만들 때 정한다.
-- 지금은 "그 시간에 예약 가능한 공간" 조회가 빨라지도록 인덱스만 둔다.
CREATE TABLE reservations (
    id          VARCHAR(40)  NOT NULL,
    group_id    VARCHAR(40),
    user_id     VARCHAR(40)  NOT NULL,
    space_id    VARCHAR(40)  NOT NULL,
    res_date    DATE         NOT NULL,
    start_hour  INT          NOT NULL,
    price       INT          NOT NULL,
    status      VARCHAR(20)  NOT NULL,
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_reservations_slot (space_id, res_date, start_hour),
    KEY idx_reservations_user (user_id),
    CONSTRAINT fk_reservations_user  FOREIGN KEY (user_id)  REFERENCES users (id),
    CONSTRAINT fk_reservations_space FOREIGN KEY (space_id) REFERENCES spaces (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
