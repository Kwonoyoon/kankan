import { useEffect, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import styles from './Header.module.css';

const SOLID_AFTER_PX = 40;

// solid: 히어로(어두운 사진) 위에 얹히지 않는 화면(상세, 마이페이지)에서는 처음부터 불투명하게 둔다.
// 투명한 채로 두면 흰 글씨가 밝은 배경 위에서 안 보인다.
function Header({ onMenuOpen, onOpenSpaces, user, onLogout, onLoginClick, onAdmin, onMyPage, onHome, solid = false }) {
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
    <header className={`${styles.topbar} ${scrolled || solid ? styles.scrolled : ''}`}>
      <div className={`wrap ${styles.inner}`}>
        <button type="button" className={styles.logo} onClick={onHome} aria-label="kany home">kany</button>
        <div className={styles.right}>
          {user?.role === 'ADMIN' && (
            <button className={styles.authLink} onClick={onAdmin}>{t('관리자')}</button>
          )}
          {user ? (
            <>
              <button className={styles.authLink} onClick={onMyPage} title={t('마이페이지')}>
                {user.nickname}{t('님')}
              </button>
              <button className={styles.authLink} onClick={onLogout}>{t('로그아웃')}</button>
            </>
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
