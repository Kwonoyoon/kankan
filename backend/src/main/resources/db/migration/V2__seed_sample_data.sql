-- 프론트 mockData.js에 있던 지점·컨셉·공간을 DB로 옮긴 샘플 데이터.
-- id는 프론트가 쓰던 값(hongdae, sp-1 등)을 그대로 써서 화면 코드를 바꿀 때 대응이 쉽다.
-- 이 데이터는 마이그레이션이라 어느 환경에서든 적용된다. 실서비스 전에는 운영 데이터로 교체해야 한다.

INSERT INTO branches (id, name, address, open_hour, close_hour) VALUES
    ('hongdae', '홍대점', '서울 마포구 동교로 123', 7, 24),
    ('gangnam', '강남점', '서울 강남구 테헤란로 456', 7, 24),
    ('konkuk',  '건대점', '서울 광진구 능동로 789', 7, 24);

INSERT INTO concept_tags (id, name) VALUES
    ('band',    '밴드 합주'),
    ('vocal',   '보컬 연습'),
    ('dance',   '댄스 연습'),
    ('study',   '소규모 스터디'),
    ('shoot',   '촬영 미팅룸'),
    ('seminar', '세미나실');

INSERT INTO amenities (id, name) VALUES
    ('drum',         '드럼'),
    ('amp',          '앰프'),
    ('mic',          '마이크'),
    ('whiteboard',   '화이트보드'),
    ('outlet',       '콘센트'),
    ('lighting',     '조명'),
    ('screen-share', '화면공유'),
    ('piano',        '피아노'),
    ('booth',        '방음부스'),
    ('mirror-wall',  '거울벽'),
    ('wood-floor',   '마루바닥'),
    ('screen',       '스크린');

INSERT INTO spaces (id, branch_id, name, description, capacity, price, images, is_active) VALUES
    ('sp-1', 'hongdae', '2번 합주실',
     '드럼과 앰프, 마이크까지 갖춘 방음 합주실이에요. 밴드 연습부터 공연 준비까지 부담 없이 이용하세요.',
     6, 12000, '/rooms/band-practice.jpg', 1),
    ('sp-2', 'gangnam', '스터디룸 A',
     '화이트보드와 넉넉한 콘센트가 있는 4인 스터디룸이에요. 조용한 분위기에서 집중하기 좋아요.',
     4, 8000, '/rooms/studyroom.jpg', 1),
    ('sp-3', 'konkuk', '촬영 미팅룸',
     '조명과 화면공유 장비를 갖춘 다목적 공간이에요. 제품 촬영부터 화상 회의까지 한 번에 해결하세요.',
     8, 15000, '/rooms/shoot-studio.jpg', 1),
    ('sp-4', 'hongdae', '보컬 연습실 1',
     '피아노와 방음부스가 있는 1인 보컬 연습실이에요. 발성 연습부터 레슨 녹음까지 편하게 이용하세요.',
     2, 9000, '/rooms/vocal.jpg', 1),
    ('sp-5', 'gangnam', '댄스연습실 B',
     '전면 거울벽과 마루바닥을 갖춘 댄스 연습실이에요. 팀 단위 안무 연습에 딱 맞는 공간이에요.',
     10, 14000, '/rooms/dance.jpg', 1),
    ('sp-6', 'konkuk', '세미나실 201',
     '대형 스크린과 화이트보드가 있는 12인 세미나실이에요. 정기 모임이나 발표 자리에 좋아요.',
     12, 20000, '/rooms/seminar.jpg', 1);

INSERT INTO space_tags (space_id, tag_id) VALUES
    ('sp-1', 'band'),
    ('sp-2', 'study'),
    ('sp-3', 'shoot'),
    ('sp-4', 'vocal'),
    ('sp-5', 'dance'),
    ('sp-6', 'seminar');

INSERT INTO space_amenities (space_id, amenity_id) VALUES
    ('sp-1', 'drum'), ('sp-1', 'amp'), ('sp-1', 'mic'),
    ('sp-2', 'whiteboard'), ('sp-2', 'outlet'),
    ('sp-3', 'lighting'), ('sp-3', 'screen-share'),
    ('sp-4', 'piano'), ('sp-4', 'booth'),
    ('sp-5', 'mirror-wall'), ('sp-5', 'wood-floor'),
    ('sp-6', 'screen'), ('sp-6', 'whiteboard');
