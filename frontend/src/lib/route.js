// 라우터 라이브러리 없이 주소창의 경로만 해석한다. 화면이 3종류(메인, 공간 상세, 마이페이지)뿐이라
// 라이브러리를 들이는 것보다 이 함수 하나가 읽기 쉽다. 화면이 늘어나면 그때 라이브러리를 고려한다.
// 관리자 화면은 예전대로 #admin 으로 구분하므로 여기서 다루지 않는다.
export function parseRoute(pathname) {
  const space = pathname.match(/^\/space\/([^/]+)\/?$/);
  if (space) return { name: 'space', spaceId: decodeURIComponent(space[1]) };
  if (/^\/mypage\/?$/.test(pathname)) return { name: 'mypage' };
  return { name: 'home' };
}

export function spacePath(spaceId) {
  return `/space/${encodeURIComponent(spaceId)}`;
}
