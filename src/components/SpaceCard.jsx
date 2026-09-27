import { branchName } from '../data/mockData';
import { useLanguage } from '../i18n/LanguageContext';
import styles from './SpaceCard.module.css';

function SpaceCard({ space, onReserve }) {
  const { t, lang } = useLanguage();

  return (
    <div className={styles.card}>
      <div
        className={styles.thumb}
        style={{ backgroundImage: `url(${space.image})` }}
      >
        <span className={styles.priceChip}>
          {lang === 'en' ? `₩${space.pricePerHour.toLocaleString()} / hr` : `시간당 ${space.pricePerHour.toLocaleString()}원`}
        </span>
      </div>
      <div className={styles.body}>
        <div className={styles.branch}>{t(branchName(space.branchId))}</div>
        <h4>{t(space.name)}</h4>
        <p className={styles.desc}>{t(space.description)}</p>
        <div className={styles.meta}>
          <span>{lang === 'en' ? `Fits ${space.capacity}` : `정원 ${space.capacity}명`}</span>
          <span>{space.amenities.map((a) => t(a)).join(' · ')}</span>
        </div>
        <button className={styles.reserveBtn} onClick={onReserve}>{t('예약하기')}</button>
      </div>
    </div>
  );
}

export default SpaceCard;
