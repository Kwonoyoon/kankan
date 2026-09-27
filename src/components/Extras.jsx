import { useLanguage } from '../i18n/LanguageContext';
import PlaceholderLink from './PlaceholderLink';
import styles from './Extras.module.css';

function Extras() {
  const { t } = useLanguage();

  return (
    <>
      <section>
        <div className={`wrap ${styles.story}`}>
          <div
            className={styles.storyImg}
            style={{ backgroundImage: 'url(/brand/2026.jpg)' }}
          />
          <div>
            <span className={styles.kicker}>{t('kany 이야기')}</span>
            <h2>2026</h2>
            <p>{t('필요한 만큼만 빌릴 수 있는 공간이 없다는 불편함에서 kany가 시작됐습니다. 하루 종일이 아니라, 딱 필요한 한 시간만.')}</p>
            <PlaceholderLink className={styles.linkCta}>kany story</PlaceholderLink>
          </div>
        </div>
      </section>
{/* 
      <section>
        <div className="wrap">
          <div className={styles.ctaBanner}>
            <h2>{t('예약은 부담없이, 취소는 간편하게')}</h2>
            <p>{t('이용 하루 전까지 무료로 취소할 수 있어요.')}</p>
            <a href="#spaces">{t('지금 예약하기')}</a>
          </div>
        </div>
      </section> */}
    </>
  );
}

export default Extras;
