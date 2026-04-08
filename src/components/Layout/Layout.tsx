import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import CookieBanner from '../Legal/CookieBanner';
import LegalModals, { type LegalPolicyType } from '../Legal/LegalModals';
import styles from './Layout.module.css';
import { useEffect } from 'react';

export default function Layout() {
  const [activePolicy, setActivePolicy] = useState<LegalPolicyType | null>(null);
  const location = useLocation();

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      if (location.hash) {
        const targetId = decodeURIComponent(location.hash.slice(1));
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          const navbarOffset = 96;
          const top = targetEl.getBoundingClientRect().top + window.scrollY - navbarOffset;
          window.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' });
          return;
        }
      }

      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [location.pathname, location.hash]);

  return (
    <div className={styles.layout}>
      <Navbar />
      <main className={styles.main}>
        <div key={`${location.pathname}${location.hash}`} className={styles.routeContent}>
          <Outlet />
        </div>
      </main>
      <Footer onOpenPolicy={setActivePolicy} />
      <CookieBanner onOpenPolicy={setActivePolicy} />
      <LegalModals activePolicy={activePolicy} onClose={() => setActivePolicy(null)} />
    </div>
  );
}
