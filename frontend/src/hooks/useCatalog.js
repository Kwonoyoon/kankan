import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { concepts as fallbackConcepts, branches as fallbackBranches } from '../data/mockData';

// 컨셉(용도)과 지점 목록은 서버가 갖고 있다. 관리자가 지점을 추가하거나 컨셉이 늘어나도 화면 코드를 고치지 않게 하려는 것이다.
// 서버 응답(name)을 기존 화면 코드가 쓰던 모양(label)으로 맞춘다.
function useCatalog(refreshKey) {
  const [state, setState] = useState({ concepts: null, branches: null });

  useEffect(() => {
    let cancelled = false;
    Promise.all([api('/concepts'), api('/branches')])
      .then(([concepts, branches]) => {
        if (cancelled) return;
        setState({ concepts: concepts.map((c) => ({ id: c.id, label: c.name })), branches });
      })
      // 서버에 연결하지 못했을 때만 예전 목업을 쓴다. 불러오는 동안은 빈 목록이다.
      .catch(() => { if (!cancelled) setState({ concepts: fallbackConcepts, branches: fallbackBranches }); });
    return () => { cancelled = true; };
  }, [refreshKey]);

  const concepts = state.concepts ?? [];
  const branches = state.branches ?? [];
  const branchName = (branchId) => branches.find((b) => b.id === branchId)?.name ?? '';

  return { concepts, branches, branchName };
}

export default useCatalog;
