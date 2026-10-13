import { guides, notices, drawerSections } from '../data/mockData';
import { useLanguage } from '../i18n/LanguageContext';
import PlaceholderLink from './PlaceholderLink';
import Branches from './Branches';
import EventsPanel from './EventsPanel';
import InquiryPanel from './InquiryPanel';
import styles from './Drawer.module.css';
import { CloseLabel } from './Icon';

// href 규칙: '#'=아직 없는 페이지, 'modal:pass'=정기권 창, 'tab:xxx'=드로어 탭 전환,
// 'concept:xxx'=그 용도로 걸러진 공간 목록, 'spaces:all'=전체 공간 목록.
// 예전에는 이 항목들이 '#spaces'(메인 화면 안의 위치)였다. 그건 메인에서만 동작하고 필터가 걸리지 않아서 목록 창을 여는 쪽으로 바꿨다.
function DrawerLink({ href, children, onTabChange, onOpenPassPlans, onOpenSpaces, onOpenSpacesWith, onClose }) {
  if (href === '#') return <PlaceholderLink>{children}</PlaceholderLink>;
  if (href === 'modal:pass') return <button onClick={onOpenPassPlans}>{children}</button>;
  if (href === 'spaces:all') return <button onClick={onOpenSpaces}>{children}</button>;
  if (href.startsWith('concept:')) {
    return <button onClick={() => onOpenSpacesWith({ concept: href.slice(8) })}>{children}</button>;
  }
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
  onOpenPassPlans,
  onOpenSpaces,
  onOpenSpacesWith,
  onOpenMyPage,
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
        <button className={styles.closeBtn} onClick={onClose}><CloseLabel /></button>

        <nav className={styles.nav}>
          <div className={styles.quickLinks}>
            <button onClick={onOpenSpaces}>{t('실시간 예약 현황')}</button>
            <button onClick={() => onTabChange('explore')}>{t('지점 위치')}</button>
            <button onClick={() => onTabChange('howto')}>{t('이용 가이드')}</button>
            <button onClick={() => onTabChange('live')}>{t('공지사항')}</button>
          </div>

          {drawerSections.map((s) => (
            <button
              key={s.id}
              className={`${styles.navItem} ${s.id === activeId ? styles.active : ''}`}
              // 마이페이지는 패널 안의 탭이 아니라 독립된 화면(/mypage)이라서 이동한다.
              onClick={() => (s.id === 'mypage' ? onOpenMyPage() : onTabChange(s.id))}
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
          {activeId === 'events' && <EventsPanel />}

          {activeId === 'inquiry' && <InquiryPanel />}

          {active && activeId !== 'events' && activeId !== 'inquiry' && (
            <>
              {active.image && <img src={active.image} alt={t(active.label)} />}
              <ul>
                {active.links.map((link) => (
                  <li key={link.label}>
                    <DrawerLink
                      href={link.href}
                      onTabChange={onTabChange}
                      onOpenPassPlans={onOpenPassPlans}
                      onOpenSpaces={onOpenSpaces}
                      onOpenSpacesWith={onOpenSpacesWith}
                      onClose={onClose}
                    >
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
