import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './Footer.module.css';
import type { LegalPolicyType } from '../Legal/LegalModals';
import { PROJECTS_CATALOG } from '../../data/projectsCatalog';

interface FooterProps {
  onOpenPolicy: (policy: LegalPolicyType) => void;
}

const BUILD_MARK = 'build-2026-04-08-7';

export default function Footer({ onOpenPolicy }: FooterProps) {
  const { t } = useTranslation();
  const year = new Date().getFullYear();
  const featuredProjects = PROJECTS_CATALOG.filter((project) => project.featured).slice(0, 4);

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        {/* Brand column */}
        <div className={styles.brand}>
          <Link to="/" className={styles.logo}>
            <span className={styles.logoMt}>MT</span>
            <span className={styles.logoText}>Projekt MT</span>
          </Link>
          <p className={styles.tagline}>
            {t('footer.tagline')}
          </p>
          <address className={styles.address}>
            <span>Stolačka 25, 10 000 Zagreb</span>
            <span>Hrvatska</span>
            <a href="tel:+385992999001">GSM: 099 / 2999 001</a>
            <a href="mailto:projektmt313@gmail.com">projektmt313@gmail.com</a>
          </address>
        </div>

        {/* Navigation column */}
        <div className={styles.nav}>
          <h4 className={styles.colTitle}>{t('footer.navCol')}</h4>
          <ul>
            <li><Link to="/">{t('nav.home')}</Link></li>
            <li><Link to="/ponuda">{t('nav.properties')}</Link></li>
            <li><Link to="/o-nama">{t('nav.about')}</Link></li>
            <li><Link to="/kontakt">{t('nav.contact')}</Link></li>
          </ul>
        </div>

        {/* Projects column */}
        <div className={styles.nav}>
          <h4 className={styles.colTitle}>{t('footer.projectsCol')}</h4>
          <ul>
            {featuredProjects.map((project) => (
              <li key={project.id}>
                <Link to={`/ponuda/${project.slug}`}>{t(`projects.${project.id}.title`)}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className={`container ${styles.bottomInner}`}>
          <div className={styles.bottomMeta}>
            <p>
            &copy; {year} {t('common.copyright')}
            </p>
            <p className={styles.buildMark}>{BUILD_MARK}</p>
          </div>
          <div className={styles.legalLinks}>
            <button type="button" onClick={() => onOpenPolicy('privacy')} className={styles.legalBtn}>
              {t('legal.privacyTitle', { defaultValue: 'Privacy Policy' })}
            </button>
            <button type="button" onClick={() => onOpenPolicy('terms')} className={styles.legalBtn}>
              {t('legal.termsTitle', { defaultValue: 'Terms of Service' })}
            </button>
            <button type="button" onClick={() => onOpenPolicy('cookies')} className={styles.legalBtn}>
              {t('legal.cookiesTitle', { defaultValue: 'Cookie Policy' })}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
