-- 같은 사진을 돌려 쓰던 공간과 마지막 일러스트 2곳(sp-16, sp-17)을 각자의 사진으로 바꾼다.
-- sp-8(밴드룸 라이브)은 사진이 아직 없어서 sp-1과 같은 band-practice.jpg를 그대로 쓴다.
UPDATE spaces SET images = '/rooms/band-practice-2.jpg' WHERE id = 'sp-7';
UPDATE spaces SET images = '/rooms/vocal-2.jpg'         WHERE id = 'sp-9';
UPDATE spaces SET images = '/rooms/dance-c.jpg'         WHERE id = 'sp-10';
UPDATE spaces SET images = '/rooms/study-b.jpg'         WHERE id = 'sp-12';
UPDATE spaces SET images = '/rooms/record-studio-a.jpg' WHERE id = 'sp-16';
UPDATE spaces SET images = '/rooms/party-bloom.jpg'     WHERE id = 'sp-17';
UPDATE spaces SET images = '/rooms/seminar-301.jpg'     WHERE id = 'sp-22';
UPDATE spaces SET images = '/rooms/shoot-meeting-2.jpg' WHERE id = 'sp-23';
