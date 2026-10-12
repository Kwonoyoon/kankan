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

// toISOString()은 UTC 기준이라 한국 시간 새벽(00~09시)에는 어제 날짜가 나온다. 로컬 날짜를 직접 조립한다.
export function todayISODate() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

// "지금 바로 예약"의 기준 칸: 다음 정각에 시작하는 칸. 지금 시각이 속한 칸은 이미 시작했으므로 예약할 수 없다.
// 운영 시간 밖이면 null. (예: 새벽 5시는 아직 열지 않았고, 23시 이후는 다음 칸이 없다)
export function nextSlotTime(now) {
  const hour = now.getHours() + 1;
  if (hour < OPERATING_HOURS.start || hour >= OPERATING_HOURS.end) return null;
  return `${String(hour).padStart(2, '0')}:00`;
}

export function dateToISO(date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export function isPastSlot(date, time) {
  return new Date(`${date}T${time}:00`) <= new Date();
}

export function isSlotTaken(reservations, spaceId, date, time) {
  return reservations.some((r) => r.spaceId === spaceId && r.date === date && r.time === time);
}

// 지난 시간이거나 이미 예약된 시간이면 예약할 수 없다.
export function isSlotAvailable(reservations, spaceId, date, time) {
  return !isPastSlot(date, time) && !isSlotTaken(reservations, spaceId, date, time);
}

export function loadReservations() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveReservations(reservations) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reservations));
}
