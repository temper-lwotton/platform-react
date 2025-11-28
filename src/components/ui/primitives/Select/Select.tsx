import { forwardRef } from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Icon } from '../../Icon';
import styles from './Select.module.scss';

export type SelectSize = 'sm' | 'md' | 'lg';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  size?: SelectSize;
  fullWidth?: boolean;
  label?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
}

export const Select = forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      options,
      value,
      defaultValue,
      onValueChange,
      placeholder = 'Select an option...',
      disabled = false,
      size = 'md',
      fullWidth = false,
      label,
      helperText,
      error,
      required = false,
    },
    ref
  ) => {
    const containerClasses = [
      styles.container,
      fullWidth && styles.fullWidth,
    ]
      .filter(Boolean)
      .join(' ');

    const triggerClasses = [
      styles.trigger,
      styles[`size-${size}`],
      error && styles.error,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={containerClasses}>
        {label && (
          <label className={styles.label}>
            {label}
            {required && <span className={styles.required}>*</span>}
          </label>
        )}

        <SelectPrimitive.Root
          value={value}
          defaultValue={defaultValue}
          onValueChange={onValueChange}
          disabled={disabled}
        >
          <SelectPrimitive.Trigger ref={ref} className={triggerClasses}>
            <SelectPrimitive.Value placeholder={placeholder} />
            <SelectPrimitive.Icon className={styles.icon}>
              <Icon icon="chevronDown" size={16} />
            </SelectPrimitive.Icon>
          </SelectPrimitive.Trigger>

          <SelectPrimitive.Portal>
            <SelectPrimitive.Content className={styles.content}>
              <SelectPrimitive.Viewport className={styles.viewport}>
                {options.map((option) => (
                  <SelectPrimitive.Item
                    key={option.value}
                    value={option.value}
                    disabled={option.disabled}
                    className={styles.item}
                  >
                    <SelectPrimitive.ItemText>
                      {option.label}
                    </SelectPrimitive.ItemText>
                    <SelectPrimitive.ItemIndicator className={styles.indicator}>
                      <Icon icon="check" size={16} />
                    </SelectPrimitive.ItemIndicator>
                  </SelectPrimitive.Item>
                ))}
              </SelectPrimitive.Viewport>
            </SelectPrimitive.Content>
          </SelectPrimitive.Portal>
        </SelectPrimitive.Root>

        {(error || helperText) && (
          <p className={error ? styles.errorText : styles.helperText}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
