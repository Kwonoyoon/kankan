import { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import styles from './LoginModal.module.css';
import { CloseLabel } from './Icon';

function LoginModal({ onClose, onSubmit }) {
  const { t } = useLanguage();
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const isSignup = mode === 'signup';

  function switchMode(next) {
    setMode(next);
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await onSubmit(mode, { email, password, nickname });
    } catch (err) {
      // 서버가 준 문구를 그대로 보여준다. (이메일 중복, 비밀번호 틀림 등)
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}><CloseLabel /></button>

        <h3>{isSignup ? t('회원가입') : t('로그인')}</h3>
        <p className={styles.subInfo}>{t('예약과 정기권 구독은 로그인 후 이용할 수 있어요.')}</p>

        <form onSubmit={handleSubmit}>
          <label className={styles.field}>
            {t('이메일')}
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
          </label>

          <label className={styles.field}>
            {t('비밀번호')}
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={isSignup ? 8 : undefined}
              autoComplete={isSignup ? 'new-password' : 'current-password'}
            />
            {isSignup && <span className={styles.hint}>{t('8자 이상')}</span>}
          </label>

          {isSignup && (
            <label className={styles.field}>
              {t('닉네임')}
              <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} required maxLength={20} />
            </label>
          )}

          {error && <p className={styles.error} role="alert">{error}</p>}

          <button type="submit" className={styles.confirmBtn} disabled={busy}>
            {isSignup ? t('가입하고 시작하기') : t('로그인')}
          </button>
        </form>

        <p className={styles.switch}>
          {isSignup ? t('이미 계정이 있나요?') : t('아직 계정이 없나요?')}{' '}
          <button type="button" onClick={() => switchMode(isSignup ? 'login' : 'signup')}>
            {isSignup ? t('로그인') : t('회원가입')}
          </button>
        </p>
      </div>
    </div>
  );
}

export default LoginModal;
