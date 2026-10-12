// 문의 종류. 서버(InquiryCategory)의 값과 같아야 한다. 화면에는 label을 보여준다.
export const INQUIRY_CATEGORIES = [
  { id: 'RESERVATION', label: '예약 문의' },
  { id: 'SPACE', label: '공간 문의' },
  { id: 'PAYMENT', label: '결제·환불' },
  { id: 'ETC', label: '기타' },
];

export const categoryLabel = (id) => INQUIRY_CATEGORIES.find((c) => c.id === id)?.label ?? id;

// "2026-10-12T14:35:49.289" → "2026-10-12 14:35"
export const formatDateTime = (iso) => iso.slice(0, 16).replace('T', ' ');
