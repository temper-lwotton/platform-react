'use client';

import React from 'react';
import { FormField } from '@/types/form-builder';
import { useFormBuilder } from '../FormBuilderProvider';
import { Input } from '@/components/ui/primitives/Input';
import { Label } from '@/components/ui/primitives/Label';
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
        <h4>Future Enhancements</h4>
        <p className={styles.fieldHint}>
          The following features will be available in future updates:
        </p>
        <ul className={styles.featureList}>
          <li>Conditional logic (show/hide based on other fields)</li>
          <li>Custom CSS classes and styling</li>
          <li>Field groups and sections</li>
          <li>Calculated/formula fields</li>
        </ul>
      </div>
    </div>
  );
}
