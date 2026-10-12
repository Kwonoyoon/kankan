const STORAGE_KEY = 'kany.reviews';

// 사용자가 직접 쓴 후기만 저장한다. 처음부터 보이는 샘플 후기는 mockData에 있다.
export function loadReviews() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveReviews(reviews) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
}
