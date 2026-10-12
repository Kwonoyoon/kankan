import { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import useA11y from '../hooks/useA11y';
import { Icon } from './Icon';
import styles from './A11yWidget.module.css';

function A11yWidget() {
  const { lang, toggleLang, t } = useLanguage();
  const { settings, toggle } = useA11y();
  const [open, setOpen] = useState(true);

  const options = [
    { key: 'large', icon: 'textSize', label: t('큰 글씨 모드') },
    { key: 'dark', icon: settings.dark ? 'sun' : 'moon', label: t('다크 모드') },
    { key: 'contrast', icon: 'contrast', label: t('고대비 모드') },
  ];

  if (!open) {
    return (
      <button type="button" className={styles.openBtn} onClick={() => setOpen(true)} aria-label={t('접근성 메뉴 열기')} title={t('접근성 메뉴 열기')}>
        <Icon name="accessibility" size={22} />
      </button>
    );
  }

  return (
    <div className={styles.widget} role="group" aria-label={t('접근성 설정')}>
      <button type="button" className={styles.btn} onClick={toggleLang} title={t('언어')} aria-label={t('언어')}>
        <span className={styles.lang}>{lang === 'ko' ? 'KO' : 'EN'}</span>
      </button>
      {options.map((o) => (
        <button
          key={o.key}
          type="button"
          className={`${styles.btn} ${settings[o.key] ? styles.active : ''}`}
          onClick={() => toggle(o.key)}
          aria-pressed={settings[o.key]}
          title={o.label}
          aria-label={o.label}
        >
          <Icon name={o.icon} size={21} />
        </button>
      ))}
      <button type="button" className={styles.close} onClick={() => setOpen(false)} aria-label={t('접근성 메뉴 접기')} title={t('접근성 메뉴 접기')}>
        <Icon name="close" size={15} />
      </button>
    </div>
  );
}

export default A11yWidget;
