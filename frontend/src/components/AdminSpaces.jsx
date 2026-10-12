import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import AdminCatalogForms from './AdminCatalogForms';
import styles from './AdminPage.module.css';

function AdminSpaces() {
  const [spaces, setSpaces] = useState(null);
  // 서버 값과 다르게 고치는 중인 값. 저장하기 전까지는 서버 목록(spaces)을 건드리지 않는다.
  const [drafts, setDrafts] = useState({});
  const [message, setMessage] = useState({ type: '', text: '' });
  // 공간을 새로 추가하면 목록을 다시 받아야 해서 version을 올린다.
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;
    api('/admin/spaces')
      .then((list) => { if (!cancelled) setSpaces(list); })
      .catch((err) => { if (!cancelled) setMessage({ type: 'error', text: err.message }); });
    return () => { cancelled = true; };
  }, [version]);

  function draftOf(space) {
    return drafts[space.id] ?? { price: String(space.pricePerHour), active: space.active };
  }

  function change(space, patch) {
    setDrafts((d) => ({ ...d, [space.id]: { ...draftOf(space), ...patch } }));
    setMessage({ type: '', text: '' });
  }

  const priceOf = (draft) => (draft.price === '' ? NaN : Number(draft.price));
  const isDirty = (space) => {
    const d = draftOf(space);
    return priceOf(d) !== space.pricePerHour || d.active !== space.active;
  };

  async function save(space) {
    const d = draftOf(space);
    const price = priceOf(d);
    // 서버도 검사하지만(0~500,000), 숫자가 아닌 값은 요청을 보내기 전에 걸러서 바로 알려준다.
    if (!Number.isInteger(price) || price < 0) {
      setMessage({ type: 'error', text: '가격은 0 이상의 정수로 입력해주세요.' });
      return;
    }
    try {
      const updated = await api(`/admin/spaces/${space.id}`, { method: 'PUT', body: { pricePerHour: price, active: d.active } });
      setSpaces((list) => list.map((s) => (s.id === updated.id ? updated : s)));
      setDrafts((all) => {
        const { [space.id]: _removed, ...rest } = all;
        return rest;
      });
      setMessage({ type: 'ok', text: `${updated.name} 저장했어요. 사이트에 바로 반영돼요.` });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
  }

  return (
    <>
    <section className={styles.panel}>
      <h2>공간 관리 {spaces ? `(${spaces.length})` : ''}</h2>
      <p className={styles.note}>
        가격을 바꿔도 이미 한 예약의 금액은 그대로예요. 숨긴 공간은 사이트에 보이지 않고 예약도 받지 않아요(기존 예약은 유지돼요).
      </p>
      {message.text && (
        <p className={message.type === 'ok' ? styles.okMsg : styles.error} role="alert">{message.text}</p>
      )}
      <div className={styles.tableWrap}>
        <table>
          <thead>
            <tr>
              <th>공간</th>
              <th>정원</th>
              <th>시간당 가격(원)</th>
              <th>사이트에 표시</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {!spaces && <tr><td colSpan={5} className={styles.empty}>불러오는 중…</td></tr>}
            {(spaces ?? []).map((s) => {
              const d = draftOf(s);
              return (
                <tr key={s.id} className={!d.active ? styles.canceled : ''}>
                  <td>
                    <div>{s.name}</div>
                    <div className={styles.sub}>{s.branchName}</div>
                  </td>
                  <td>{s.capacity}명</td>
                  <td>
                    <input
                      className={styles.numInput}
                      type="number"
                      min="0"
                      step="500"
                      value={d.price}
                      onChange={(e) => change(s, { price: e.target.value })}
                      aria-label={`${s.name} 시간당 가격`}
                    />
                  </td>
                  <td>
                    <label className={styles.toggle}>
                      <input type="checkbox" checked={d.active} onChange={(e) => change(s, { active: e.target.checked })} />
                      {d.active ? '표시 중' : '숨김'}
                    </label>
                  </td>
                  <td>
                    <button type="button" className={styles.saveBtn} disabled={!isDirty(s)} onClick={() => save(s)}>저장</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
    <AdminCatalogForms onCreated={() => setVersion((v) => v + 1)} />
    </>
  );
}

export default AdminSpaces;
