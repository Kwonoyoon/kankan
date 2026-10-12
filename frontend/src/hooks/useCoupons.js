import { useState } from 'react';
import { coupons } from '../data/mockData';
import { loadCoupons, saveCoupons } from '../lib/coupons';

function useCoupons() {
  const [claimed, setClaimed] = useState(loadCoupons);

  function update(next) {
    setClaimed(next);
    saveCoupons(next);
  }

  // 이미 받은 쿠폰을 또 눌러도 중복으로 쌓이지 않게 한다.
  function claimCoupon(couponId) {
    if (claimed.some((c) => c.couponId === couponId)) return;
    update([...claimed, { couponId, used: false }]);
  }

  // 이름을 useCoupon으로 하면 React가 훅(use로 시작)으로 착각해서 규칙 위반 경고가 난다.
  function consumeCoupon(couponId) {
    update(claimed.map((c) => (c.couponId === couponId ? { ...c, used: true } : c)));
  }

  const availableCoupons = claimed
    .filter((c) => !c.used)
    .map((c) => coupons.find((x) => x.id === c.couponId))
    .filter(Boolean);

  return { claimed, availableCoupons, claimCoupon, consumeCoupon };
}

export default useCoupons;
