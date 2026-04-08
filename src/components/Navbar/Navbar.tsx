import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import styles from './Navbar.module.css';
import { useTranslation } from 'react-i18next';
import LangSwitcher from '../LangSwitcher/LangSwitcher';

export default function Navbar() {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
      <header className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
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

          {/* Hamburger button */}
          <button
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
        </div>
      </header>

      {/* Mobile menu overlay */}
      <div
        id="mobile-menu"
        className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ''}`}
        aria-hidden={!menuOpen}
      >
        <nav aria-label="Mobilna navigacija">
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
          <Link
            to="/kontakt"
            className={`btn btn-primary ${styles.mobileCta}`}
            onClick={closeMenu}
          >
            {t('nav.cta')}
          </Link>
        </nav>
      </div>

      {/* Backdrop */}
      {menuOpen && (
        <div
          className={styles.backdrop}
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}
    </>
  );
}
