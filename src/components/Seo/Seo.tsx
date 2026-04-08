import { Helmet } from 'react-helmet-async';
import i18n from '../../i18n';

type JsonLd = Record<string, unknown>;

interface SeoProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article';
  noindex?: boolean;
  jsonLd?: JsonLd | JsonLd[];
}

const SITE_NAME = 'Projekt MT';
const DEFAULT_IMAGE = '/og-default.jpg';
const SITE_URL = ((import.meta.env.VITE_SITE_URL as string | undefined) ?? 'https://projekt-mt.hr').replace(/\/$/, '');

function toAbsoluteUrl(value: string): string {
  if (/^https?:\/\//i.test(value)) return value;
  const normalized = value.startsWith('/') ? value : `/${value}`;
  return `${SITE_URL}${normalized}`;
}

function normalizePath(path?: string): string {
  if (!path || path.trim() === '') {
    if (typeof window !== 'undefined') {
      return `${window.location.pathname}${window.location.search}`;
    }
    return '/';
  }
  return path.startsWith('/') ? path : `/${path}`;
}

export default function Seo({
  title,
  description,
  path,
  image,
  type = 'website',
  noindex = false,
  jsonLd,
}: SeoProps) {
  const lang = i18n.resolvedLanguage || i18n.language || 'hr';
  const currentPath = normalizePath(path);
  const canonical = toAbsoluteUrl(currentPath);
  const ogImage = toAbsoluteUrl(image || DEFAULT_IMAGE);
  const robots = noindex ? 'noindex, nofollow' : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1';

  const jsonLdItems = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];

  return (
    <Helmet>
      <html lang={lang} />
      <title>{title}</title>

      <meta name="description" content={description} />
      <meta name="robots" content={robots} />
      <meta name="author" content={SITE_NAME} />
      <meta name="theme-color" content="#0F1B2D" />

      <link rel="canonical" href={canonical} />

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content={lang} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {jsonLdItems.map((item, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(item)}
        </script>
      ))}
    </Helmet>
  );
}
