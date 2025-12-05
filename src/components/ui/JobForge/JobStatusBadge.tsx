'use client';

import { JobSpecStatus } from '@/types/jobforge';
import styles from './JobForge.module.scss';

interface JobStatusBadgeProps {
  status: JobSpecStatus;
  className?: string;
}

export function JobStatusBadge({ status, className = '' }: JobStatusBadgeProps) {
  const getStatusConfig = (status: JobSpecStatus) => {
    switch (status) {
      case 'draft':
        return { label: 'Draft', variant: 'gray' };
      case 'pending_approval':
        return { label: 'Pending Approval', variant: 'amber' };
      case 'approved':
        return { label: 'Approved', variant: 'green' };
      case 'rejected':
        return { label: 'Rejected', variant: 'red' };
      case 'in_crm':
        return { label: 'In CRM', variant: 'blue' };
      case 'archived':
        return { label: 'Archived', variant: 'gray' };
      default:
        return { label: status, variant: 'gray' };
    }
  };

  const { label, variant } = getStatusConfig(status);

  return (
    <span className={`${styles.badge} ${styles[`badge${variant.charAt(0).toUpperCase() + variant.slice(1)}`]} ${className}`}>
      {label}
    </span>
  );
}
