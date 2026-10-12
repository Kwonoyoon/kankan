import { events, coupons } from '../data/mockData';
import { useLanguage } from '../i18n/LanguageContext';
import { useApp } from '../AppContext';
import styles from './EventsPanel.module.css';

function EventsPanel() {
  const { t } = useLanguage();
  const { claimed, claimCoupon, requireAuth } = useApp();

  function statusOf(couponId) {
    return claimed.find((c) => c.couponId === couponId);
  }

  function buttonLabel(couponId) {
    const s = statusOf(couponId);
    if (!s) return t('쿠폰 받기');
    return s.used ? t('사용 완료') : t('받음');
  }

  return (
    <>
      <h4 className={styles.subhead}>{t('진행 중인 이벤트')}</h4>
      <ul className={styles.list}>
        {events.map((ev) => (
          <li key={ev.id} className={styles.event}>
            <div>
              <div className={styles.title}>{t(ev.title)}</div>
              <p className={styles.desc}>{t(ev.desc)}</p>
              <div className={styles.period}>{ev.period}</div>
            </div>
            <button
              className={styles.claimBtn}
              disabled={Boolean(statusOf(ev.couponId))}
              onClick={() => requireAuth(() => claimCoupon(ev.couponId))}
            >
              {buttonLabel(ev.couponId)}
            </button>
          </li>
        ))}
      </ul>

      <h4 className={styles.subhead}>{t('내 쿠폰')}</h4>
      {claimed.length === 0 ? (
        <p className={styles.empty}>{t('받은 쿠폰이 없어요.')}</p>
      ) : (
        <ul className={styles.list}>
          {claimed.map((c) => {
            const coupon = coupons.find((x) => x.id === c.couponId);
            if (!coupon) return null;
            return (
              <li key={c.couponId} className={`${styles.coupon} ${c.used ? styles.used : ''}`}>
                <span className={styles.code}>{coupon.code}</span>
                <span>{t(coupon.title)}</span>
                <span className={styles.state}>{c.used ? t('사용 완료') : t('사용 가능')}</span>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}

export default EventsPanel;
