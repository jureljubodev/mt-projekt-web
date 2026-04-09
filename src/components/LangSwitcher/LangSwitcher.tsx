import { useRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './LangSwitcher.module.css';
import { ensureLanguageResources } from '../../i18n';

const LANGUAGES = [
  { code: 'hr', label: 'Hrvatski',    flag: '🇭🇷' },
  { code: 'en', label: 'English',     flag: '🇬🇧' },
  { code: 'de', label: 'Deutsch',     flag: '🇩🇪' },
  { code: 'fr', label: 'Français',    flag: '🇫🇷' },
  { code: 'it', label: 'Italiano',    flag: '🇮🇹' },
  { code: 'es', label: 'Español',     flag: '🇪🇸' },
  { code: 'cs', label: 'Čeština',     flag: '🇨🇿' },
  { code: 'sl', label: 'Slovenščina', flag: '🇸🇮' },
  { code: 'sk', label: 'Slovenčina',  flag: '🇸🇰' },
  { code: 'uk', label: 'Українська',  flag: '🇺🇦' },
  { code: 'hu', label: 'Magyar',      flag: '🇭🇺' },
];

export default function LangSwitcher() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const currentCode = (i18n.resolvedLanguage || i18n.language || 'hr').toLowerCase().split('-')[0];
  const current = LANGUAGES.find(l => l.code === currentCode) ?? LANGUAGES[0];

  useEffect(() => {
    function handlePointerOutside(event: PointerEvent | MouseEvent | TouchEvent) {
      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }

      if (ref.current && !ref.current.contains(target)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }

    if ('PointerEvent' in window) {
      document.addEventListener('pointerdown', handlePointerOutside, true);
    } else {
      document.addEventListener('mousedown', handlePointerOutside, true);
      document.addEventListener('touchstart', handlePointerOutside, true);
    }

    document.addEventListener('keydown', handleEscape);

    return () => {
      if ('PointerEvent' in window) {
        document.removeEventListener('pointerdown', handlePointerOutside, true);
      } else {
        document.removeEventListener('mousedown', handlePointerOutside, true);
        document.removeEventListener('touchstart', handlePointerOutside, true);
      }
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  async function select(code: string) {
    await ensureLanguageResources(code);
    await i18n.changeLanguage(code);
    setOpen(false);
  }

  return (
    <div className={styles.wrapper} ref={ref}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Select language"
      >
        <span className={styles.flag}>{current.flag}</span>
        <span className={styles.code}>{current.code.toUpperCase()}</span>
        <span className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}>▾</span>
      </button>

      {open && (
        <ul className={styles.dropdown} role="listbox" aria-label="Language options">
          {LANGUAGES.map(lang => (
            <li
              key={lang.code}
              role="option"
              aria-selected={lang.code === currentCode}
              className={`${styles.option} ${lang.code === currentCode ? styles.active : ''}`}
              onClick={() => select(lang.code)}
            >
              <span className={styles.flag}>{lang.flag}</span>
              <span className={styles.langLabel}>{lang.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
