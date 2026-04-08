import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { LegalPolicyType } from './LegalModals';
import styles from './CookieBanner.module.css';

interface CookieBannerProps {
  onOpenPolicy: (policy: LegalPolicyType) => void;
}

type CookieChoice = 'accepted' | 'essential';

const COOKIE_KEY = 'pm_cookie_consent';

export default function CookieBanner({ onOpenPolicy }: CookieBannerProps) {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState<boolean>(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    return !window.localStorage.getItem(COOKIE_KEY);
  });

  const saveChoice = (choice: CookieChoice) => {
    window.localStorage.setItem(COOKIE_KEY, choice);
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <aside className={styles.banner} role="dialog" aria-live="polite" aria-label="Cookie consent">
      <div className={styles.inner}>
        <div className={styles.textWrap}>
          <strong className={styles.title}>
            {t('legal.bannerTitle', { defaultValue: 'Cookie Preferences' })}
          </strong>
          <p className={styles.text}>
            {t('legal.bannerText', {
              defaultValue:
                'We use essential cookies for site functionality and optional analytics cookies to improve performance. You can choose your preference below.',
            })}
          </p>
        </div>

        <div className={styles.actions}>
          <button type="button" className="btn btn-outline" onClick={() => onOpenPolicy('cookies')}>
            {t('legal.learnMoreBtn', { defaultValue: 'Learn More' })}
          </button>
          <button type="button" className="btn btn-outline" onClick={() => saveChoice('essential')}>
            {t('legal.essentialOnlyBtn', { defaultValue: 'Essential Only' })}
          </button>
          <button type="button" className="btn btn-primary" onClick={() => saveChoice('accepted')}>
            {t('legal.acceptAllBtn', { defaultValue: 'Accept All' })}
          </button>
        </div>
      </div>
    </aside>
  );
}
