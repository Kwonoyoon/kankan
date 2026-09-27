import { useState } from 'react';
import { spaces } from '../data/mockData';
import { useLanguage } from '../i18n/LanguageContext';
import SpaceCard from './SpaceCard';
import BookingModal from './BookingModal';
import styles from './SpacesModal.module.css';

function SpacesModal({ onReserve, onRequireAuth, onClose }) {
  const { t } = useLanguage();
  const [bookingSpace, setBookingSpace] = useState(null);

  return (
    <>
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <div className={styles.header}>
            <h2>{t('공간 둘러보기')}</h2>
            <button className={styles.closeBtn} onClick={onClose}>{t('닫기 ✕')}</button>
          </div>
          <p className={styles.subtitle}>{t('가장 많이 예약된 공간을 모아봤어요.')}</p>

          <div className={styles.grid}>
            {spaces.map((s) => (
              <SpaceCard key={s.id} space={s} onReserve={() => onRequireAuth(() => setBookingSpace(s))} />
            ))}
          </div>
        </div>
      </div>

      {bookingSpace && (
        <BookingModal
          space={bookingSpace}
          onClose={() => setBookingSpace(null)}
          onConfirm={onReserve}
        />
      )}
    </>
  );
}

export default SpacesModal;
