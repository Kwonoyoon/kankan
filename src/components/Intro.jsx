import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import styles from './Intro.module.css';

const SHOW_MS = 2400;
// 사라지는 CSS 전환 시간(.5s)과 같아야 한다. 다르면 전환이 끝나기 전에 화면이 사라지거나 투명한 채로 남는다.
const FADE_MS = 500;

function Intro({ onDone }) {
  const { t } = useLanguage();
  const [leaving, setLeaving] = useState(false);
  const timers = useRef([]);

  function finish() {
    setLeaving(true);
    timers.current.push(setTimeout(onDone, FADE_MS));
  }

  useEffect(() => {
    timers.current.push(setTimeout(finish, SHOW_MS));
    // 시작 화면이 떠 있는 동안 뒤의 메인 화면이 스크롤되지 않게 막는다.
    document.body.style.overflow = 'hidden';
    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
      document.body.style.overflow = '';
    };
    // finish는 렌더마다 새로 만들어지지만 항상 같은 일을 하므로 타이머는 한 번만 건다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`${styles.intro} ${leaving ? styles.leaving : ''}`} role="dialog" aria-label="kany">
      <div className={styles.logo}>kany</div>
      <div className={styles.bar} />
      <div className={styles.tag}>{t('오늘 필요한 시간만')}</div>
      <button className={styles.skip} onClick={finish}>{t('건너뛰기')}</button>
    </div>
  );
}

export default Intro;
