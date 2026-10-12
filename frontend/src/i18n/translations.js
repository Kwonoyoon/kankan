// t(text)는 lang이 'en'일 때 이 사전에서 원문(한국어)을 찾아 영어로 바꿔치기한다.
// 값이 숫자를 품은 동적 문장(예: "정원 4명")은 여기 넣지 않고 각 컴포넌트에서 직접 분기한다.
export const translations = {
  // Header
  '지금 예약하기': 'Book now',
  '메뉴': 'Menu',
  '로그인': 'Log in',
  '로그아웃': 'Log out',

  // Intro
  '건너뛰기': 'Skip',

  // 공간 찾기·예약 팝업
  '용도': 'Purpose',
  '전체': 'All',
  '시간 선택': 'Select time',
  '필터 초기화': 'Reset filters',
  '조건에 맞는 공간이 없어요.': 'No spaces match your filters.',
  '서버에 저장된 예약을 기준으로 계산해요.': 'Based on bookings saved on the server.',
  '(지난 시간)': '(past)',
  '(예약됨)': '(booked)',
  '이 날짜에는 예약 가능한 시간이 없어요.': 'No available times on this date.',
  '쿠폰': 'Coupon',
  '사용 안 함': 'No coupon',
  '결제 금액': 'Total',

  // 후기·별점
  '후기': 'Reviews',
  '후기 없음': 'No reviews',
  '후기 쓰기': 'Write a review',
  '로그인 필요': 'Login required',
  '이용 후기를 남겨주세요.': 'Share your experience.',
  '등록': 'Submit',
  '별점을 골라주세요.': 'Please pick a rating.',
  '아직 후기가 없어요.': 'No reviews yet.',
  '방음이 잘 돼서 합주하기 좋아요. 앰프 상태도 좋았어요.': 'Soundproofing is great for jamming, and the amps were in good shape.',
  '드럼 세팅이 깔끔해요. 주말엔 예약이 빨리 차요.': 'The drum setup is clean. Weekends fill up fast.',
  '콘센트가 많고 조용해서 집중이 잘 됐어요.': 'Lots of outlets and quiet — I could really focus.',
  '화이트보드가 커서 팀 스터디에 딱이에요.': 'The whiteboard is big, perfect for team study.',
  '조명이 좋아서 제품 사진 찍기 편했어요.': 'The lighting made product shots easy.',
  '화면공유가 바로 돼서 미팅이 수월했어요.': 'Screen sharing worked right away, so the meeting went smoothly.',
  '피아노가 있어서 발성 연습하기 좋아요.': 'Having a piano makes vocal warm-ups easy.',
  '방음부스 덕분에 마음 편히 불렀어요.': 'The sound booth let me sing without worrying.',
  '거울이 커서 동선 맞추기 좋았어요.': 'The big mirror made it easy to line up our formations.',
  '마루바닥이 미끄럽지 않아서 안심이에요.': "The wood floor isn't slippery, which is reassuring.",
  '스크린이 선명해서 발표하기 좋았어요.': 'The screen is sharp — great for presentations.',
  '인원이 많아도 여유 있는 공간이에요.': 'Plenty of room even with a large group.',

  // 쿠폰·이벤트
  '쿠폰·이벤트': 'Coupons & events',
  '진행 중인 이벤트': 'Ongoing events',
  '내 쿠폰': 'My coupons',
  '쿠폰 받기': 'Get coupon',
  '받음': 'Claimed',
  '사용 완료': 'Used',
  '사용 가능': 'Available',
  '받은 쿠폰이 없어요.': 'You have no coupons yet.',
  '첫 예약 20% 할인': '20% off your first booking',
  '오픈 기념 10% 할인': '10% off to celebrate our opening',
  '처음 예약하는 분께 20% 할인 쿠폰을 드려요. 예약 1건에 사용할 수 있어요.': 'New customers get a 20% coupon, valid for one booking.',
  '건대점 세미나실 201 오픈을 기념해 모든 이용자에게 10% 할인 쿠폰을 드려요.': 'To celebrate Seminar Room 201 at Konkuk, everyone gets a 10% coupon.',

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

  // 로그인·회원가입
  '회원가입': 'Sign up',
  '비밀번호': 'Password',
  '8자 이상': '8+ characters',
  '가입하고 시작하기': 'Sign up and start',
  '이미 계정이 있나요?': 'Already have an account?',
  '아직 계정이 없나요?': 'No account yet?',
  '관리자': 'Admin',

  // 필터·정렬
  '지점': 'Branch',
  '인원': 'People',
  '명': 'ppl',
  '시간당 가격': 'Price / hr',
  '편의시설': 'Amenities',
  '정렬': 'Sort',
  '추천순': 'Recommended',
  '낮은 가격순': 'Price: low to high',
  '높은 가격순': 'Price: high to low',
  '평점 높은순': 'Top rated',
  '정원 큰 순': 'Largest capacity',
  '지금 바로 가능': 'Available now',
  '지금은 운영 시간이 아니에요': 'Outside operating hours',

  // 새 컨셉·지점·편의시설
  '녹음·팟캐스트': 'Recording & podcast',
  '파티룸': 'Party room',
  '회의실': 'Meeting room',
  '클래스·워크숍': 'Classes & workshops',
  '성수점': 'Seongsu',
  '신촌점': 'Sinchon',
  '빔프로젝터': 'Projector',
  '스피커': 'Speaker',
  '소파': 'Sofa',
  '주방': 'Kitchen',
  '와이파이': 'Wi-Fi',
  '방음': 'Soundproof',
  '오디오 인터페이스': 'Audio interface',
  '배경지': 'Backdrop',
  '주차': 'Parking',

  // 1:1 문의
  '문의는 로그인 후 남길 수 있어요. 답변은 이 화면에서 확인할 수 있어요.': 'Log in to send an inquiry. Replies appear on this screen.',
  '문의 종류': 'Category',
  '관련 공간 (선택)': 'Related space (optional)',
  '선택 안 함': 'None',
  '제목': 'Title',
  '내용': 'Message',
  '문의 남기기': 'Send inquiry',
  '문의를 남겼어요. 답변이 달리면 아래에서 확인할 수 있어요.': 'Inquiry sent. Replies will appear below.',
  '내 문의': 'My inquiries',
  '남긴 문의가 없어요.': 'No inquiries yet.',
  '답변 완료': 'Answered',
  '답변 대기': 'Waiting for reply',
  '운영팀 답변': 'Reply from our team',
  '예약 문의': 'Reservation',
  '공간 문의': 'Space',
  '결제·환불': 'Payment & refund',
  '기타': 'Other',
  '필터로 전체 공간 보기': 'See all spaces with filters',

  // 히어로(메인 첫 화면)
  '비어 있는 공간을 찾아드려요': 'We will find you a free space',
  '홍대·강남·건대·성수·신촌, 합주실부터 스터디룸·녹음부스·파티룸까지. 1시간 단위로 바로 예약하세요.':
    'Rehearsal rooms, study rooms, recording booths and party rooms across five branches. Book by the hour.',
  '상관없음': 'Any',
  '빈 공간 찾기': 'Find a space',
  '지금 바로': 'Right now',
  '1만원 이하': 'Under ₩10,000',
  '정기권으로 더 저렴하게': 'Save more with a pass',
  '시간당': 'Per hour',

  // 접근성 위젯
  '닫기': 'Close',
  '접근성 설정': 'Accessibility settings',
  '접근성 메뉴 열기': 'Open accessibility menu',
  '접근성 메뉴 접기': 'Collapse accessibility menu',
};
