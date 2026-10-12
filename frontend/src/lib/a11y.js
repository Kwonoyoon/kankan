// 접근성 설정(큰 글씨·다크 모드·고대비)을 저장하고 화면에 적용한다.
// 적용 방식: <html>에 data-* 속성을 붙이면 index.css가 그에 맞춰 색·크기를 바꾼다.
const STORAGE_KEY = 'kany.a11y';

export const DEFAULT_A11Y = { large: false, dark: false, contrast: false };

// 저장된 값은 누가 손으로 고치거나, 예전 버전의 모양일 수 있다. 그대로 믿지 않고
// 우리가 아는 키만, 정확히 true일 때만 켜진 것으로 읽는다. 깨진 JSON이면 기본값을 쓴다.
export function loadA11y() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return {
      large: parsed?.large === true,
      dark: parsed?.dark === true,
      contrast: parsed?.contrast === true,
    };
  } catch {
    return { ...DEFAULT_A11Y };
  }
}

export function saveA11y(settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // 저장소를 못 쓰는 환경(시크릿 모드 등)에서도 이번 방문 동안은 동작한다.
  }
}

export function applyA11y(settings, root = document.documentElement) {
  const set = (name, on, value) => (on ? root.setAttribute(name, value) : root.removeAttribute(name));
  set('data-theme', settings.dark, 'dark');
  set('data-contrast', settings.contrast, 'high');
  set('data-text', settings.large, 'large');
}
