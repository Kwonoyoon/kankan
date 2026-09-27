import { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import styles from './LoginModal.module.css';

function LoginModal({ onClose, onLogin }) {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    onLogin({ email, nickname });
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>{t('닫기 ✕')}</button>

        <h3>{t('로그인')}</h3>
        <p className={styles.subInfo}>{t('예약과 정기권 구독은 로그인 후 이용할 수 있어요.')}</p>

        <form onSubmit={handleSubmit}>
          <label className={styles.field}>
            {t('이메일')}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className={styles.field}>
            {t('닉네임')}
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
            />
          </label>

          <button type="submit" className={styles.confirmBtn}>{t('로그인')}</button>
        </form>
      </div>
    </div>
  );
}

export default LoginModal;
