import { useState } from 'react';
import { getTimeSlots, todayISODate, isPastSlot, isSlotAvailable } from '../lib/reservations';
import { applyDiscount } from '../lib/coupons';
import { useLanguage } from '../i18n/LanguageContext';
import { useApp } from '../AppContext';
import useBookedSlots from '../hooks/useBookedSlots';
import styles from './BookingModal.module.css';
import { CloseLabel } from './Icon';

const timeSlots = getTimeSlots();

function formatDate(isoDate, lang) {
  const date = new Date(`${isoDate}T00:00:00`);
  return date.toLocaleDateString(lang === 'en' ? 'en-US' : 'ko-KR', { month: 'long', day: 'numeric', weekday: 'short' });
}

function formatWon(amount, lang) {
  return lang === 'en' ? `₩${amount.toLocaleString()}` : `${amount.toLocaleString()}원`;
}

function BookingModal({ space, onClose, initialDate, initialTime }) {
  const { t, lang } = useLanguage();
  const { availableCoupons, confirmBooking, branchName } = useApp();
  const [date, setDate] = useState(initialDate || todayISODate);
  const [chosenTime, setChosenTime] = useState(initialTime || '');
  const [couponId, setCouponId] = useState('');
  // 예약이 확정된 순간의 날짜·시간·금액. 확정 뒤에는 칸 상태와 쿠폰 목록이 바뀌어서
  // 화면에서 다시 계산하면 방금 예약한 시간이 '예약됨'으로 취급돼 다른 시간이 표시된다.
  const [done, setDone] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const { booked, reload } = useBookedSlots(date);

  const slots = timeSlots.map((slot) => ({ slot, ok: isSlotAvailable(booked, space.id, date, slot) }));

  // 날짜를 바꾸면 고르던 시간이 그날 이미 찼을 수 있다. 그럴 땐 첫 빈 시간으로 대신 잡는다.
  const firstFree = slots.find((s) => s.ok)?.slot ?? '';
  const time = slots.find((s) => s.slot === chosenTime)?.ok ? chosenTime : firstFree;

  const coupon = availableCoupons.find((c) => c.id === couponId);
  const finalPrice = coupon ? applyDiscount(space.pricePerHour, coupon.discountRate) : space.pricePerHour;

  function slotLabel({ slot, ok }) {
    if (ok) return slot;
    return `${slot} ${isPastSlot(date, slot) ? t('(지난 시간)') : t('(예약됨)')}`;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!time) return;
    setBusy(true);
    setError('');
    try {
      // 가격은 보내지 않는다. 서버가 공간 가격으로 정한다. (쿠폰 할인은 아직 화면에서만 계산한다)
      await confirmBooking({ spaceId: space.id, date, time }, coupon ? coupon.id : null);
      reload();
      setDone({ date, time, price: finalPrice });
    } catch (err) {
      setError(err.message);
      // 그 사이 다른 사람이 먼저 예약했을 수 있다. 칸 상태를 다시 받아와서 예약됨으로 표시한다.
      reload();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}><CloseLabel /></button>

        {done ? (
          <div className={styles.done}>
            <h3>{t('예약이 완료됐어요')}</h3>
            <p>{t(branchName(space.branchId))} · {t(space.name)}</p>
            <p>{formatDate(done.date, lang)} {done.time}</p>
            <p>{t('결제 금액')} {formatWon(done.price, lang)}</p>
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
              <select value={time} onChange={(e) => setChosenTime(e.target.value)} disabled={!firstFree}>
                {slots.map((s) => (
                  <option key={s.slot} value={s.slot} disabled={!s.ok}>{slotLabel(s)}</option>
                ))}
              </select>
              {!firstFree && <span className={styles.warn}>{t('이 날짜에는 예약 가능한 시간이 없어요.')}</span>}
            </label>

            <label className={styles.field}>
              {t('쿠폰')}
              <select value={couponId} onChange={(e) => setCouponId(e.target.value)}>
                <option value="">{t('사용 안 함')}</option>
                {availableCoupons.map((c) => (
                  <option key={c.id} value={c.id}>{t(c.title)} ({c.code})</option>
                ))}
              </select>
            </label>

            <div className={styles.total}>
              <span>{t('결제 금액')}</span>
              <strong>{formatWon(finalPrice, lang)}</strong>
            </div>

            {error && <p className={styles.warn} role="alert">{error}</p>}

            <button type="submit" className={styles.confirmBtn} disabled={!firstFree || busy}>{t('예약 확정')}</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default BookingModal;
