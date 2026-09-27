import { stats } from '../data/mockData';
import { useLanguage } from '../i18n/LanguageContext';
import styles from './Stats.module.css';

function Stats() {
  const { t } = useLanguage();

  return (
    <section className={styles.stats}>
      <span className={styles.kicker}>{t('숫자로 보는 kany')}</span>
      <div className={`wrap ${styles.grid}`}>
        {stats.map((s) => (
          <div className={styles.stat} key={s.label}>
            <b>{s.value}</b>
            <span>{t(s.label)}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Stats;
