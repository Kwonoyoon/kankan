import { useState } from 'react';
import { passPlans } from '../data/mockData';
import { useLanguage } from '../i18n/LanguageContext';
import styles from './PaymentModal.module.css';
import { CloseLabel } from './Icon';

// 결제수단은 고르기만 한다. 카드번호 같은 값을 입력받으면 이 화면이 그 값을 다뤄야 하는데,
// 실제 결제사(PG) 연동 전에 민감정보를 받는 입력칸부터 만들 이유가 없다. 연동하면 결제사 창이 대신 받는다.
const METHODS = [
  { id: 'card', label: '신용·체크카드' },
  { id: 'transfer', label: '계좌이체' },
  { id: 'kakao', label: '카카오페이' },
  { id: 'naver', label: '네이버페이' },
  { id: 'toss', label: '토스페이' },
];

// 결제가 실제로 일어나는 것처럼 보이도록 잠깐 기다린다. 서버 결제 API가 생기면 이 대기를 호출로 바꾼다.
const FAKE_PAYMENT_MS = 900;

function nextBillingDate(lang) {
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  return d.toLocaleDateString(lang === 'en' ? 'en-US' : 'ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
}

function PaymentModal({ planId, onPaid, onBack, onClose }) {
  const { t, lang } = useLanguage();
  const plan = passPlans.find((p) => p.id === planId);
  const [method, setMethod] = useState('card');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState('form');

  if (!plan) return null;

  const won = (n) => (lang === 'en' ? `₩${n.toLocaleString()}` : `${n.toLocaleString()}원`);

  function pay(e) {
    e.preventDefault();
    if (!agreed) {
      setError(t('결제 진행에 동의해 주세요.'));
      return;
    }
    setError('');
    setStep('processing');
    setTimeout(() => {
      onPaid(plan.id);
      setStep('done');
    }, FAKE_PAYMENT_MS);
  }

  return (
    <div className={styles.overlay} onClick={step === 'processing' ? undefined : onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        {step !== 'processing' && <button className={styles.closeBtn} onClick={onClose}><CloseLabel /></button>}

        {step === 'done' ? (
          <div className={styles.done}>
            <div className={styles.check} aria-hidden="true">✓</div>
            <h2>{t('결제가 완료됐어요')}</h2>
            <p>{t(plan.name)} · {won(plan.price)}</p>
            <p className={styles.muted}>{t('다음 결제일')} {nextBillingDate(lang)}</p>
            <button type="button" className={styles.payBtn} onClick={onClose}>{t('확인')}</button>
          </div>
        ) : (
          <form onSubmit={pay}>
            <h2>{t('결제하기')}</h2>
            <p className={styles.demo}>{t('데모 화면이에요. 실제로 결제되지 않아요.')}</p>

            <section className={styles.order}>
              <h3>{t('주문 정보')}</h3>
              <dl>
                <dt>{t('상품')}</dt><dd>{t('정기권')} · {t(plan.name)}</dd>
                <dt>{t('이용 내용')}</dt><dd>{t(plan.creditsLabel)}</dd>
                <dt>{t('결제 주기')}</dt><dd>{t('매월 자동 결제')}</dd>
                <dt>{t('다음 결제일')}</dt><dd>{nextBillingDate(lang)}</dd>
              </dl>
              <div className={styles.total}>
                <span>{t('결제 금액')}</span>
                <strong>{won(plan.price)}</strong>
              </div>
            </section>

            <fieldset className={styles.methods} disabled={step === 'processing'}>
              <legend>{t('결제수단')}</legend>
              {METHODS.map((m) => (
                <label key={m.id} className={method === m.id ? styles.picked : ''}>
                  <input type="radio" name="method" value={m.id} checked={method === m.id} onChange={() => setMethod(m.id)} />
                  {t(m.label)}
                </label>
              ))}
            </fieldset>

            <label className={styles.agree}>
              <input type="checkbox" checked={agreed} onChange={(e) => { setAgreed(e.target.checked); setError(''); }} />
              {t('주문 내용을 확인했고, 매월 자동 결제되며 언제든 해지할 수 있음에 동의합니다.')}
            </label>

            {error && <p className={styles.error} role="alert">{error}</p>}

            <div className={styles.actions}>
              <button type="button" className={styles.backBtn} onClick={onBack} disabled={step === 'processing'}>{t('플랜 다시 고르기')}</button>
              <button type="submit" className={styles.payBtn} disabled={step === 'processing'}>
                {step === 'processing' ? t('결제 중...') : `${won(plan.price)} ${t('결제하기')}`}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default PaymentModal;
