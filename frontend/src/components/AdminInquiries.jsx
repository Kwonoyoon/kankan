import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { categoryLabel, formatDateTime } from '../lib/inquiry';
import styles from './AdminPage.module.css';

const FILTERS = [
  { id: 'OPEN', label: '답변 대기' },
  { id: '', label: '전체' },
];

function AdminInquiries() {
  const [status, setStatus] = useState('OPEN');
  const [loaded, setLoaded] = useState({ key: null, list: [] });
  const [drafts, setDrafts] = useState({});
  const [message, setMessage] = useState({ type: '', text: '' });
  const [version, setVersion] = useState(0);

  const key = `${status}|${version}`;
  const loading = loaded.key !== key;

  useEffect(() => {
    let cancelled = false;
    api(`/admin/inquiries${status ? `?status=${status}` : ''}`)
      .then((list) => { if (!cancelled) setLoaded({ key, list }); })
      .catch((err) => { if (!cancelled) setMessage({ type: 'error', text: err.message }); });
    return () => { cancelled = true; };
  }, [key, status]);

  // 답변 입력칸의 값: 아직 저장하지 않은 입력이 있으면 그것을, 없으면 서버에 저장된 답변을 보여준다.
  const draftOf = (q) => drafts[q.id] ?? q.answer ?? '';

  async function save(q) {
    const answer = draftOf(q).trim();
    if (!answer) {
      setMessage({ type: 'error', text: '답변 내용을 입력해주세요.' });
      return;
    }
    try {
      await api(`/admin/inquiries/${q.id}/answer`, { method: 'PUT', body: { answer } });
      setDrafts((all) => {
        const { [q.id]: _removed, ...rest } = all;
        return rest;
      });
      setVersion((v) => v + 1);
      setMessage({ type: 'ok', text: '답변을 저장했어요. 회원의 "내 문의"에 바로 보여요.' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
  }

  return (
    <section className={styles.panel}>
      <div className={styles.panelHead}>
        <h2>문의</h2>
        <div className={styles.tabs}>
          {FILTERS.map((f) => (
            <button
              key={f.label}
              type="button"
              className={`${styles.tab} ${f.id === status ? styles.tabOn : ''}`}
              onClick={() => setStatus(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
      {message.text && (
        <p className={message.type === 'ok' ? styles.okMsg : styles.error} role="alert">{message.text}</p>
      )}

      {loading && <p className={styles.empty}>불러오는 중…</p>}
      {!loading && loaded.list.length === 0 && (
        <p className={styles.empty}>{status === 'OPEN' ? '답변을 기다리는 문의가 없어요.' : '문의가 없어요.'}</p>
      )}

      <div className={styles.inquiryList}>
        {!loading && loaded.list.map((q) => (
          <article key={q.id} className={styles.inquiry}>
            <div className={styles.inquiryHead}>
              <span className={`${styles.statusBadge} ${q.status === 'ANSWERED' ? styles.statusDone : ''}`}>
                {q.status === 'ANSWERED' ? '답변 완료' : '답변 대기'}
              </span>
              <span className={styles.sub}>
                {categoryLabel(q.category)}{q.spaceName ? ` · ${q.spaceName}` : ''} · {q.userNickname} ({q.userEmail}) · {formatDateTime(q.createdAt)}
              </span>
            </div>
            <div className={styles.inquiryTitle}>{q.title}</div>
            <p className={styles.inquiryBody}>{q.content}</p>
            <textarea
              className={styles.answerBox}
              rows={3}
              maxLength={2000}
              placeholder="답변을 입력하세요"
              value={draftOf(q)}
              onChange={(e) => setDrafts((d) => ({ ...d, [q.id]: e.target.value }))}
            />
            <div className={styles.answerActions}>
              <button type="button" className={styles.saveBtn} onClick={() => save(q)}>
                {q.status === 'ANSWERED' ? '답변 수정' : '답변 등록'}
              </button>
              {q.answeredAt && <span className={styles.sub}>마지막 답변 {formatDateTime(q.answeredAt)}</span>}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default AdminInquiries;
