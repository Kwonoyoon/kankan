const STORAGE_KEY = 'kany.reservations';

// Hero 문구("매일 07:00–24:00 운영 · 1시간 단위")와 동일한 정책.
// 예약 폼의 시간대는 전부 이 값에서 파생시켜서, 운영시간이 바뀌면 여기 한 곳만 고치면 된다.
export const OPERATING_HOURS = { start: 7, end: 24 };

export function getTimeSlots() {
  const slots = [];
  for (let hour = OPERATING_HOURS.start; hour < OPERATING_HOURS.end; hour++) {
    slots.push(`${String(hour).padStart(2, '0')}:00`);
  }
  return slots;
}

export function loadReservations() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveReservations(reservations) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reservations));
}
