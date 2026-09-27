import { guides, notices, drawerSections, passPlanName } from '../data/mockData';
import { useLanguage } from '../i18n/LanguageContext';
import ReservationList from './ReservationList';
import PlaceholderLink from './PlaceholderLink';
import Branches from './Branches';
import styles from './Drawer.module.css';

function DrawerLink({ href, children, onTabChange, onOpenPassPlans, onClose }) {
  if (href === '#') return <PlaceholderLink>{children}</PlaceholderLink>;
  if (href === 'modal:pass') return <button onClick={onOpenPassPlans}>{children}</button>;
  if (href.startsWith('tab:')) {
    return <button onClick={() => onTabChange(href.slice(4))}>{children}</button>;
  }
  return <a href={href} onClick={onClose}>{children}</a>;
}

function Drawer({
  open,
  onClose,
  activeId,
  onTabChange,
  reservations,
  onCancelReservation,
  activePlanId,
  onCancelSubscription,
  onOpenPassPlans,
  onOpenSpaces,
}) {
  const { t } = useLanguage();
  const active = drawerSections.find((s) => s.id === activeId);

  return (
    <>
      <div
        className={`${styles.overlay} ${open ? styles.open : ''}`}
        onClick={onClose}
      />
      <div className={`${styles.drawer} ${open ? styles.open : ''}`}>
        <button className={styles.closeBtn} onClick={onClose}>{t('닫기 ✕')}</button>

        <nav className={styles.nav}>
          <div className={styles.quickLinks}>
            <a href="#spaces" onClick={onClose}>{t('실시간 예약 현황')}</a>
            <button onClick={() => onTabChange('explore')}>{t('지점 위치')}</button>
            <button onClick={() => onTabChange('howto')}>{t('이용 가이드')}</button>
            <button onClick={() => onTabChange('live')}>{t('공지사항')}</button>
          </div>

          {drawerSections.map((s) => (
            <button
              key={s.id}
              className={`${styles.navItem} ${s.id === activeId ? styles.active : ''}`}
              onClick={() => onTabChange(s.id)}
            >
              {t(s.label)}
            </button>
          ))}
          <div className={styles.ctaGroup}>
            <button className={styles.primary} onClick={onOpenSpaces}>{t('지금 예약하기')}</button>
            <button className={styles.secondary} onClick={onOpenPassPlans}>
              {t('정기권 구매하기')}
            </button>
          </div>
        </nav>

        <div className={styles.panel}>
          {activeId === 'mypage' && (
            <>
              <div className={styles.planStatus}>
                {activePlanId ? (
                  <>
                    {t('현재 정기권:')} <strong>{t(passPlanName(activePlanId))}</strong>
                    <button onClick={onCancelSubscription}>{t('해지')}</button>
                  </>
                ) : (
                  <>{t('가입한 정기권이 없어요.')} <button onClick={onOpenPassPlans}>{t('정기권 보기')}</button></>
                )}
              </div>
              <ReservationList reservations={reservations} onCancel={onCancelReservation} />
            </>
          )}

          {active && activeId !== 'mypage' && (
            <>
              {active.image && <img src={active.image} alt={t(active.label)} />}
              <ul>
                {active.links.map((link) => (
                  <li key={link.label}>
                    <DrawerLink href={link.href} onTabChange={onTabChange} onOpenPassPlans={onOpenPassPlans} onClose={onClose}>
                      {t(link.label)}
                    </DrawerLink>
                  </li>
                ))}
              </ul>

              {activeId === 'explore' && (
                <>
                  <h4 className={styles.subhead}>{t('지점 위치')}</h4>
                  <Branches />
                </>
              )}

              {activeId === 'howto' && (
                <>
                  <h4 className={styles.subhead}>{t('이용 꿀팁')}</h4>
                  <ul className={styles.infoList}>
                    {guides.map((g) => (
                      <li key={g.title} className={styles.infoItem}>
                        <span className={styles.infoTag}>{t(g.tag)}</span>
                        <span className={styles.infoTitle}>{t(g.title)}</span>
                        <span className={styles.infoDate}>{g.date}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {activeId === 'live' && (
                <>
                  <h4 className={styles.subhead}>{t('공지사항')}</h4>
                  <ul className={styles.infoList}>
                    {notices.map((n) => (
                      <li key={n.title} className={styles.infoItem}>
                        <span className={styles.infoTag}>{t(n.tag)}</span>
                        <span className={styles.infoTitle}>{t(n.title)}</span>
                        <span className={styles.infoDate}>{n.date}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Drawer;
