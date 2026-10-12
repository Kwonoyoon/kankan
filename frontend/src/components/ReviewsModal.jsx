import { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useApp } from '../AppContext';
import StarRating from './StarRating';
import styles from './ReviewsModal.module.css';
import { CloseLabel } from './Icon';

function ReviewsModal({ space, onClose }) {
  const { t, lang } = useLanguage();
  const { user, requireAuth, reviewsFor, ratingFor, addReview } = useApp();
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const reviews = reviewsFor(space.id);
  const { avg, count } = ratingFor(space.id);

  function handleSubmit(e) {
    e.preventDefault();
    if (rating === 0) {
      setError(t('별점을 골라주세요.'));
      return;
    }
    // 로그인 안 했으면 로그인창이 먼저 뜨고, 로그인 후 이 후기가 이어서 등록된다.
    requireAuth((loggedInUser) => {
      addReview({ spaceId: space.id, rating, text: text.trim(), nickname: loggedInUser.nickname });
      setRating(0);
      setText('');
      setError('');
    });
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>{t(space.name)} {t('후기')}</h3>
          <button className={styles.closeBtn} onClick={onClose}><CloseLabel /></button>
        </div>

        <div className={styles.summary}>
          <strong>{count === 0 ? '-' : avg.toFixed(1)}</strong>
          <StarRating value={avg} />
          <span>{lang === 'en' ? `${count} reviews` : `후기 ${count}개`}</span>
        </div>

        <ul className={styles.list}>
          {reviews.length === 0 && <li className={styles.empty}>{t('아직 후기가 없어요.')}</li>}
          {reviews.map((r) => (
            <li key={r.id} className={styles.item}>
              <div className={styles.meta}>
                <span className={styles.name}>{r.nickname}</span>
                <StarRating value={r.rating} />
                <span className={styles.date}>{r.date}</span>
              </div>
              <p>{t(r.text)}</p>
            </li>
          ))}
        </ul>

        <form className={styles.form} onSubmit={handleSubmit}>
          <h4>{t('후기 쓰기')}{user ? '' : ` · ${t('로그인 필요')}`}</h4>
          <StarRating value={rating} onChange={(n) => { setRating(n); setError(''); }} />
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={200}
            rows={3}
            placeholder={t('이용 후기를 남겨주세요.')}
          />
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.submitBtn}>{t('등록')}</button>
        </form>
      </div>
    </div>
  );
}

export default ReviewsModal;
