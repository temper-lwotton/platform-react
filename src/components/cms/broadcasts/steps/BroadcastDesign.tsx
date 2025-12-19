'use client';

import { useState } from 'react';
import { EmailBuilder } from '../EmailBuilder';
import styles from './Steps.module.scss';

interface BroadcastDesignProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function BroadcastDesign({ data, onUpdate, onNext }: BroadcastDesignProps) {
  const [emailContent, setEmailContent] = useState(data.emailContent || null);

  const handleContentChange = (content: any) => {
    setEmailContent(content);
    onUpdate({ emailContent: content });
  };

  const isValid = () => {
    return emailContent !== null;
  };

  return (
    <div className={styles.stepContainer}>
      <div className={styles.stepHeader}>
        <h2 className={styles.stepTitle}>Design Your Email</h2>
        <p className={styles.stepDescription}>
          Create your email using the visual builder
        </p>
      </div>

      <div className={styles.emailBuilderWrapper}>
        <EmailBuilder content={emailContent} onChange={handleContentChange} />
      </div>

      <div className={styles.stepFooter}>
        <button onClick={onNext} disabled={!isValid()} className={styles.nextButton}>
          Continue to Review
        </button>
      </div>
    </div>
  );
}
