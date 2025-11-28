'use client';

import { forwardRef } from 'react';
import styles from './Card.module.scss';

export type CardVariant = 'default' | 'elevated' | 'outlined' | 'ghost';

export interface CardProps extends React.HTMLAttributes<HTMLElement> {
  variant?: CardVariant;
  hoverable?: boolean;
  as?: 'div' | 'article' | 'section';
  children: React.ReactNode;
}

/**
 * Card component for consistent card layouts
 *
 * Provides base card styling with variants and optional hover effects.
 *
 * @example
 * ```tsx
 * <Card variant="elevated" hoverable>
 *   <CardHeader>
 *     <h3>Title</h3>
 *   </CardHeader>
 *   <CardContent>
 *     Content goes here
 *   </CardContent>
 * </Card>
 * ```
 */
export const Card = forwardRef<HTMLElement, CardProps>(
  ({ variant = 'default', hoverable = false, as: Component = 'div', className = '', children, ...props }, ref) => {
    const variantClass = styles[`card--${variant}`] || styles['card--default'];
    const hoverClass = hoverable ? styles['card--hoverable'] : '';
    const combinedClassName = [styles.card, variantClass, hoverClass, className]
      .filter(Boolean)
      .join(' ');

    return (
      <Component ref={ref as any} className={combinedClassName} {...props}>
        {children}
      </Component>
    );
  }
);

Card.displayName = 'Card';

// Sub-components for common card sections
export interface CardSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardHeader = forwardRef<HTMLDivElement, CardSectionProps>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <div ref={ref} className={`${styles.cardHeader} ${className}`} {...props}>
        {children}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

export const CardContent = forwardRef<HTMLDivElement, CardSectionProps>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <div ref={ref} className={`${styles.cardContent} ${className}`} {...props}>
        {children}
      </div>
    );
  }
);

CardContent.displayName = 'CardContent';

export const CardFooter = forwardRef<HTMLDivElement, CardSectionProps>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <div ref={ref} className={`${styles.cardFooter} ${className}`} {...props}>
        {children}
      </div>
    );
  }
);

CardFooter.displayName = 'CardFooter';
