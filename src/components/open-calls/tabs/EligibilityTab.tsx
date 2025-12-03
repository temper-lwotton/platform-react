import React from 'react';
import { OpenCall } from '@/types/open-calls';
import { CheckCircle2, XCircle } from 'lucide-react';
import styles from './TabContent.module.scss';

interface EligibilityTabProps {
  openCall: OpenCall;
}

export default function EligibilityTab({ openCall }: EligibilityTabProps) {
  return (
    <div className={styles.tabContent}>
      {openCall.eligibilitySummary && (
        <div className={styles.section}>
          <div className={styles.summaryBox}>
            <p>{openCall.eligibilitySummary}</p>
          </div>
        </div>
      )}

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Eligibility Criteria</h3>
        <div className={styles.criteriaList}>
          {openCall.eligibilityCriteria.map((criteria) => (
            <div key={criteria.id} className={`${styles.criteriaItem} ${criteria.required ? styles.required : styles.optional}`}>
              <div className={styles.criteriaIcon}>
                {criteria.required ? (
                  <CheckCircle2 className={styles.iconRequired} />
                ) : (
                  <CheckCircle2 className={styles.iconOptional} />
                )}
              </div>
              <div className={styles.criteriaContent}>
                <div className={styles.criteriaText}>{criteria.criterion}</div>
                {!criteria.required && (
                  <span className={styles.badge}>Optional</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {openCall.tabs
        .filter((tab) => tab.id === 'eligibility')
        .map((tab) =>
          tab.sections.map((section) => (
            <div key={section.id} className={styles.section}>
              <h3 className={styles.sectionTitle}>{section.title}</h3>
              <div className={styles.richContent} dangerouslySetInnerHTML={{ __html: section.content }} />
            </div>
          ))
        )}
    </div>
  );
}
