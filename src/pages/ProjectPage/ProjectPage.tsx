import { Link, Navigate, useParams } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import styles from './ProjectPage.module.css';
import {
  GALLERY_CATEGORY_LABELS,
  PROJECTS_CATALOG,
  type GalleryCategory,
  type ProjectImageItem,
  loadCategoryImages,
  loadProjectCoverImage,
  getProjectPathGroups,
  getProjectBySlug,
} from '../../data/projectsCatalog';
import Seo from '../../components/Seo/Seo';
import { lockBodyScroll } from '../../utils/scrollLock';

const CATEGORY_ORDER: GalleryCategory[] = [
  'gallery',
  'projections',
  'exterior',
  'interior',
  'apartment-1',
  'apartment-2',
  'floorplans',
];

const INITIAL_GALLERY_BATCH = 9;
const GALLERY_BATCH_STEP = 9;

export default function ProjectPage() {
  const { t } = useTranslation();
  const { slug } = useParams();

  const project = slug ? getProjectBySlug(slug) : null;

  // Derive category list synchronously from glob keys (no image loading yet)
  const pathGroups = useMemo(() => {
    if (!project) return null;
    return getProjectPathGroups(project);
  }, [project]);

  const categories = useMemo(
    () => (pathGroups ? CATEGORY_ORDER.filter((key) => pathGroups[key].length > 0) : CATEGORY_ORDER),
    [pathGroups],
  );

  const [activeCategory, setActiveCategory] = useState<GalleryCategory>(CATEGORY_ORDER[0]);
  const [currentImages, setCurrentImages] = useState<ProjectImageItem[]>([]);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [visibleCount, setVisibleCount] = useState(INITIAL_GALLERY_BATCH);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const activeResolved = categories.includes(activeCategory) ? activeCategory : categories[0] ?? CATEGORY_ORDER[0];

  // Load cover image once when project changes
  useEffect(() => {
    if (!project) return;
    let cancelled = false;
    loadProjectCoverImage(project).then((img) => {
      if (!cancelled) setCoverImage(img);
    });
    return () => {
      cancelled = true;
    };
  }, [project]);

  // Load images for active category when it changes
  useEffect(() => {
    if (!pathGroups || !activeResolved) return;
    let cancelled = false;
    const paths = pathGroups[activeResolved] ?? [];
    const firstBatchPaths = paths.slice(0, INITIAL_GALLERY_BATCH);

    Promise.resolve().then(() => {
      if (cancelled) return;
      setIsLoadingImages(true);
      setIsLoadingMore(false);
      setVisibleCount(INITIAL_GALLERY_BATCH);
      setCurrentImages([]);
    });

    loadCategoryImages(firstBatchPaths).then((imgs) => {
      if (cancelled) return;
      setCurrentImages(imgs);
      setIsLoadingImages(false);
    });
    return () => {
      cancelled = true;
    };
  }, [pathGroups, activeResolved]);

  useEffect(() => {
    if (lightboxIndex === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setLightboxIndex(null);
      }
      if (event.key === 'ArrowLeft') {
        setLightboxIndex((prev) => {
          if (prev === null || currentImages.length === 0) return prev;
          return (prev - 1 + currentImages.length) % currentImages.length;
        });
      }
      if (event.key === 'ArrowRight') {
        setLightboxIndex((prev) => {
          if (prev === null || currentImages.length === 0) return prev;
          return (prev + 1) % currentImages.length;
        });
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxIndex, currentImages.length]);

  useEffect(() => {
    if (lightboxIndex === null) {
      return;
    }

    return lockBodyScroll();
  }, [lightboxIndex]);

  if (!slug) return <Navigate to="/ponuda" replace />;
  if (!project) return <Navigate to="/ponuda" replace />;

  const title = t(`projects.${project.id}.title`);
  const location = t(`projects.${project.id}.location`);
  const shortDesc = t(`projects.${project.id}.shortDesc`);
  const fullDesc = t(`projects.${project.id}.fullDesc`);
  const rawFeatures = t(`projects.${project.id}.features`, { returnObjects: true });
  const rawMaterials = t(`projects.${project.id}.materials`, { returnObjects: true, defaultValue: [] });
  const features = Array.isArray(rawFeatures) ? (rawFeatures as string[]) : [];
  const materials = Array.isArray(rawMaterials) ? (rawMaterials as string[]) : [];
  const totalInCategory = pathGroups?.[activeResolved]?.length ?? 0;
  const hasMoreImages = currentImages.length < totalInCategory;
  const lightboxImage = lightboxIndex !== null ? currentImages[lightboxIndex] : null;

  const related = PROJECTS_CATALOG.filter((item) => item.slug !== project.slug).slice(0, 3);

  const handleLoadMore = async () => {
    if (!pathGroups || !activeResolved || isLoadingMore) return;

    const paths = pathGroups[activeResolved] ?? [];
    if (paths.length <= visibleCount) return;

    const nextCount = Math.min(visibleCount + GALLERY_BATCH_STEP, paths.length);
    const nextBatchPaths = paths.slice(visibleCount, nextCount);

    setIsLoadingMore(true);
    try {
      const nextImages = await loadCategoryImages(nextBatchPaths);
      setCurrentImages((prev) => [...prev, ...nextImages]);
      setVisibleCount(nextCount);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const pageTitle = `${title} | Projekt MT`;
  const pageDescription = shortDesc || fullDesc;
  const pagePath = `/ponuda/${project.slug}`;
  const projectSchema = {
    '@context': 'https://schema.org',
    '@type': 'Residence',
    name: title,
    description: fullDesc,
    url: `https://projekt-mt.hr${pagePath}`,
    image: coverImage || undefined,
    address: {
      '@type': 'PostalAddress',
      addressLocality: location,
      addressCountry: 'HR',
    },
  };

  const lightboxNode = lightboxImage ? (
    <div className={styles.lightbox} role="dialog" aria-modal="true" aria-label={t('projectPage.preview', { defaultValue: 'Image preview' })}>
      <button
        type="button"
        className={styles.lightboxBackdrop}
        onClick={() => setLightboxIndex(null)}
        aria-label={t('projectPage.closePreview', { defaultValue: 'Close preview' })}
      />

      <div className={styles.lightboxContent}>
        <button
          type="button"
          className={`${styles.lightboxBtn} ${styles.prevBtn}`}
          onClick={() =>
            setLightboxIndex((prev) => {
              if (prev === null || currentImages.length === 0) return prev;
              return (prev - 1 + currentImages.length) % currentImages.length;
            })
          }
          aria-label={t('projectPage.prevImage', { defaultValue: 'Previous image' })}
        >
          &#8249;
        </button>

        <img
          src={lightboxImage.src}
          alt={`${title} - ${lightboxImage.label}`}
          className={styles.lightboxImage}
        />

        <button
          type="button"
          className={`${styles.lightboxBtn} ${styles.nextBtn}`}
          onClick={() =>
            setLightboxIndex((prev) => {
              if (prev === null || currentImages.length === 0) return prev;
              return (prev + 1) % currentImages.length;
            })
          }
          aria-label={t('projectPage.nextImage', { defaultValue: 'Next image' })}
        >
          &#8250;
        </button>

        <button
          type="button"
          className={styles.closeBtn}
          onClick={() => setLightboxIndex(null)}
          aria-label={t('projectPage.closePreview', { defaultValue: 'Close preview' })}
        >
          &times;
        </button>
      </div>
    </div>
  ) : null;

  return (
    <div className={styles.page}>
      <Seo
        title={pageTitle}
        description={pageDescription}
        path={pagePath}
        image={coverImage || undefined}
        type="article"
        jsonLd={projectSchema}
      />

      <section className={styles.hero}>
        <div className={styles.heroMedia}>
          {coverImage && (
            <img
              src={coverImage}
              alt={title}
              className={styles.heroImage}
              fetchPriority="high"
            />
          )}
          <div className={styles.heroOverlay} />
        </div>

        <div className={`container ${styles.heroContent}`}>
          <span className="section-label">{location}</span>
          <h1>{title}</h1>
          <p className={styles.short}>{shortDesc}</p>
          <span className={`${styles.status} ${project.status === 'sold' ? styles.sold : styles.available}`}>
            {project.status === 'sold' ? t('common.sold') : t('common.available')}
          </span>
        </div>
      </section>

      <section className={`section ${styles.summary}`}>
        <div className="container">
          <h2>{t('projectPage.overview')}</h2>
          <div className="gold-divider" />
          <p className={styles.fullDesc}>{fullDesc}</p>

          {materials.length > 0 && (
            <>
              <h3 className={styles.subheading}>{t('projectPage.materials', { defaultValue: 'Materials & equipment' })}</h3>
              <ul className={styles.features}>
                {materials.map((material) => (
                  <li key={material}>
                    <span className={styles.dot} aria-hidden="true" />
                    {material}
                  </li>
                ))}
              </ul>
            </>
          )}

          <ul className={styles.features}>
            {features.map((feature) => (
              <li key={feature}>
                <span className={styles.dot} aria-hidden="true" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={`section ${styles.gallerySection}`}>
        <div className="container">
          <div className={styles.galleryHeader}>
            <h2>{t('projectPage.gallery')}</h2>
            <div className={styles.filters}>
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={`${styles.filterBtn} ${activeResolved === category ? styles.active : ''}`}
                  onClick={() => setActiveCategory(category)}
                >
                  {t(`projectPage.categories.${category}`, {
                    defaultValue: GALLERY_CATEGORY_LABELS[category],
                  })}
                </button>
              ))}
            </div>
          </div>

          {isLoadingImages && <p className={styles.loadingMsg}>{t('projectPage.loading')}</p>}

          <div className={styles.grid}>
            {currentImages.map((image, index) => (
              <article key={image.src} className={styles.card}>
                <div className={styles.imageWrap}>
                  <img
                    src={image.src}
                    alt={`${title} - ${image.label}`}
                    loading="lazy"
                    decoding="async"
                    onClick={() => setLightboxIndex(index)}
                    onError={(event) => {
                      event.currentTarget.closest('article')?.remove();
                    }}
                  />
                </div>
              </article>
            ))}
          </div>

          {hasMoreImages && (
            <div className={styles.loadMoreWrap}>
              <button
                type="button"
                className={styles.loadMoreBtn}
                onClick={handleLoadMore}
                disabled={isLoadingMore}
              >
                {isLoadingMore && <span className={styles.spinner} aria-hidden="true" />}
                {isLoadingMore
                  ? t('projectPage.loadingMore', { defaultValue: 'Loading...' })
                  : t('projectPage.loadMore', { defaultValue: 'Load more' })}
              </button>
            </div>
          )}
        </div>
      </section>

      <section className={`section ${styles.related}`}>
        <div className="container">
          <h2>{t('projectPage.otherProjects')}</h2>
          <div className={styles.relatedGrid}>
            {related.map((item) => (
              <Link key={item.slug} to={`/ponuda/${item.slug}`} className={styles.relatedCard}>
                <span>{t(`projects.${item.id}.title`)}</span>
                <small>{t(`projects.${item.id}.location`)}</small>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {lightboxNode && typeof document !== 'undefined' ? createPortal(lightboxNode, document.body) : null}
    </div>
  );
}
