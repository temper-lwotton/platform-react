import { forwardRef, ButtonHTMLAttributes } from 'react';
import styles from './Button.module.scss';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'outline' | 'ghost' | 'gradient';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      loading = false,
      disabled,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const classes = [
      styles.button,
      styles[`variant-${variant}`],
      styles[`size-${size}`],
      fullWidth && styles.fullWidth,
      loading && styles.loading,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <span className={styles.spinner} aria-hidden="true">
            <svg viewBox="0 0 24 24" className={styles.spinnerSvg}>
              <circle
                className={styles.spinnerCircle}
                cx="12"
                cy="12"
                r="10"
                fill="none"
                strokeWidth="3"
              />
            </svg>
          </span>
        )}
        <span className={loading ? styles.content : undefined}>{children}</span>
      </button>
    );
  }
);

Button.displayName = 'Button';
