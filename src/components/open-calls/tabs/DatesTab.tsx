import React from 'react';
import { OpenCall } from '@/types/open-calls';
import { Calendar, Clock } from 'lucide-react';
import styles from './TabContent.module.scss';

interface DatesTabProps {
  openCall: OpenCall;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatDateShort = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export default function DatesTab({ openCall }: DatesTabProps) {
  const allDates = [
    { label: 'Published', date: openCall.publishDate, description: 'Call was published' },
    { label: 'Opening Date', date: openCall.openDate, description: 'Applications open', primary: true },
    { label: 'Closing Date', date: openCall.closeDate, description: 'Applications close', primary: true },
    ...(openCall.notificationDate ? [{ label: 'Notification Date', date: openCall.notificationDate, description: 'Applicants notified' }] : []),
    ...(openCall.projectStartDate ? [{ label: 'Project Start Date', date: openCall.projectStartDate, description: 'Projects begin' }] : []),
    ...openCall.keyDates,
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const now = new Date();

  return (
    <div className={styles.tabContent}>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Important Dates</h3>
        <div className={styles.timeline}>
          {allDates.map((dateItem, index) => {
            const itemDate = new Date(dateItem.date);
            const isPast = itemDate < now;
            const isCurrent = !isPast && (index === 0 || new Date(allDates[index - 1].date) < now);

            return (
              <div
                key={`${dateItem.label}-${index}`}
                className={`${styles.timelineItem} ${isPast ? styles.past : ''} ${isCurrent ? styles.current : ''} ${(dateItem as any).primary ? styles.primary : ''}`}
              >
                <div className={styles.timelineMarker}>
                  {isCurrent ? <Clock /> : <Calendar />}
                </div>
                <div className={styles.timelineContent}>
                  <div className={styles.timelineHeader}>
                    <div className={styles.timelineLabel}>{dateItem.label}</div>
                    <div className={styles.timelineDate}>{formatDateShort(dateItem.date)}</div>
                  </div>
                  <div className={styles.timelineDescription}>{dateItem.description}</div>
                  <div className={styles.timelineFull}>{formatDate(dateItem.date)}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {openCall.tabs
        .filter((tab) => tab.id === 'dates')
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
