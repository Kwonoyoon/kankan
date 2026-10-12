import { useCallback, useEffect, useState } from 'react';
import { api } from '../lib/api';

// 그날 이미 찬 칸을 서버에서 받아온다. 내 예약뿐 아니라 다른 사람 예약도 포함이라, 로그인 없이도 호출되는 공개 API다.
// 반환 모양을 { spaceId, date, time }으로 맞춰서 lib/reservations.js의 isSlotAvailable을 그대로 쓴다.
// refreshKey를 바꾸면 같은 날짜라도 다시 불러온다. (관리자 화면에서 시간을 막고 돌아온 경우 등)
function useBookedSlots(date, refreshKey) {
  const [loaded, setLoaded] = useState({ date: null, slots: [] });
  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (!date) return undefined;
    let cancelled = false;
    api(`/reservations/booked?date=${date}`)
      .then((rows) => {
        if (cancelled) return;
        const slots = rows.map((r) => ({ spaceId: r.spaceId, date, time: `${String(r.hour).padStart(2, '0')}:00` }));
        setLoaded({ date, slots });
      })
      // 불러오지 못하면 "다 비어 있음"으로 보이지만, 실제 예약은 서버가 한 번 더 검사하므로 중복 예약은 생기지 않는다.
      .catch(() => {});
    return () => { cancelled = true; };
  }, [date, version, refreshKey]);

  const reload = useCallback(() => setVersion((v) => v + 1), []);

  // 날짜를 막 바꿔서 이전 날짜의 결과가 남아 있으면 쓰지 않는다. 다른 날 데이터로 잘못 판단하게 되기 때문이다.
  const booked = loaded.date === date ? loaded.slots : [];
  return { booked, reload };
}

export default useBookedSlots;
