import { useLanguage } from '../i18n/LanguageContext';
import styles from './HomeSections.module.css';

const ITEMS = [
  { q: '예약은 최소 몇 시간부터 가능한가요?', a: '1시간 단위로 예약할 수 있어요. 연속된 시간을 여러 번 예약해도 돼요.' },
  { q: '취소와 환불은 어떻게 되나요?', a: '이용 1일 전까지는 100% 환불돼요. 당일 시작 3시간 전까지는 50%, 그 이후에는 환불되지 않아요.' },
  { q: '정기권은 언제든 해지할 수 있나요?', a: '네, 마이페이지에서 언제든 해지할 수 있어요. 해지해도 이미 결제한 기간 동안은 이용할 수 있어요.' },
  { q: '악기나 장비를 빌릴 수 있나요?', a: '합주실의 드럼·앰프·마이크처럼 공간에 설치된 장비는 이용 요금에 포함돼 있어요. 스틱이나 케이블 같은 개인 소모품은 직접 챙겨 오세요.' },
  { q: '인원이 정원보다 많으면 어떻게 하나요?', a: '안전과 쾌적함을 위해 정원을 넘겨서는 입장할 수 없어요. 인원이 많다면 정원이 더 큰 공간을 골라 주세요.' },
];

// <details>는 눌러서 열고 닫는 동작을 브라우저가 해 준다. 상태를 직접 관리하지 않아도 되고 키보드로도 열린다.
function Faq() {
  const { t } = useLanguage();

  return (
    <section className={styles.section}>
      <div className={`wrap ${styles.faqWrap}`}>
        <div className={styles.head}>
          <span className={styles.kicker}>FAQ</span>
          <h2>{t('자주 묻는 질문')}</h2>
        </div>
        <div className={styles.faq}>
          {ITEMS.map((it) => (
            <details key={it.q}>
              <summary>{t(it.q)}</summary>
              <p>{t(it.a)}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Faq;
