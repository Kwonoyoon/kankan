import { useLanguage } from '../i18n/LanguageContext';
import { useApp } from '../AppContext';
import StarRating from './StarRating';
import styles from './HomeSections.module.css';

const SHOWN = 6;

function RecentReviews() {
  const { t } = useLanguage();
  const { allReviews, spaces, branchName, openSpace } = useApp();

  // 서버에서 숨겨진 공간의 후기는 보여주지 않는다. 눌러도 갈 곳이 없어서다.
  const rows = allReviews
    .map((r) => ({ review: r, space: spaces.find((s) => s.id === r.spaceId) }))
    .filter((row) => row.space && row.review.text)
    .slice(0, SHOWN);

  if (rows.length === 0) return null;

  return (
    <section className={styles.section}>
      <div className="wrap">
        <div className={styles.head}>
          <span className={styles.kicker}>{t('이용 후기')}</span>
          <h2>{t('먼저 써 본 분들의 이야기')}</h2>
        </div>
        <ul className={styles.reviews}>
          {rows.map(({ review, space }) => (
            <li key={review.id}>
              <StarRating value={review.rating} />
              <p>{t(review.text)}</p>
              <div className={styles.reviewFoot}>
                <span>{review.nickname}</span>
                <button type="button" onClick={() => openSpace(space.id)}>
                  {t(branchName(space.branchId))} · {t(space.name)}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default RecentReviews;
