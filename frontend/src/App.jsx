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
import PaymentModal from './components/PaymentModal';
import SpaceDetailPage from './components/SpaceDetailPage';
import MyPage from './components/MyPage';
import HowItWorks from './components/HowItWorks';
import BranchShowcase from './components/BranchShowcase';
import RecentReviews from './components/RecentReviews';
import PassBanner from './components/PassBanner';
import Faq from './components/Faq';
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
import useRoute from './hooks/useRoute';
import useNow from './hooks/useNow';
import useBookedSlots from './hooks/useBookedSlots';
import { dateToISO, nextSlotTime, isSlotAvailable } from './lib/reservations';
import { AppProvider } from './AppContext';
import { shouldShowIntro, markIntroSeen } from './lib/intro';
import { drawerSections } from './data/mockData';
import { spacePath } from './lib/route';

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
  const [paymentPlanId, setPaymentPlanId] = useState(null);
  const { route, navigate } = useRoute();
  const [pendingAction, setPendingAction] = useState(null);
  const [activeConcept, setActiveConcept] = useState(null);
  const { user, login, signup, logout } = useAuth();
  const { reservations, addReservation, cancelReservation } = useReservations(user);
  const { activePlanId, subscribe, cancelSubscription } = useSubscription();
  const [isAdminRoute, setIsAdminRoute] = useState(() => window.location.hash === ADMIN_HASH);
  const { claimed, availableCoupons, claimCoupon, consumeCoupon } = useCoupons();
  const { reviewsFor, ratingFor, reviewsBy, addReview, removeReview, allReviews } = useReviews();
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

  // 화면을 옮길 때는 떠 있던 창(드로어·공간 목록)을 닫는다. 안 닫으면 새 화면 위에 이전 창이 그대로 남는다.
  function goTo(path) {
    setDrawerOpen(false);
    setSpacesModalOpen(false);
    navigate(path);
  }

  const openSpace = (spaceId, hash = '') => goTo(`${spacePath(spaceId)}${hash}`);
  const goHome = () => goTo('/');
  const openMyPage = () => goTo('/mypage');

  // 정기권 구독은 플랜을 고른 뒤 결제 창을 거친다. 결제가 끝난 뒤에만 구독 상태를 바꾼다.
  function startPayment(planId) {
    setPassModalOpen(false);
    setPaymentPlanId(planId);
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
    cancelReservation,
    availableCoupons,
    claimed,
    claimCoupon,
    confirmBooking,
    reviewsFor,
    ratingFor,
    reviewsBy,
    addReview,
    removeReview,
    allReviews,
    openSpace,
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
      <Header
        solid={route.name !== 'home'}
        onHome={goHome}
        onMenuOpen={() => openDrawer()}
        onOpenSpaces={openSpaces}
        user={user}
        onLogout={logout}
        onLoginClick={() => setLoginModalOpen(true)}
        onMyPage={openMyPage}
        onAdmin={() => { window.location.hash = ADMIN_HASH; }}
      />
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        activeId={drawerTab}
        onTabChange={setDrawerTab}
        onOpenPassPlans={openPassPlans}
        onOpenSpaces={openSpaces}
        onOpenSpacesWith={openSpacesWith}
        onOpenMyPage={openMyPage}
      />
      {passModalOpen && (
        <PassPlansModal
          activePlanId={activePlanId}
          onSubscribe={(planId) => requireAuth(() => startPayment(planId))}
          onCancel={cancelSubscription}
          onClose={() => setPassModalOpen(false)}
        />
      )}
      {paymentPlanId && (
        <PaymentModal
          planId={paymentPlanId}
          onPaid={subscribe}
          onBack={() => { setPaymentPlanId(null); setPassModalOpen(true); }}
          onClose={() => setPaymentPlanId(null)}
        />
      )}
      {spacesModalOpen && <SpacesModal initialFilters={spacesFilters} onClose={() => setSpacesModalOpen(false)} />}
      {loginModalOpen && (
        <LoginModal
          onSubmit={handleAuthSubmit}
          onClose={() => { setLoginModalOpen(false); setPendingAction(null); }}
        />
      )}

      {route.name === 'space' && <SpaceDetailPage spaceId={route.spaceId} onBack={goHome} />}

      {route.name === 'mypage' && (
        <MyPage
          activePlanId={activePlanId}
          onCancelSubscription={cancelSubscription}
          onOpenPassPlans={openPassPlans}
          onOpenSpace={openSpace}
          onOpenSpaces={openSpaces}
          onLogin={() => setLoginModalOpen(true)}
        />
      )}

      {route.name === 'home' && (
        <main>
          <Hero onOpenPass={openPassPlans} onSearch={openSpacesWith} />
          <ConceptPills activeConcept={activeConcept} onSelect={setActiveConcept} />
          <Stats />
          <SpaceGrid activeConcept={activeConcept} onOpenSpaces={openSpaces} />
          <BranchShowcase onSelectBranch={(branchId) => openSpacesWith({ branch: branchId })} />
          <HowItWorks />
          <RecentReviews />
          <PassBanner onOpenPass={openPassPlans} />
          <Faq />
          <Extras />
        </main>
      )}

      <Footer onOpenDrawer={openDrawer} onOpenPassPlans={openPassPlans} onOpenSpaces={openSpaces} />
      <A11yWidget />
      <CookieBar />
      {showIntro && <Intro onDone={finishIntro} />}
    </AppProvider>
  );
}

export default App;
