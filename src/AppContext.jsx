import { createContext, useContext } from 'react';

// 예약·쿠폰·후기·로그인처럼 여러 컴포넌트가 함께 쓰는 값을 props로 한 단계씩 내리지 않고 한 번에 내려준다.
const AppContext = createContext(null);

export const AppProvider = AppContext.Provider;

export function useApp() {
  return useContext(AppContext);
}
