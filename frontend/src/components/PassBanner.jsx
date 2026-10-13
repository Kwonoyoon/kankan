import { useLanguage } from '../i18n/LanguageContext';
import styles from './HomeSections.module.css';

function PassBanner({ onOpenPass }) {
  const { t } = useLanguage();

  return (
    <section className={styles.section}>
      <div className="wrap">
        <div className={styles.banner}>
          <div>
            <h2>{t('매주 같은 시간, 정기권으로 더 저렴하게')}</h2>
            <p>{t('월 39,000원부터. 스탠다드 이상은 시간당 요금도 할인돼요.')}</p>
          </div>
          <button type="button" onClick={onOpenPass}>{t('정기권 보기')}</button>
        </div>
      </div>
    </section>
  );
}

export default PassBanner;
