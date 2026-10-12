import { useState } from 'react';
import { getTimeSlots, todayISODate, isSlotAvailable } from '../lib/reservations';
import { useLanguage } from '../i18n/LanguageContext';
import { useApp } from '../AppContext';
import useBookedSlots from '../hooks/useBookedSlots';
import SpaceCard from './SpaceCard';
import BookingModal from './BookingModal';
import styles from './SpacesModal.module.css';
import { CloseLabel } from './Icon';

const timeSlots = getTimeSlots();

// 가격 필터는 직접 입력이 아니라 구간 선택으로 한다. 숫자를 입력하게 하면 오타와 빈 값 처리가 늘어나는 데 비해 얻는 게 적다.
const PRICE_LIMITS = [10000, 15000, 20000, 30000];

const SORTS = [
  { id: 'recommend', label: '추천순' },
  { id: 'priceAsc', label: '낮은 가격순' },
  { id: 'priceDesc', label: '높은 가격순' },
  { id: 'rating', label: '평점 높은순' },
  { id: 'capacity', label: '정원 큰 순' },
];

const EMPTY_FILTERS = {
  date: '',
  time: '',
  concept: '',
  branch: '',
  people: '',
  maxPrice: '',
  amenity: '',
  nowOnly: false,
  sort: 'recommend',
};

// initialFilters: 히어로의 검색창이나 빠른 선택 칩에서 넘어온 조건. 있으면 그 조건이 이미 걸린 채로 열린다.
function SpacesModal({ onClose, initialFilters }) {
  const { t, lang } = useLanguage();
  const { spaces, concepts, branches, requireAuth, ratingFor, isNow, nowTime } = useApp();
  const [bookingSpace, setBookingSpace] = useState(null);
  const [filters, setFilters] = useState(() => ({ ...EMPTY_FILTERS, ...initialFilters }));
  const { date, time } = filters;

  // 고른 날짜의 찬 칸을 서버에서 받아온다. 날짜를 고르기 전에는 요청하지 않는다.
  const { booked } = useBookedSlots(date);

  function set(key, value) {
    setFilters((f) => ({ ...f, [key]: value }));
  }

  // 날짜와 시간을 둘 다 골랐을 때만 "그 시간에 비어 있는 공간"으로 거른다. 하나만 고르면 거를 기준이 부족하다.
  const searching = Boolean(date && time);
  const people = Number(filters.people) || 0;
  const maxPrice = Number(filters.maxPrice) || 0;
  const amenityOptions = [...new Set(spaces.flatMap((s) => s.amenities))].sort();

  const matched = spaces.filter(
    (s) =>
      (!filters.concept || s.concepts.includes(filters.concept)) &&
      (!filters.branch || s.branchId === filters.branch) &&
      // 인원 필터는 "최소 이 인원이 들어가는 공간"이다. 정원이 4명인 방을 6명이 쓸 수는 없다.
      (!people || s.capacity >= people) &&
      (!maxPrice || s.pricePerHour <= maxPrice) &&
      (!filters.amenity || s.amenities.includes(filters.amenity)) &&
      (!filters.nowOnly || isNow(s.id)) &&
      (!searching || isSlotAvailable(booked, s.id, date, time)),
  );

  const byRating = (a, b) => {
    const ra = ratingFor(a.id);
    const rb = ratingFor(b.id);
    return rb.avg - ra.avg || rb.count - ra.count;
  };
  const comparators = {
    recommend: null,
    priceAsc: (a, b) => a.pricePerHour - b.pricePerHour,
    priceDesc: (a, b) => b.pricePerHour - a.pricePerHour,
    rating: byRating,
    capacity: (a, b) => b.capacity - a.capacity,
  };
  // filter가 새 배열을 만들어서 sort가 원본(spaces)의 순서를 바꾸지 않는다. 추천순은 서버가 준 순서 그대로다.
  const compare = comparators[filters.sort];
  const visible = compare ? [...matched].sort(compare) : matched;

  const filtered = Object.keys(EMPTY_FILTERS).some((k) => k !== 'sort' && filters[k] !== EMPTY_FILTERS[k]);
  const changed = filtered || filters.sort !== EMPTY_FILTERS.sort;

  function summary() {
    if (!filtered) {
      return lang === 'en' ? `${visible.length} spaces in total.` : `전체 ${visible.length}개 공간이에요.`;
    }
    if (visible.length === 0) return t('조건에 맞는 공간이 없어요.');
    return lang === 'en' ? `${visible.length} spaces available.` : `${visible.length}개 공간을 찾았어요.`;
  }

  return (
    <>
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <div className={styles.header}>
            <h2>{t('공간 둘러보기')}</h2>
            <button className={styles.closeBtn} onClick={onClose}><CloseLabel /></button>
          </div>

          <div className={styles.filters}>
            <label>
              {t('날짜')}
              <input type="date" value={date} min={todayISODate()} onChange={(e) => set('date', e.target.value)} />
            </label>
            <label>
              {t('시간')}
              <select value={time} onChange={(e) => set('time', e.target.value)}>
                <option value="">{t('시간 선택')}</option>
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </label>
            <label>
              {t('용도')}
              <select value={filters.concept} onChange={(e) => set('concept', e.target.value)}>
                <option value="">{t('전체')}</option>
                {concepts.map((c) => (
                  <option key={c.id} value={c.id}>{t(c.label)}</option>
                ))}
              </select>
            </label>
            <label>
              {t('지점')}
              <select value={filters.branch} onChange={(e) => set('branch', e.target.value)}>
                <option value="">{t('전체')}</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>{t(b.name)}</option>
                ))}
              </select>
            </label>
            <label>
              {t('인원')}
              <input
                className={styles.narrow}
                type="number"
                min="1"
                max="99"
                inputMode="numeric"
                placeholder={t('명')}
                value={filters.people}
                onChange={(e) => set('people', e.target.value)}
              />
            </label>
            <label>
              {t('시간당 가격')}
              <select value={filters.maxPrice} onChange={(e) => set('maxPrice', e.target.value)}>
                <option value="">{t('전체')}</option>
                {PRICE_LIMITS.map((p) => (
                  <option key={p} value={p}>
                    {lang === 'en' ? `Up to ₩${p.toLocaleString()}` : `${p.toLocaleString()}원 이하`}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {t('편의시설')}
              <select value={filters.amenity} onChange={(e) => set('amenity', e.target.value)}>
                <option value="">{t('전체')}</option>
                {amenityOptions.map((a) => (
                  <option key={a} value={a}>{t(a)}</option>
                ))}
              </select>
            </label>
            <label>
              {t('정렬')}
              <select value={filters.sort} onChange={(e) => set('sort', e.target.value)}>
                {SORTS.map((s) => (
                  <option key={s.id} value={s.id}>{t(s.label)}</option>
                ))}
              </select>
            </label>
            <button
              type="button"
              className={`${styles.nowChip} ${filters.nowOnly ? styles.nowOn : ''}`}
              aria-pressed={filters.nowOnly}
              disabled={nowTime === null}
              title={nowTime === null ? t('지금은 운영 시간이 아니에요') : undefined}
              onClick={() => set('nowOnly', !filters.nowOnly)}
            >
              NOW {t('지금 바로 가능')}
            </button>
            <button type="button" className={styles.resetBtn} onClick={() => setFilters(EMPTY_FILTERS)} disabled={!changed}>
              {t('필터 초기화')}
            </button>
          </div>

          <p className={styles.subtitle}>{summary()}</p>
          {searching && <p className={styles.note}>{t('서버에 저장된 예약을 기준으로 계산해요.')}</p>}

          <div className={styles.grid}>
            {visible.map((s) => (
              <SpaceCard key={s.id} space={s} onReserve={() => requireAuth(() => setBookingSpace(s))} />
            ))}
          </div>
        </div>
      </div>

      {bookingSpace && (
        <BookingModal
          space={bookingSpace}
          initialDate={date || undefined}
          initialTime={time || undefined}
          onClose={() => setBookingSpace(null)}
        />
      )}
    </>
  );
}

export default SpacesModal;
