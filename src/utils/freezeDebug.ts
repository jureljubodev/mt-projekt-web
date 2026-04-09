const DEBUG_PARAM = 'debugFreeze';
const DEBUG_ENABLED_KEY = 'pm_freeze_debug_enabled';
const DEBUG_LOG_KEY = 'pm_freeze_debug_logs';
const DEBUG_WINDOW_NAME_KEY = '__pmFreezeDebugLogs__';
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

  try {
    return window.localStorage.getItem(DEBUG_ENABLED_KEY) === '1';
  } catch {
    return false;
  }
}

export function setFreezeDebugEnabled(enabled: boolean): void {
  if (!isBrowser()) {
    return;
  }

  try {
    if (enabled) {
      window.localStorage.setItem(DEBUG_ENABLED_KEY, '1');
      return;
    }

    window.localStorage.removeItem(DEBUG_ENABLED_KEY);
  } catch {
    // no-op
  }
}

function readWindowNameLines(): string[] {
  if (!isBrowser()) {
    return [];
  }

  try {
    const raw = window.name || '';
    if (!raw.startsWith(`${DEBUG_WINDOW_NAME_KEY}:`)) {
      return [];
    }

    const payload = raw.slice(`${DEBUG_WINDOW_NAME_KEY}:`.length);
    const parsed = JSON.parse(payload);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((line): line is string => typeof line === 'string').slice(-MAX_LOG_LINES);
  } catch {
    return [];
  }
}

function writeWindowNameLines(lines: string[]): void {
  if (!isBrowser()) {
    return;
  }

  try {
    window.name = `${DEBUG_WINDOW_NAME_KEY}:${JSON.stringify(lines.slice(-MAX_LOG_LINES))}`;
  } catch {
    // no-op
  }
}

function readStorageLines(): string[] {
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

    return parsed.filter((line): line is string => typeof line === 'string').slice(-MAX_LOG_LINES);
  } catch {
    return [];
  }
}

function writeStorageLines(lines: string[]): void {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.setItem(DEBUG_LOG_KEY, JSON.stringify(lines.slice(-MAX_LOG_LINES)));
  } catch {
    // no-op
  }
}

export function readFreezeDebugLines(): string[] {
  const fromStorage = readStorageLines();
  if (fromStorage.length > 0) {
    return fromStorage.slice().reverse();
  }

  const fromWindowName = readWindowNameLines();
  return fromWindowName.slice().reverse();
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
    writeStorageLines(next);
    writeWindowNameLines(next);
  } catch {
    // Never allow debug logging to disrupt runtime behavior.
  }
}

export function clearFreezeDebugLines(): void {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.removeItem(DEBUG_LOG_KEY);
  } catch {
    // no-op
  }
  window.name = '';
}

export function getFreezeDebugTransportInfo(): string {
  if (!isBrowser()) {
    return 'no-browser';
  }

  let storage = 'ok';
  try {
    const probeKey = '__pmFreezeProbe__';
    window.localStorage.setItem(probeKey, '1');
    window.localStorage.removeItem(probeKey);
  } catch {
    storage = 'blocked';
  }

  let windowName = 'ok';
  try {
    const previous = window.name;
    window.name = `${previous}`;
  } catch {
    windowName = 'blocked';
  }

  return `storage:${storage} windowName:${windowName}`;
}
