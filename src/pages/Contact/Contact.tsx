import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './Contact.module.css';
import Seo from '../../components/Seo/Seo';

interface FormState {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const initialForm: FormState = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
};

export default function Contact() {
  const { t } = useTranslation();
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const pageTitle = `${t('contact.heading')} | Projekt MT`;
  const pageDescription = t('contact.description');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError(t('contact.errorRequired'));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError(t('contact.errorEmail'));
      return;
    }

    // In a real project, POST to an API endpoint here.
    setSubmitted(true);
    setForm(initialForm);
  };

  return (
    <div className={styles.page}>
      <Seo
        title={pageTitle}
        description={pageDescription}
        path="/kontakt"
        type="website"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'ContactPage',
          name: pageTitle,
          description: pageDescription,
          url: 'https://projekt-mt.hr/kontakt',
        }}
      />

      {/* Page header */}
      <section className={styles.pageHeader}>
        <div className="container">
          <span className="section-label">{t('contact.label')}</span>
          <h1>{t('contact.heading')}</h1>
          <div className="gold-divider" />
          <p className={styles.headerDesc}>{t('contact.description')}</p>
        </div>
      </section>

      {/* Contact content */}
      <section className={`section ${styles.content}`}>
        <div className={`container ${styles.contentGrid}`}>
          {/* Info column */}
          <div className={styles.infoCol}>
            <h2 className={styles.infoTitle}>{t('contact.infoTitle')}</h2>
            <div className="gold-divider" />

            <div className={styles.infoList}>
              <div className={styles.infoItem}>
                <span className={styles.infoIcon} aria-hidden="true">📍</span>
                <div>
                  <strong className={styles.infoLabel}>{t('contact.addressLabel')}</strong>
                  <p>Stolačka 25<br />10 000 Zagreb<br />Hrvatska</p>
                </div>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.infoIcon} aria-hidden="true">📞</span>
                <div>
                  <strong className={styles.infoLabel}>{t('contact.phoneLabel')}</strong>
                  <a href="tel:+385992999001" className={styles.infoLink}>
                    099 / 2999 001
                  </a>
                </div>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.infoIcon} aria-hidden="true">✉️</span>
                <div>
                  <strong className={styles.infoLabel}>{t('contact.emailLabel')}</strong>
                  <a href="mailto:projektmt313@gmail.com" className={styles.infoLink}>
                    projektmt313@gmail.com
                  </a>
                </div>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.infoIcon} aria-hidden="true">🕐</span>
                <div>
                  <strong className={styles.infoLabel}>{t('contact.hoursLabel')}</strong>
                  <p>
                    {t('contact.hoursLine1')}<br />
                    {t('contact.hoursLine2')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form column */}
          <div className={styles.formCol}>
            {submitted ? (
              <div className={styles.successMsg} role="alert">
                <span className={styles.successIcon} aria-hidden="true">✓</span>
                <h3>{t('contact.successTitle')}</h3>
                <p>{t('contact.successText')}</p>
                <button
                  type="button"
                  className="btn btn-outline-dark"
                  onClick={() => setSubmitted(false)}
                >
                  {t('contact.successBtn')}
                </button>
              </div>
            ) : (
              <form
                className={styles.form}
                onSubmit={handleSubmit}
                noValidate
                aria-label={t('contact.label')}
              >
                <h2 className={styles.formTitle}>{t('contact.formTitle')}</h2>

                {error && (
                  <div className={styles.errorMsg} role="alert">
                    {error}
                  </div>
                )}

                <div className={styles.formRow}>
                  <div className={styles.fieldGroup}>
                    <label htmlFor="name" className={styles.label}>
                      {t('contact.nameLabel')} <span aria-label="obavezno">*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      className={styles.input}
                      value={form.name}
                      onChange={handleChange}
                      placeholder={t('contact.namePlaceholder')}
                      required
                      autoComplete="name"
                    />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label htmlFor="email" className={styles.label}>
                      {t('contact.emailFieldLabel')} <span aria-label="obavezno">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className={styles.input}
                      value={form.email}
                      onChange={handleChange}
                      placeholder={t('contact.emailPlaceholder')}
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.fieldGroup}>
                    <label htmlFor="phone" className={styles.label}>
                      {t('contact.phoneFieldLabel')}
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      className={styles.input}
                      value={form.phone}
                      onChange={handleChange}
                      placeholder={t('contact.phonePlaceholder')}
                      autoComplete="tel"
                    />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label htmlFor="subject" className={styles.label}>
                      {t('contact.subjectLabel')}
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      className={styles.select}
                      value={form.subject}
                      onChange={handleChange}
                    >
                      <option value="">{t('contact.subjectDefault')}</option>
                      <option value="villa-azzuro-malinska">Villa Azzuro Malinska</option>
                      <option value="projekt-sesvete">Projekt Sesvete</option>
                      <option value="ville-krk-a">Ville KRK – Objekt A</option>
                      <option value="ville-krk-b">Ville KRK – Objekt B</option>
                      <option value="other">{t('contact.subjectOther')}</option>
                    </select>
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="message" className={styles.label}>
                    {t('contact.messageLabel')} <span aria-label="obavezno">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    className={styles.textarea}
                    value={form.message}
                    onChange={handleChange}
                    placeholder={t('contact.messagePlaceholder')}
                    rows={6}
                    required
                  />
                </div>

                <button type="submit" className={`btn btn-primary ${styles.submitBtn}`}>
                  {t('contact.submitBtn')}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
