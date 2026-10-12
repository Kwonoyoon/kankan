import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { formatWon } from '../lib/adminFormat';
import styles from './AdminPage.module.css';

function AdminStats() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    api('/admin/stats')
      .then((data) => { if (!cancelled) setStats(data); })
      .catch((err) => { if (!cancelled) setError(err.message); });
    return () => { cancelled = true; };
  }, []);

  if (error) return <p className={styles.error} role="alert">{error}</p>;
  if (!stats) return <p className={styles.empty}>불러오는 중…</p>;

  // 막대 길이는 가장 많이 예약된 공간을 100%로 둔 비율이다. (절대 숫자는 옆에 따로 쓴다)
  const max = Math.max(1, ...stats.spaces.map((s) => s.reservations));
  const cards = [
    { label: '전체 회원', value: `${stats.totalUsers.toLocaleString()}명` },
    { label: '현재 예약', value: `${stats.confirmedReservations.toLocaleString()}건` },
    { label: '오늘 이용 예약', value: `${stats.todayReservations.toLocaleString()}건` },
    { label: '예약 금액 합계', value: formatWon(stats.confirmedAmount) },
    { label: '답변 대기 문의', value: `${stats.openInquiries.toLocaleString()}건` },
  ];

  return (
    <div className={styles.statsWrap}>
      <div className={styles.cards}>
        {cards.map((c) => (
          <div key={c.label} className={styles.card}>
            <div className={styles.cardLabel}>{c.label}</div>
            <div className={styles.cardValue}>{c.value}</div>
          </div>
        ))}
      </div>
      <p className={styles.note}>
        예약 금액은 확정된 예약의 공간 가격을 더한 예상 금액이에요. 쿠폰 할인과 결제는 반영되지 않아서 실제 매출과 다를 수 있어요.
      </p>

      <section className={styles.panel}>
        <h2>공간별 예약</h2>
        {stats.spaces.length === 0 ? (
          <p className={styles.empty}>아직 예약이 없어요.</p>
        ) : (
          <ul className={styles.rank}>
            {stats.spaces.map((s) => (
              <li key={s.spaceId}>
                <div className={styles.rankHead}>
                  <span>{s.spaceName} <em className={styles.sub}>{s.branchName}</em></span>
                  <span>{s.reservations}건 · {formatWon(s.amount)}</span>
                </div>
                <div className={styles.bar}><span style={{ width: `${(s.reservations / max) * 100}%` }} /></div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default AdminStats;
