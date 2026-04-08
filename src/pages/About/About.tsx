import styles from './About.module.css';
import { useTranslation } from 'react-i18next';
import Seo from '../../components/Seo/Seo';
import aboutCraftVisual from '../../assets/images/about-craft-visual.svg';

export default function About() {
  const { t } = useTranslation();

  const pageTitle = `${t('about.heading')} | Projekt MT`;
  const pageDescription = t('about.description');

  const values = [
    {
      icon: '◈',
      title: t('about.value1Title'),
      description: t('about.value1Desc'),
    },
    {
      icon: '◈',
      title: t('about.value2Title'),
      description: t('about.value2Desc'),
    },
    {
      icon: '◈',
      title: t('about.value3Title'),
      description: t('about.value3Desc'),
    },
    {
      icon: '◈',
      title: t('about.value4Title'),
      description: t('about.value4Desc'),
    },
  ];

  const team = [
    {
      name: t('about.team1Name'),
      role: t('about.team1Role'),
      description: t('about.team1Desc'),
    },
    {
      name: t('about.team2Name'),
      role: t('about.team2Role'),
      description: t('about.team2Desc'),
    },
    {
      name: t('about.team3Name'),
      role: t('about.team3Role'),
      description: t('about.team3Desc'),
    },
  ];

  return (
    <div className={styles.page}>
      <Seo
        title={pageTitle}
        description={pageDescription}
        path="/o-nama"
        type="website"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          name: pageTitle,
          description: pageDescription,
          url: 'https://projekt-mt.hr/o-nama',
        }}
      />

      {/* Page header */}
      <section className={styles.pageHeader}>
        <div className="container">
          <span className="section-label">{t('about.label')}</span>
          <h1>{t('about.heading')}</h1>
          <div className="gold-divider" />
          <p className={styles.headerDesc}>{t('about.description')}</p>
        </div>
      </section>

      {/* Story section */}
      <section className={`section ${styles.story}`}>
        <div className={`container ${styles.storyGrid}`}>
          <div className={styles.storyText}>
            <span className="section-label">{t('about.storyLabel')}</span>
            <h2>{t('about.storyHeading')}</h2>
            <div className="gold-divider" />
            <p>{t('about.storyP1')}</p>
            <p className={styles.paragraph}>{t('about.storyP2')}</p>
            <p className={styles.paragraph}>{t('about.storyP3')}</p>
            <p className={styles.paragraph}>{t('about.storyP4')}</p>
          </div>
          <div className={styles.storyMedia}>
            <div className={styles.imagePlaceholder}>
              <img
                src={aboutCraftVisual}
                alt={t('about.storyHeading')}
                className={styles.storyVisual}
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className={styles.yearBadge}>
              <strong>2001</strong>
              <span>{t('common.founded')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Values section */}
      <section className={`section ${styles.valuesSection}`}>
        <div className="container">
          <div className={styles.sectionCenter}>
            <span className="section-label">{t('about.valuesLabel')}</span>
            <h2>{t('about.valuesHeading')}</h2>
            <div className="gold-divider" style={{ margin: '1.25rem auto' }} />
          </div>
          <div className={styles.valuesGrid}>
            {values.map(({ icon, title, description }) => (
              <div key={title} className={styles.valueCard}>
                <span className={styles.valueIcon} aria-hidden="true">{icon}</span>
                <h3 className={styles.valueTitle}>{title}</h3>
                <p className={styles.valueDesc}>{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className={`section ${styles.teamSection}`}>
        <div className="container">
          <span className="section-label">{t('about.teamLabel')}</span>
          <h2>{t('about.teamHeading')}</h2>
          <div className="gold-divider" />
          <div className={styles.teamGrid}>
            {team.map(({ name, role, description }) => (
              <div key={name} className={styles.teamCard}>
                <div className={styles.teamAvatar} aria-hidden="true">
                  {name.charAt(0)}
                </div>
                <h3 className={styles.teamName}>{name}</h3>
                <p className={styles.teamRole}>{role}</p>
                <p className={styles.teamDesc}>{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
