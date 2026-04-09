import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { LegalPolicyType } from './LegalModals';
import styles from './CookieBanner.module.css';
import { useSafeMode } from '../../utils/safeMode';
import { subscribeToMediaQuery } from '../../utils/mediaQuery';

interface CookieBannerProps {
  onOpenPolicy: (policy: LegalPolicyType) => void;
}

type CookieChoice = 'accepted' | 'essential';

const COOKIE_KEY = 'pm_cookie_consent';

export default function CookieBanner({ onOpenPolicy }: CookieBannerProps) {
  const { t } = useTranslation();
  const safeMode = useSafeMode();
  const [touchSafe, setTouchSafe] = useState(() => window.matchMedia('(pointer: coarse)').matches);
  const [showTouchPolicy, setShowTouchPolicy] = useState(false);
  const [isVisible, setIsVisible] = useState<boolean>(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    return !window.localStorage.getItem(COOKIE_KEY);
  });

  useEffect(() => {
    return subscribeToMediaQuery('(pointer: coarse)', (isCoarse) => {
      setTouchSafe(isCoarse);
      if (!isCoarse) {
        setShowTouchPolicy(false);
      }
    });
  }, []);

  const saveChoice = (choice: CookieChoice) => {
    try {
      window.localStorage.setItem(COOKIE_KEY, choice);
    } catch {
      // If storage is blocked (e.g. strict/private browser mode), still allow dismissing the banner.
    }
    setIsVisible(false);
  };

  const openCookiePolicy = () => {
    if (touchSafe) {
      setShowTouchPolicy((prev) => !prev);
      return;
    }
    onOpenPolicy('cookies');
  };

  if (!isVisible) {
    return null;
  }

  return (
    <aside className={`${styles.banner} ${safeMode ? styles.safe : ''}`} role="dialog" aria-live="polite" aria-label="Cookie consent">
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
          <button type="button" className="btn btn-outline" onClick={openCookiePolicy}>
            {showTouchPolicy
              ? t('common.close', { defaultValue: 'Close' })
              : t('legal.learnMoreBtn', { defaultValue: 'Learn More' })}
          </button>
          <button type="button" className="btn btn-outline" onClick={() => saveChoice('essential')}>
            {t('legal.essentialOnlyBtn', { defaultValue: 'Essential Only' })}
          </button>
          <button type="button" className="btn btn-primary" onClick={() => saveChoice('accepted')}>
            {t('legal.acceptAllBtn', { defaultValue: 'Accept All' })}
          </button>
        </div>

        {touchSafe && showTouchPolicy && (
          <div className={styles.touchPolicy}>
            <p>
              {t('legal.cookiesP1', {
                defaultValue:
                  'We use essential cookies to ensure core website functionality, such as navigation and security. These cookies are always active.',
              })}
            </p>
            <p>
              {t('legal.cookiesP2', {
                defaultValue:
                  'Optional analytics cookies help us understand website usage and improve performance. You can accept or decline these cookies through the cookie banner.',
              })}
            </p>
            <p>
              {t('legal.cookiesP3', {
                defaultValue:
                  'Your cookie preference is stored in your browser and can be changed at any time by clearing stored site data and selecting a new preference.',
              })}
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
