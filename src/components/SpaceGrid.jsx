import { useState } from 'react';
import { spaces, concepts } from '../data/mockData';
import { useLanguage } from '../i18n/LanguageContext';
import BookingModal from './BookingModal';
import SpaceCard from './SpaceCard';
import styles from './SpaceGrid.module.css';

function conceptLabel(conceptId) {
  return concepts.find((c) => c.id === conceptId)?.label ?? '';
}

function SpaceGrid({ activeConcept, onReserve, onRequireAuth }) {
  const { t, lang } = useLanguage();
  const [bookingSpace, setBookingSpace] = useState(null);

  const filtered = activeConcept
    ? spaces.filter((s) => s.concept === activeConcept)
    : spaces;

  return (
    <section id="spaces">
      <div className="wrap">
        <div className={styles.head}>
          <h2>
            {activeConcept ? `${t(conceptLabel(activeConcept))} ${t('공간')}` : t('이번 주 추천 공간')}
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
            {filtered.map((s) => (
              <SpaceCard key={s.id} space={s} onReserve={() => onRequireAuth(() => setBookingSpace(s))} />
            ))}
          </div>
        )}
      </div>

      {bookingSpace && (
        <BookingModal
          space={bookingSpace}
          onClose={() => setBookingSpace(null)}
          onConfirm={onReserve}
        />
      )}
    </section>
  );
}

export default SpaceGrid;
