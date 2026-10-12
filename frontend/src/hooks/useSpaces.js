import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { spaces as fallbackSpaces } from '../data/mockData';

// 서버 응답(SpaceResponse)을 기존 화면 코드가 쓰던 모양으로 맞춘다. 화면 컴포넌트를 건드리지 않으려는 것이다.
// 서버는 공간이 여러 컨셉을 가질 수 있게 배열(concepts)로 주지만, 화면은 아직 컨셉 하나(concept)만 쓴다.
function toView(s) {
  return {
    id: s.id,
    branchId: s.branchId,
    name: s.name,
    // 공간은 컨셉을 여러 개 가질 수 있다(예: 미팅 라운지 = 회의실 + 스터디). 필터는 concepts에 포함되는지로 본다.
    concepts: s.concepts,
    capacity: s.capacity,
    pricePerHour: s.pricePerHour,
    amenities: s.amenities,
    image: s.images[0] ?? '',
    description: s.description,
  };
}

// 공간 목록은 서버가 갖고 있다. 관리자가 가격을 바꾸거나 숨기면 사이트에 바로 반영되어야 하기 때문이다.
// refreshKey가 바뀔 때마다 다시 불러온다. 관리자 화면에서 공간을 고친 뒤 사이트로 돌아왔을 때,
// 같은 페이지 안에서 화면만 바뀌므로 처음 불러온 옛 목록이 그대로 남아 있지 않게 하려는 것이다.
function useSpaces(refreshKey) {
  const [state, setState] = useState({ status: 'loading', list: [] });

  useEffect(() => {
    let cancelled = false;
    api('/spaces')
      .then((rows) => { if (!cancelled) setState({ status: 'ready', list: rows.map(toView) }); })
      .catch(() => { if (!cancelled) setState({ status: 'error', list: [] }); });
    return () => { cancelled = true; };
  }, [refreshKey]);

  // 불러오는 동안은 빈 목록이다. 임시로 옛 목록(목업)을 보여주면, 숨긴 공간이 잠깐 떴다 사라진다.
  // 서버에 연결하지 못했을 때만 목업을 대신 보여준다. (예약은 서버가 거절하므로 둘러보기용이다)
  if (state.status === 'error') return fallbackSpaces.map((s) => ({ ...s, concepts: [s.concept] }));
  return state.list;
}

export default useSpaces;
