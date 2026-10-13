import { useEffect, useState } from 'react';
import { getTimeSlots, todayISODate } from '../lib/reservations';
import { useLanguage } from '../i18n/LanguageContext';
import { useApp } from '../AppContext';
import { Icon } from './Icon';
import styles from './Hero.module.css';

const SLIDE_INTERVAL_MS = 6000;
// 배경은 사진을 많이 흐리게 해서 분위기만 남긴다. 선명한 사진은 오른쪽 콜라주에서 따로 보여준다.
const backdrops = ['/hero/practice-room.png', '/hero/meeting-room.png', '/hero/study-room.png'];

const timeSlots = getTimeSlots();
const PEOPLE_OPTIONS = [1, 2, 3, 4, 5, 6, 8, 10, 12, 20];

// 빠른 선택 칩. 누르면 "공간 둘러보기"가 그 조건으로 걸러진 채 열린다.
const QUICK_CHIPS = [
  { label: '1만원 이하', filters: { maxPrice: '10000' } },
  { label: '방음', filters: { amenity: '방음' } },
  { label: '빔프로젝터', filters: { amenity: '빔프로젝터' } },
  { label: '주차', filters: { amenity: '주차' } },
];

function Hero({ onOpenPass, onSearch }) {
  const { t, lang } = useLanguage();
  const { spaces, concepts } = useApp();
  const [form, setForm] = useState({ date: todayISODate(), time: '', people: '', concept: '' });
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setSlide((i) => (i + 1) % backdrops.length), SLIDE_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  const minPrice = spaces.length ? Math.min(...spaces.map((s) => s.pricePerHour)) : 0;

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function submit(e) {
    e.preventDefault();
    onSearch(form);
  }

  return (
    <section className={styles.hero}>
      {backdrops.map((src, i) => (
        <img key={src} src={src} alt="" aria-hidden="true" className={`${styles.backdrop} ${i === slide ? styles.backdropOn : ''}`} />
      ))}
      <div className={styles.scrim} />

      <div className={styles.inner}>
        <div className={styles.copy}>
          <h1>
            {t('오늘 필요한 시간만')}
            <em>{t('비어 있는 공간을 찾아드려요')}</em>
          </h1>
          <p className={styles.lead}>
            {t('홍대·강남·건대·성수·신촌, 합주실부터 스터디룸·녹음부스·파티룸까지. 1시간 단위로 바로 예약하세요.')}
          </p>

          <form className={styles.widget} onSubmit={submit}>
            <div className={styles.row}>
              <label>
                {t('날짜')}
                <input type="date" value={form.date} min={todayISODate()} onChange={(e) => set('date', e.target.value)} required />
              </label>
              <label>
                {t('시간')}
                <select value={form.time} onChange={(e) => set('time', e.target.value)}>
                  <option value="">{t('시간 선택')}</option>
                  {timeSlots.map((slot) => <option key={slot} value={slot}>{slot}</option>)}
                </select>
              </label>
              <label>
                {t('인원')}
                <select value={form.people} onChange={(e) => set('people', e.target.value)}>
                  <option value="">{t('상관없음')}</option>
                  {PEOPLE_OPTIONS.map((n) => (
                    <option key={n} value={n}>{lang === 'en' ? `${n}+` : `${n}명 이상`}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className={styles.row2}>
              <label>
                {t('용도')}
                <select value={form.concept} onChange={(e) => set('concept', e.target.value)}>
                  <option value="">{t('전체')}</option>
                  {concepts.map((c) => <option key={c.id} value={c.id}>{t(c.label)}</option>)}
                </select>
              </label>
              <button type="submit" className={styles.go}>
                {t('빈 공간 찾기')}
                <Icon name="arrowRight" size={18} />
              </button>
            </div>
            <div className={styles.chips}>
              <button type="button" className={`${styles.chip} ${styles.nowChip}`} onClick={() => onSearch({ nowOnly: true })}>
                NOW {t('지금 바로')}
              </button>
              {QUICK_CHIPS.map((c) => (
                <button key={c.label} type="button" className={styles.chip} onClick={() => onSearch(c.filters)}>
                  {t(c.label)}
                </button>
              ))}
            </div>
          </form>

          <button type="button" className={styles.passLink} onClick={onOpenPass}>
            {t('정기권으로 더 저렴하게')}
            <Icon name="arrowRight" size={16} />
          </button>
        </div>

        <div className={styles.collage} aria-hidden="true">
          <img className={`${styles.photo} ${styles.p1}`} src="/rooms/band-practice.jpg" alt="" />
          <img className={`${styles.photo} ${styles.p2}`} src="/rooms/studyroom.jpg" alt="" />
          <img className={`${styles.photo} ${styles.p3}`} src="/rooms/shoot-studio.jpg" alt="" />
          <div className={styles.tag}>
            <span>{t('시간당')}</span>
            <b>{minPrice.toLocaleString()}{lang === 'en' ? '+' : '원~'}</b>
            <span>{lang === 'en' ? `${spaces.length} spaces` : `${spaces.length}개 공간`}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
