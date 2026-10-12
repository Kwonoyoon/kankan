import { useEffect, useState } from 'react';
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
import AdminPage from './components/AdminPage';
import useReservations from './hooks/useReservations';
import useSubscription from './hooks/useSubscription';
import useAuth from './hooks/useAuth';
import useCoupons from './hooks/useCoupons';
import useReviews from './hooks/useReviews';
import useSpaces from './hooks/useSpaces';
import useCatalog from './hooks/useCatalog';
import useNow from './hooks/useNow';
import useBookedSlots from './hooks/useBookedSlots';
import { dateToISO, nextSlotTime, isSlotAvailable } from './lib/reservations';
import { AppProvider } from './AppContext';
import { shouldShowIntro, markIntroSeen } from './lib/intro';
import { drawerSections } from './data/mockData';

// 라우터 없이 주소 뒤의 #admin 만 보고 관리자 화면을 보여준다. (# 뒤는 서버로 전송되지 않아 nginx 설정이 필요 없다)
const ADMIN_HASH = '#admin';

function App() {
  const [showIntro, setShowIntro] = useState(shouldShowIntro);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState(drawerSections[0].id);
  const [passModalOpen, setPassModalOpen] = useState(false);
  const [spacesModalOpen, setSpacesModalOpen] = useState(false);
  const [spacesFilters, setSpacesFilters] = useState(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [reviewSpace, setReviewSpace] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);
  const [activeConcept, setActiveConcept] = useState(null);
  const { user, login, signup, logout } = useAuth();
  const { reservations, addReservation, cancelReservation } = useReservations(user);
  const { activePlanId, subscribe, cancelSubscription } = useSubscription();
  const [isAdminRoute, setIsAdminRoute] = useState(() => window.location.hash === ADMIN_HASH);
  const { claimed, availableCoupons, claimCoupon, consumeCoupon } = useCoupons();
  const { reviewsFor, ratingFor, addReview } = useReviews();
  const spaces = useSpaces(isAdminRoute);
  const { concepts, branches, branchName } = useCatalog(isAdminRoute);

  // "지금 바로 가능": 다음 정각 칸이 오늘 비어 있는 공간. 오늘 찬 칸은 한 번만 받아서 모든 카드가 같이 쓴다.
  const now = useNow();
  const todayISO = dateToISO(now);
  const nowTime = nextSlotTime(now);
  const { booked: todayBooked } = useBookedSlots(todayISO, isAdminRoute);
  const isNow = (spaceId) => nowTime !== null && isSlotAvailable(todayBooked, spaceId, todayISO, nowTime);

  useEffect(() => {
    const onHashChange = () => setIsAdminRoute(window.location.hash === ADMIN_HASH);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  function openDrawer(tab) {
    setDrawerTab(tab ?? drawerSections[0].id);
    setDrawerOpen(true);
  }

  function openPassPlans() {
    setDrawerOpen(false);
    setPassModalOpen(true);
  }

  // 일반 "예약하기" 버튼들은 인자 없이 호출한다. onClick={openSpaces}처럼 쓰면 클릭 이벤트 객체가 인자로 들어오므로,
  // 필터를 넘기는 경로(히어로 검색)는 별도 함수(openSpacesWith)로 분리했다.
  function openSpaces() {
    setSpacesFilters(null);
    setDrawerOpen(false);
    setSpacesModalOpen(true);
  }

  function openSpacesWith(filters) {
    setSpacesFilters(filters);
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

  // 실패하면 예외를 그대로 던져서 LoginModal이 서버 메시지를 보여주게 한다. (성공했을 때만 모달을 닫는다)
  async function handleAuthSubmit(mode, fields) {
    const loggedIn = mode === 'signup' ? await signup(fields) : await login(fields);
    setLoginModalOpen(false);
    if (pendingAction) {
      pendingAction(loggedIn);
      setPendingAction(null);
    }
  }

  // 서버 예약이 성공한 뒤에만 쿠폰을 쓴 것으로 처리한다. 예약이 거절됐는데 쿠폰만 사라지면 안 되기 때문이다.
  async function confirmBooking(booking, couponId) {
    await addReservation(booking);
    if (couponId) consumeCoupon(couponId);
  }

  function finishIntro() {
    markIntroSeen();
    setShowIntro(false);
  }

  const appValue = {
    user,
    spaces,
    concepts,
    branches,
    branchName,
    isNow,
    nowTime,
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

  if (isAdminRoute) {
    return (
      <AdminPage
        user={user}
        onLogin={login}
        onLogout={logout}
        onExit={() => { window.location.hash = ''; }}
      />
    );
  }

  return (
    <AppProvider value={appValue}>
      <Header onMenuOpen={() => openDrawer()} onOpenSpaces={openSpaces} user={user} onLogout={logout} onLoginClick={() => setLoginModalOpen(true)} onAdmin={() => { window.location.hash = ADMIN_HASH; }} />
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
      {spacesModalOpen && <SpacesModal initialFilters={spacesFilters} onClose={() => setSpacesModalOpen(false)} />}
      {reviewSpace && <ReviewsModal space={reviewSpace} onClose={() => setReviewSpace(null)} />}
      {loginModalOpen && (
        <LoginModal
          onSubmit={handleAuthSubmit}
          onClose={() => { setLoginModalOpen(false); setPendingAction(null); }}
        />
      )}

      <main>
        <Hero onOpenPass={openPassPlans} onSearch={openSpacesWith} />
        <ConceptPills activeConcept={activeConcept} onSelect={setActiveConcept} />
        <Stats />
        <SpaceGrid activeConcept={activeConcept} onOpenSpaces={openSpaces} />
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
