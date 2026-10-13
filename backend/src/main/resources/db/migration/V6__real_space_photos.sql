-- 일러스트(.svg)였거나 같은 사진을 돌려 쓰던 공간 8곳을 새 사진으로 바꾼다.
-- V2·V5를 직접 고치지 않고 새 마이그레이션으로 바꾸는 이유: Flyway는 이미 적용된 파일의 체크섬을 기억해서,
-- 내용이 바뀐 파일이 있으면 서버 기동 때 검증 오류로 멈춘다.
-- 아직 사진이 없는 sp-16(녹음 스튜디오 A), sp-17(파티룸 블룸)은 일러스트 그대로 둔다.
UPDATE spaces SET images = '/rooms/focus-seat.jpg'      WHERE id = 'sp-11';
UPDATE spaces SET images = '/rooms/meeting-prime.jpg'   WHERE id = 'sp-13';
UPDATE spaces SET images = '/rooms/meeting-lounge.jpg'  WHERE id = 'sp-14';
UPDATE spaces SET images = '/rooms/podcast-booth.jpg'   WHERE id = 'sp-15';
UPDATE spaces SET images = '/rooms/party-neon.jpg'      WHERE id = 'sp-18';
UPDATE spaces SET images = '/rooms/studio-white.jpg'    WHERE id = 'sp-19';
UPDATE spaces SET images = '/rooms/classroom.jpg'       WHERE id = 'sp-20';
UPDATE spaces SET images = '/rooms/workshop-lounge.jpg' WHERE id = 'sp-21';
