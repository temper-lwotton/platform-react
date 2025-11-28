import { forwardRef, TextareaHTMLAttributes } from 'react';
import styles from './Textarea.module.scss';

export type TextareaSize = 'sm' | 'md' | 'lg';
export type TextareaVariant = 'default' | 'error' | 'success';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  size?: TextareaSize;
  variant?: TextareaVariant;
  fullWidth?: boolean;
  label?: string;
  helperText?: string;
  error?: string;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
  maxLength?: number;
  showCharCount?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      size = 'md',
      variant = 'default',
      fullWidth = false,
      label,
      helperText,
      error,
      resize = 'vertical',
      maxLength,
      showCharCount = false,
      className = '',
      id,
      value,
      ...props
    },
    ref
  ) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    const effectiveVariant = error ? 'error' : variant;
    const currentLength = typeof value === 'string' ? value.length : 0;

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
      styles[`resize-${resize}`],
      props.disabled && styles.disabled,
    ]
      .filter(Boolean)
      .join(' ');

    const textareaClasses = [styles.textarea, className].filter(Boolean).join(' ');

    return (
      <div className={containerClasses}>
        {label && (
          <div className={styles.labelRow}>
            <label htmlFor={textareaId} className={styles.label}>
              {label}
              {props.required && <span className={styles.required}>*</span>}
            </label>
            {showCharCount && maxLength && (
              <span className={styles.charCount}>
                {currentLength}/{maxLength}
              </span>
            )}
          </div>
        )}

        <div className={wrapperClasses}>
          <textarea
            ref={ref}
            id={textareaId}
            className={textareaClasses}
            maxLength={maxLength}
            value={value}
            {...props}
          />
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

Textarea.displayName = 'Textarea';
