import { branches } from '../data/mockData';
import { useLanguage } from '../i18n/LanguageContext';
import styles from './Branches.module.css';

// 메인 페이지가 아니라 Drawer의 "공간 둘러보기" 탭 안에 들어가는 목록이라
// section/wrap 없이 리스트만 그린다.
function Branches() {
  const { t } = useLanguage();

  return (
    <ul className={styles.list}>
      {branches.map((b) => (
        <li className={styles.item} key={b.id}>
          <h4>{t(b.name)}</h4>
          <p>{t(b.address)}</p>
        </li>
      ))}
    </ul>
  );
}

export default Branches;
