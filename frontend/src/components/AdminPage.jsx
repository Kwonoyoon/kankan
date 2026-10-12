import { useState } from 'react';
import AdminStats from './AdminStats';
import AdminReservations from './AdminReservations';
import AdminSpaces from './AdminSpaces';
import AdminBlocks from './AdminBlocks';
import AdminInquiries from './AdminInquiries';
import styles from './AdminPage.module.css';

// 관리자 화면은 직원만 쓰는 내부 도구라 한국어 고정이다. (사이트 번역 사전 t()를 쓰지 않는다)

const TABS = [
  { id: 'stats', label: '통계', View: AdminStats },
  { id: 'reservations', label: '예약·회원', View: AdminReservations },
  { id: 'spaces', label: '공간 관리', View: AdminSpaces },
  { id: 'blocks', label: '예약 막기', View: AdminBlocks },
  { id: 'inquiries', label: '문의', View: AdminInquiries },
];

function AdminLogin({ user, onLogin, onLogout }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await onLogin({ email, password });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className={styles.loginCard} onSubmit={handleSubmit}>
      <h2>관리자 로그인</h2>
      {user && (
        <p className={styles.notice}>
          {user.nickname} 계정은 관리자 권한이 없어요. 관리자 계정으로 다시 로그인하세요.
          <button type="button" onClick={onLogout}>로그아웃</button>
        </p>
      )}
      <label>
        이메일
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="username" />
      </label>
      <label>
        비밀번호
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
      </label>
      {error && <p className={styles.error} role="alert">{error}</p>}
      <button type="submit" className={styles.primary} disabled={busy}>로그인</button>
    </form>
  );
}

function AdminTabs() {
  const [tab, setTab] = useState(TABS[0].id);
  const { View } = TABS.find((t) => t.id === tab);

  return (
    <>
      <nav className={styles.tabs} aria-label="관리자 메뉴">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`${styles.tab} ${t.id === tab ? styles.tabOn : ''}`}
            aria-current={t.id === tab ? 'page' : undefined}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>
      {/* key를 탭 id로 줘서 탭을 옮길 때마다 새로 그린다. 그래야 다른 탭에서 바꾼 값(가격·막기)이 다시 불러와진다. */}
      <View key={tab} />
    </>
  );
}

function AdminPage({ user, onLogin, onLogout, onExit }) {
  const isAdmin = user?.role === 'ADMIN';

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        {/* 사이트 메인의 로고와 같은 자리·같은 역할이다. 로고를 누르면 사이트로 돌아간다. (별도의 "사이트로" 버튼은 없앴다) */}
        <button type="button" className={styles.brand} onClick={onExit} aria-label="kany 사이트로 이동" title="사이트로 이동">
          kany <span>관리자</span>
        </button>
        <div className={styles.topRight}>
          {user && <span className={styles.who}>{user.nickname} ({user.email})</span>}
          {user && <button type="button" onClick={onLogout}>로그아웃</button>}
        </div>
      </header>
      <main className={styles.main}>
        {isAdmin ? <AdminTabs /> : <AdminLogin user={user} onLogin={onLogin} onLogout={onLogout} />}
      </main>
    </div>
  );
}

export default AdminPage;
