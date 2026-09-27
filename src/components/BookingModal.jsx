import { useState } from 'react';
import { branchName } from '../data/mockData';
import { getTimeSlots } from '../lib/reservations';
import { useLanguage } from '../i18n/LanguageContext';
import styles from './BookingModal.module.css';

const timeSlots = getTimeSlots();

function todayISODate() {
  return new Date().toISOString().slice(0, 10);
}

function formatDate(isoDate, lang) {
  const date = new Date(`${isoDate}T00:00:00`);
  return date.toLocaleDateString(lang === 'en' ? 'en-US' : 'ko-KR', { month: 'long', day: 'numeric', weekday: 'short' });
}

function BookingModal({ space, onClose, onConfirm }) {
  const { t, lang } = useLanguage();
  const [date, setDate] = useState(todayISODate);
  const [time, setTime] = useState(timeSlots[0]);
  const [done, setDone] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    onConfirm({
      id: `res-${Date.now()}`,
      spaceId: space.id,
      spaceName: space.name,
      branchName: branchName(space.branchId),
      pricePerHour: space.pricePerHour,
      date,
      time,
    });
    setDone(true);
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>{t('닫기 ✕')}</button>

        {done ? (
          <div className={styles.done}>
            <h3>{t('예약이 완료됐어요')}</h3>
            <p>{t(branchName(space.branchId))} · {t(space.name)}</p>
            <p>{formatDate(date, lang)} {time}</p>
            <button className={styles.confirmBtn} onClick={onClose}>{t('확인')}</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h3>{lang === 'en' ? `Book ${t(space.name)}` : `${space.name} 예약`}</h3>
            <p className={styles.subInfo}>
              {t(branchName(space.branchId))} · {lang === 'en' ? `₩${space.pricePerHour.toLocaleString()} / hr` : `시간당 ${space.pricePerHour.toLocaleString()}원`}
            </p>

            <label className={styles.field}>
              {t('날짜')}
              <input
                type="date"
                value={date}
                min={todayISODate()}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </label>

            <label className={styles.field}>
              {t('시간')}
              <select value={time} onChange={(e) => setTime(e.target.value)}>
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </label>

            <button type="submit" className={styles.confirmBtn}>{t('예약 확정')}</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default BookingModal;
