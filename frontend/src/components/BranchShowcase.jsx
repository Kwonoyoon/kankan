import { useLanguage } from '../i18n/LanguageContext';
import { useApp } from '../AppContext';
import styles from './HomeSections.module.css';

// 지점마다 대표 사진은 그 지점의 첫 번째 공간 사진을 쓴다. 지점 사진을 따로 관리하는 컬럼이 아직 없어서다.
function BranchShowcase({ onSelectBranch }) {
  const { t, lang } = useLanguage();
  const { branches, spaces } = useApp();

  if (branches.length === 0) return null;

  return (
    <section className={styles.section}>
      <div className="wrap">
        <div className={styles.head}>
          <span className={styles.kicker}>{t('지점')}</span>
          <h2>{t('가까운 지점에서 찾아보세요')}</h2>
        </div>
        <ul className={styles.branches}>
          {branches.map((b) => {
            const inBranch = spaces.filter((s) => s.branchId === b.id);
            return (
              <li key={b.id}>
                <button type="button" onClick={() => onSelectBranch(b.id)}>
                  <span
                    className={styles.branchImg}
                    style={{ backgroundImage: inBranch[0] ? `url(${inBranch[0].image})` : undefined }}
                  />
                  <span className={styles.branchBody}>
                    <strong>{t(b.name)}</strong>
                    <span>{t(b.address)}</span>
                    <em>{lang === 'en' ? `${inBranch.length} spaces` : `공간 ${inBranch.length}개`}</em>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export default BranchShowcase;
