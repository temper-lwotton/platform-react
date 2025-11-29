import { forwardRef, InputHTMLAttributes } from 'react';
import styles from './Input.module.scss';

export type InputSize = 'sm' | 'md' | 'lg';
export type InputVariant = 'default' | 'error' | 'success';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: InputSize;
  variant?: InputVariant;
  fullWidth?: boolean;
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size = 'md',
      variant = 'default',
      fullWidth = false,
      label,
      helperText,
      error,
      leftIcon,
      rightIcon,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const effectiveVariant = error ? 'error' : variant;

    const containerClasses = [
      styles.container,
      fullWidth && styles.fullWidth,
    ]
      .filter(Boolean)
      .join(' ');

    const wrapperClasses = [
      styles.wrapper,
      styles[`size-${size}`],
      styles[`variant-${effectiveVariant}`],
      leftIcon && styles.hasLeftIcon,
      rightIcon && styles.hasRightIcon,
      props.disabled && styles.disabled,
    ]
      .filter(Boolean)
      .join(' ');

    const inputClasses = [styles.input, className].filter(Boolean).join(' ');

    return (
      <div className={containerClasses}>
        {label && (
          <label htmlFor={inputId} className={styles.label}>
            {label}
            {props.required && <span className={styles.required}>*</span>}
          </label>
        )}

        <div className={wrapperClasses}>
          {leftIcon && <span className={styles.leftIcon}>{leftIcon}</span>}

          <input
            ref={ref}
            id={inputId}
            className={inputClasses}
            {...props}
          />

          {rightIcon && <span className={styles.rightIcon}>{rightIcon}</span>}
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

Input.displayName = 'Input';
