import { useEffect, useState } from 'react';

const ONE_MINUTE_MS = 60 * 1000;

// 현재 시각. 화면이 열려 있는 동안 "지금 바로 가능"이 시간에 따라 바뀌어야 해서, 1분마다 갱신한다.
// 렌더링 중에 new Date()를 직접 부르면 같은 화면이 그릴 때마다 다른 값을 내는 불순한 계산이 된다.
function useNow() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), ONE_MINUTE_MS);
    return () => clearInterval(timer);
  }, []);

  return now;
}

export default useNow;
