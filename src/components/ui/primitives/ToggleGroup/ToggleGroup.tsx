import { forwardRef } from 'react';
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import styles from './ToggleGroup.module.scss';

export type ToggleGroupSize = 'sm' | 'md' | 'lg';
export type ToggleGroupOrientation = 'horizontal' | 'vertical';

export interface ToggleOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface ToggleGroupSingleProps {
  options: ToggleOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  type: 'single';
  size?: ToggleGroupSize;
  orientation?: ToggleGroupOrientation;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export interface ToggleGroupMultipleProps {
  options: ToggleOption[];
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  type: 'multiple';
  size?: ToggleGroupSize;
  orientation?: ToggleGroupOrientation;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export type ToggleGroupProps = ToggleGroupSingleProps | ToggleGroupMultipleProps;

export const ToggleGroup = forwardRef<HTMLDivElement, ToggleGroupProps>(
  (
    {
      options,
      value,
      defaultValue,
      onValueChange,
      type = 'multiple',
      size = 'md',
      orientation = 'horizontal',
      label,
      disabled = false,
      className = '',
    },
    ref
  ) => {
    const containerClasses = [
      styles.container,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const groupClasses = [
      styles.group,
      styles[`size-${size}`],
      styles[`orientation-${orientation}`],
      disabled && styles.disabled,
    ]
      .filter(Boolean)
      .join(' ');

    const renderItems = () =>
      options.map((option) => {
        const itemClasses = [
          styles.item,
          option.disabled && styles.itemDisabled,
        ]
          .filter(Boolean)
          .join(' ');

        return (
          <ToggleGroupPrimitive.Item
            key={option.value}
            className={itemClasses}
            value={option.value}
            disabled={disabled || option.disabled}
          >
            {option.icon && <span className={styles.icon}>{option.icon}</span>}
            <span className={styles.itemLabel}>{option.label}</span>
          </ToggleGroupPrimitive.Item>
        );
      });

    return (
      <div className={containerClasses}>
        {label && (
          <label className={styles.label}>
            {label}
          </label>
        )}

        {type === 'multiple' ? (
          <ToggleGroupPrimitive.Root
            ref={ref}
            className={groupClasses}
            type="multiple"
            value={value as string[]}
            defaultValue={defaultValue as string[]}
            onValueChange={onValueChange as (value: string[]) => void}
            disabled={disabled}
            orientation={orientation}
          >
            {renderItems()}
          </ToggleGroupPrimitive.Root>
        ) : (
          <ToggleGroupPrimitive.Root
            ref={ref}
            className={groupClasses}
            type="single"
            value={value as string}
            defaultValue={defaultValue as string}
            onValueChange={onValueChange as (value: string) => void}
            disabled={disabled}
            orientation={orientation}
          >
            {renderItems()}
          </ToggleGroupPrimitive.Root>
        )}
      </div>
    );
  }
);

ToggleGroup.displayName = 'ToggleGroup';
