const DEBUG_PARAM = 'debugFreeze';
const DEBUG_ENABLED_KEY = 'pm_freeze_debug_enabled';
const DEBUG_LOG_KEY = 'pm_freeze_debug_logs';
const MAX_LOG_LINES = 120;

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

function hasDebugParam(): boolean {
  if (!isBrowser()) {
    return false;
  }

  const fromSearch = new URLSearchParams(window.location.search).get(DEBUG_PARAM) === '1';
  if (fromSearch) {
    return true;
  }

  const hash = window.location.hash;
  const queryIndex = hash.indexOf('?');
  if (queryIndex === -1) {
    return false;
  }

  return new URLSearchParams(hash.slice(queryIndex + 1)).get(DEBUG_PARAM) === '1';
}

export function isFreezeDebugEnabled(): boolean {
  if (!isBrowser()) {
    return false;
  }

  if (hasDebugParam()) {
    return true;
  }

  return window.localStorage.getItem(DEBUG_ENABLED_KEY) === '1';
}

export function setFreezeDebugEnabled(enabled: boolean): void {
  if (!isBrowser()) {
    return;
  }

  if (enabled) {
    window.localStorage.setItem(DEBUG_ENABLED_KEY, '1');
    return;
  }

  window.localStorage.removeItem(DEBUG_ENABLED_KEY);
}

export function readFreezeDebugLines(): string[] {
  if (!isBrowser()) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(DEBUG_LOG_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((line): line is string => typeof line === 'string').slice(-MAX_LOG_LINES).reverse();
  } catch {
    return [];
  }
}

export function logFreezeDebug(message: string): void {
  if (!isFreezeDebugEnabled()) {
    return;
  }

  try {
    const timestamp = new Date().toISOString().slice(11, 19);
    const line = `${timestamp} ${message}`;
    const existing = readFreezeDebugLines().reverse();
    const next = [...existing, line].slice(-MAX_LOG_LINES);
    window.localStorage.setItem(DEBUG_LOG_KEY, JSON.stringify(next));
  } catch {
    // Never allow debug logging to disrupt runtime behavior.
  }
}

export function clearFreezeDebugLines(): void {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(DEBUG_LOG_KEY);
}
