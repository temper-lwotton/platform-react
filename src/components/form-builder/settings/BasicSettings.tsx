'use client';

import React from 'react';
import { FormField } from '@/types/form-builder';
import { useFormBuilder } from '../FormBuilderProvider';
import { Input } from '@/components/ui/primitives/Input';
import { Textarea } from '@/components/ui/primitives/Textarea';
import { Label } from '@/components/ui/primitives/Label';
import { Switch } from '@/components/ui/primitives/Switch';
import * as RadioGroup from '@radix-ui/react-radio-group';
import styles from './Settings.module.scss';

interface BasicSettingsProps {
  field: FormField;
}

export default function BasicSettings({ field }: BasicSettingsProps) {
  const { updateField } = useFormBuilder();

  const handleUpdate = (updates: Partial<FormField>) => {
    updateField(field.id, updates);
  };

  return (
    <div className={styles.settingsSection}>
      <div className={styles.field}>
        <Label htmlFor="field-label">Label</Label>
        <Input
          id="field-label"
          value={field.label}
          onChange={(e) => handleUpdate({ label: e.target.value })}
          placeholder="Field label"
        />
      </div>

      {['text', 'textarea', 'email', 'number', 'tel', 'select'].includes(
        field.type
      ) && (
        <div className={styles.field}>
          <Label htmlFor="field-placeholder">Placeholder</Label>
          <Input
            id="field-placeholder"
            value={field.placeholder || ''}
            onChange={(e) => handleUpdate({ placeholder: e.target.value })}
            placeholder="Placeholder text"
          />
        </div>
      )}

      <div className={styles.field}>
        <Label htmlFor="field-help">Help Text</Label>
        <Textarea
          id="field-help"
          value={field.helpText || ''}
          onChange={(e) => handleUpdate({ helpText: e.target.value })}
          placeholder="Additional instructions for this field"
          rows={3}
        />
      </div>

      {field.type === 'textarea' && (
        <div className={styles.field}>
          <Label htmlFor="field-rows">Rows</Label>
          <Input
            id="field-rows"
            type="number"
            value={field.rows || 4}
            onChange={(e) =>
              handleUpdate({ rows: parseInt(e.target.value) || 4 })
            }
            min={1}
            max={20}
          />
        </div>
      )}

      {['number', 'slider'].includes(field.type) && (
        <>
          <div className={styles.field}>
            <Label htmlFor="field-min">Minimum Value</Label>
            <Input
              id="field-min"
              type="number"
              value={field.min ?? ''}
              onChange={(e) =>
                handleUpdate({
                  min: e.target.value ? parseFloat(e.target.value) : undefined,
                })
              }
              placeholder="No minimum"
            />
          </div>

          <div className={styles.field}>
            <Label htmlFor="field-max">Maximum Value</Label>
            <Input
              id="field-max"
              type="number"
              value={field.max ?? ''}
              onChange={(e) =>
                handleUpdate({
                  max: e.target.value ? parseFloat(e.target.value) : undefined,
                })
              }
              placeholder="No maximum"
            />
          </div>

          <div className={styles.field}>
            <Label htmlFor="field-step">Step</Label>
            <Input
              id="field-step"
              type="number"
              value={field.step ?? 1}
              onChange={(e) =>
                handleUpdate({
                  step: e.target.value ? parseFloat(e.target.value) : 1,
                })
              }
              min={0.01}
              step={0.01}
            />
          </div>
        </>
      )}

      {field.type === 'rating' && (
        <div className={styles.field}>
          <Label htmlFor="field-max-rating">Maximum Stars</Label>
          <Input
            id="field-max-rating"
            type="number"
            value={field.max || 5}
            onChange={(e) =>
              handleUpdate({ max: parseInt(e.target.value) || 5 })
            }
            min={3}
            max={10}
          />
        </div>
      )}

      {field.type === 'file' && (
        <>
          <div className={styles.field}>
            <Label htmlFor="field-accept">Accepted File Types</Label>
            <Input
              id="field-accept"
              value={field.accept || ''}
              onChange={(e) => handleUpdate({ accept: e.target.value })}
              placeholder="e.g., .pdf,.doc,.docx"
            />
            <p className={styles.fieldHint}>
              Comma-separated file extensions or MIME types
            </p>
          </div>

          <div className={styles.switchField}>
            <div>
              <span className={styles.switchLabel}>Allow Multiple Files</span>
              <p className={styles.fieldHint}>
                Allow users to upload multiple files
              </p>
            </div>
            <Switch
              checked={field.multiple || false}
              onCheckedChange={(checked: boolean) => handleUpdate({ multiple: checked })}
            />
          </div>
        </>
      )}

      {field.type === 'select' && (
        <div className={styles.switchField}>
          <div>
            <span className={styles.switchLabel}>Multiple Selection</span>
            <p className={styles.fieldHint}>Allow selecting multiple options</p>
          </div>
          <Switch
            checked={field.multiple || false}
            onCheckedChange={(checked: boolean) => handleUpdate({ multiple: checked })}
          />
        </div>
      )}

      <div className={styles.field}>
        <Label>Field Width</Label>
        <RadioGroup.Root
          value={field.width || 'full'}
          onValueChange={(value) =>
            handleUpdate({ width: value as 'full' | 'half' | 'third' })
          }
          className={styles.radioGroup}
        >
          <div className={styles.radioItem}>
            <RadioGroup.Item
              value="full"
              id="width-full"
              className={styles.radioButton}
            >
              <RadioGroup.Indicator className={styles.radioIndicator} />
            </RadioGroup.Item>
            <Label htmlFor="width-full" className={styles.radioLabel}>
              Full Width
            </Label>
          </div>

          <div className={styles.radioItem}>
            <RadioGroup.Item
              value="half"
              id="width-half"
              className={styles.radioButton}
            >
              <RadioGroup.Indicator className={styles.radioIndicator} />
            </RadioGroup.Item>
            <Label htmlFor="width-half" className={styles.radioLabel}>
              Half Width
            </Label>
          </div>

          <div className={styles.radioItem}>
            <RadioGroup.Item
              value="third"
              id="width-third"
              className={styles.radioButton}
            >
              <RadioGroup.Indicator className={styles.radioIndicator} />
            </RadioGroup.Item>
            <Label htmlFor="width-third" className={styles.radioLabel}>
              Third Width
            </Label>
          </div>
        </RadioGroup.Root>
      </div>
    </div>
  );
}
