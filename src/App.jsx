import { useState } from 'react';
import Header from './components/Header';
import Drawer from './components/Drawer';
import Hero from './components/Hero';
import ConceptPills from './components/ConceptPills';
import Stats from './components/Stats';
import SpaceGrid from './components/SpaceGrid';
import Extras from './components/Extras';
import Footer from './components/Footer';
import A11yWidget from './components/A11yWidget';
import CookieBar from './components/CookieBar';
import PassPlansModal from './components/PassPlansModal';
import SpacesModal from './components/SpacesModal';
import LoginModal from './components/LoginModal';
import useReservations from './hooks/useReservations';
import useSubscription from './hooks/useSubscription';
import useAuth from './hooks/useAuth';
import { drawerSections } from './data/mockData';

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState(drawerSections[0].id);
  const [passModalOpen, setPassModalOpen] = useState(false);
  const [spacesModalOpen, setSpacesModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [activeConcept, setActiveConcept] = useState(null);
  const { reservations, addReservation, cancelReservation } = useReservations();
  const { activePlanId, subscribe, cancelSubscription } = useSubscription();
  const { user, login, logout } = useAuth();

  function openDrawer(tab) {
    setDrawerTab(tab ?? drawerSections[0].id);
    setDrawerOpen(true);
  }

  function openPassPlans() {
    setDrawerOpen(false);
    setPassModalOpen(true);
  }

  function openSpaces() {
    setDrawerOpen(false);
    setSpacesModalOpen(true);
  }

  // 로그인 안 한 상태에서 예약/구독처럼 로그인이 필요한 동작을 시도하면
  // 로그인창을 먼저 띄우고, 로그인에 성공하면 하려던 동작을 이어서 실행한다.
  function requireAuth(action) {
    if (user) {
      action();
    } else {
      setPendingAction(() => action);
      setLoginModalOpen(true);
    }
  }

  function handleLogin(credentials) {
    login(credentials);
    setLoginModalOpen(false);
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  }

  return (
    <>
      <Header onMenuOpen={() => openDrawer()} onOpenSpaces={openSpaces} user={user} onLogout={logout} onLoginClick={() => setLoginModalOpen(true)} />
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        activeId={drawerTab}
        onTabChange={setDrawerTab}
        reservations={reservations}
        onCancelReservation={cancelReservation}
        activePlanId={activePlanId}
        onCancelSubscription={cancelSubscription}
        onOpenPassPlans={openPassPlans}
        onOpenSpaces={openSpaces}
      />
      {passModalOpen && (
        <PassPlansModal
          activePlanId={activePlanId}
          onSubscribe={(planId) => requireAuth(() => subscribe(planId))}
          onCancel={cancelSubscription}
          onClose={() => setPassModalOpen(false)}
        />
      )}
      {spacesModalOpen && (
        <SpacesModal
          onReserve={addReservation}
          onRequireAuth={requireAuth}
          onClose={() => setSpacesModalOpen(false)}
        />
      )}
      {loginModalOpen && (
        <LoginModal
          onLogin={handleLogin}
          onClose={() => { setLoginModalOpen(false); setPendingAction(null); }}
        />
      )}

      <main>
        <Hero onOpenPass={openPassPlans} onOpenSpaces={openSpaces} />
        <ConceptPills activeConcept={activeConcept} onSelect={setActiveConcept} />
        <Stats />
        <SpaceGrid
          activeConcept={activeConcept}
          onReserve={addReservation}
          onRequireAuth={requireAuth}
        />
        <Extras />
      </main>

      <Footer onOpenDrawer={openDrawer} onOpenPassPlans={openPassPlans} onOpenSpaces={openSpaces} />
      <A11yWidget />
      <CookieBar />
    </>
  );
}

export default App;
