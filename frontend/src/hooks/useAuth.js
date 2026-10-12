import { useEffect, useState } from 'react';
import { api, getToken, saveToken, clearToken, UNAUTHORIZED_EVENT } from '../lib/api';

function useAuth() {
  const [user, setUser] = useState(null);

  // 새로고침했을 때 토큰이 남아 있으면 서버에 "이 토큰의 주인이 누구냐"를 물어 로그인 상태를 되살린다.
  // 토큰만 믿고 user를 만들지 않는 이유: 만료됐거나 삭제된 회원의 토큰일 수 있고, 서버만이 그걸 안다.
  useEffect(() => {
    if (!getToken()) return undefined;
    let cancelled = false;
    api('/auth/me')
      .then((me) => { if (!cancelled) setUser(me); })
      .catch(() => clearToken());
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const onUnauthorized = () => setUser(null);
    window.addEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
  }, []);

  async function authenticate(path, body) {
    const res = await api(path, { method: 'POST', body });
    saveToken(res.accessToken);
    setUser(res.user);
    return res.user;
  }

  const login = ({ email, password }) => authenticate('/auth/login', { email, password });
  const signup = ({ email, password, nickname }) => authenticate('/auth/signup', { email, password, nickname });

  function logout() {
    clearToken();
    setUser(null);
  }

  return { user, login, signup, logout };
}

export default useAuth;
