import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './NotFound.module.css';
import Seo from '../../components/Seo/Seo';

export default function NotFound() {
  const { t } = useTranslation();
  const pageTitle = `${t('notFound.heading')} | Projekt MT`;
  const pageDescription = t('notFound.description');

  return (
    <div className={styles.page}>
      <Seo
        title={pageTitle}
        description={pageDescription}
        path="/404"
        noindex
      />

      <div className={`container ${styles.content}`}>
        <span className={styles.code} aria-hidden="true">404</span>
        <h1>{t('notFound.heading')}</h1>
        <div className="gold-divider" style={{ margin: '1.25rem auto' }} />
        <p className={styles.desc}>{t('notFound.description')}</p>
        <div className={styles.actions}>
          <Link to="/" className="btn btn-primary">
            {t('notFound.homeCta')}
          </Link>
          <Link to="/ponuda" className="btn btn-outline-dark">
            {t('notFound.propertiesCta')}
          </Link>
        </div>
      </div>
    </div>
  );
}
