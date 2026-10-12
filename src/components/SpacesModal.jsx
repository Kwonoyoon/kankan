import { useState } from 'react';
import { spaces, concepts } from '../data/mockData';
import { getTimeSlots, todayISODate, isSlotAvailable } from '../lib/reservations';
import { useLanguage } from '../i18n/LanguageContext';
import { useApp } from '../AppContext';
import SpaceCard from './SpaceCard';
import BookingModal from './BookingModal';
import styles from './SpacesModal.module.css';

const timeSlots = getTimeSlots();

function SpacesModal({ onClose }) {
  const { t, lang } = useLanguage();
  const { reservations, requireAuth } = useApp();
  const [bookingSpace, setBookingSpace] = useState(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [concept, setConcept] = useState('');

  // 날짜와 시간을 둘 다 골랐을 때만 "그 시간에 비어 있는 공간"으로 거른다. 하나만 고르면 거를 기준이 부족하다.
  const searching = Boolean(date && time);
  const visible = spaces.filter(
    (s) =>
      (!concept || s.concept === concept) &&
      (!searching || isSlotAvailable(reservations, s.id, date, time)),
  );
  const filtered = Boolean(concept || searching);

  function reset() {
    setDate('');
    setTime('');
    setConcept('');
  }

  function summary() {
    if (!filtered) return t('가장 많이 예약된 공간을 모아봤어요.');
    if (visible.length === 0) return t('조건에 맞는 공간이 없어요.');
    return lang === 'en' ? `${visible.length} spaces available.` : `${visible.length}개 공간을 찾았어요.`;
  }

  return (
    <>
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <div className={styles.header}>
            <h2>{t('공간 둘러보기')}</h2>
            <button className={styles.closeBtn} onClick={onClose}>{t('닫기 ✕')}</button>
          </div>

          <div className={styles.filters}>
            <label>
              {t('날짜')}
              <input type="date" value={date} min={todayISODate()} onChange={(e) => setDate(e.target.value)} />
            </label>
            <label>
              {t('시간')}
              <select value={time} onChange={(e) => setTime(e.target.value)}>
                <option value="">{t('시간 선택')}</option>
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </label>
            <label>
              {t('용도')}
              <select value={concept} onChange={(e) => setConcept(e.target.value)}>
                <option value="">{t('전체')}</option>
                {concepts.map((c) => (
                  <option key={c.id} value={c.id}>{t(c.label)}</option>
                ))}
              </select>
            </label>
            <button type="button" className={styles.resetBtn} onClick={reset} disabled={!filtered && !date && !time}>
              {t('필터 초기화')}
            </button>
          </div>

          <p className={styles.subtitle}>{summary()}</p>
          {searching && <p className={styles.note}>{t('이 브라우저에 저장된 예약을 기준으로 계산해요.')}</p>}

          <div className={styles.grid}>
            {visible.map((s) => (
              <SpaceCard key={s.id} space={s} onReserve={() => requireAuth(() => setBookingSpace(s))} />
            ))}
          </div>
        </div>
      </div>

      {bookingSpace && (
        <BookingModal
          space={bookingSpace}
          initialDate={date || undefined}
          initialTime={time || undefined}
          onClose={() => setBookingSpace(null)}
        />
      )}
    </>
  );
}

export default SpacesModal;
