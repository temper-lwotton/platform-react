import React from 'react';
import { OpenCall } from '@/types/open-calls';
import { ExternalLink } from 'lucide-react';
import styles from './TabContent.module.scss';

interface HowToApplyTabProps {
  openCall: OpenCall;
}

export default function HowToApplyTab({ openCall }: HowToApplyTabProps) {
  return (
    <div className={styles.tabContent}>
      {openCall.applicationGuidelines && (
        <div className={styles.section}>
          <div className={styles.guidelinesBox}>
            <h4>Application Guidelines</h4>
            <div className={styles.richContent} dangerouslySetInnerHTML={{ __html: openCall.applicationGuidelines }} />
          </div>
        </div>
      )}

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Application Steps</h3>
        <div className={styles.stepsList}>
          {openCall.applicationSteps.map((step) => (
            <div key={step.id} className={styles.stepItem}>
              <div className={styles.stepNumber}>{step.stepNumber}</div>
              <div className={styles.stepContent}>
                <h4 className={styles.stepTitle}>{step.title}</h4>
                <p className={styles.stepDescription}>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {openCall.tabs
        .filter((tab) => tab.id === 'how-to-apply')
        .map((tab) =>
          tab.sections.map((section) => (
            <div key={section.id} className={styles.section}>
              <h3 className={styles.sectionTitle}>{section.title}</h3>
              <div className={styles.richContent} dangerouslySetInnerHTML={{ __html: section.content }} />
            </div>
          ))
        )}

      <div className={styles.section}>
        <div className={styles.applyBox}>
          <h3>Ready to Apply?</h3>
          <p>Click the button below to start your application process.</p>
          <a
            href={openCall.applicationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.applyButton}
          >
            Start Application
            <ExternalLink />
          </a>
        </div>
      </div>
    </div>
  );
}
