'use client';

import { Mail, User } from 'lucide-react';
import styles from './Steps.module.scss';

interface BroadcastSetupProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function BroadcastSetup({ data, onUpdate, onNext }: BroadcastSetupProps) {
  const handleChange = (field: string, value: string) => {
    onUpdate({ [field]: value });
  };

  const isValid = () => {
    return data.name && data.subject && data.fromName && data.fromEmail;
  };

  return (
    <div className={styles.stepContainer}>
      <div className={styles.stepHeader}>
        <h2 className={styles.stepTitle}>Campaign Setup</h2>
        <p className={styles.stepDescription}>
          Configure the basic details of your email campaign
        </p>
      </div>

      <div className={styles.formGrid}>
        {/* Campaign Name */}
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>
            Campaign Name <span className={styles.required}>*</span>
          </label>
          <input
            id="name"
            type="text"
            value={data.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="e.g. Welcome Series - Week 1"
            className={styles.input}
          />
          <p className={styles.hint}>Internal name for your reference</p>
        </div>

        {/* Subject Line */}
        <div className={styles.formGroup}>
          <label htmlFor="subject" className={styles.label}>
            Email Subject <span className={styles.required}>*</span>
          </label>
          <div className={styles.inputWithIcon}>
            <Mail className={styles.inputIcon} />
            <input
              id="subject"
              type="text"
              value={data.subject || ''}
              onChange={(e) => handleChange('subject', e.target.value)}
              placeholder="e.g. Welcome to our community!"
              className={styles.input}
            />
          </div>
          <p className={styles.hint}>This will be visible to your recipients</p>
        </div>

        {/* Preheader */}
        <div className={styles.formGroup}>
          <label htmlFor="preheader" className={styles.label}>
            Preheader Text
          </label>
          <input
            id="preheader"
            type="text"
            value={data.preheader || ''}
            onChange={(e) => handleChange('preheader', e.target.value)}
            placeholder="e.g. We're excited to have you here"
            className={styles.input}
            maxLength={100}
          />
          <p className={styles.hint}>
            Preview text shown in email clients (optional, max 100 characters)
          </p>
        </div>

        {/* From Name */}
        <div className={styles.formGroup}>
          <label htmlFor="fromName" className={styles.label}>
            From Name <span className={styles.required}>*</span>
          </label>
          <div className={styles.inputWithIcon}>
            <User className={styles.inputIcon} />
            <input
              id="fromName"
              type="text"
              value={data.fromName || ''}
              onChange={(e) => handleChange('fromName', e.target.value)}
              placeholder="e.g. John from Acme Inc"
              className={styles.input}
            />
          </div>
        </div>

        {/* From Email */}
        <div className={styles.formGroup}>
          <label htmlFor="fromEmail" className={styles.label}>
            From Email <span className={styles.required}>*</span>
          </label>
          <div className={styles.inputWithIcon}>
            <Mail className={styles.inputIcon} />
            <input
              id="fromEmail"
              type="email"
              value={data.fromEmail || ''}
              onChange={(e) => handleChange('fromEmail', e.target.value)}
              placeholder="e.g. hello@acme.com"
              className={styles.input}
            />
          </div>
        </div>

        {/* Reply To */}
        <div className={styles.formGroup}>
          <label htmlFor="replyTo" className={styles.label}>
            Reply-To Email
          </label>
          <input
            id="replyTo"
            type="email"
            value={data.replyTo || ''}
            onChange={(e) => handleChange('replyTo', e.target.value)}
            placeholder="e.g. support@acme.com"
            className={styles.input}
          />
          <p className={styles.hint}>
            Leave blank to use the same as From Email
          </p>
        </div>
      </div>

      <div className={styles.stepFooter}>
        <button
          onClick={onNext}
          disabled={!isValid()}
          className={styles.nextButton}
        >
          Continue to Recipients
        </button>
      </div>
    </div>
  );
}
