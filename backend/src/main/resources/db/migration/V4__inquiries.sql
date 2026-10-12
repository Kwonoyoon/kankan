-- 4단계: 1:1 문의. 회원이 운영자에게 묻고, 관리자가 답변한다.

-- space_id는 비워 둘 수 있다. "특정 공간 문의"와 "일반 문의(결제·이용 등)"를 한 테이블에서 다루기 위해서다.
-- 공간이 삭제될 일은 없다(숨김 처리만 한다)고 보고 ON DELETE 동작은 따로 두지 않았다.
-- 답변은 별도 테이블이 아니라 같은 행의 answer 컬럼에 둔다. 지금은 "문의 1건 : 답변 1건"이고,
-- 주고받는 대화(여러 번 답변)가 필요해지면 그때 inquiry_replies 테이블로 분리한다.
CREATE TABLE inquiries (
    id           VARCHAR(40)  NOT NULL,
    user_id      VARCHAR(40)  NOT NULL,
    space_id     VARCHAR(40),
    category     VARCHAR(20)  NOT NULL,
    title        VARCHAR(100) NOT NULL,
    content      TEXT         NOT NULL,
    status       VARCHAR(20)  NOT NULL,
    answer       TEXT,
    answered_at  TIMESTAMP    NULL,
    created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    -- "내 문의 목록"(회원별 최신순)과 "미답변 문의 목록"(상태별 최신순)이 각각 자주 쓰이는 조회다.
    KEY idx_inquiries_user_created (user_id, created_at),
    KEY idx_inquiries_status_created (status, created_at),
    CONSTRAINT fk_inquiries_user  FOREIGN KEY (user_id)  REFERENCES users (id),
    CONSTRAINT fk_inquiries_space FOREIGN KEY (space_id) REFERENCES spaces (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
