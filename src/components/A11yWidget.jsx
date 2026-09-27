import { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import styles from './A11yWidget.module.css';

function A11yWidget() {
  const { lang, toggleLang, t } = useLanguage();
  const [visible, setVisible] = useState(true);
  const [largeText, setLargeText] = useState(false);
  const [dark, setDark] = useState(false);
  const [contrastOn, setContrastOn] = useState(true);

  return (
    <>
      <div className={`${styles.widget} ${visible ? '' : styles.hidden}`}>
        <button
          className={styles.btn}
          title={t('언어')}
          onClick={toggleLang}
        >
          {lang === 'ko' ? '🇰🇷' : '🇬🇧'}
        </button>
        <button
          className={`${styles.btn} ${largeText ? styles.active : ''}`}
          title={t('큰 글씨 모드')}
          onClick={() => setLargeText((v) => !v)}
        >
          🧍
        </button>
        <button
          className={`${styles.btn} ${dark ? styles.active : ''}`}
          title={t('다크 모드')}
          onClick={() => setDark((v) => !v)}
        >
          🌙
        </button>
        <button
          className={`${styles.btn} ${styles.power}`}
          title={t('고대비 모드')}
          onClick={() => setContrastOn((v) => !v)}
        >
          <span className={styles.dot}>⏻</span>
          {contrastOn ? 'ON' : 'OFF'}
        </button>
        <button className={styles.close} onClick={() => setVisible(false)}>✕</button>
      </div>

      {!visible && (
        <button className={styles.openBtn} onClick={() => setVisible(true)}>⚙️</button>
      )}
    </>
  );
}

export default A11yWidget;
