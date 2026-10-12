import { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import styles from './CookieBar.module.css';

function CookieBar() {
  const { t } = useLanguage();
  const [hidden, setHidden] = useState(false);

  return (
    <div className={`${styles.bar} ${hidden ? styles.hidden : ''}`}>
      <p>{t('더 나은 서비스를 위해 쿠키를 사용합니다. 통계·환경설정 목적의 쿠키 저장에 동의하시겠어요?')}</p>
      <div className={styles.actions}>
        <button className={styles.decline} onClick={() => setHidden(true)}>{t('거부')}</button>
        <button className={styles.accept} onClick={() => setHidden(true)}>{t('수락')}</button>
      </div>
    </div>
  );
}

export default CookieBar;
