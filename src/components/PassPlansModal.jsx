import { passPlans } from '../data/mockData';
import { useLanguage } from '../i18n/LanguageContext';
import styles from './PassPlansModal.module.css';

function PassPlansModal({ activePlanId, onSubscribe, onCancel, onClose }) {
  const { t, lang } = useLanguage();

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{t('정기권')}</h2>
          <button className={styles.closeBtn} onClick={onClose}>{t('닫기 ✕')}</button>
        </div>
        <p className={styles.subtitle}>{t('매주 같은 시간, 정기권으로 더 저렴하게 이용하세요.')}</p>

        <div className={styles.grid}>
          {passPlans.map((plan) => {
            const isActive = activePlanId === plan.id;
            return (
              <div
                key={plan.id}
                className={`${styles.card} ${plan.highlight ? styles.highlight : ''}`}
              >
                {plan.highlight && <div className={styles.badge}>{t('추천')}</div>}
                <h3>{t(plan.name)}</h3>
                <p className={styles.tagline}>{t(plan.tagline)}</p>

                <div className={styles.price}>
                  {lang === 'en'
                    ? <>₩{plan.price.toLocaleString()}<span> / mo</span></>
                    : <>{plan.price.toLocaleString()}<span>원 / 월</span></>}
                </div>
                <div className={styles.credits}>{t(plan.creditsLabel)}</div>

                <ul className={styles.features}>
                  {plan.features.map((f) => (
                    <li key={f}>{t(f)}</li>
                  ))}
                </ul>

                <button
                  className={`${styles.subscribeBtn} ${isActive ? styles.active : ''}`}
                  onClick={() => (isActive ? onCancel() : onSubscribe(plan.id))}
                >
                  {isActive ? t('구독 중 · 해지하기') : t('구독하기')}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default PassPlansModal;
