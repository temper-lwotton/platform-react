'use client';

import React from 'react';
import { FormField } from '@/types/form-builder';
import { useFormBuilder } from '../FormBuilderProvider';
import { Input } from '@/components/ui/primitives/Input';
import { Label } from '@/components/ui/primitives/Label';
import { Switch } from '@/components/ui/primitives/Switch';
import { Select } from '@/components/ui/primitives/Select';
import styles from './Settings.module.scss';

interface AdvancedSettingsProps {
  field: FormField;
}

export default function AdvancedSettings({ field }: AdvancedSettingsProps) {
  const { updateField } = useFormBuilder();

  return (
    <div className={styles.settingsSection}>
      <div className={styles.field}>
        <Label htmlFor="field-id">Field ID</Label>
        <Input
          id="field-id"
          value={field.id}
          disabled
          readOnly
        />
        <p className={styles.fieldHint}>
          Unique identifier for this field (read-only)
        </p>
      </div>

      <div className={styles.field}>
        <Label htmlFor="field-type">Field Type</Label>
        <Input
          id="field-type"
          value={field.type}
          disabled
          readOnly
        />
        <p className={styles.fieldHint}>
          The type of this field (read-only)
        </p>
      </div>

      {field.defaultValue !== undefined && (
        <div className={styles.field}>
          <Label htmlFor="field-default">Default Value</Label>
          <Input
            id="field-default"
            value={field.defaultValue?.toString() || ''}
            onChange={(e) => updateField(field.id, { defaultValue: e.target.value })}
            placeholder="Default value for this field"
          />
          <p className={styles.fieldHint}>
            This value will be pre-filled when the form loads
          </p>
        </div>
      )}

      <div className={styles.infoBox}>
        <h4>Field Configuration Summary</h4>
        <dl className={styles.configList}>
          <div className={styles.configItem}>
            <dt>Width:</dt>
            <dd>{field.width || 'full'}</dd>
          </div>
          <div className={styles.configItem}>
            <dt>Required:</dt>
            <dd>{field.required ? 'Yes' : 'No'}</dd>
          </div>
          <div className={styles.configItem}>
            <dt>Validations:</dt>
            <dd>{field.validations.length}</dd>
          </div>
          {field.options && (
            <div className={styles.configItem}>
              <dt>Options:</dt>
              <dd>{field.options.length}</dd>
            </div>
          )}
        </dl>
      </div>

      <div className={styles.infoBox}>
        <h4>Additional Features</h4>
        <p className={styles.fieldHint}>
          Use the tabs above to access additional field configuration:
        </p>
        <ul className={styles.featureList}>
          <li><strong>Logic Tab:</strong> Configure conditional visibility, dynamic required states, and field dependencies</li>
          <li><strong>Validation Tab:</strong> Set up custom validation functions and cross-field validation</li>
        </ul>
      </div>

      <div className={styles.infoBox}>
        <h4>Future Enhancements</h4>
        <p className={styles.fieldHint}>
          The following features will be available in future updates:
        </p>
        <ul className={styles.featureList}>
          <li>Custom CSS classes and styling</li>
          <li>Calculated/formula fields</li>
          <li>Field presets and quick actions</li>
        </ul>
      </div>
    </div>
  );
}
