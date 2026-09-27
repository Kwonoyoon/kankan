import { useState } from 'react';
import { loadUser, saveUser, clearUser } from '../lib/auth';

function useAuth() {
  const [user, setUser] = useState(loadUser);

  function login({ email, nickname }) {
    const nextUser = { email, nickname };
    setUser(nextUser);
    saveUser(nextUser);
  }

  function logout() {
    setUser(null);
    clearUser();
  }

  return { user, login, logout };
}

export default useAuth;
