'use client';

import { ValidationStatus } from '@/types/jobforge';
import { Icon } from '../Icon';
import styles from './JobForge.module.scss';

interface ValidationIndicatorProps {
  status: ValidationStatus;
  message?: string;
  className?: string;
}

export function ValidationIndicator({ status, message, className = '' }: ValidationIndicatorProps) {
  const getIconName = () => {
    switch (status) {
      case 'valid':
        return 'check';
      case 'warning':
        return 'info';
      case 'error':
        return 'x';
      case 'empty':
        return 'minus';
      default:
        return 'minus';
    }
  };

  const getColor = () => {
    switch (status) {
      case 'valid':
        return 'green';
      case 'warning':
        return 'amber';
      case 'error':
        return 'red';
      case 'empty':
        return 'gray';
      default:
        return 'gray';
    }
  };

  return (
    <div className={`${styles.validationIndicator} ${styles[`validation${getColor().charAt(0).toUpperCase() + getColor().slice(1)}`]} ${className}`}>
      <Icon icon={getIconName() as any} size={14} />
      {message && <span className={styles.validationMessage}>{message}</span>}
    </div>
  );
}
