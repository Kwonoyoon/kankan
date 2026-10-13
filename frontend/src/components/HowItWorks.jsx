import { useLanguage } from '../i18n/LanguageContext';
import styles from './HomeSections.module.css';

const STEPS = [
  { title: '공간 찾기', desc: '날짜·시간·용도로 비어 있는 공간을 찾아요. 지금 바로 쓸 수 있는 곳은 NOW 표시가 떠요.' },
  { title: '1시간부터 예약', desc: '필요한 시간만 골라 예약해요. 정기권이 있으면 더 저렴하게 이용할 수 있어요.' },
  { title: '도착해서 바로 이용', desc: '예약한 시간에 맞춰 도착하면 끝이에요. 이용 하루 전까지는 무료로 취소할 수 있어요.' },
];

function HowItWorks() {
  const { t } = useLanguage();

  return (
    <section className={styles.section}>
      <div className="wrap">
        <div className={styles.head}>
          <span className={styles.kicker}>{t('이용 방법')}</span>
          <h2>{t('세 단계면 예약 끝')}</h2>
        </div>
        <ol className={styles.steps}>
          {STEPS.map((s, i) => (
            <li key={s.title}>
              <span className={styles.stepNo}>{i + 1}</span>
              <h3>{t(s.title)}</h3>
              <p>{t(s.desc)}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default HowItWorks;
