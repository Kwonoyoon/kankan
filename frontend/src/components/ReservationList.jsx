import { useLanguage } from '../i18n/LanguageContext';
import styles from './ReservationList.module.css';

function formatDate(isoDate, lang) {
  const date = new Date(`${isoDate}T00:00:00`);
  return date.toLocaleDateString(lang === 'en' ? 'en-US' : 'ko-KR', { month: 'long', day: 'numeric', weekday: 'short' });
}

// onOpenSpace가 있으면 공간 이름이 상세 페이지로 가는 링크가 된다. (마이페이지에서 예약한 곳을 다시 보러 가는 용도)
function ReservationList({ reservations, onCancel, onOpenSpace }) {
  const { t, lang } = useLanguage();

  if (reservations.length === 0) {
    return <p className={styles.empty}>{t('아직 예약한 공간이 없어요. 공간을 둘러보고 예약해보세요.')}</p>;
  }

  return (
    <ul className={styles.list}>
      {reservations.map((r) => (
        <li key={r.id} className={styles.item}>
          <div>
            <div className={styles.space}>
              {t(r.branchName)} ·{' '}
              {onOpenSpace ? (
                <button type="button" className={styles.spaceLink} onClick={() => onOpenSpace(r.spaceId)}>{t(r.spaceName)}</button>
              ) : t(r.spaceName)}
            </div>
            <div className={styles.time}>{formatDate(r.date, lang)} {r.time}</div>
          </div>
          <button className={styles.cancelBtn} onClick={() => onCancel(r.id)}>{t('취소')}</button>
        </li>
      ))}
    </ul>
  );
}

export default ReservationList;
