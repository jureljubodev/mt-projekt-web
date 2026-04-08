import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import hr from './locales/hr.json';

const SUPPORTED_LANGS = ['hr', 'en', 'de', 'fr', 'it', 'es', 'cs', 'sl', 'sk', 'uk', 'hu'] as const;
type SupportedLang = (typeof SUPPORTED_LANGS)[number];

const localeLoaders = import.meta.glob<{ default: Record<string, unknown> }>('./locales/*.json');

function normalizeLang(code?: string): SupportedLang {
  const base = (code ?? 'hr').toLowerCase().split('-')[0] as SupportedLang;
  return (SUPPORTED_LANGS as readonly string[]).includes(base) ? base : 'hr';
}

export async function ensureLanguageResources(code?: string) {
  const lang = normalizeLang(code);
  if (i18n.hasResourceBundle(lang, 'translation')) return lang;

  const key = `./locales/${lang}.json`;
  const loader = localeLoaders[key];
  if (!loader) return 'hr';

  const module = await loader();
  i18n.addResourceBundle(lang, 'translation', module.default, true, true);
  return lang;
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      hr: { translation: hr },
    },
    fallbackLng: 'hr',
    supportedLngs: SUPPORTED_LANGS as unknown as string[],
    nonExplicitSupportedLngs: true,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    load: 'languageOnly',
  });

void (async () => {
  const active = normalizeLang(i18n.resolvedLanguage || i18n.language);
  if (active !== 'hr') {
    await ensureLanguageResources(active);
    await i18n.changeLanguage(active);
  }
})();

export default i18n;
