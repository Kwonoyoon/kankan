import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { STATUS_LABEL, formatHour, formatDateTime, formatWon } from '../lib/adminFormat';
import styles from './AdminPage.module.css';

function AdminReservations() {
  const [users, setUsers] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [date, setDate] = useState('');
  const [result, setResult] = useState({ key: null, rows: [] });
  const [error, setError] = useState('');
  const [version, setVersion] = useState(0);

  // 회원을 고르면 그 회원의 기록, 아니면 (날짜 필터를 적용한) 전체 예약을 본다.
  const key = `${selectedUser?.id ?? ''}|${date}|${version}`;
  const loading = result.key !== key;

  useEffect(() => {
    let cancelled = false;
    api('/admin/users')
      .then((list) => { if (!cancelled) setUsers(list); })
      .catch((err) => { if (!cancelled) setError(err.message); });
    return () => { cancelled = true; };
  }, [version]);

  useEffect(() => {
    let cancelled = false;
    const query = new URLSearchParams();
    if (selectedUser) query.set('userId', selectedUser.id);
    if (date) query.set('date', date);
    api(`/admin/reservations?${query}`)
      .then((rows) => { if (!cancelled) setResult({ key, rows }); })
      .catch((err) => { if (!cancelled) setError(err.message); });
    return () => { cancelled = true; };
  }, [key, selectedUser, date]);

  async function cancel(id) {
    if (!window.confirm('이 예약을 취소할까요?')) return;
    try {
      await api(`/admin/reservations/${id}`, { method: 'DELETE' });
      setVersion((v) => v + 1);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className={styles.dashboard}>
      <section className={styles.panel}>
        <h2>회원 {users ? `(${users.length})` : ''}</h2>
        <button
          type="button"
          className={`${styles.userRow} ${!selectedUser ? styles.selected : ''}`}
          onClick={() => setSelectedUser(null)}
        >
          <strong>전체 예약 보기</strong>
        </button>
        <ul className={styles.userList}>
          {(users ?? []).map((u) => (
            <li key={u.id}>
              <button
                type="button"
                className={`${styles.userRow} ${selectedUser?.id === u.id ? styles.selected : ''}`}
                onClick={() => setSelectedUser(u)}
              >
                <span className={styles.userName}>
                  {u.nickname}
                  {u.role === 'ADMIN' && <em className={styles.badge}>관리자</em>}
                </span>
                <span className={styles.userMeta}>{u.email}</span>
                <span className={styles.userMeta}>
                  현재 예약 {u.activeReservations}건 · 누적 {u.totalReservations}건 · 가입 {u.createdAt.slice(0, 10)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.panel}>
        <div className={styles.panelHead}>
          <h2>{selectedUser ? `${selectedUser.nickname}님의 예약 기록` : '전체 예약'}</h2>
          <label className={styles.dateFilter}>
            날짜
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            {date && <button type="button" onClick={() => setDate('')}>지우기</button>}
          </label>
        </div>
        {error && <p className={styles.error} role="alert">{error}</p>}
        <div className={styles.tableWrap}>
          <table>
            <thead>
              <tr>
                {!selectedUser && <th>예약자</th>}
                <th>공간</th>
                <th>이용 일시</th>
                <th>금액</th>
                <th>상태</th>
                <th>예약한 시각</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={7} className={styles.empty}>불러오는 중…</td></tr>}
              {!loading && result.rows.length === 0 && (
                <tr><td colSpan={7} className={styles.empty}>예약 기록이 없어요.</td></tr>
              )}
              {!loading && result.rows.map((r) => (
                <tr key={r.id} className={r.status === 'CANCELED' ? styles.canceled : ''}>
                  {!selectedUser && (
                    <td>
                      <div>{r.userNickname}</div>
                      <div className={styles.sub}>{r.userEmail}</div>
                    </td>
                  )}
                  <td>
                    <div>{r.spaceName}</div>
                    <div className={styles.sub}>{r.branchName}</div>
                  </td>
                  <td className={styles.nowrap}>{r.date} {formatHour(r.hour)}</td>
                  <td>{formatWon(r.price)}</td>
                  <td>{STATUS_LABEL[r.status]}</td>
                  <td className={`${styles.sub} ${styles.nowrap}`}>{formatDateTime(r.createdAt)}</td>
                  <td>
                    {r.status === 'CONFIRMED' && (
                      <button type="button" className={styles.cancelBtn} onClick={() => cancel(r.id)}>취소</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default AdminReservations;
