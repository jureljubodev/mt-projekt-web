import { useCallback, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import CookieBanner from '../Legal/CookieBanner';
import LegalModals, { type LegalPolicyType } from '../Legal/LegalModals';
import styles from './Layout.module.css';
import { useSafeMode } from '../../utils/safeMode';
import {
  clearFreezeDebugLines,
  getFreezeDebugTransportInfo,
  logFreezeDebug,
  readFreezeDebugLines,
  setFreezeDebugEnabled,
} from '../../utils/freezeDebug';

function hasDebugFreezeFlag(search: string, hash: string): boolean {
  const fromSearch = new URLSearchParams(search).get('debugFreeze') === '1';
  if (fromSearch) {
    return true;
  }

  const queryIndex = hash.indexOf('?');
  if (queryIndex === -1) {
    return false;
  }

  const hashQuery = hash.slice(queryIndex + 1);
  return new URLSearchParams(hashQuery).get('debugFreeze') === '1';
}

export default function Layout() {
  const [activePolicy, setActivePolicy] = useState<LegalPolicyType | null>(null);
  const [debugOpen, setDebugOpen] = useState(true);
  const [debugLines, setDebugLines] = useState<string[]>([]);
  const [debugTransport, setDebugTransport] = useState('');
  const location = useLocation();
  const safeMode = useSafeMode();
  const handleOpenPolicy = useCallback((policy: LegalPolicyType) => {
    setActivePolicy(policy);
  }, []);
  const handleClosePolicy = useCallback(() => {
    setActivePolicy(null);
  }, []);

  useEffect(() => {
    document.body.setAttribute('data-safe-mode', safeMode ? '1' : '0');

    const touchSafe = window.matchMedia('(pointer: coarse)').matches;
    document.body.setAttribute('data-touch-safe', touchSafe ? '1' : '0');

    return () => {
      document.body.removeAttribute('data-safe-mode');
      document.body.removeAttribute('data-touch-safe');
    };
  }, [safeMode]);

  useEffect(() => {
    if (!('scrollRestoration' in window.history)) {
      return;
    }

    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';

    return () => {
      window.history.scrollRestoration = previous;
    };
  }, []);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      if (location.hash) {
        const targetId = decodeURIComponent(location.hash.slice(1));
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          const navbarOffset = 96;
          const top = targetEl.getBoundingClientRect().top + window.scrollY - navbarOffset;
          window.scrollTo({ top: Math.max(top, 0), left: 0, behavior: 'auto' });
          return;
        }
      }

      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const debugEnabled = hasDebugFreezeFlag(location.search, window.location.hash);
    setFreezeDebugEnabled(debugEnabled);

    if (!debugEnabled) {
      setDebugLines([]);
      setDebugOpen(false);
      setDebugTransport('');
      return;
    }

    setDebugOpen(true);
    setDebugTransport(getFreezeDebugTransportInfo());
    setDebugLines(readFreezeDebugLines());
    const syncInterval = window.setInterval(() => {
      setDebugLines(readFreezeDebugLines());
    }, 700);
    const heartbeatInterval = window.setInterval(() => {
      logFreezeDebug('hb');
    }, 2500);

    const describeInteractiveTarget = (eventTarget: EventTarget | null): string => {
      if (!(eventTarget instanceof Element)) {
        return 'unknown';
      }

      const interactive = eventTarget.closest('button, a, [role="button"]');
      if (!interactive) {
        return eventTarget.tagName.toLowerCase();
      }

      const tag = interactive.tagName.toLowerCase();
      const aria = interactive.getAttribute('aria-label');
      const id = interactive.id;

      if (aria) {
        return `${tag}:${aria}`;
      }

      if (id) {
        return `${tag}#${id}`;
      }

      const text = (interactive.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 36);
      return text ? `${tag}:${text}` : tag;
    };

    const onError = (event: ErrorEvent) => {
      logFreezeDebug(`error ${event.message || 'unknown error'}`);
    };

    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      let reason = 'unknown rejection';
      if (typeof event.reason === 'string') {
        reason = event.reason;
      } else {
        try {
          reason = JSON.stringify(event.reason);
        } catch {
          reason = String(event.reason);
        }
      }
      logFreezeDebug(`rejection ${reason}`);
    };

    const onVisibilityChange = () => {
      logFreezeDebug(`visibility ${document.visibilityState}`);
    };

    const onPageHide = () => {
      logFreezeDebug('pagehide');
    };

    const onPointerDownCapture = (event: Event) => {
      logFreezeDebug(`pointerdown ${describeInteractiveTarget(event.target)}`);
    };

    const onClickCapture = (event: Event) => {
      logFreezeDebug(`click ${describeInteractiveTarget(event.target)}`);
    };

    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onUnhandledRejection);
    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('pagehide', onPageHide);
    document.addEventListener('pointerdown', onPointerDownCapture, true);
    document.addEventListener('click', onClickCapture, true);

    logFreezeDebug('debugFreeze enabled');

    return () => {
      window.clearInterval(syncInterval);
      window.clearInterval(heartbeatInterval);
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onUnhandledRejection);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('pagehide', onPageHide);
      document.removeEventListener('pointerdown', onPointerDownCapture, true);
      document.removeEventListener('click', onClickCapture, true);
    };
  }, [location.search, location.pathname]);

  const debugEnabled = hasDebugFreezeFlag(location.search, window.location.hash);

  return (
    <div className={styles.layout}>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.routeContent}>
          <Outlet />
        </div>
      </main>
      <Footer onOpenPolicy={handleOpenPolicy} />
      <CookieBanner onOpenPolicy={handleOpenPolicy} />
      <LegalModals activePolicy={activePolicy} onClose={handleClosePolicy} />

      {debugEnabled && (
        <div className={styles.debugWrap}>
          <button
            type="button"
            className={styles.debugToggle}
            onClick={() => setDebugOpen((prev) => !prev)}
            aria-expanded={debugOpen}
            aria-label="Toggle runtime debug panel"
          >
            DBG {debugLines.length}
          </button>

          {debugOpen && (
            <div className={styles.debugPanel} role="status" aria-live="polite">
              <p className={styles.debugTransport}>{debugTransport}</p>
              <div className={styles.debugPanelActions}>
                <button
                  type="button"
                  className={styles.debugClearBtn}
                  onClick={() => {
                    clearFreezeDebugLines();
                    setDebugLines([]);
                    logFreezeDebug('debug logs cleared');
                  }}
                >
                  Clear logs
                </button>
              </div>

              {debugLines.length === 0 ? (
                <p>Waiting for events...</p>
              ) : (
                debugLines.map((line) => <p key={line}>{line}</p>)
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
