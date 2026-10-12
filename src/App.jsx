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
import ReviewsModal from './components/ReviewsModal';
import LoginModal from './components/LoginModal';
import Intro from './components/Intro';
import useReservations from './hooks/useReservations';
import useSubscription from './hooks/useSubscription';
import useAuth from './hooks/useAuth';
import useCoupons from './hooks/useCoupons';
import useReviews from './hooks/useReviews';
import { AppProvider } from './AppContext';
import { shouldShowIntro, markIntroSeen } from './lib/intro';
import { drawerSections } from './data/mockData';

function App() {
  const [showIntro, setShowIntro] = useState(shouldShowIntro);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState(drawerSections[0].id);
  const [passModalOpen, setPassModalOpen] = useState(false);
  const [spacesModalOpen, setSpacesModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [reviewSpace, setReviewSpace] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);
  const [activeConcept, setActiveConcept] = useState(null);
  const { reservations, addReservation, cancelReservation } = useReservations();
  const { activePlanId, subscribe, cancelSubscription } = useSubscription();
  const { user, login, logout } = useAuth();
  const { claimed, availableCoupons, claimCoupon, consumeCoupon } = useCoupons();
  const { reviewsFor, ratingFor, addReview } = useReviews();

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

  // 로그인 안 한 상태에서 예약/구독/후기처럼 로그인이 필요한 동작을 시도하면
  // 로그인창을 먼저 띄우고, 로그인에 성공하면 하려던 동작을 이어서 실행한다.
  // action에는 로그인한 사용자 정보를 넘겨준다. (방금 로그인한 경우 state가 아직 갱신 전이라서)
  function requireAuth(action) {
    if (user) {
      action(user);
    } else {
      setPendingAction(() => action);
      setLoginModalOpen(true);
    }
  }

  function handleLogin(credentials) {
    login(credentials);
    setLoginModalOpen(false);
    if (pendingAction) {
      pendingAction(credentials);
      setPendingAction(null);
    }
  }

  function confirmBooking(reservation, couponId) {
    addReservation(reservation);
    if (couponId) consumeCoupon(couponId);
  }

  function finishIntro() {
    markIntroSeen();
    setShowIntro(false);
  }

  const appValue = {
    user,
    requireAuth,
    reservations,
    availableCoupons,
    claimed,
    claimCoupon,
    confirmBooking,
    reviewsFor,
    ratingFor,
    addReview,
    openReviews: setReviewSpace,
  };

  return (
    <AppProvider value={appValue}>
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
      {spacesModalOpen && <SpacesModal onClose={() => setSpacesModalOpen(false)} />}
      {reviewSpace && <ReviewsModal space={reviewSpace} onClose={() => setReviewSpace(null)} />}
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
        <SpaceGrid activeConcept={activeConcept} />
        <Extras />
      </main>

      <Footer onOpenDrawer={openDrawer} onOpenPassPlans={openPassPlans} onOpenSpaces={openSpaces} />
      <A11yWidget />
      <CookieBar />
      {showIntro && <Intro onDone={finishIntro} />}
    </AppProvider>
  );
}

export default App;
