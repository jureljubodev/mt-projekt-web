import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import styles from './Navbar.module.css';
import { useTranslation } from 'react-i18next';
import LangSwitcher from '../LangSwitcher/LangSwitcher';

export default function Navbar() {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const isScrolled = isMobile ? true : scrolled;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile]);

  const navLinks = [
    { to: '/',        label: t('nav.home') },
    { to: '/ponuda',  label: t('nav.properties') },
    { to: '/o-nama',  label: t('nav.about') },
    { to: '/kontakt', label: t('nav.contact') },
  ];

  return (
    <>
      <header className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}>
        <div className={`container ${styles.inner}`}>
          {/* Logo */}
          <Link to="/" className={styles.logo}>
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
            <Link to="/kontakt" className={`btn btn-primary ${styles.ctaBtn}`}>
              {t('nav.cta')}
            </Link>
          </div>
          {isMobile && (
            <div className={styles.mobileTopActions}>
              <LangSwitcher />
              <Link to="/kontakt" className={`btn btn-primary ${styles.mobileTopCta}`}>
                {t('nav.cta')}
              </Link>
            </div>
          )}
        </div>

        {isMobile && (
          <div className={styles.mobileInlineNav}>
            <div className="container">
              <ul className={styles.mobileInlineList}>
                {navLinks.map(({ to, label }) => (
                  <li key={to}>
                    <NavLink
                      to={to}
                      end={to === '/'}
                      className={({ isActive }) =>
                        `${styles.mobileInlineLink} ${isActive ? styles.active : ''}`
                      }
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
