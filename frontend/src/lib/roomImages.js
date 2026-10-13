// 사이트에 들어 있는 공간 이미지(frontend/public/rooms). 관리자가 공간을 추가할 때 고르는 목록이다.
// 새 이미지를 public/rooms 에 넣으면 여기에도 한 줄 추가한다.
// (관리자 화면에서 이미지 파일을 직접 올리는 기능은 아직 없다. 파일 업로드는 저장 위치·용량 제한 설계가 필요하다.)
export const ROOM_IMAGES = [
  { path: '/rooms/band-practice.jpg', label: '합주실 A' },
  { path: '/rooms/band-practice-2.jpg', label: '합주실 B' },
  { path: '/rooms/vocal.jpg', label: '보컬 연습실 A' },
  { path: '/rooms/vocal-2.jpg', label: '보컬 연습실 B' },
  { path: '/rooms/dance.jpg', label: '댄스 연습실 A' },
  { path: '/rooms/dance-c.jpg', label: '댄스 연습실 B' },
  { path: '/rooms/studyroom.jpg', label: '스터디룸 A' },
  { path: '/rooms/study-b.jpg', label: '스터디룸 B' },
  { path: '/rooms/focus-seat.jpg', label: '집중석 바 좌석' },
  { path: '/rooms/shoot-studio.jpg', label: '촬영 스튜디오 A' },
  { path: '/rooms/studio-white.jpg', label: '촬영 스튜디오 화이트' },
  { path: '/rooms/shoot-meeting-2.jpg', label: '촬영 미팅룸' },
  { path: '/rooms/seminar.jpg', label: '세미나실 A' },
  { path: '/rooms/seminar-301.jpg', label: '세미나실 B' },
  { path: '/rooms/meeting-prime.jpg', label: '회의실' },
  { path: '/rooms/meeting-lounge.jpg', label: '미팅 라운지' },
  { path: '/rooms/podcast-booth.jpg', label: '팟캐스트 부스' },
  { path: '/rooms/record-studio-a.jpg', label: '녹음 스튜디오' },
  { path: '/rooms/party-neon.jpg', label: '파티룸 네온' },
  { path: '/rooms/party-bloom.jpg', label: '파티룸 블룸' },
  { path: '/rooms/classroom.jpg', label: '클래스룸' },
  { path: '/rooms/workshop-lounge.jpg', label: '워크숍 라운지' },
];
