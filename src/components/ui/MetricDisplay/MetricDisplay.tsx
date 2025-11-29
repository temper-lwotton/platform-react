import React from 'react';
import styles from './MetricDisplay.module.scss';

export interface MetricDisplayProps {
  value: string | number;
  label: string;
  sublabel?: string;
  suffix?: string;
  icon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'accent';
  className?: string;
}

export const MetricDisplay: React.FC<MetricDisplayProps> = ({
  value,
  label,
  sublabel,
  suffix,
  icon,
  size = 'lg',
  variant = 'default',
  className = '',
}) => {
  return (
    <div className={`${styles.metricDisplay} ${className}`}>
      {icon && <div className={styles.metricDisplay__icon}>{icon}</div>}
      <div className={styles.metricDisplay__content}>
        <div className={`${styles.metricDisplay__value} ${styles[`metricDisplay__value--${size}`]}`}>
          {value}
          {suffix && <sup className={styles.metricDisplay__suffix}>{suffix}</sup>}
        </div>
        <div className={styles.metricDisplay__label}>{label}</div>
        {sublabel && <div className={styles.metricDisplay__sublabel}>{sublabel}</div>}
      </div>
    </div>
  );
};
