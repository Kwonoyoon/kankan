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

export const coupons = [
  { id: 'welcome20', code: 'WELCOME20', title: '첫 예약 20% 할인', discountRate: 20 },
  { id: 'open10', code: 'OPEN10', title: '오픈 기념 10% 할인', discountRate: 10 },
];

export const events = [
  {
    id: 'ev-welcome',
    title: '첫 예약 20% 할인',
    desc: '처음 예약하는 분께 20% 할인 쿠폰을 드려요. 예약 1건에 사용할 수 있어요.',
    period: '2026.10.01 ~ 2026.10.31',
    couponId: 'welcome20',
  },
  {
    id: 'ev-open',
    title: '오픈 기념 10% 할인',
    desc: '건대점 세미나실 201 오픈을 기념해 모든 이용자에게 10% 할인 쿠폰을 드려요.',
    period: '2026.10.01 ~ 2026.10.31',
    couponId: 'open10',
  },
];

// 공간마다 처음부터 보이는 샘플 후기. 사용자가 쓴 후기는 localStorage에 따로 저장되고 이 목록과 합쳐서 보여준다.
export const sampleReviews = [
  { id: 'sr-1', spaceId: 'sp-1', nickname: '드러머민수', rating: 5, text: '방음이 잘 돼서 합주하기 좋아요. 앰프 상태도 좋았어요.', date: '2026-10-02' },
  { id: 'sr-2', spaceId: 'sp-1', nickname: '기타치는지은', rating: 4, text: '드럼 세팅이 깔끔해요. 주말엔 예약이 빨리 차요.', date: '2026-09-21' },
  { id: 'sr-3', spaceId: 'sp-2', nickname: '시험기간생', rating: 5, text: '콘센트가 많고 조용해서 집중이 잘 됐어요.', date: '2026-10-05' },
  { id: 'sr-4', spaceId: 'sp-2', nickname: '스터디장', rating: 4, text: '화이트보드가 커서 팀 스터디에 딱이에요.', date: '2026-09-18' },
  { id: 'sr-5', spaceId: 'sp-3', nickname: '촬영담당', rating: 5, text: '조명이 좋아서 제품 사진 찍기 편했어요.', date: '2026-10-08' },
  { id: 'sr-6', spaceId: 'sp-3', nickname: '회의러', rating: 4, text: '화면공유가 바로 돼서 미팅이 수월했어요.', date: '2026-09-27' },
  { id: 'sr-7', spaceId: 'sp-4', nickname: '보컬지망생', rating: 5, text: '피아노가 있어서 발성 연습하기 좋아요.', date: '2026-10-01' },
  { id: 'sr-8', spaceId: 'sp-4', nickname: '노래하는하은', rating: 4, text: '방음부스 덕분에 마음 편히 불렀어요.', date: '2026-09-15' },
  { id: 'sr-9', spaceId: 'sp-5', nickname: '댄서수아', rating: 5, text: '거울이 커서 동선 맞추기 좋았어요.', date: '2026-10-06' },
  { id: 'sr-10', spaceId: 'sp-5', nickname: '크루리더', rating: 4, text: '마루바닥이 미끄럽지 않아서 안심이에요.', date: '2026-09-23' },
  { id: 'sr-11', spaceId: 'sp-6', nickname: '스터디모임', rating: 5, text: '스크린이 선명해서 발표하기 좋았어요.', date: '2026-10-03' },
  { id: 'sr-12', spaceId: 'sp-6', nickname: '정기모임장', rating: 4, text: '인원이 많아도 여유 있는 공간이에요.', date: '2026-09-19' },
];

// href가 '#'이면 아직 실제 페이지·폼이 없는 항목(PlaceholderLink로 렌더링).
// href가 'tab:xxx'면 Drawer 안에서 다른 탭으로 전환, 'modal:xxx'면 별도 팝업(모달)을 연다.
export const drawerSections = [
  {
    id: 'explore',
    label: '공간 둘러보기',
    links: [
      { label: '밴드·합주 연습실', href: 'concept:band' },
      { label: '소규모 스터디', href: 'concept:study' },
      { label: '촬영·미팅룸', href: 'concept:shoot' },
    ],
  },
  {
    id: 'howto',
    label: '이용 안내',
    links: [
      { label: '예약 방법', href: 'spaces:all' },
      { label: '결제 및 환불 규정', href: '#' },
      { label: '정기권 안내', href: 'modal:pass' },
    ],
  },
  {
    id: 'mypage',
    label: '마이페이지',
  },
  {
    id: 'events',
    label: '쿠폰·이벤트',
  },
  {
    id: 'live',
    label: '실시간 정보',
    links: [
      { label: '실시간 예약 현황', href: 'spaces:all' },
      { label: '지점별 혼잡도', href: '#' },
    ],
  },
  {
    id: 'support',
    label: '고객센터',
    image: 'https://picsum.photos/seed/kankan-drawer-support/700/440',
    links: [
      { label: '자주 묻는 질문', href: '#' },
      { label: '1:1 문의', href: 'tab:inquiry' },
      { label: '이용약관', href: '#' },
    ],
  },
];
