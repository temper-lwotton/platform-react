import { forwardRef } from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import styles from './Switch.module.scss';

export type SwitchSize = 'sm' | 'md' | 'lg';

export interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  value?: string;
  size?: SwitchSize;
  label?: string;
  helperText?: string;
  error?: string;
  className?: string;
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      checked,
      defaultChecked,
      onCheckedChange,
      disabled = false,
      required = false,
      name,
      value,
      size = 'md',
      label,
      helperText,
      error,
      className = '',
    },
    ref
  ) => {
    const switchId = name || `switch-${Math.random().toString(36).substr(2, 9)}`;

    const containerClasses = [
      styles.container,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const wrapperClasses = [
      styles.wrapper,
      disabled && styles.disabled,
    ]
      .filter(Boolean)
      .join(' ');

    const switchClasses = [
      styles.switch,
      styles[`size-${size}`],
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={containerClasses}>
        <div className={wrapperClasses}>
          <SwitchPrimitive.Root
            ref={ref}
            id={switchId}
            className={switchClasses}
            checked={checked}
            defaultChecked={defaultChecked}
            onCheckedChange={onCheckedChange}
            disabled={disabled}
            required={required}
            name={name}
            value={value}
          >
            <SwitchPrimitive.Thumb className={styles.thumb} />
          </SwitchPrimitive.Root>
          {label && (
            <label htmlFor={switchId} className={styles.label}>
              {label}
              {required && <span className={styles.required}>*</span>}
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

Switch.displayName = 'Switch';
