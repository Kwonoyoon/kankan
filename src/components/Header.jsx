import { useEffect, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import styles from './Header.module.css';

const SOLID_AFTER_PX = 40;

function Header({ onMenuOpen, onOpenSpaces, user, onLogout, onLoginClick }) {
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > SOLID_AFTER_PX);
    }
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`${styles.topbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`wrap ${styles.inner}`}>
        <div className={styles.logo}>kany</div>
        <div className={styles.right}>
          {user ? (
            <button className={styles.authLink} onClick={onLogout}>
              {user.nickname} · {t('로그아웃')}
            </button>
          ) : (
            <button className={styles.authLink} onClick={onLoginClick}>{t('로그인')}</button>
          )}
          <button className={styles.pillCta} onClick={onOpenSpaces}>{t('지금 예약하기')}</button>
          <button className={styles.menuToggle} onClick={onMenuOpen}>
            <span className={styles.bars}><span /><span /><span /></span>
            {t('메뉴')}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
