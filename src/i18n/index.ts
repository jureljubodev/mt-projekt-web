import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import hr from './locales/hr.json';
import en from './locales/en.json';
import de from './locales/de.json';
import fr from './locales/fr.json';
import it from './locales/it.json';
import es from './locales/es.json';
import cs from './locales/cs.json';
import sl from './locales/sl.json';
import sk from './locales/sk.json';
import uk from './locales/uk.json';
import hu from './locales/hu.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      hr: { translation: hr },
      en: { translation: en },
      de: { translation: de },
      fr: { translation: fr },
      it: { translation: it },
      es: { translation: es },
      cs: { translation: cs },
      sl: { translation: sl },
      sk: { translation: sk },
      uk: { translation: uk },
      hu: { translation: hu },
    },
    fallbackLng: 'hr',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
