import { useLanguage } from '../i18n/LanguageContext';

// 이모지 대신 쓰는 선(stroke) 아이콘 모음. 이모지는 기기·브라우저마다 모양이 달라 보이고, 글자 색·다크 모드를 따르지 않는다.
// SVG는 currentColor를 쓰므로 부모의 글자색이 그대로 아이콘 색이 된다.
const PATHS = {
  close: <path d="M6 6l12 12M18 6L6 18" />,
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" />
    </>
  ),
  textSize: <path d="M3 19l5-13 5 13M5 14h6M15 19l3.5-8.5L22 19M16.2 16h4.6" />,
  moon: <path d="M20.5 13.5A8.5 8.5 0 1110.5 3.5a7 7 0 0010 10z" />,
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </>
  ),
  contrast: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3a9 9 0 010 18z" fill="currentColor" />
    </>
  ),
  accessibility: (
    <>
      <circle cx="12" cy="4.5" r="1.7" />
      <path d="M5 8.5l7 1.5 7-1.5M12 10v5M9 21l3-6 3 6" />
    </>
  ),
  arrowRight: <path d="M5 12h14M13 6l6 6-6 6" />,
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l4.5 4.5" />
    </>
  ),
};

export function Icon({ name, size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[name]}
    </svg>
  );
}

// 모든 팝업의 "닫기 ✕" 문구를 한 곳에서 관리한다. 글자 ✕ 대신 아이콘을 쓴다.
export function CloseLabel() {
  const { t } = useLanguage();
  return (
    <span className="closeLabel">
      {t('닫기')}
      <Icon name="close" size={14} />
    </span>
  );
}
