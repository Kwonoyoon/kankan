import { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useApp } from '../AppContext';
import BookingModal from './BookingModal';
import SpaceCard from './SpaceCard';
import styles from './SpaceGrid.module.css';

// 메인에는 한 줄 두 개 분량만 보여준다. 공간이 늘어나도 메인이 끝없이 길어지지 않게 하고,
// 전체는 필터가 있는 "공간 둘러보기"(onOpenSpaces)에서 본다.
const FEATURED_COUNT = 6;

function SpaceGrid({ activeConcept, onOpenSpaces }) {
  const { t, lang } = useLanguage();
  const { spaces, concepts, requireAuth } = useApp();
  const [bookingSpace, setBookingSpace] = useState(null);

  const conceptLabel = concepts.find((c) => c.id === activeConcept)?.label ?? '';
  const filtered = activeConcept ? spaces.filter((s) => s.concepts.includes(activeConcept)) : spaces;
  const shown = filtered.slice(0, FEATURED_COUNT);
  const hiddenCount = filtered.length - shown.length;

  return (
    <section id="spaces">
      <div className="wrap">
        <div className={styles.head}>
          <h2>
            {activeConcept ? `${t(conceptLabel)} ${t('공간')}` : t('이번 주 추천 공간')}
          </h2>
          <p>
            {activeConcept
              ? (lang === 'en' ? `Found ${filtered.length} spaces.` : `${filtered.length}개의 공간을 찾았어요.`)
              : t('가장 많이 예약된 공간을 모아봤어요.')}
          </p>
        </div>

        {filtered.length === 0 ? (
          <p className={styles.empty}>{t('아직 등록된 공간이 없어요.')}</p>
        ) : (
          <div className={styles.grid}>
            {shown.map((s) => (
              <SpaceCard key={s.id} space={s} onReserve={() => requireAuth(() => setBookingSpace(s))} />
            ))}
          </div>
        )}

        {hiddenCount > 0 && (
          <div className={styles.moreWrap}>
            <button type="button" className={styles.moreBtn} onClick={onOpenSpaces}>
              {lang === 'en' ? `See all ${spaces.length} spaces with filters` : `필터로 전체 ${spaces.length}개 공간 보기`}
            </button>
          </div>
        )}
      </div>

      {bookingSpace && (
        <BookingModal space={bookingSpace} onClose={() => setBookingSpace(null)} />
      )}
    </section>
  );
}

export default SpaceGrid;
