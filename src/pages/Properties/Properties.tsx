import { Link } from 'react-router-dom';
import styles from './Properties.module.css';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { PROJECTS_CATALOG, loadProjectThumbnailImage, type ProjectCatalogItem, type ProjectStatus } from '../../data/projectsCatalog';
import Seo from '../../components/Seo/Seo';

interface Project {
  id: string;
  slug: string;
  title: string;
  location: string;
  description: string;
  status: ProjectStatus;
  features: string[];
  catalogItem: ProjectCatalogItem;
}

export default function Properties() {
  const { t } = useTranslation();
  const projects: Project[] = PROJECTS_CATALOG.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: t(`projects.${p.id}.title`),
    location: t(`projects.${p.id}.location`),
    description: t(`projects.${p.id}.fullDesc`),
    status: p.status,
    features: t(`projects.${p.id}.features`, { returnObjects: true }) as string[],
    catalogItem: p,
  }));

  const available = projects.filter((p) => p.status === 'available');
  const sold = projects.filter((p) => p.status === 'sold');

  const pageTitle = `${t('properties.heading')} | Projekt MT`;
  const pageDescription = t('properties.description');

  return (
    <div className={styles.page}>
      <Seo
        title={pageTitle}
        description={pageDescription}
        path="/ponuda"
        type="website"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: pageTitle,
          description: pageDescription,
          url: 'https://projekt-mt.hr/ponuda',
        }}
      />

      {/* Page header */}
      <section className={styles.pageHeader}>
        <div className="container">
          <span className="section-label">{t('properties.label')}</span>
          <h1>{t('properties.heading')}</h1>
          <div className="gold-divider" />
          <p className={styles.headerDesc}>{t('properties.description')}</p>
        </div>
      </section>

      {/* Available projects */}
      {available.length > 0 && (
        <section className={`section ${styles.projectsSection}`}>
          <div className="container">
            <h2 className={styles.subheading}>{t('properties.availableHeading')}</h2>
            <div className={styles.grid}>
              {available.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Sold projects */}
      {sold.length > 0 && (
        <section className={`section ${styles.projectsSection} ${styles.altBg}`}>
          <div className="container">
            <h2 className={styles.subheading}>{t('properties.soldHeading')}</h2>
            <div className={styles.grid}>
              {sold.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const { t } = useTranslation();
  const [coverImage, setCoverImage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadProjectThumbnailImage(project.catalogItem).then((img) => {
      if (!cancelled) setCoverImage(img);
    });
    return () => {
      cancelled = true;
    };
  }, [project.catalogItem]);

  return (
    <article className={`${styles.card} ${project.status === 'sold' ? styles.cardSold : ''}`}>
      <div className={styles.cardImage}>
        {coverImage && (
          <img
            src={coverImage}
            alt={project.title}
            className={styles.cardImageAsset}
            loading="lazy"
            decoding="async"
          />
        )}
        <span className={`${styles.badge} ${project.status === 'sold' ? styles.badgeSold : styles.badgeAvailable}`}>
          {project.status === 'sold' ? t('common.sold') : t('common.available')}
        </span>
      </div>
      <div className={styles.cardBody}>
        <p className={styles.cardLocation}>{project.location}</p>
        <h3 className={styles.cardTitle}>{project.title}</h3>
        <p className={styles.cardDesc}>{project.description}</p>
        <ul className={styles.features}>
          {project.features.map((f) => (
            <li key={f} className={styles.feature}>
              <span className={styles.featureDot} aria-hidden="true" />
              {f}
            </li>
          ))}
        </ul>
        <Link to={`/ponuda/${project.slug}`} className={styles.detailLink}>
          {t('common.learnMore')}
        </Link>
      </div>
    </article>
  );
}
