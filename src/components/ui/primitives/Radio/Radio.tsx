import { forwardRef } from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import styles from './Radio.module.scss';

export type RadioSize = 'sm' | 'md' | 'lg';
export type RadioOrientation = 'horizontal' | 'vertical';

export interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
  helperText?: string;
}

export interface RadioGroupProps {
  options: RadioOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  size?: RadioSize;
  orientation?: RadioOrientation;
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      options,
      value,
      defaultValue,
      onValueChange,
      name,
      size = 'md',
      orientation = 'vertical',
      label,
      error,
      helperText,
      required = false,
      disabled = false,
      className = '',
    },
    ref
  ) => {
    const groupId = name || `radio-group-${Math.random().toString(36).substr(2, 9)}`;

    const containerClasses = [
      styles.container,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const groupClasses = [
      styles.group,
      styles[`orientation-${orientation}`],
      disabled && styles.disabled,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={containerClasses}>
        {label && (
          <div className={styles.labelRow}>
            <label className={styles.label}>
              {label}
              {required && <span className={styles.required}>*</span>}
            </label>
          </div>
        )}

        <RadioGroupPrimitive.Root
          ref={ref}
          className={groupClasses}
          value={value}
          defaultValue={defaultValue}
          onValueChange={onValueChange}
          name={groupId}
          disabled={disabled}
        >
          {options.map((option) => {
            const itemId = `${groupId}-${option.value}`;
            const isDisabled = disabled || option.disabled;

            const itemClasses = [
              styles.item,
              styles[`size-${size}`],
              isDisabled && styles.itemDisabled,
            ]
              .filter(Boolean)
              .join(' ');

            return (
              <div key={option.value} className={itemClasses}>
                <div className={styles.radioWrapper}>
                  <RadioGroupPrimitive.Item
                    className={styles.radio}
                    value={option.value}
                    id={itemId}
                    disabled={isDisabled}
                  >
                    <RadioGroupPrimitive.Indicator className={styles.indicator} />
                  </RadioGroupPrimitive.Item>
                  <label htmlFor={itemId} className={styles.itemLabel}>
                    {option.label}
                  </label>
                </div>
                {option.helperText && (
                  <p className={styles.itemHelperText}>{option.helperText}</p>
                )}
              </div>
            );
          })}
        </RadioGroupPrimitive.Root>

        {(error || helperText) && (
          <p className={error ? styles.errorText : styles.helperText}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

RadioGroup.displayName = 'RadioGroup';

// Export as Radio for convenience
export const Radio = RadioGroup;
