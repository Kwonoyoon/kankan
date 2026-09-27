export const branches = [
  { id: 'hongdae', name: '홍대점', address: '서울 마포구 동교로 123' },
  { id: 'gangnam', name: '강남점', address: '서울 강남구 테헤란로 456' },
  { id: 'konkuk', name: '건대점', address: '서울 광진구 능동로 789' },
];

export function branchName(branchId) {
  return branches.find((b) => b.id === branchId)?.name ?? '';
}

export const passPlans = [
  {
    id: 'light',
    name: '라이트',
    tagline: '가끔 필요한 사람에게',
    price: 39000,
    creditsLabel: '월 4회 이용권',
    features: ['전 지점 공통 사용', '예약 최대 2주 전 오픈'],
  },
  {
    id: 'standard',
    name: '스탠다드',
    tagline: '가장 많이 선택하는 플랜',
    price: 69000,
    creditsLabel: '월 8회 이용권',
    features: ['전 지점 공통 사용', '예약 최대 4주 전 오픈', '시간당 요금 10% 할인'],
    highlight: true,
  },
  {
    id: 'unlimited',
    name: '무제한',
    tagline: '매일 쓰는 사람에게',
    price: 129000,
    creditsLabel: '이용 횟수 제한 없음',
    features: ['전 지점 공통 사용', '예약 최대 4주 전 오픈', '시간당 요금 15% 할인', '우선 예약 배정'],
  },
];

export function passPlanName(planId) {
  return passPlans.find((p) => p.id === planId)?.name ?? '';
}

export const concepts = [
  { id: 'band', label: '밴드 합주' },
  { id: 'vocal', label: '보컬 연습' },
  { id: 'dance', label: '댄스 연습' },
  { id: 'study', label: '소규모 스터디' },
  { id: 'shoot', label: '촬영 미팅룸' },
  { id: 'seminar', label: '세미나실' },
];

export const spaces = [
  {
    id: 'sp-1',
    branchId: 'hongdae',
    name: '2번 합주실',
    concept: 'band',
    capacity: 6,
    pricePerHour: 12000,
    amenities: ['드럼', '앰프', '마이크'],
    image: '/rooms/band-practice.jpg',
    description: '드럼과 앰프, 마이크까지 갖춘 방음 합주실이에요. 밴드 연습부터 공연 준비까지 부담 없이 이용하세요.',
  },
  {
    id: 'sp-2',
    branchId: 'gangnam',
    name: '스터디룸 A',
    concept: 'study',
    capacity: 4,
    pricePerHour: 8000,
    amenities: ['화이트보드', '콘센트'],
    image: '/rooms/studyroom.jpg',
    description: '화이트보드와 넉넉한 콘센트가 있는 4인 스터디룸이에요. 조용한 분위기에서 집중하기 좋아요.',
  },
  {
    id: 'sp-3',
    branchId: 'konkuk',
    name: '촬영 미팅룸',
    concept: 'shoot',
    capacity: 8,
    pricePerHour: 15000,
    amenities: ['조명', '화면공유'],
    image: '/rooms/shoot-studio.jpg',
    description: '조명과 화면공유 장비를 갖춘 다목적 공간이에요. 제품 촬영부터 화상 회의까지 한 번에 해결하세요.',
  },
  {
    id: 'sp-4',
    branchId: 'hongdae',
    name: '보컬 연습실 1',
    concept: 'vocal',
    capacity: 2,
    pricePerHour: 9000,
    amenities: ['피아노', '방음부스'],
    image: '/rooms/vocal.jpg',
    description: '피아노와 방음부스가 있는 1인 보컬 연습실이에요. 발성 연습부터 레슨 녹음까지 편하게 이용하세요.',
  },
  {
    id: 'sp-5',
    branchId: 'gangnam',
    name: '댄스연습실 B',
    concept: 'dance',
    capacity: 10,
    pricePerHour: 14000,
    amenities: ['거울벽', '마루바닥'],
    image: '/rooms/dance.jpg',
    description: '전면 거울벽과 마루바닥을 갖춘 댄스 연습실이에요. 팀 단위 안무 연습에 딱 맞는 공간이에요.',
  },
  {
    id: 'sp-6',
    branchId: 'konkuk',
    name: '세미나실 201',
    concept: 'seminar',
    capacity: 12,
    pricePerHour: 20000,
    amenities: ['스크린', '화이트보드'],
    image: '/rooms/seminar.jpg',
    description: '대형 스크린과 화이트보드가 있는 12인 세미나실이에요. 정기 모임이나 발표 자리에 좋아요.',
  },
];

export const stats = [
  { value: '3', label: '운영 지점' },
  { value: '107', label: '등록된 공간' },
  { value: '1', label: '시간 단위 최소 예약' },
  { value: '4.8', label: '평균 이용 만족도' },
];

export const guides = [
  { tag: '추천', title: '합주실 예약 전 꼭 확인할 3가지', date: '2026.09.10', image: 'https://picsum.photos/seed/kankan-guide1/500/320' },
  { tag: '팁', title: '시험기간, 스터디룸 빨리 잡는 법', date: '2026.08.28', image: 'https://picsum.photos/seed/kankan-guide2/500/320' },
  { tag: '팁', title: '정기권으로 매주 같은 시간 확보하기', date: '2026.08.14', image: 'https://picsum.photos/seed/kankan-guide3/500/320' },
];

export const notices = [
  { tag: '점검', title: '9/20(일) 새벽 2시~4시 결제 시스템 점검 안내', date: '2026.09.14' },
  { tag: '오픈', title: '건대점 세미나실 201 신규 오픈', date: '2026.09.05' },
  { tag: '안내', title: '추석 연휴 운영시간 변경 안내', date: '2026.08.20' },
];

// href가 '#'이면 아직 실제 페이지·폼이 없는 항목(PlaceholderLink로 렌더링).
// href가 'tab:xxx'면 Drawer 안에서 다른 탭으로 전환, 'modal:xxx'면 별도 팝업(모달)을 연다.
export const drawerSections = [
  {
    id: 'explore',
    label: '공간 둘러보기',
    links: [
      { label: '밴드·합주 연습실', href: '#spaces' },
      { label: '소규모 스터디', href: '#spaces' },
      { label: '촬영·미팅룸', href: '#spaces' },
    ],
  },
  {
    id: 'howto',
    label: '이용 안내',
    links: [
      { label: '예약 방법', href: '#spaces' },
      { label: '결제 및 환불 규정', href: '#' },
      { label: '정기권 안내', href: 'modal:pass' },
    ],
  },
  {
    id: 'mypage',
    label: '내 예약',
  },
  {
    id: 'live',
    label: '실시간 정보',
    links: [
      { label: '실시간 예약 현황', href: '#spaces' },
      { label: '지점별 혼잡도', href: '#' },
    ],
  },
  {
    id: 'support',
    label: '고객센터',
    image: 'https://picsum.photos/seed/kankan-drawer-support/700/440',
    links: [
      { label: '자주 묻는 질문', href: '#' },
      { label: '1:1 문의', href: '#' },
      { label: '이용약관', href: '#' },
    ],
  },
];
