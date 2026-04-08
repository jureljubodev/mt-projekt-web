import { useRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './LangSwitcher.module.css';

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

  const current = LANGUAGES.find(l => l.code === i18n.language) ?? LANGUAGES[0];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function select(code: string) {
    i18n.changeLanguage(code);
    setOpen(false);
  }

  return (
    <div className={styles.wrapper} ref={ref}>
      <button
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
              aria-selected={lang.code === i18n.language}
              className={`${styles.option} ${lang.code === i18n.language ? styles.active : ''}`}
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
