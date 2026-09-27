import { useEffect, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import styles from './Hero.module.css';

const SLIDE_INTERVAL_MS = 5000;
const heroSlides = ['/hero/practice-room.png', '/hero/meeting-room.png', '/hero/study-room.png'];

function Hero({ onOpenPass, onOpenSpaces }) {
  const { t } = useLanguage();
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveSlide((i) => (i + 1) % heroSlides.length);
    }, SLIDE_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <section className={styles.hero}>
      {heroSlides.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          className={`${styles.slide} ${i === activeSlide ? styles.slideActive : ''}`}
        />
      ))}
      <div className={styles.scrim} />
      <div className={`wrap ${styles.content}`}>
        <div className={styles.eyebrow}>{t('kany · 홍대 · 강남 · 건대')}</div>
        <h1>
          {t('kany에서,')}<br />
          <span className={styles.script}>{t('오늘 필요한 시간만')}</span>
        </h1>
        <p className={styles.season}>
          <b>{t('매일 07:00 – 24:00 운영')}</b> · {t('1시간 단위로 바로 예약')}
        </p>
        <div className={styles.ctas}>
          <button className={styles.primary} onClick={onOpenSpaces}>{t('지금 예약하기')}</button>
          <button className={styles.secondary} onClick={onOpenPass}>{t('정기권 구매하기')}</button>
        </div>
      </div>
    </section>
  );
}

export default Hero;
