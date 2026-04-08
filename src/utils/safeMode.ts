import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const SAFE_MODE_KEY = 'pm_safe_mode';

function parseSafeMode(search: string): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    const params = new URLSearchParams(search);
    const fromQuery = params.get('safe');

    if (fromQuery === '1') {
      window.localStorage.setItem(SAFE_MODE_KEY, '1');
      return true;
    }

    if (fromQuery === '0') {
      window.localStorage.removeItem(SAFE_MODE_KEY);
      return false;
    }

    return window.localStorage.getItem(SAFE_MODE_KEY) === '1';
  } catch {
    return false;
  }
}

export function useSafeMode(): boolean {
  const location = useLocation();
  const [safeMode, setSafeMode] = useState<boolean>(() => parseSafeMode(window.location.search));

  useEffect(() => {
    setSafeMode(parseSafeMode(location.search));
  }, [location.search]);

  return safeMode;
}
