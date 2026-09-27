import { concepts } from '../data/mockData';
import { useLanguage } from '../i18n/LanguageContext';
import styles from './ConceptPills.module.css';

function ConceptPills({ activeConcept, onSelect }) {
  const { t } = useLanguage();

  return (
    <section>
      <div className="wrap">
        <div className={styles.intro}>
          <h2>{t('공간을 둘러보세요')}</h2>
          <p>{t('밴드 합주부터 소규모 스터디, 촬영용 미팅룸까지. 목적에 맞는 공간을 시간 단위로 편하게 빌릴 수 있습니다.')}</p>
        </div>
        <div className={styles.pillRow}>
          {concepts.map((c) => (
            <button
              key={c.id}
              className={`${styles.pill} ${activeConcept === c.id ? styles.activePill : ''}`}
              onClick={() => onSelect(c.id === activeConcept ? null : c.id)}
            >
              {t(c.label)}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ConceptPills;
