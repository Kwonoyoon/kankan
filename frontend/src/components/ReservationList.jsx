import { useLanguage } from '../i18n/LanguageContext';
import styles from './ReservationList.module.css';

function formatDate(isoDate, lang) {
  const date = new Date(`${isoDate}T00:00:00`);
  return date.toLocaleDateString(lang === 'en' ? 'en-US' : 'ko-KR', { month: 'long', day: 'numeric', weekday: 'short' });
}

function ReservationList({ reservations, onCancel }) {
  const { t, lang } = useLanguage();

  if (reservations.length === 0) {
    return <p className={styles.empty}>{t('아직 예약한 공간이 없어요. 공간을 둘러보고 예약해보세요.')}</p>;
  }

  return (
    <ul className={styles.list}>
      {reservations.map((r) => (
        <li key={r.id} className={styles.item}>
          <div>
            <div className={styles.space}>{t(r.branchName)} · {t(r.spaceName)}</div>
            <div className={styles.time}>{formatDate(r.date, lang)} {r.time}</div>
          </div>
          <button className={styles.cancelBtn} onClick={() => onCancel(r.id)}>{t('취소')}</button>
        </li>
      ))}
    </ul>
  );
}

export default ReservationList;
