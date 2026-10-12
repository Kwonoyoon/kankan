const STORAGE_KEY = 'kany.coupons';

// 저장 형태: [{ couponId, used }]. 쿠폰 정보(이름, 할인율)는 mockData에 있고 여기엔 "받았는지/썼는지"만 둔다.
export function loadCoupons() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveCoupons(claimed) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(claimed));
}

export function applyDiscount(price, discountRate) {
  return Math.round((price * (100 - discountRate)) / 100);
}
