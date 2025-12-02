'use client';

import React from 'react';
import { FormField } from '@/types/form-builder';
import { Input } from '@/components/ui/primitives/Input';
import { Textarea } from '@/components/ui/primitives/Textarea';
import { Label } from '@/components/ui/primitives/Label';
import { Select } from '@/components/ui/primitives/Select';
import { Radio } from '@/components/ui/primitives/Radio';
import { RadioGroup } from '@/components/ui/primitives/Radio';
import { Checkbox } from '@/components/ui/primitives/Checkbox';
import { Switch } from '@/components/ui/primitives/Switch';
import RatingField from './RatingField';
import SliderField from './SliderField';
import CheckboxGroupField from './CheckboxGroupField';
import styles from './FieldRenderer.module.scss';

interface FieldRendererProps {
  field: FormField;
  value?: any;
  onChange?: (value: any) => void;
  error?: string;
}

export default function FieldRenderer({
  field,
  value,
  onChange,
  error,
}: FieldRendererProps) {
  const renderField = () => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'tel':
        return (
          <Input
            type={field.type}
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange?.(e.target.value)}
            error={error}
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange?.(e.target.value)}
            min={field.min}
            max={field.max}
            step={field.step}
            error={error}
          />
        );

      case 'textarea':
        return (
          <Textarea
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange?.(e.target.value)}
            rows={field.rows || 4}
            error={error}
          />
        );

      case 'select':
        return (
          <Select
            options={field.options?.map(opt => ({ value: opt.value, label: opt.label })) || []}
            value={value || ''}
            onValueChange={onChange}
            placeholder={field.placeholder}
            error={error}
          />
        );

      case 'radio':
        return (
          <RadioGroup
            options={field.options?.map(opt => ({ value: opt.value, label: opt.label })) || []}
            value={value || ''}
            onValueChange={onChange}
            error={error}
          />
        );

      case 'checkbox':
        return (
          <div className={styles.checkboxWrapper}>
            <Checkbox
              checked={value || false}
              onCheckedChange={onChange}
              label={field.label}
            />
          </div>
        );

      case 'checkbox-group':
        return (
          <CheckboxGroupField
            field={field}
            value={value || []}
            onChange={onChange}
          />
        );

      case 'date':
        return (
          <Input
            type="date"
            value={value || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange?.(e.target.value)}
            min={field.min?.toString()}
            max={field.max?.toString()}
            error={error}
          />
        );

      case 'time':
        return (
          <Input
            type="time"
            value={value || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange?.(e.target.value)}
            error={error}
          />
        );

      case 'file':
        return (
          <Input
            type="file"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange?.(e.target.files)}
            accept={field.accept}
            multiple={field.multiple}
            error={error}
          />
        );

      case 'switch':
        return (
          <Switch
            checked={value || false}
            onCheckedChange={onChange}
            label={field.label}
          />
        );

      case 'rating':
        return (
          <RatingField
            value={value || 0}
            onChange={onChange}
            max={field.max || 5}
          />
        );

      case 'slider':
        return (
          <SliderField
            value={value || field.min || 0}
            onChange={onChange}
            min={field.min || 0}
            max={field.max || 100}
            step={field.step || 1}
          />
        );

      default:
        return <div>Unsupported field type: {field.type}</div>;
    }
  };

  const widthClass = field.width === 'half'
    ? styles.halfWidth
    : field.width === 'third'
    ? styles.thirdWidth
    : styles.fullWidth;

  // Don't render label for checkbox and switch as they include it in the field
  const showLabel = !['checkbox', 'switch'].includes(field.type);

  return (
    <div className={`${styles.fieldWrapper} ${widthClass}`}>
      {showLabel && (
        <Label htmlFor={field.id}>
          {field.label}
          {field.required && <span className={styles.required}>*</span>}
        </Label>
      )}
      {renderField()}
      {field.helpText && !error && (
        <p className={styles.helpText}>{field.helpText}</p>
      )}
    </div>
  );
}
