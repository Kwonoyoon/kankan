import { useCallback, useEffect, useState } from 'react';
import { api } from '../lib/api';

// 서버는 시작 시각을 숫자(10)로, 화면은 "10:00" 문자열로 다룬다. 경계에서 한 번만 바꾼다.
const toTime = (hour) => `${String(hour).padStart(2, '0')}:00`;
const toHour = (time) => Number(time.slice(0, 2));

function toView(r) {
  return {
    id: r.id,
    spaceId: r.spaceId,
    spaceName: r.spaceName,
    branchName: r.branchName,
    date: r.date,
    time: toTime(r.hour),
    price: r.price,
  };
}

// 내 예약은 서버가 갖고 있다. 로그인한 사람이 바뀌면(로그인/로그아웃) 목록을 다시 받아온다.
function useReservations(user) {
  const userId = user?.id ?? null;
  // 목록에 "누구의 것인지"를 같이 저장한다. 로그아웃하거나 다른 계정으로 바꾼 직후, 새 목록이 오기 전에
  // 이전 사람의 예약이 화면에 남아 보이지 않게 하려는 것이다.
  const [loaded, setLoaded] = useState({ userId: null, list: [] });
  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (!userId) return undefined;
    let cancelled = false;
    api('/reservations/me')
      .then((list) => {
        if (cancelled) return;
        // 취소된 예약은 기록(관리자용)으로만 남기고, 내 예약 목록에는 보이지 않게 한다.
        setLoaded({ userId, list: list.filter((r) => r.status === 'CONFIRMED').map(toView) });
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [userId, version]);

  const reload = useCallback(() => setVersion((v) => v + 1), []);

  async function addReservation({ spaceId, date, time }) {
    await api('/reservations', { method: 'POST', body: { spaceId, date, hours: [toHour(time)] } });
    reload();
  }

  async function cancelReservation(id) {
    await api(`/reservations/${id}`, { method: 'DELETE' });
    reload();
  }

  const reservations = loaded.userId === userId ? loaded.list : [];
  return { reservations, addReservation, cancelReservation };
}

export default useReservations;
