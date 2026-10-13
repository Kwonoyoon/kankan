import { useCallback, useEffect, useState } from 'react';
import { parseRoute } from '../lib/route';

// pushState 로 주소만 바꾸고 화면은 직접 다시 그린다. 새로고침 없이 이동하므로 로그인 상태와 불러온 목록이 유지된다.
// 새로고침이나 주소 직접 입력은 서버가 어떤 경로든 index.html 을 돌려줘야 동작한다. (nginx try_files, Vite 개발 서버는 기본 지원)
function useRoute() {
  const [route, setRoute] = useState(() => parseRoute(window.location.pathname));

  // 브라우저의 뒤로/앞으로 버튼은 pushState 를 거치지 않으므로 popstate 로 따로 받는다.
  useEffect(() => {
    const onPop = () => setRoute(parseRoute(window.location.pathname));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigate = useCallback((path) => {
    window.history.pushState(null, '', path);
    setRoute(parseRoute(window.location.pathname));
    // 해시(#reviews)가 있으면 그 자리로 가는 건 화면이 맡는다. 없으면 새 페이지처럼 맨 위에서 시작한다.
    if (!window.location.hash) window.scrollTo(0, 0);
  }, []);

  return { route, navigate };
}

export default useRoute;
