import { useLanguage } from '../i18n/LanguageContext';

// 실제 페이지/폼이 아직 없는 링크. href="#"로 인한 위쪽 점프(가짜 동작처럼 보임)를 막고,
// 왜 안 눌리는지 title로 알려준다. 이 컴포넌트만 "아직 없는 기능" 처리 방식을 안다.
function PlaceholderLink({ children, className }) {
  const { t } = useLanguage();

  return (
    <a href="#" className={className} title={t('아직 준비 중이에요')} onClick={(e) => e.preventDefault()}>
      {children}
    </a>
  );
}

export default PlaceholderLink;
