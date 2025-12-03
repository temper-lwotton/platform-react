import React from 'react';
import { OpenCall } from '@/types/open-calls';
import { Building2, DollarSign, Award } from 'lucide-react';
import styles from './TabContent.module.scss';

interface SummaryTabProps {
  openCall: OpenCall;
}

export default function SummaryTab({ openCall }: SummaryTabProps) {
  return (
    <div className={styles.tabContent}>
      <div className={styles.overview}>
        <div className={styles.keyInfo}>
          {openCall.fundingAmount && (
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>
                <DollarSign />
              </div>
              <div className={styles.infoContent}>
                <div className={styles.infoLabel}>Funding Amount</div>
                <div className={styles.infoValue}>{openCall.fundingAmount}</div>
              </div>
            </div>
          )}

          {openCall.totalBudget && (
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>
                <DollarSign />
              </div>
              <div className={styles.infoContent}>
                <div className={styles.infoLabel}>Total Budget</div>
                <div className={styles.infoValue}>{openCall.totalBudget}</div>
              </div>
            </div>
          )}

          {openCall.numberOfAwards && (
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>
                <Award />
              </div>
              <div className={styles.infoContent}>
                <div className={styles.infoLabel}>Number of Awards</div>
                <div className={styles.infoValue}>{openCall.numberOfAwards}</div>
              </div>
            </div>
          )}

          <div className={styles.infoCard}>
            <div className={styles.infoIcon}>
              <Building2 />
            </div>
            <div className={styles.infoContent}>
              <div className={styles.infoLabel}>Organization</div>
              <div className={styles.infoValue}>{openCall.organization}</div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>About This Opportunity</h3>
        <div className={styles.richContent} dangerouslySetInnerHTML={{ __html: openCall.fullDescription }} />
      </div>

      {openCall.tabs
        .filter((tab) => tab.id === 'summary')
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
