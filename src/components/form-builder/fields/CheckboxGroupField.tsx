'use client';

import React from 'react';
import { FormField } from '@/types/form-builder';
import { Checkbox } from '@/components/ui/primitives/Checkbox';
import { Label } from '@/components/ui/primitives/Label';
import styles from './CheckboxGroupField.module.scss';

interface CheckboxGroupFieldProps {
  field: FormField;
  value: string[];
  onChange?: (value: string[]) => void;
  disabled?: boolean;
}

export default function CheckboxGroupField({
  field,
  value,
  onChange,
  disabled = false,
}: CheckboxGroupFieldProps) {
  const handleToggle = (optionValue: string, checked: boolean) => {
    if (checked) {
      onChange?.([...value, optionValue]);
    } else {
      onChange?.(value.filter((v) => v !== optionValue));
    }
  };

  return (
    <div className={styles.checkboxGroup}>
      {field.options?.map((option) => (
        <div key={option.id} className={styles.checkboxOption}>
          <Checkbox
            checked={value.includes(option.value)}
            onCheckedChange={(checked) =>
              handleToggle(option.value, checked as boolean)
            }
            id={`${field.id}-${option.id}`}
            disabled={disabled}
          />
          <Label htmlFor={`${field.id}-${option.id}`}>{option.label}</Label>
        </div>
      ))}
    </div>
  );
}
