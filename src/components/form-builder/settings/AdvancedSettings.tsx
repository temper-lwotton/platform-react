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
  const { state, updateField } = useFormBuilder();

  // Get list of fields that can be used for conditional logic (fields before this one)
  const currentFieldIndex = state.fields.findIndex((f) => f.id === field.id);
  const availableFields = state.fields.slice(0, currentFieldIndex);

  const handleConditionalToggle = (enabled: boolean) => {
    if (enabled) {
      updateField(field.id, {
        conditionalLogic: {
          show: true,
          when: '',
          is: '',
        },
      });
    } else {
      updateField(field.id, { conditionalLogic: undefined });
    }
  };

  const handleConditionalUpdate = (updates: Partial<NonNullable<FormField['conditionalLogic']>>) => {
    if (field.conditionalLogic) {
      updateField(field.id, {
        conditionalLogic: {
          ...field.conditionalLogic,
          ...updates,
        },
      });
    }
  };

  const selectedTargetField = availableFields.find((f) => f.id === field.conditionalLogic?.when);

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

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Conditional Logic</h4>
        <div className={styles.field}>
          <Switch
            checked={!!field.conditionalLogic}
            onCheckedChange={handleConditionalToggle}
            label="Enable conditional visibility"
          />
          <p className={styles.fieldHint}>
            Show or hide this field based on another field's value
          </p>
        </div>

        {field.conditionalLogic && (
          <div className={styles.conditionalSettings}>
            <div className={styles.field}>
              <Label htmlFor="conditional-action">Action</Label>
              <Select
                options={[
                  { value: 'true', label: 'Show this field' },
                  { value: 'false', label: 'Hide this field' },
                ]}
                value={field.conditionalLogic.show.toString()}
                onValueChange={(value) => handleConditionalUpdate({ show: value === 'true' })}
              />
            </div>

            <div className={styles.field}>
              <Label htmlFor="conditional-when">When field</Label>
              <Select
                options={availableFields.map((f) => ({
                  value: f.id,
                  label: f.label,
                }))}
                value={field.conditionalLogic.when}
                onValueChange={(value) => handleConditionalUpdate({ when: value })}
                placeholder={availableFields.length === 0 ? 'No fields available' : 'Select a field...'}
              />
              {availableFields.length === 0 && (
                <p className={styles.fieldHint}>
                  Add fields above this one to enable conditional logic
                </p>
              )}
            </div>

            {selectedTargetField && (
              <div className={styles.field}>
                <Label htmlFor="conditional-is">Equals</Label>
                {selectedTargetField.type === 'checkbox' || selectedTargetField.type === 'switch' ? (
                  <Select
                    options={[
                      { value: 'true', label: 'Checked' },
                      { value: 'false', label: 'Unchecked' },
                    ]}
                    value={field.conditionalLogic.is?.toString() || ''}
                    onValueChange={(value) => handleConditionalUpdate({ is: value === 'true' })}
                    placeholder="Select value..."
                  />
                ) : selectedTargetField.options && selectedTargetField.options.length > 0 ? (
                  <Select
                    options={selectedTargetField.options.map((opt) => ({
                      value: opt.value,
                      label: opt.label,
                    }))}
                    value={field.conditionalLogic.is?.toString() || ''}
                    onValueChange={(value) => handleConditionalUpdate({ is: value })}
                    placeholder="Select value..."
                  />
                ) : (
                  <Input
                    id="conditional-is"
                    value={field.conditionalLogic.is?.toString() || ''}
                    onChange={(e) => handleConditionalUpdate({ is: e.target.value })}
                    placeholder="Enter value..."
                  />
                )}
                <p className={styles.fieldHint}>
                  The value that triggers this condition
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className={styles.infoBox}>
        <h4>Future Enhancements</h4>
        <p className={styles.fieldHint}>
          The following features will be available in future updates:
        </p>
        <ul className={styles.featureList}>
          <li>Custom CSS classes and styling</li>
          <li>Field groups and sections</li>
          <li>Calculated/formula fields</li>
          <li>Multiple conditional rules (AND/OR logic)</li>
        </ul>
      </div>
    </div>
  );
}
