import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import styles from './Navbar.module.css';
import { useTranslation } from 'react-i18next';
import LangSwitcher from '../LangSwitcher/LangSwitcher';
import { useSafeMode } from '../../utils/safeMode';
import { subscribeToMediaQuery } from '../../utils/mediaQuery';

export default function Navbar() {
  const { t } = useTranslation();
  const safeMode = useSafeMode();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    return subscribeToMediaQuery('(min-width: 768px)', (isDesktop) => {
      if (isDesktop) {
        setMenuOpen(false);
      }
    });
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const navLinks = [
    { to: '/',        label: t('nav.home') },
    { to: '/ponuda',  label: t('nav.properties') },
    { to: '/o-nama',  label: t('nav.about') },
    { to: '/kontakt', label: t('nav.contact') },
  ];

  return (
    <>
      <header className={`${styles.navbar} ${scrolled || safeMode ? styles.scrolled : ''} ${safeMode ? styles.safeMode : ''}`}>
        <div className={`container ${styles.inner}`}>
          {/* Logo */}
          <Link to="/" className={styles.logo} onClick={closeMenu}>
            <span className={styles.logoMt}>MT</span>
            <span className={styles.logoText}>Projekt&nbsp;MT</span>
          </Link>

          {/* Desktop nav */}
          <nav className={styles.desktopNav} aria-label={t('nav.home')}>
            <ul className={styles.navList}>
              {navLinks.map(({ to, label }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={to === '/'}
                    className={({ isActive }) =>
                      `${styles.navLink} ${isActive ? styles.active : ''}`
                    }
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Lang switcher + CTA */}
          <div className={styles.navActions}>
            <LangSwitcher />
            <Link to="/kontakt" className={`btn btn-primary ${styles.ctaBtn}`} onClick={closeMenu}>
              {t('nav.cta')}
            </Link>
          </div>

          {!safeMode && (
            <button
              type="button"
              className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ''}`}
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label={menuOpen ? 'Zatvori meni' : 'Otvori meni'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              <span className={styles.bar} />
              <span className={styles.bar} />
              <span className={styles.bar} />
            </button>
          )}
        </div>

        {!safeMode && menuOpen && (
          <div id="mobile-menu" className={styles.mobileMenu}>
            <div className="container">
              <div className={styles.mobileLang}>
                <LangSwitcher />
              </div>
              <ul className={styles.mobileNavList}>
                {navLinks.map(({ to, label }) => (
                  <li key={to}>
                    <NavLink
                      to={to}
                      end={to === '/'}
                      className={({ isActive }) =>
                        `${styles.mobileNavLink} ${isActive ? styles.active : ''}`
                      }
                      onClick={closeMenu}
                    >
                      {label}
                    </NavLink>
                  </li>
                ))}
              </ul>
              <Link to="/kontakt" className={`btn btn-primary ${styles.mobileCta}`} onClick={closeMenu}>
                {t('nav.cta')}
              </Link>
            </div>
          </div>
        )}

        {safeMode && (
          <div className={styles.safeNavRow}>
            <div className="container">
              <ul className={styles.safeNavList}>
                {navLinks.map(({ to, label }) => (
                  <li key={to}>
                    <NavLink
                      to={to}
                      end={to === '/'}
                      className={({ isActive }) => `${styles.safeNavLink} ${isActive ? styles.active : ''}`}
                    >
                      {label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
