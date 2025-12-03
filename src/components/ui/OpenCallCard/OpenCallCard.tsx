import React from 'react';
import Link from 'next/link';
import { Calendar, Clock, DollarSign, ArrowRight, Building2 } from 'lucide-react';
import { OpenCallListItem, OpenCallStatus, OpenCallType } from '@/types/open-calls';
import styles from './OpenCallCard.module.scss';

interface OpenCallCardProps {
  openCall: OpenCallListItem;
}

const statusLabels: Record<OpenCallStatus, string> = {
  upcoming: 'Upcoming',
  open: 'Open',
  'closing-soon': 'Closing Soon',
  closed: 'Closed',
};

const typeLabels: Record<OpenCallType, string> = {
  funding: 'Funding',
  collaboration: 'Collaboration',
  research: 'Research',
  innovation: 'Innovation',
  training: 'Training',
  other: 'Other',
};

const getTimeRemaining = (closeDate: string): string => {
  const now = new Date();
  const close = new Date(closeDate);
  const diff = close.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  if (days < 0) return 'Closed';
  if (days === 0) return 'Closes today';
  if (days === 1) return '1 day left';
  if (days < 7) return `${days} days left`;
  if (days < 30) return `${Math.ceil(days / 7)} weeks left`;
  return `${Math.ceil(days / 30)} months left`;
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export default function OpenCallCard({ openCall }: OpenCallCardProps) {
  const timeRemaining = getTimeRemaining(openCall.closeDate);
  const statusClass = openCall.status === 'closing-soon' ? 'closingSoon' : openCall.status;

  return (
    <div className={`${styles.card} ${openCall.featured ? styles.featured : ''}`}>
      <div className={styles.header}>
        <div className={styles.imageContainer}>
          {openCall.coverImage ? (
            <img src={openCall.coverImage} alt={openCall.title} />
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--color-background-alt)'
            }}>
              <Building2 size={48} style={{ color: 'var(--color-text-tertiary)' }} />
            </div>
          )}
          <span className={`${styles.statusBadge} ${styles[statusClass]}`}>
            {statusLabels[openCall.status]}
          </span>
        </div>

        <div className={styles.content}>
          <div className={styles.organization}>
            {openCall.organizationLogo && (
              <img src={openCall.organizationLogo} alt={openCall.organization} className={styles.orgLogo} />
            )}
            <span>{openCall.organization}</span>
          </div>

          <h3 className={styles.title}>
            <Link href={`/open-calls/${openCall.slug}`}>
              {openCall.title}
            </Link>
          </h3>

          <div className={styles.type}>
            {typeLabels[openCall.type]}
          </div>

          <p className={styles.description}>
            {openCall.shortDescription}
          </p>
        </div>
      </div>

      <div className={styles.details}>
        <div className={styles.detailItem}>
          <Calendar />
          <span>
            <span className={styles.label}>Opens:</span> {formatDate(openCall.openDate)}
          </span>
        </div>

        <div className={styles.detailItem}>
          <Clock />
          <span>
            <span className={styles.label}>Closes:</span> {formatDate(openCall.closeDate)}
          </span>
        </div>

        {openCall.status === 'open' || openCall.status === 'closing-soon' ? (
          <div className={styles.detailItem}>
            <Clock />
            <span className={styles.label} style={{ color: 'var(--color-warning)' }}>
              {timeRemaining}
            </span>
          </div>
        ) : null}

        {openCall.fundingAmount && (
          <div className={styles.detailItem}>
            <DollarSign />
            <span className={styles.funding}>{openCall.fundingAmount}</span>
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <div className={styles.tags}>
          {openCall.tags.slice(0, 3).map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
          {openCall.tags.length > 3 && (
            <span className={styles.tag}>+{openCall.tags.length - 3} more</span>
          )}
        </div>

        <Link href={`/open-calls/${openCall.slug}`} className={styles.cta}>
          View Details
          <ArrowRight />
        </Link>
      </div>
    </div>
  );
}
