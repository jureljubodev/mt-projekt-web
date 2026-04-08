import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './LegalModals.module.css';
import { lockBodyScroll } from '../../utils/scrollLock';

export type LegalPolicyType = 'privacy' | 'terms' | 'cookies';

interface LegalModalsProps {
  activePolicy: LegalPolicyType | null;
  onClose: () => void;
}

export default function LegalModals({ activePolicy, onClose }: LegalModalsProps) {
  const { t } = useTranslation();

  useEffect(() => {
    if (!activePolicy) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    const unlockScroll = lockBodyScroll();

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      unlockScroll();
    };
  }, [activePolicy, onClose]);

  if (!activePolicy) {
    return null;
  }

  const contentByPolicy: Record<LegalPolicyType, { title: string; body: string[] }> = {
    privacy: {
      title: t('legal.privacyTitle', { defaultValue: 'Privacy Policy' }),
      body: [
        t('legal.privacyP1', {
          defaultValue:
            'We process personal data only to answer inquiries, provide requested services, and improve our website experience in line with applicable data-protection laws.',
        }),
        t('legal.privacyP2', {
          defaultValue:
            'Data submitted through forms may include your name, email, phone number, and message content. We keep this data only for as long as needed to provide support and fulfill legal obligations.',
        }),
        t('legal.privacyP3', {
          defaultValue:
            'You may request access, correction, or deletion of your personal data at any time by contacting us via the details listed on the Contact page.',
        }),
      ],
    },
    terms: {
      title: t('legal.termsTitle', { defaultValue: 'Terms of Service' }),
      body: [
        t('legal.termsP1', {
          defaultValue:
            'The website content is provided for informational purposes regarding real-estate projects and availability. All listings are subject to change without prior notice.',
        }),
        t('legal.termsP2', {
          defaultValue:
            'By using this website, you agree not to misuse any content, attempt unauthorized access, or perform actions that may impact website security or availability.',
        }),
        t('legal.termsP3', {
          defaultValue:
            'Project descriptions, visuals, and technical details may be updated over time. For the latest official information, please contact our team directly.',
        }),
      ],
    },
    cookies: {
      title: t('legal.cookiesTitle', { defaultValue: 'Cookie Policy' }),
      body: [
        t('legal.cookiesP1', {
          defaultValue:
            'We use essential cookies to ensure core website functionality, such as navigation and security. These cookies are always active.',
        }),
        t('legal.cookiesP2', {
          defaultValue:
            'Optional analytics cookies help us understand website usage and improve performance. You can accept or decline these cookies through the cookie banner.',
        }),
        t('legal.cookiesP3', {
          defaultValue:
            'Your cookie preference is stored in your browser and can be changed at any time by clearing stored site data and selecting a new preference.',
        }),
      ],
    },
  };

  const selected = contentByPolicy[activePolicy];

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="legal-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
          ×
        </button>
        <h2 id="legal-modal-title" className={styles.title}>
          {selected.title}
        </h2>
        <div className="gold-divider" />
        <div className={styles.content}>
          {selected.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
