// 관리자 화면 여러 곳에서 쓰는 표시용 변환. (한 곳에 모아야 시간·금액 표기가 화면마다 어긋나지 않는다)
export const STATUS_LABEL = { CONFIRMED: '예약됨', CANCELED: '취소됨' };

export const formatHour = (hour) => `${String(hour).padStart(2, '0')}:00–${String(hour + 1).padStart(2, '0')}:00`;

// 서버가 주는 "2026-10-12T14:35:49.289" 에서 분까지만 보여준다.
export const formatDateTime = (iso) => iso.slice(0, 16).replace('T', ' ');

export const formatWon = (n) => `${n.toLocaleString()}원`;
