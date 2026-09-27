// t(text)는 lang이 'en'일 때 이 사전에서 원문(한국어)을 찾아 영어로 바꿔치기한다.
// 값이 숫자를 품은 동적 문장(예: "정원 4명")은 여기 넣지 않고 각 컴포넌트에서 직접 분기한다.
export const translations = {
  // Header
  '지금 예약하기': 'Book now',
  '메뉴': 'Menu',
  '로그인': 'Log in',
  '로그아웃': 'Log out',

  // LoginModal
  '예약과 정기권 구독은 로그인 후 이용할 수 있어요.': 'Log in to reserve a space or subscribe to a membership.',
  '이메일': 'Email',
  '닉네임': 'Nickname',

  // ConceptPills
  '공간을 둘러보세요': 'Explore our spaces',
  '밴드 합주부터 소규모 스터디, 촬영용 미팅룸까지. 목적에 맞는 공간을 시간 단위로 편하게 빌릴 수 있습니다.':
    'From band practice to small study groups to meeting rooms — rent the right space by the hour.',
  '밴드 합주': 'Band Practice',
  '보컬 연습': 'Vocal Practice',
  '댄스 연습': 'Dance Practice',
  '소규모 스터디': 'Small Study',
  '촬영 미팅룸': 'Shoot & Meeting',
  '세미나실': 'Seminar Room',

  // Hero
  'kany · 홍대 · 강남 · 건대': 'kany · Hongdae · Gangnam · Konkuk',
  'kany에서,': 'At kany,',
  '오늘 필요한 시간만': 'just the time you need',
  '매일 07:00 – 24:00 운영': 'Open daily 07:00 – 24:00',
  '1시간 단위로 바로 예약': 'book instantly by the hour',
  '정기권 구매하기': 'Get a pass',

  // Stats
  '숫자로 보는 kany': 'kany by the numbers',
  '운영 지점': 'Branches',
  '등록된 공간': 'Listed spaces',
  '시간 단위 최소 예약': 'Min. booking unit',
  '평균 이용 만족도': 'Avg. satisfaction',

  // SpaceGrid
  '이번 주 추천 공간': "This week's picks",
  '가장 많이 예약된 공간을 모아봤어요.': 'Our most-booked spaces.',
  '공간': 'Spaces',
  '아직 등록된 공간이 없어요.': 'No spaces listed yet.',
  '예약하기': 'Reserve',

  // SpaceGrid — space names & amenities
  '2번 합주실': 'Practice Room 2',
  '스터디룸 A': 'Study Room A',
  '보컬 연습실 1': 'Vocal Room 1',
  '댄스연습실 B': 'Dance Room B',
  '세미나실 201': 'Seminar Room 201',
  '드럼': 'Drums',
  '앰프': 'Amp',
  '마이크': 'Mic',
  '화이트보드': 'Whiteboard',
  '콘센트': 'Outlets',
  '조명': 'Lighting',
  '화면공유': 'Screen sharing',
  '피아노': 'Piano',
  '방음부스': 'Sound booth',
  '거울벽': 'Mirror wall',
  '마루바닥': 'Wood floor',
  '스크린': 'Screen',
  '드럼과 앰프, 마이크까지 갖춘 방음 합주실이에요. 밴드 연습부터 공연 준비까지 부담 없이 이용하세요.':
    'A soundproof practice room with drums, an amp, and a mic. Great for band rehearsals or getting ready for a show.',
  '화이트보드와 넉넉한 콘센트가 있는 4인 스터디룸이에요. 조용한 분위기에서 집중하기 좋아요.':
    'A 4-person study room with a whiteboard and plenty of outlets. A quiet spot to focus.',
  '조명과 화면공유 장비를 갖춘 다목적 공간이에요. 제품 촬영부터 화상 회의까지 한 번에 해결하세요.':
    'A versatile space with lighting and screen-sharing gear — from product shoots to video calls.',
  '피아노와 방음부스가 있는 1인 보컬 연습실이에요. 발성 연습부터 레슨 녹음까지 편하게 이용하세요.':
    'A solo vocal room with a piano and a sound booth. Perfect for warm-ups or recording a lesson.',
  '전면 거울벽과 마루바닥을 갖춘 댄스 연습실이에요. 팀 단위 안무 연습에 딱 맞는 공간이에요.':
    'A dance studio with a full mirror wall and sprung floor — ideal for group choreography practice.',
  '대형 스크린과 화이트보드가 있는 12인 세미나실이에요. 정기 모임이나 발표 자리에 좋아요.':
    'A 12-person seminar room with a large screen and whiteboard. Great for recurring meetups or presentations.',

  // Branches
  '지점 위치': 'Locations',
  '가까운 지점을 확인하세요.': 'Find a branch near you.',
  '홍대점': 'Hongdae',
  '강남점': 'Gangnam',
  '건대점': 'Konkuk',
  '서울 마포구 동교로 123': '123 Donggyo-ro, Mapo-gu, Seoul',
  '서울 강남구 테헤란로 456': '456 Teheran-ro, Gangnam-gu, Seoul',
  '서울 광진구 능동로 789': '789 Neungdong-ro, Gwangjin-gu, Seoul',

  // PassPlans
  '더 자주, 더 저렴하게': 'More often, for less',
  '정기권': 'Membership',
  '매주 같은 시간, 정기권으로 더 저렴하게 이용하세요.': 'Same time every week, for less with a membership.',
  '추천': 'Recommended',
  '라이트': 'Light',
  '가끔 필요한 사람에게': 'For occasional use',
  '월 4회 이용권': '4 visits / month',
  '전 지점 공통 사용': 'Valid at every branch',
  '예약 최대 2주 전 오픈': 'Booking opens 2 weeks ahead',
  '스탠다드': 'Standard',
  '가장 많이 선택하는 플랜': 'Our most popular plan',
  '월 8회 이용권': '8 visits / month',
  '예약 최대 4주 전 오픈': 'Booking opens 4 weeks ahead',
  '시간당 요금 10% 할인': '10% off hourly rate',
  '무제한': 'Unlimited',
  '매일 쓰는 사람에게': 'For everyday use',
  '이용 횟수 제한 없음': 'No visit limit',
  '시간당 요금 15% 할인': '15% off hourly rate',
  '우선 예약 배정': 'Priority booking',
  '구독하기': 'Subscribe',
  '구독 중 · 해지하기': 'Subscribed · Cancel',

  // Extras
  'kany 이야기': "kany's story",
  '필요한 만큼만 빌릴 수 있는 공간이 없다는 불편함에서 kany가 시작됐습니다. 하루 종일이 아니라, 딱 필요한 한 시간만.':
    "kany started from a simple frustration — there was nowhere to rent a space for just as long as you needed. Not all day. Just the one hour that matters.",
  '예약은 부담없이, 취소는 간편하게': 'Book freely, cancel easily',
  '이용 하루 전까지 무료로 취소할 수 있어요.': 'Free cancellation up until one day before.',
  '공지사항': 'Notices',
  'kany의 새 소식을 확인하세요.': "Catch up on what's new at kany.",
  '점검': 'Maintenance',
  '9/20(일) 새벽 2시~4시 결제 시스템 점검 안내': 'Payment system maintenance Sun 9/20, 2–4 AM',
  '오픈': 'New',
  '건대점 세미나실 201 신규 오픈': 'Seminar Room 201 now open at Konkuk',
  '안내': 'Notice',
  '추석 연휴 운영시간 변경 안내': 'Holiday hours change for Chuseok',
  '이용 꿀팁': 'Tips',
  'kany를 더 잘 쓰는 법.': 'Get more out of kany.',
  '팁': 'Tip',
  '합주실 예약 전 꼭 확인할 3가지': '3 things to check before booking a practice room',
  '시험기간, 스터디룸 빨리 잡는 법': 'How to snag a study room during exam week',
  '정기권으로 매주 같은 시간 확보하기': 'Lock in the same slot every week with a membership',

  // Footer
  '필요한 시간만큼 빌리는 공유공간 예약 플랫폼. 합주실부터 스터디룸, 미팅룸까지.':
    'A shared-space booking platform for exactly as long as you need — practice rooms, study rooms, meeting rooms.',
  '유용한 링크': 'Useful links',
  '자주 묻는 질문': 'FAQ',
  '이용 가이드': 'Guide',
  '이용 Tip': 'Tips',
  '고객센터': 'Support',
  '1:1 문의': 'Contact us',
  '예약': 'Booking',
  '웹 접근성 : 일부 미흡, 개선 진행 중': 'Accessibility: partially compliant, improvements ongoing',
  'kany 2026 — 포트폴리오 프로토타입': 'kany 2026 — Portfolio prototype',
  '쿠키 정책': 'Cookie Policy',
  '개인정보처리방침': 'Privacy Policy',
  '이용약관': 'Terms of Service',

  // Drawer
  '실시간 예약 현황': 'Live availability',
  '닫기 ✕': 'Close ✕',
  '공간 둘러보기': 'Explore spaces',
  '이용 안내': 'How it works',
  '내 예약': 'My bookings',
  '실시간 정보': 'Live info',
  '전체 지점 보기': 'View all branches',
  '밴드·합주 연습실': 'Band practice rooms',
  '촬영·미팅룸': 'Shoot & meeting rooms',
  '지점별 위치 안내': 'Branch locations',
  '예약 방법': 'How to book',
  '결제 및 환불 규정': 'Payment & refund policy',
  '정기권 안내': 'About memberships',
  '이용 매너 가이드': 'Etiquette guide',
  '지점별 혼잡도': 'Branch crowd levels',
  '현재 정기권:': 'Current plan:',
  '가입한 정기권이 없어요.': "You don't have a membership yet.",
  '정기권 보기': 'View plans',
  '해지': 'Cancel',

  // ReservationList
  '아직 예약한 공간이 없어요. 공간을 둘러보고 예약해보세요.': "You haven't booked anything yet. Browse spaces and reserve one.",
  '취소': 'Cancel',

  // BookingModal
  '예약이 완료됐어요': 'Booking confirmed',
  '확인': 'Done',
  '날짜': 'Date',
  '시간': 'Time',
  '예약 확정': 'Confirm booking',

  // PlaceholderLink
  '아직 준비 중이에요': 'Coming soon',

  // A11yWidget
  '언어': 'Language',
  '큰 글씨 모드': 'Large text',
  '다크 모드': 'Dark mode',
  '고대비 모드': 'High contrast',

  // CookieBar
  '더 나은 서비스를 위해 쿠키를 사용합니다. 통계·환경설정 목적의 쿠키 저장에 동의하시겠어요?':
    'We use cookies to improve our service. Do you agree to cookies for analytics and preferences?',
  '거부': 'Decline',
  '수락': 'Accept',
};
