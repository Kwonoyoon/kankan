// 로그인 토큰은 localStorage에 둔다. 새로고침해도 로그인이 유지되지만, 페이지에 악성 스크립트가 들어오면(XSS) 읽힐 수 있다는 한계가 있다.
// 더 안전하게 하려면 httpOnly 쿠키 + 리프레시 토큰 구조로 가야 한다. (이후 단계)
const TOKEN_KEY = 'kany.token';

// 토큰이 만료돼서 서버가 401을 주면 알리는 이벤트 이름. 화면(useAuth)이 이걸 받아 로그아웃 상태로 돌린다.
export const UNAUTHORIZED_EVENT = 'kany:unauthorized';

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function saveToken(token) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // 저장소를 못 쓰는 환경(시크릿 모드 등)에서는 새로고침하면 로그아웃된다. 동작 자체는 막지 않는다.
  }
}

export function clearToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // 위와 같은 이유로 무시한다.
  }
}

export class ApiError extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export async function api(path, { method = 'GET', body } = {}) {
  const headers = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`/api${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, 'NETWORK', '서버에 연결할 수 없어요. 잠시 후 다시 시도해주세요.');
  }

  if (res.status === 204) return null;
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    // 토큰을 들고 보냈는데 UNAUTHORIZED면 토큰이 만료·위조된 것이다. 로그인 실패(INVALID_CREDENTIALS)와는 코드로 구분한다.
    if (res.status === 401 && token && data?.code === 'UNAUTHORIZED') {
      clearToken();
      window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
    }
    throw new ApiError(res.status, data?.code ?? 'ERROR', data?.message ?? '요청을 처리하지 못했어요.');
  }
  return data;
}
