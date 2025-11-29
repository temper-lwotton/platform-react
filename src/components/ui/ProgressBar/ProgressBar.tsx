import React from 'react';
import styles from './ProgressBar.module.scss';

export interface ProgressBarProps {
  value: number;
  max?: number;
  variant?: 'default' | 'gradient' | 'dual';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  variant = 'default',
  size = 'md',
  showLabel = false,
  className = '',
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={`${styles.progressBar} ${className}`}>
      {showLabel && (
        <div className={styles.progressBar__label}>
          {Math.round(percentage)}%
        </div>
      )}
      <div className={`${styles.progressBar__track} ${styles[`progressBar__track--${size}`]}`}>
        <div
          className={`${styles.progressBar__fill} ${styles[`progressBar__fill--${variant}`]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
