'use client';

import { forwardRef } from 'react';
import styles from './Badge.module.scss';

export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'outline';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: React.ReactNode;
}

/**
 * Badge component for displaying status, labels, and tags
 *
 * Provides consistent badge styling with multiple variants and sizes.
 *
 * @example
 * ```tsx
 * <Badge variant="success">New</Badge>
 * <Badge variant="primary" size="sm">Beta</Badge>
 * <Badge variant="outline">Public</Badge>
 * ```
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'default', size = 'md', className = '', children, ...props }, ref) => {
    const variantClass = styles[`badge--${variant}`] || styles['badge--default'];
    const sizeClass = styles[`badge--${size}`] || styles['badge--md'];
    const combinedClassName = [styles.badge, variantClass, sizeClass, className]
      .filter(Boolean)
      .join(' ');

    return (
      <span ref={ref} className={combinedClassName} {...props}>
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
