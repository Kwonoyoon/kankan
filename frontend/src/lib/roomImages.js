// 사이트에 들어 있는 공간 이미지(frontend/public/rooms). 관리자가 공간을 추가할 때 고르는 목록이다.
// .jpg는 직접 찍은 사진, .svg는 임시 일러스트다. 새 이미지를 public/rooms 에 넣으면 여기에도 한 줄 추가한다.
// (관리자 화면에서 이미지 파일을 직접 올리는 기능은 아직 없다. 파일 업로드는 저장 위치·용량 제한 설계가 필요하다.)
export const ROOM_IMAGES = [
  { path: '/rooms/band-practice.jpg', label: '합주실 (사진)' },
  { path: '/rooms/vocal.jpg', label: '보컬 연습실 (사진)' },
  { path: '/rooms/dance.jpg', label: '댄스 연습실 (사진)' },
  { path: '/rooms/studyroom.jpg', label: '스터디룸 (사진)' },
  { path: '/rooms/shoot-studio.jpg', label: '촬영 스튜디오 (사진)' },
  { path: '/rooms/seminar.jpg', label: '세미나실 (사진)' },
  { path: '/rooms/meeting-1.svg', label: '회의실 A (일러스트)' },
  { path: '/rooms/meeting-2.svg', label: '미팅 라운지 (일러스트)' },
  { path: '/rooms/record-1.svg', label: '팟캐스트 부스 (일러스트)' },
  { path: '/rooms/record-2.svg', label: '녹음 스튜디오 (일러스트)' },
  { path: '/rooms/party-1.svg', label: '파티룸 A (일러스트)' },
  { path: '/rooms/party-2.svg', label: '파티룸 네온 (일러스트)' },
  { path: '/rooms/class-1.svg', label: '클래스룸 (일러스트)' },
  { path: '/rooms/class-2.svg', label: '워크숍 라운지 (일러스트)' },
];
