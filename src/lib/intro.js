const SEEN_KEY = 'kany.introSeen';

// sessionStorage는 브라우저 탭을 닫으면 지워진다. 그래서 탭을 새로 열 때마다 한 번씩만 시작 화면이 나온다.
// (localStorage면 영원히 한 번만 나오고, 새로고침마다 나오게 하면 방문자가 귀찮다.)
export function shouldShowIntro() {
  return !sessionStorage.getItem(SEEN_KEY);
}

export function markIntroSeen() {
  sessionStorage.setItem(SEEN_KEY, '1');
}
