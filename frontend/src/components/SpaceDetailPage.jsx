import { useEffect, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useApp } from '../AppContext';
import { buildDetail, REFUND_RULES } from '../lib/spaceDetail';
import { todayISODate } from '../lib/reservations';
import StarRating from './StarRating';
import BookingModal from './BookingModal';
import styles from './SpaceDetailPage.module.css';

const SECTIONS = [
  { id: 'intro', label: '공간 소개' },
  { id: 'facilities', label: '시설 안내' },
  { id: 'notes', label: '이용 안내' },
  { id: 'refund', label: '환불 정책' },
  { id: 'reviews', label: '이용 후기' },
];

function SpaceDetailPage({ spaceId, onBack }) {
  const { t, lang } = useLanguage();
  const { user, spaces, concepts, branches, branchName, requireAuth, reviewsFor, ratingFor, addReview, isNow, nowTime } = useApp();
  const [bookingOpen, setBookingOpen] = useState(false);
  const [date, setDate] = useState(todayISODate);
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const space = spaces.find((s) => s.id === spaceId);
  const loaded = spaces.length > 0;

  useEffect(() => {
    if (space) document.title = `${space.name} | kany`;
    return () => { document.title = 'kany'; };
  }, [space]);

  // 후기 별점을 눌러서 들어온 경우(#reviews)에는 목록이 그려진 뒤 그 자리로 내려간다.
  useEffect(() => {
    if (space && window.location.hash === '#reviews') {
      document.getElementById('reviews')?.scrollIntoView();
    }
  }, [space]);

  if (!space) {
    return (
      <main className={styles.page}>
        <div className="wrap">
          <p className={styles.notFound}>{loaded ? t('찾을 수 없는 공간이에요.') : t('불러오는 중...')}</p>
          <button type="button" className={styles.backBtn} onClick={onBack}>{t('공간 목록으로')}</button>
        </div>
      </main>
    );
  }

  const branch = branches.find((b) => b.id === space.branchId);
  const detail = buildDetail(space, branch);
  const reviews = reviewsFor(space.id);
  const { avg, count } = ratingFor(space.id);
  const available = isNow(space.id);
  const price = lang === 'en' ? `₩${space.pricePerHour.toLocaleString()} / hr` : `시간당 ${space.pricePerHour.toLocaleString()}원`;

  function submitReview(e) {
    e.preventDefault();
    if (rating === 0) {
      setError(t('별점을 골라주세요.'));
      return;
    }
    // 로그인 안 했으면 로그인창이 먼저 뜨고, 로그인 후 이 후기가 이어서 등록된다.
    requireAuth((loggedInUser) => {
      addReview({ spaceId: space.id, rating, text: text.trim(), user: loggedInUser });
      setRating(0);
      setText('');
      setError('');
    });
  }

  return (
    <main className={styles.page}>
      <div className="wrap">
        <nav className={styles.crumbs} aria-label="breadcrumb">
          <button type="button" onClick={onBack}>{t('홈')}</button>
          <span>›</span>
          <span>{t(branchName(space.branchId))}</span>
          <span>›</span>
          <strong>{t(space.name)}</strong>
        </nav>

        <div className={styles.cover} style={{ backgroundImage: `url(${space.image})` }} role="img" aria-label={space.name}>
          {available && <span className={styles.nowBadge}>NOW {nowTime}~</span>}
        </div>

        <div className={styles.layout}>
          <div className={styles.main}>
            <header className={styles.head}>
              <span className={styles.branch}>{t(branchName(space.branchId))}</span>
              <h1>{t(space.name)}</h1>
              <p className={styles.headline}>{t(detail.headline)}</p>
              <a className={styles.ratingLine} href="#reviews">
                <StarRating value={avg} />
                <span>{count === 0 ? t('후기 없음') : `${avg.toFixed(1)} (${count})`}</span>
              </a>
              <ul className={styles.chips}>
                <li>{lang === 'en' ? `Fits ${space.capacity}` : `최대 ${space.capacity}인`}</li>
                {space.concepts.map((id) => (
                  <li key={id}>#{t(concepts.find((c) => c.id === id)?.label ?? id)}</li>
                ))}
              </ul>
            </header>

            <nav className={styles.tabs} aria-label="sections">
              {SECTIONS.map((s) => (
                <a key={s.id} href={`#${s.id}`}>{t(s.label)}</a>
              ))}
            </nav>

            <section id="intro" className={styles.block}>
              <h2>{t('공간 소개')}</h2>
              {detail.intro.map((p) => <p key={p}>{t(p)}</p>)}
            </section>

            <section id="facilities" className={styles.block}>
              <h2>{t('시설 안내')}</h2>
              <ul className={styles.facilities}>
                {detail.facilities.map((f) => <li key={f}>{t(f)}</li>)}
              </ul>
              <dl className={styles.info}>
                <dt>{t('운영 시간')}</dt><dd>{detail.hours}</dd>
                <dt>{t('수용 인원')}</dt><dd>{lang === 'en' ? `Up to ${space.capacity}` : `최대 ${space.capacity}명`}</dd>
                <dt>{t('위치')}</dt><dd>{t(branch?.name ?? '')} · {t(branch?.address ?? '')}</dd>
              </dl>
            </section>

            <section id="notes" className={styles.block}>
              <h2>{t('이용 안내')}</h2>
              <ul className={styles.bullets}>
                {detail.notes.map((n) => <li key={n}>{t(n)}</li>)}
              </ul>
            </section>

            <section id="refund" className={styles.block}>
              <h2>{t('환불 정책')}</h2>
              <table className={styles.refund}>
                <tbody>
                  {REFUND_RULES.map((r) => (
                    <tr key={r.when}><th>{t(r.when)}</th><td>{t(r.rate)}</td></tr>
                  ))}
                </tbody>
              </table>
            </section>

            <section id="reviews" className={styles.block}>
              <h2>{t('이용 후기')} <span className={styles.count}>{count}</span></h2>
              <div className={styles.summary}>
                <strong>{count === 0 ? '-' : avg.toFixed(1)}</strong>
                <StarRating value={avg} />
              </div>

              <form className={styles.form} onSubmit={submitReview}>
                <h3>{t('후기 쓰기')}{user ? '' : ` · ${t('로그인 필요')}`}</h3>
                <StarRating value={rating} onChange={(n) => { setRating(n); setError(''); }} />
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  maxLength={200}
                  rows={3}
                  placeholder={t('이용 후기를 남겨주세요.')}
                />
                {error && <p className={styles.error} role="alert">{error}</p>}
                <button type="submit" className={styles.submitBtn}>{t('등록')}</button>
              </form>

              <ul className={styles.reviewList}>
                {reviews.length === 0 && <li className={styles.empty}>{t('아직 후기가 없어요.')}</li>}
                {reviews.map((r) => (
                  <li key={r.id}>
                    <div className={styles.meta}>
                      <span className={styles.name}>{r.nickname}</span>
                      <StarRating value={r.rating} />
                      <span className={styles.date}>{r.date}</span>
                    </div>
                    {r.text && <p>{t(r.text)}</p>}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <aside className={styles.side}>
            <div className={styles.card}>
              <div className={styles.price}>{price}</div>
              <label className={styles.field}>
                {t('날짜')}
                <input type="date" value={date} min={todayISODate()} onChange={(e) => setDate(e.target.value)} />
              </label>
              <button type="button" className={styles.reserve} onClick={() => requireAuth(() => setBookingOpen(true))}>
                {t('예약하기')}
              </button>
              <p className={styles.sideNote}>{t('이용 하루 전까지 무료로 취소할 수 있어요.')}</p>
            </div>
          </aside>
        </div>
      </div>

      {bookingOpen && <BookingModal space={space} initialDate={date} onClose={() => setBookingOpen(false)} />}
    </main>
  );
}

export default SpaceDetailPage;
