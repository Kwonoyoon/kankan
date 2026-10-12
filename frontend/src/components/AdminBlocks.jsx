import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { getTimeSlots, todayISODate } from '../lib/reservations';
import { formatHour } from '../lib/adminFormat';
import styles from './AdminPage.module.css';

const SLOTS = getTimeSlots();
const hourOf = (slot) => Number(slot.slice(0, 2));

function AdminBlocks() {
  const [spaces, setSpaces] = useState([]);
  const [blocks, setBlocks] = useState(null);
  const [version, setVersion] = useState(0);
  const [spaceId, setSpaceId] = useState('');
  const [date, setDate] = useState(todayISODate);
  const [hours, setHours] = useState([]);
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    api('/admin/spaces')
      .then((list) => { if (!cancelled) setSpaces(list); })
      .catch((err) => { if (!cancelled) setMessage({ type: 'error', text: err.message }); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    api('/admin/blocked-slots')
      .then((list) => { if (!cancelled) setBlocks(list); })
      .catch((err) => { if (!cancelled) setMessage({ type: 'error', text: err.message }); });
    return () => { cancelled = true; };
  }, [version]);

  // 공간을 아직 안 골랐으면 첫 공간을 기본으로 쓴다. (state를 따로 채우지 않고 화면에서 계산한다)
  const chosenSpace = spaceId || spaces[0]?.id || '';

  function toggleHour(hour) {
    setHours((list) => (list.includes(hour) ? list.filter((h) => h !== hour) : [...list, hour].sort((a, b) => a - b)));
  }

  async function submit(e) {
    e.preventDefault();
    if (hours.length === 0) {
      setMessage({ type: 'error', text: '막을 시간을 하나 이상 골라주세요.' });
      return;
    }
    setBusy(true);
    setMessage({ type: '', text: '' });
    try {
      await api('/admin/blocked-slots', { method: 'POST', body: { spaceId: chosenSpace, date, hours, reason } });
      setHours([]);
      setReason('');
      setVersion((v) => v + 1);
      setMessage({ type: 'ok', text: '막았어요. 사이트에서는 해당 시간이 예약됨으로 보여요.' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setBusy(false);
    }
  }

  async function unblock(id) {
    try {
      await api(`/admin/blocked-slots/${id}`, { method: 'DELETE' });
      setVersion((v) => v + 1);
      setMessage({ type: 'ok', text: '다시 예약받을 수 있도록 풀었어요.' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
  }

  return (
    <div className={styles.blockGrid}>
      <form className={styles.panel} onSubmit={submit}>
        <h2>시간 막기</h2>
        <p className={styles.note}>점검·휴무처럼 받지 않을 시간을 닫아요. 이미 예약이 있는 시간은 먼저 그 예약을 취소해야 막을 수 있어요.</p>

        <label className={styles.formField}>
          공간
          <select value={chosenSpace} onChange={(e) => setSpaceId(e.target.value)}>
            {spaces.map((s) => <option key={s.id} value={s.id}>{s.branchName} · {s.name}</option>)}
          </select>
        </label>

        <label className={styles.formField}>
          날짜
          <input type="date" value={date} min={todayISODate()} onChange={(e) => setDate(e.target.value)} required />
        </label>

        <div className={styles.formField}>
          시간 (여러 개 선택)
          <div className={styles.hourGrid}>
            {SLOTS.map((slot) => {
              const hour = hourOf(slot);
              const on = hours.includes(hour);
              return (
                <button
                  key={slot}
                  type="button"
                  className={`${styles.hourBtn} ${on ? styles.hourOn : ''}`}
                  aria-pressed={on}
                  onClick={() => toggleHour(hour)}
                >
                  {slot}
                </button>
              );
            })}
          </div>
        </div>

        <label className={styles.formField}>
          사유 (선택)
          <input type="text" value={reason} maxLength={255} onChange={(e) => setReason(e.target.value)} placeholder="예: 방음 공사" />
        </label>

        {message.text && (
          <p className={message.type === 'ok' ? styles.okMsg : styles.error} role="alert">{message.text}</p>
        )}
        <button type="submit" className={styles.primary} disabled={busy}>선택한 시간 막기</button>
      </form>

      <section className={styles.panel}>
        <h2>막아 둔 시간 {blocks ? `(${blocks.length})` : ''}</h2>
        <div className={styles.tableWrap}>
          <table>
            <thead>
              <tr><th>날짜</th><th>시간</th><th>공간</th><th>사유</th><th /></tr>
            </thead>
            <tbody>
              {!blocks && <tr><td colSpan={5} className={styles.empty}>불러오는 중…</td></tr>}
              {blocks && blocks.length === 0 && <tr><td colSpan={5} className={styles.empty}>막아 둔 시간이 없어요.</td></tr>}
              {(blocks ?? []).map((b) => (
                <tr key={b.id}>
                  <td className={styles.nowrap}>{b.date}</td>
                  <td className={styles.nowrap}>{formatHour(b.hour)}</td>
                  <td>
                    <div>{b.spaceName}</div>
                    <div className={styles.sub}>{b.branchName}</div>
                  </td>
                  <td className={styles.sub}>{b.reason ?? '-'}</td>
                  <td><button type="button" className={styles.cancelBtn} onClick={() => unblock(b.id)}>풀기</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default AdminBlocks;
