import { useLanguage } from '../i18n/LanguageContext';
import { useApp } from '../AppContext';
import { spacePath } from '../lib/route';
import StarRating from './StarRating';
import styles from './SpaceCard.module.css';

function SpaceCard({ space, onReserve }) {
  const { t, lang } = useLanguage();
  const { ratingFor, openSpace, branchName, isNow, nowTime } = useApp();
  const { avg, count } = ratingFor(space.id);
  const available = isNow(space.id);

  // 실제 링크(<a href>)로 두는 이유: 새 탭으로 열기·주소 복사가 되고, 클릭만 가로채서 새로고침 없이 이동한다.
  // Ctrl/Cmd 클릭은 브라우저 기본 동작(새 탭)에 맡긴다.
  const href = spacePath(space.id);
  function go(e, hash) {
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    openSpace(space.id, hash);
  }

  return (
    <div className={styles.card}>
      <a
        className={styles.thumb}
        href={href}
        onClick={(e) => go(e)}
        aria-label={space.name}
        style={{ backgroundImage: `url(${space.image})` }}
      >
        {available && <span className={styles.nowBadge}>NOW {nowTime}~</span>}
        <span className={styles.priceChip}>
          {lang === 'en' ? `₩${space.pricePerHour.toLocaleString()} / hr` : `시간당 ${space.pricePerHour.toLocaleString()}원`}
        </span>
      </a>
      <div className={styles.body}>
        <div className={styles.branch}>{t(branchName(space.branchId))}</div>
        <h4><a href={href} className={styles.titleLink} onClick={(e) => go(e)}>{t(space.name)}</a></h4>
        <button className={styles.rating} onClick={(e) => go(e, '#reviews')}>
          <StarRating value={avg} />
          <span>{count === 0 ? t('후기 없음') : `${avg.toFixed(1)} (${count})`}</span>
        </button>
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
