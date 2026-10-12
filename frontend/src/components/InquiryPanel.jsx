import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { INQUIRY_CATEGORIES, categoryLabel, formatDateTime } from '../lib/inquiry';
import { useLanguage } from '../i18n/LanguageContext';
import { useApp } from '../AppContext';
import styles from './InquiryPanel.module.css';

const EMPTY_FORM = { category: 'RESERVATION', spaceId: '', title: '', content: '' };

function InquiryPanel() {
  const { t } = useLanguage();
  const { user, spaces, requireAuth } = useApp();
  const userId = user?.id ?? null;

  // 목록에 "누구의 것인지"를 같이 저장한다. 로그아웃하거나 계정을 바꾼 직후 이전 사람의 문의가 남아 보이지 않게 하려는 것이다.
  const [loaded, setLoaded] = useState({ userId: null, list: [] });
  const [version, setVersion] = useState(0);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!userId) return undefined;
    let cancelled = false;
    api('/inquiries/me')
      .then((list) => { if (!cancelled) setLoaded({ userId, list }); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [userId, version]);

  const list = loaded.userId === userId ? loaded.list : [];

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
    setSent(false);
  }

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api('/inquiries', {
        method: 'POST',
        body: { category: form.category, spaceId: form.spaceId || null, title: form.title, content: form.content },
      });
      setForm(EMPTY_FORM);
      setSent(true);
      setVersion((v) => v + 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (!user) {
    return (
      <div className={styles.guest}>
        <p>{t('문의는 로그인 후 남길 수 있어요. 답변은 이 화면에서 확인할 수 있어요.')}</p>
        <button type="button" className={styles.primary} onClick={() => requireAuth(() => {})}>{t('로그인')}</button>
      </div>
    );
  }

  return (
    <div>
      <h4 className={styles.heading}>{t('1:1 문의')}</h4>
      <form className={styles.form} onSubmit={submit}>
        <div className={styles.row}>
          <label>
            {t('문의 종류')}
            <select value={form.category} onChange={(e) => set('category', e.target.value)}>
              {INQUIRY_CATEGORIES.map((c) => <option key={c.id} value={c.id}>{t(c.label)}</option>)}
            </select>
          </label>
          <label>
            {t('관련 공간 (선택)')}
            <select value={form.spaceId} onChange={(e) => set('spaceId', e.target.value)}>
              <option value="">{t('선택 안 함')}</option>
              {spaces.map((s) => <option key={s.id} value={s.id}>{t(s.name)}</option>)}
            </select>
          </label>
        </div>
        <label>
          {t('제목')}
          <input type="text" value={form.title} maxLength={100} onChange={(e) => set('title', e.target.value)} required />
        </label>
        <label>
          {t('내용')}
          <textarea value={form.content} maxLength={2000} rows={5} onChange={(e) => set('content', e.target.value)} required />
        </label>
        {error && <p className={styles.error} role="alert">{error}</p>}
        {sent && <p className={styles.ok} role="status">{t('문의를 남겼어요. 답변이 달리면 아래에서 확인할 수 있어요.')}</p>}
        <button type="submit" className={styles.primary} disabled={busy}>{t('문의 남기기')}</button>
      </form>

      <h4 className={styles.heading}>{t('내 문의')} {list.length > 0 && `(${list.length})`}</h4>
      {list.length === 0 ? (
        <p className={styles.empty}>{t('남긴 문의가 없어요.')}</p>
      ) : (
        <div className={styles.cards}>
          {list.map((q) => (
            <article key={q.id} className={styles.card}>
              <div className={styles.cardHead}>
                <span className={`${styles.badge} ${q.status === 'ANSWERED' ? styles.answered : ''}`}>
                  {q.status === 'ANSWERED' ? t('답변 완료') : t('답변 대기')}
                </span>
                <span className={styles.meta}>
                  {t(categoryLabel(q.category))}{q.spaceName ? ` · ${t(q.spaceName)}` : ''} · {formatDateTime(q.createdAt)}
                </span>
              </div>
              <div className={styles.title}>{q.title}</div>
              <p className={styles.content}>{q.content}</p>
              {q.answer && (
                <div className={styles.answer}>
                  <div className={styles.answerHead}>{t('운영팀 답변')} · {formatDateTime(q.answeredAt)}</div>
                  <p>{q.answer}</p>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default InquiryPanel;
