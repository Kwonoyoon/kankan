import { useLanguage } from '../i18n/LanguageContext';
import PlaceholderLink from './PlaceholderLink';
import styles from './Footer.module.css';

function Footer({ onOpenDrawer, onOpenPassPlans, onOpenSpaces }) {
  const { t } = useLanguage();

  return (
    <footer className={styles.footer}>
      <div className="wrap">
        <div className={styles.grid}>
          <div className={styles.brand}>
            <div className={styles.logo}>kany</div>
            <p>{t('필요한 시간만큼 빌리는 공유공간 예약 플랫폼. 합주실부터 스터디룸, 미팅룸까지.')}</p>
          </div>
          <div>
              <h5>{t('유용한 링크')}</h5>
              <ul>
                <li><PlaceholderLink>{t('자주 묻는 질문')}</PlaceholderLink></li>
                <li><button onClick={() => onOpenDrawer('howto')}>{t('이용 가이드')}</button></li>
                <li><button onClick={() => onOpenDrawer('live')}>{t('공지사항')}</button></li>
                <li><button onClick={() => onOpenDrawer('howto')}>{t('이용 Tip')}</button></li>
              </ul>
            </div>
            <div>
            <h5>{t('고객센터')}</h5>
            <ul>
              <li><a href="mailto:help@kany.kr">help@kany.kr</a></li>
              <li><a href="tel:1544-0000">1544-0000</a></li>
              <li><PlaceholderLink>{t('1:1 문의')}</PlaceholderLink></li>
            </ul>
          </div>
          <div>
            <h5>{t('예약')}</h5>
            <ul>
              <li><button onClick={onOpenSpaces}>{t('지금 예약하기')}</button></li>
              <li><button onClick={onOpenPassPlans}>{t('정기권 구매하기')}</button></li>
            </ul>
          </div>
        </div>
        <div className={styles.a11yNote}>{t('웹 접근성 : 일부 미흡, 개선 진행 중')}</div>
        <div className={styles.bottom}>
          <span>{t('kany 2026 — 포트폴리오 프로토타입')}</span>
          <div className={styles.legalLinks}>
            <PlaceholderLink>{t('쿠키 정책')}</PlaceholderLink>
            <PlaceholderLink>{t('개인정보처리방침')}</PlaceholderLink>
            <PlaceholderLink>{t('이용약관')}</PlaceholderLink>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
