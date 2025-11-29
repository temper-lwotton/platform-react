import { forwardRef } from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Icon } from '../../Icon';
import styles from './Checkbox.module.scss';

export type CheckboxSize = 'sm' | 'md' | 'lg';

export interface CheckboxProps extends Omit<CheckboxPrimitive.CheckboxProps, 'asChild'> {
  size?: CheckboxSize;
  label?: React.ReactNode;
  helperText?: string;
  error?: string;
}

export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(
  (
    {
      size = 'md',
      label,
      helperText,
      error,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

    const containerClasses = [styles.container, className]
      .filter(Boolean)
      .join(' ');

    const rootClasses = [
      styles.root,
      styles[`size-${size}`],
      error && styles.error,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={containerClasses}>
        <div className={styles.wrapper}>
          <CheckboxPrimitive.Root
            ref={ref}
            id={checkboxId}
            className={rootClasses}
            {...props}
          >
            <CheckboxPrimitive.Indicator className={styles.indicator}>
              <Icon icon="check" size={size === 'sm' ? 12 : size === 'lg' ? 18 : 14} />
            </CheckboxPrimitive.Indicator>
          </CheckboxPrimitive.Root>

          {label && (
            <label htmlFor={checkboxId} className={styles.label}>
              {label}
            </label>
          )}
        </div>

        {(error || helperText) && (
          <p className={error ? styles.errorText : styles.helperText}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
