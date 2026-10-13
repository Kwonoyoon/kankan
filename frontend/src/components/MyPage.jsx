import { useState } from 'react';
import { passPlanName } from '../data/mockData';
import { useLanguage } from '../i18n/LanguageContext';
import { useApp } from '../AppContext';
import ReservationList from './ReservationList';
import StarRating from './StarRating';
import styles from './MyPage.module.css';

const TABS = [
  { id: 'reservations', label: '내 예약' },
  { id: 'reviews', label: '내가 쓴 후기' },
  { id: 'pass', label: '정기권' },
];

function MyPage({ activePlanId, onCancelSubscription, onOpenPassPlans, onOpenSpace, onOpenSpaces, onLogin }) {
  const { t } = useLanguage();
  const { user, spaces, reservations, cancelReservation, reviewsBy, removeReview } = useApp();
  const [tab, setTab] = useState('reservations');

  if (!user) {
    return (
      <main className={styles.page}>
        <div className={`wrap ${styles.guest}`}>
          <h1>{t('마이페이지')}</h1>
          <p>{t('로그인하면 예약 내역과 내가 쓴 후기를 볼 수 있어요.')}</p>
          <button type="button" className={styles.primary} onClick={onLogin}>{t('로그인')}</button>
        </div>
      </main>
    );
  }

  const myReviews = reviewsBy(user);
  const spaceName = (id) => spaces.find((s) => s.id === id)?.name ?? '';

  const counts = { reservations: reservations.length, reviews: myReviews.length, pass: activePlanId ? 1 : 0 };

  return (
    <main className={styles.page}>
      <div className={`wrap ${styles.inner}`}>
        <header className={styles.head}>
          <h1>{t('마이페이지')}</h1>
          <p>{user.nickname}{t('님')} · {user.email}</p>
        </header>

        <div className={styles.tabs} role="tablist">
          {TABS.map((tb) => (
            <button
              key={tb.id}
              type="button"
              role="tab"
              aria-selected={tab === tb.id}
              className={tab === tb.id ? styles.active : ''}
              onClick={() => setTab(tb.id)}
            >
              {t(tb.label)} <span>{counts[tb.id]}</span>
            </button>
          ))}
        </div>

        {tab === 'reservations' && (
          <section>
            <ReservationList reservations={reservations} onCancel={cancelReservation} onOpenSpace={onOpenSpace} />
            <button type="button" className={styles.secondary} onClick={onOpenSpaces}>{t('공간 둘러보기')}</button>
          </section>
        )}

        {tab === 'reviews' && (
          <section>
            {myReviews.length === 0 ? (
              <p className={styles.empty}>{t('아직 쓴 후기가 없어요. 이용한 공간에서 후기를 남겨 보세요.')}</p>
            ) : (
              <ul className={styles.reviews}>
                {myReviews.map((r) => (
                  <li key={r.id}>
                    <div className={styles.reviewHead}>
                      <button type="button" className={styles.spaceLink} onClick={() => onOpenSpace(r.spaceId)}>
                        {t(spaceName(r.spaceId))}
                      </button>
                      <span className={styles.date}>{r.date}</span>
                    </div>
                    <StarRating value={r.rating} />
                    {r.text && <p>{r.text}</p>}
                    <button type="button" className={styles.remove} onClick={() => removeReview(r.id)}>{t('삭제')}</button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {tab === 'pass' && (
          <section className={styles.pass}>
            {activePlanId ? (
              <>
                <p>{t('현재 정기권:')} <strong>{t(passPlanName(activePlanId))}</strong></p>
                <button type="button" className={styles.secondary} onClick={onCancelSubscription}>{t('해지')}</button>
              </>
            ) : (
              <>
                <p className={styles.empty}>{t('가입한 정기권이 없어요.')}</p>
                <button type="button" className={styles.primary} onClick={onOpenPassPlans}>{t('정기권 보기')}</button>
              </>
            )}
          </section>
        )}
      </div>
    </main>
  );
}

export default MyPage;
