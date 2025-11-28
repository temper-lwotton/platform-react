'use client';

import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { forwardRef } from 'react';
import styles from './Avatar.module.scss';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface AvatarProps {
  src?: string | null;
  alt?: string;
  fallback?: string;
  size?: AvatarSize;
  className?: string;
}

/**
 * Avatar component built on Radix UI Avatar primitive
 *
 * Provides consistent avatar styling with automatic fallback handling
 * and accessibility features.
 *
 * @example
 * ```tsx
 * <Avatar
 *   src={user.photo}
 *   alt={user.name}
 *   fallback="JD"
 *   size="md"
 * />
 * ```
 */
export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(
  ({ src, alt = '', fallback, size = 'md', className = '' }, ref) => {
    const sizeClass = styles[`avatar--${size}`] || styles['avatar--md'];
    const combinedClassName = [styles.avatar, sizeClass, className].filter(Boolean).join(' ');

    return (
      <AvatarPrimitive.Root ref={ref} className={combinedClassName}>
        {src && (
          <AvatarPrimitive.Image
            src={src}
            alt={alt}
            className={styles.avatarImage}
          />
        )}
        <AvatarPrimitive.Fallback className={styles.avatarFallback} delayMs={src ? 600 : 0}>
          {fallback || alt?.charAt(0)?.toUpperCase() || '?'}
        </AvatarPrimitive.Fallback>
      </AvatarPrimitive.Root>
    );
  }
);

Avatar.displayName = 'Avatar';
