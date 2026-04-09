import { useCallback, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import CookieBanner from '../Legal/CookieBanner';
import LegalModals, { type LegalPolicyType } from '../Legal/LegalModals';
import styles from './Layout.module.css';
import { useSafeMode } from '../../utils/safeMode';

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
  const [debugOpen, setDebugOpen] = useState(false);
  const [debugLines, setDebugLines] = useState<string[]>([]);
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
    return () => {
      document.body.removeAttribute('data-safe-mode');
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

    if (!debugEnabled) {
      setDebugLines([]);
      setDebugOpen(false);
      return;
    }

    const pushLine = (line: string) => {
      const time = new Date().toISOString().slice(11, 19);
      setDebugLines((prev) => [`${time} ${line}`, ...prev].slice(0, 14));
    };

    const describeTarget = (target: EventTarget | null): string => {
      if (!(target instanceof Element)) {
        return 'unknown';
      }

      const tag = target.tagName.toLowerCase();
      const id = target.id ? `#${target.id}` : '';
      const cls = typeof target.className === 'string' && target.className
        ? `.${target.className.split(/\s+/).slice(0, 2).join('.')}`
        : '';

      return `${tag}${id}${cls}`;
    };

    const onError = (event: ErrorEvent) => {
      pushLine(`error ${event.message || 'unknown error'}`);
    };

    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = typeof event.reason === 'string' ? event.reason : JSON.stringify(event.reason);
      pushLine(`rejection ${reason || 'unknown rejection'}`);
    };

    const onTouchStart = (event: TouchEvent) => {
      pushLine(`touchstart ${describeTarget(event.target)}`);
    };

    const onClick = (event: MouseEvent) => {
      pushLine(`click ${describeTarget(event.target)}`);
    };

    const onVisibilityChange = () => {
      pushLine(`visibility ${document.visibilityState}`);
    };

    const onPageHide = () => {
      pushLine('pagehide');
    };

    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onUnhandledRejection);
    document.addEventListener('touchstart', onTouchStart, { passive: true });
    document.addEventListener('click', onClick, true);
    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('pagehide', onPageHide);

    pushLine('debugFreeze enabled');

    return () => {
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onUnhandledRejection);
      document.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('click', onClick, true);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('pagehide', onPageHide);
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
