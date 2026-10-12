import { createContext, useContext, useState } from 'react';
import { translations } from './translations';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('ko');

  function toggleLang() {
    setLang((l) => (l === 'ko' ? 'en' : 'ko'));
  }

  // 사전에 없는 문자열은 원문 그대로 돌려준다 (번역 누락이 화면에서 빈 텍스트로 보이지 않도록).
  function t(text) {
    if (lang === 'ko') return text;
    return translations[text] ?? text;
  }

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
