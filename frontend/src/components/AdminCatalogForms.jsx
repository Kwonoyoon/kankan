import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { ROOM_IMAGES } from '../lib/roomImages';
import styles from './AdminPage.module.css';

const EMPTY_SPACE = {
  branchId: '',
  name: '',
  description: '',
  capacity: '4',
  pricePerHour: '10000',
  conceptIds: [],
  amenities: '',
  image: ROOM_IMAGES[0].path,
};

const EMPTY_BRANCH = { name: '', address: '', openHour: '7', closeHour: '24' };

// 공간 추가 / 지점 추가 폼. 저장에 성공하면 onCreated를 불러서 위쪽 공간 목록을 다시 받게 한다.
function AdminCatalogForms({ onCreated }) {
  const [branches, setBranches] = useState([]);
  const [concepts, setConcepts] = useState([]);
  const [branchVersion, setBranchVersion] = useState(0);
  const [space, setSpace] = useState(EMPTY_SPACE);
  const [branch, setBranch] = useState(EMPTY_BRANCH);
  const [spaceMsg, setSpaceMsg] = useState({ type: '', text: '' });
  const [branchMsg, setBranchMsg] = useState({ type: '', text: '' });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all([api('/branches'), api('/concepts')])
      .then(([b, c]) => { if (!cancelled) { setBranches(b); setConcepts(c); } })
      .catch((err) => { if (!cancelled) setSpaceMsg({ type: 'error', text: err.message }); });
    return () => { cancelled = true; };
  }, [branchVersion]);

  // 지점을 아직 안 골랐으면 첫 지점을 기본으로 쓴다. (state를 따로 채우지 않고 화면에서 계산한다)
  const chosenBranch = space.branchId || branches[0]?.id || '';

  function toggleConcept(id) {
    setSpace((s) => ({
      ...s,
      conceptIds: s.conceptIds.includes(id) ? s.conceptIds.filter((c) => c !== id) : [...s.conceptIds, id],
    }));
  }

  async function submitSpace(e) {
    e.preventDefault();
    if (space.conceptIds.length === 0) {
      setSpaceMsg({ type: 'error', text: '용도(컨셉)를 하나 이상 골라주세요.' });
      return;
    }
    setBusy(true);
    setSpaceMsg({ type: '', text: '' });
    try {
      const created = await api('/admin/spaces', {
        method: 'POST',
        body: {
          branchId: chosenBranch,
          name: space.name,
          description: space.description,
          capacity: Number(space.capacity),
          pricePerHour: Number(space.pricePerHour),
          conceptIds: space.conceptIds,
          amenities: space.amenities.split(',').map((a) => a.trim()).filter(Boolean),
          image: space.image,
        },
      });
      setSpace(EMPTY_SPACE);
      setSpaceMsg({ type: 'ok', text: `${created.name}을(를) 추가했어요. 사이트에 바로 보여요.` });
      onCreated();
    } catch (err) {
      setSpaceMsg({ type: 'error', text: err.message });
    } finally {
      setBusy(false);
    }
  }

  async function submitBranch(e) {
    e.preventDefault();
    setBusy(true);
    setBranchMsg({ type: '', text: '' });
    try {
      const created = await api('/admin/branches', {
        method: 'POST',
        body: {
          name: branch.name,
          address: branch.address,
          openHour: Number(branch.openHour),
          closeHour: Number(branch.closeHour),
        },
      });
      setBranch(EMPTY_BRANCH);
      setBranchVersion((v) => v + 1);
      setBranchMsg({ type: 'ok', text: `${created.name}을(를) 추가했어요. 이제 이 지점에 공간을 추가할 수 있어요.` });
    } catch (err) {
      setBranchMsg({ type: 'error', text: err.message });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={styles.formsGrid}>
      <form className={styles.panel} onSubmit={submitSpace}>
        <h2>공간 추가</h2>
        <label className={styles.formField}>
          지점
          <select value={chosenBranch} onChange={(e) => setSpace({ ...space, branchId: e.target.value })}>
            {branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </label>
        <label className={styles.formField}>
          공간 이름
          <input type="text" value={space.name} maxLength={100} required onChange={(e) => setSpace({ ...space, name: e.target.value })} />
        </label>
        <label className={styles.formField}>
          설명
          <textarea rows={3} value={space.description} maxLength={1000} onChange={(e) => setSpace({ ...space, description: e.target.value })} />
        </label>
        <div className={styles.twoCols}>
          <label className={styles.formField}>
            정원(명)
            <input type="number" min="1" max="200" value={space.capacity} required onChange={(e) => setSpace({ ...space, capacity: e.target.value })} />
          </label>
          <label className={styles.formField}>
            시간당 가격(원)
            <input type="number" min="0" max="500000" step="500" value={space.pricePerHour} required onChange={(e) => setSpace({ ...space, pricePerHour: e.target.value })} />
          </label>
        </div>
        <div className={styles.formField}>
          용도 (최대 3개)
          <div className={styles.chips}>
            {concepts.map((c) => {
              const on = space.conceptIds.includes(c.id);
              return (
                <button
                  key={c.id}
                  type="button"
                  className={`${styles.hourBtn} ${on ? styles.hourOn : ''}`}
                  aria-pressed={on}
                  disabled={!on && space.conceptIds.length >= 3}
                  onClick={() => toggleConcept(c.id)}
                >
                  {c.name}
                </button>
              );
            })}
          </div>
        </div>
        <label className={styles.formField}>
          편의시설 (쉼표로 구분)
          <input type="text" value={space.amenities} placeholder="예: 드럼, 앰프, 와이파이" onChange={(e) => setSpace({ ...space, amenities: e.target.value })} />
        </label>
        <label className={styles.formField}>
          이미지
          <select value={space.image} onChange={(e) => setSpace({ ...space, image: e.target.value })}>
            {ROOM_IMAGES.map((img) => <option key={img.path} value={img.path}>{img.label}</option>)}
          </select>
        </label>
        <img className={styles.preview} src={space.image} alt="" />
        {spaceMsg.text && (
          <p className={spaceMsg.type === 'ok' ? styles.okMsg : styles.error} role="alert">{spaceMsg.text}</p>
        )}
        <button type="submit" className={styles.primary} disabled={busy}>공간 추가</button>
      </form>

      <form className={styles.panel} onSubmit={submitBranch}>
        <h2>지점 추가</h2>
        <label className={styles.formField}>
          지점 이름
          <input type="text" value={branch.name} maxLength={100} required onChange={(e) => setBranch({ ...branch, name: e.target.value })} />
        </label>
        <label className={styles.formField}>
          주소
          <input type="text" value={branch.address} maxLength={255} required onChange={(e) => setBranch({ ...branch, address: e.target.value })} />
        </label>
        <div className={styles.twoCols}>
          <label className={styles.formField}>
            오픈 시각
            <input type="number" min="0" max="23" value={branch.openHour} required onChange={(e) => setBranch({ ...branch, openHour: e.target.value })} />
          </label>
          <label className={styles.formField}>
            마감 시각
            <input type="number" min="1" max="24" value={branch.closeHour} required onChange={(e) => setBranch({ ...branch, closeHour: e.target.value })} />
          </label>
        </div>
        <p className={styles.note}>
          예약 화면의 시간 칸은 아직 07:00~24:00으로 고정이라, 다른 운영 시간을 넣으면 서버가 그 밖의 시간 예약을 거절해요.
        </p>
        {branchMsg.text && (
          <p className={branchMsg.type === 'ok' ? styles.okMsg : styles.error} role="alert">{branchMsg.text}</p>
        )}
        <button type="submit" className={styles.primary} disabled={busy}>지점 추가</button>
      </form>
    </div>
  );
}

export default AdminCatalogForms;
