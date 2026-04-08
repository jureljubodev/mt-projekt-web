import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import styles from './Home.module.css';
import landingImg from '../../assets/images/landingImg.jpg';
import aboutCraftVisual from '../../assets/images/about-craft-visual.svg';
import { PROJECTS_CATALOG, loadProjectThumbnailImage } from '../../data/projectsCatalog';
import Seo from '../../components/Seo/Seo';

export default function Home() {
  const { t } = useTranslation();

  const featuredProjects = PROJECTS_CATALOG.filter((project) => project.featured).slice(0, 4);
  const [featuredImages, setFeaturedImages] = useState<Record<string, string | null>>({});

  useEffect(() => {
    let cancelled = false;

    Promise.all(
      featuredProjects.map(async (project) => ({
        id: project.id,
        src: await loadProjectThumbnailImage(project),
      })),
    ).then((entries) => {
      if (cancelled) return;
      const next: Record<string, string | null> = {};
      for (const entry of entries) next[entry.id] = entry.src;
      setFeaturedImages(next);
    });

    return () => {
      cancelled = true;
    };
  }, [featuredProjects]);

  const stats = [
    { value: '20+', label: t('home.stat1') },
    { value: '50+', label: t('home.stat2') },
    { value: '200+', label: t('home.stat3') },
    { value: '2', label: t('home.stat4') },
  ];

  const pageTitle = `${t('home.heroTitle1')} | Projekt MT`;
  const pageDescription = t('home.heroSubtitle');

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Projekt MT d.o.o.',
    url: 'https://projekt-mt.hr',
    logo: 'https://projekt-mt.hr/favicon.svg',
    email: 'mailto:projektmt313@gmail.com',
    telephone: '+385992999001',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Stolacka 25',
      postalCode: '10000',
      addressLocality: 'Zagreb',
      addressCountry: 'HR',
    },
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Projekt MT',
    url: 'https://projekt-mt.hr',
    inLanguage: 'hr',
  };

  return (
    <div className={styles.page}>
      <Seo
        title={pageTitle}
        description={pageDescription}
        path="/"
        image={landingImg}
        type="website"
        jsonLd={[organizationSchema, websiteSchema]}
      />

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <img
          src={landingImg}
          alt={t('home.heroLabel')}
          className={styles.heroBg}
          fetchPriority="high"
        />
        <div className={styles.heroOverlay} />
        <div className={`container ${styles.heroContent}`}>
          <span className={`section-label ${styles.heroLabel}`}>{t('home.heroLabel')}</span>
          <h1 className={styles.heroTitle}>
            {t('home.heroTitle1')}&nbsp;<br />
            <em>{t('home.heroTitle2')}</em>
          </h1>
          <p className={styles.heroSubtitle}>{t('home.heroSubtitle')}</p>
          <div className={styles.heroActions}>
            <Link to="/ponuda" className="btn btn-primary">
              {t('home.heroCta1')}
            </Link>
            <Link to="/o-nama" className="btn btn-outline">
              {t('home.heroCta2')}
            </Link>
          </div>
        </div>
        <div className={styles.heroScroll} aria-hidden="true">
          <span />
        </div>
      </section>

      {/* ── Stats ── */}
      <section className={styles.statsBar}>
        <div className="container">
          <ul className={styles.statsList}>
            {stats.map(({ value, label }) => (
              <li key={label} className={styles.statItem}>
                <strong className={styles.statValue}>{value}</strong>
                <span className={styles.statLabel}>{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── About intro ── */}
      <section className={`section ${styles.about}`}>
        <div className={`container ${styles.aboutGrid}`}>
          <div className={styles.aboutImage}>
            <div className={styles.imagePlaceholder}>
              <img
                src={aboutCraftVisual}
                alt={t('home.aboutHeading')}
                className={styles.aboutVisual}
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
          <div className={styles.aboutText}>
            <span className="section-label">{t('home.aboutLabel')}</span>
            <h2>{t('home.aboutHeading')}</h2>
            <div className="gold-divider" />
            <p>{t('home.aboutP1')}</p>
            <p className={styles.aboutParagraph}>{t('home.aboutP2')}</p>
            <Link to="/o-nama" className="btn btn-outline-dark">
              {t('home.aboutCta')}
            </Link>
          </div>
        </div>
      </section>

      {/* ── Featured projects ── */}
      <section className={`section ${styles.projects}`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <span className="section-label">{t('home.projectsLabel')}</span>
              <h2>{t('home.projectsHeading')}</h2>
              <div className="gold-divider" />
            </div>
            <Link to="/ponuda" className="btn btn-outline-dark">
              {t('common.seeAll')}
            </Link>
          </div>

          <div className={styles.projectsGrid}>
            {featuredProjects.map((project) => (
              <article key={project.id} className={styles.projectCard}>
                <div className={styles.cardImageWrap}>
                  {featuredImages[project.id] ? (
                    <img
                      src={featuredImages[project.id] ?? undefined}
                      alt={t(`projects.${project.id}.title`)}
                      className={styles.cardImage}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className={styles.cardImagePlaceholder} />
                  )}
                  <span className={`${styles.cardTag} ${project.status === 'sold' ? styles.sold : styles.available}`}>
                    {project.status === 'sold' ? t('common.sold') : t('common.available')}
                  </span>
                </div>
                <div className={styles.cardBody}>
                  <p className={styles.cardLocation}>{t(`projects.${project.id}.location`)}</p>
                  <h3 className={styles.cardTitle}>{t(`projects.${project.id}.title`)}</h3>
                  <p className={styles.cardDesc}>{t(`projects.${project.id}.shortDesc`)}</p>
                  <Link to={`/ponuda/${project.slug}`} className={styles.cardLink}>
                    {t('common.learnMore')}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA banner ── */}
      <section className={styles.ctaBanner}>
        <div className="container">
          <span className="section-label">{t('home.ctaLabel')}</span>
          <h2 className={styles.ctaTitle}>{t('home.ctaHeading')}</h2>
          <p className={styles.ctaText}>{t('home.ctaText')}</p>
          <Link to="/kontakt" className="btn btn-primary">
            {t('home.ctaBtn')}
          </Link>
        </div>
      </section>
    </div>
  );
}
