import { useEffect, useState } from 'react';
import { loadA11y, saveA11y, applyA11y } from '../lib/a11y';

function useA11y() {
  const [settings, setSettings] = useState(loadA11y);

  // 설정이 바뀔 때마다 <html> 속성에 반영하고 저장한다. (화면 밖의 시스템인 DOM·저장소와 맞추는 일이라 effect가 맞다)
  useEffect(() => {
    applyA11y(settings);
    saveA11y(settings);
  }, [settings]);

  const toggle = (key) => setSettings((s) => ({ ...s, [key]: !s[key] }));

  return { settings, toggle };
}

export default useA11y;
