'use client';

import React from 'react';
import { FormField, ValidationRule, ComparisonOperator } from '@/types/form-builder';
import { useFormBuilder } from '../FormBuilderProvider';
import { Input } from '@/components/ui/primitives/Input';
import { Label } from '@/components/ui/primitives/Label';
import { Switch } from '@/components/ui/primitives/Switch';
import { Button } from '@/components/ui/primitives/Button';
import { Plus, Trash2 } from 'lucide-react';
import styles from './Settings.module.scss';

interface ValidationSettingsProps {
  field: FormField;
}

export default function ValidationSettings({ field }: ValidationSettingsProps) {
  const { state, updateField } = useFormBuilder();

  const validations = field.validations || [];

  const hasValidation = (type: string) =>
    validations.some((v) => v.type === type);

  const getValidation = (type: string) =>
    validations.find((v) => v.type === type);

  const toggleValidation = (type: string, defaultMessage: string) => {
    if (hasValidation(type)) {
      // Remove validation
      updateField(field.id, {
        validations: validations.filter((v) => v.type !== type),
      });
    } else {
      // Add validation
      const newValidation: ValidationRule = {
        id: `${type}-${Date.now()}`,
        type: type as any,
        message: defaultMessage,
      };
      updateField(field.id, {
        validations: [...validations, newValidation],
      });
    }
  };

  const updateValidation = (
    type: string,
    updates: Partial<ValidationRule>
  ) => {
    updateField(field.id, {
      validations: validations.map((v) =>
        v.type === type ? { ...v, ...updates } : v
      ),
    });
  };

  const isRequired = hasValidation('required');

  return (
    <div className={styles.settingsSection}>
      <div className={styles.switchField}>
        <div>
          <span className={styles.switchLabel}>Required Field</span>
          <p className={styles.fieldHint}>User must fill this field</p>
        </div>
        <Switch
          checked={isRequired}
          onCheckedChange={() =>
            toggleValidation('required', 'This field is required')
          }
        />
      </div>

      {isRequired && (
        <div className={styles.field}>
          <Label htmlFor="required-message">Error Message</Label>
          <Input
            id="required-message"
            value={getValidation('required')?.message || ''}
            onChange={(e) =>
              updateValidation('required', { message: e.target.value })
            }
            placeholder="This field is required"
          />
        </div>
      )}

      {field.type === 'email' && (
        <>
          <div className={styles.switchField}>
            <div>
              <span className={styles.switchLabel}>Email Validation</span>
              <p className={styles.fieldHint}>Validate email format</p>
            </div>
            <Switch
              checked={hasValidation('email')}
              onCheckedChange={() =>
                toggleValidation('email', 'Please enter a valid email address')
              }
            />
          </div>

          {hasValidation('email') && (
            <div className={styles.field}>
              <Label htmlFor="email-message">Error Message</Label>
              <Input
                id="email-message"
                value={getValidation('email')?.message || ''}
                onChange={(e) =>
                  updateValidation('email', { message: e.target.value })
                }
                placeholder="Please enter a valid email address"
              />
            </div>
          )}
        </>
      )}

      {['text', 'textarea'].includes(field.type) && (
        <>
          <div className={styles.switchField}>
            <div>
              <span className={styles.switchLabel}>Minimum Length</span>
              <p className={styles.fieldHint}>Minimum number of characters</p>
            </div>
            <Switch
              
              checked={hasValidation('minLength')}
              onCheckedChange={() =>
                toggleValidation('minLength', 'Text is too short')
              }
            />
          </div>

          {hasValidation('minLength') && (
            <>
              <div className={styles.field}>
                <Label htmlFor="minLength-value">Minimum Characters</Label>
                <Input
                  id="minLength-value"
                  type="number"
                  value={(() => {
                    const val = getValidation('minLength')?.value;
                    return typeof val === 'number' ? val : '';
                  })()}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateValidation('minLength', {
                      value: parseInt(e.target.value) || 0,
                    })
                  }
                  min={1}
                />
              </div>
              <div className={styles.field}>
                <Label htmlFor="minLength-message">Error Message</Label>
                <Input
                  id="minLength-message"
                  value={getValidation('minLength')?.message || ''}
                  onChange={(e) =>
                    updateValidation('minLength', { message: e.target.value })
                  }
                  placeholder="Text is too short"
                />
              </div>
            </>
          )}

          <div className={styles.switchField}>
            <div>
              <span className={styles.switchLabel}>Maximum Length</span>
              <p className={styles.fieldHint}>Maximum number of characters</p>
            </div>
            <Switch
              
              checked={hasValidation('maxLength')}
              onCheckedChange={() =>
                toggleValidation('maxLength', 'Text is too long')
              }
            />
          </div>

          {hasValidation('maxLength') && (
            <>
              <div className={styles.field}>
                <Label htmlFor="maxLength-value">Maximum Characters</Label>
                <Input
                  id="maxLength-value"
                  type="number"
                  value={(() => {
                    const val = getValidation('maxLength')?.value;
                    return typeof val === 'number' ? val : '';
                  })()}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateValidation('maxLength', {
                      value: parseInt(e.target.value) || 0,
                    })
                  }
                  min={1}
                />
              </div>
              <div className={styles.field}>
                <Label htmlFor="maxLength-message">Error Message</Label>
                <Input
                  id="maxLength-message"
                  value={getValidation('maxLength')?.message || ''}
                  onChange={(e) =>
                    updateValidation('maxLength', { message: e.target.value })
                  }
                  placeholder="Text is too long"
                />
              </div>
            </>
          )}
        </>
      )}

      {['number', 'slider'].includes(field.type) && (
        <>
          <div className={styles.switchField}>
            <div>
              <span className={styles.switchLabel}>Minimum Value</span>
              <p className={styles.fieldHint}>Minimum allowed value</p>
            </div>
            <Switch
              
              checked={hasValidation('min')}
              onCheckedChange={() =>
                toggleValidation('min', 'Value is too small')
              }
            />
          </div>

          {hasValidation('min') && (
            <>
              <div className={styles.field}>
                <Label htmlFor="min-value">Minimum Value</Label>
                <Input
                  id="min-value"
                  type="number"
                  value={(() => {
                    const val = getValidation('min')?.value;
                    return typeof val === 'number' ? val : '';
                  })()}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateValidation('min', {
                      value: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div className={styles.field}>
                <Label htmlFor="min-message">Error Message</Label>
                <Input
                  id="min-message"
                  value={getValidation('min')?.message || ''}
                  onChange={(e) =>
                    updateValidation('min', { message: e.target.value })
                  }
                  placeholder="Value is too small"
                />
              </div>
            </>
          )}

          <div className={styles.switchField}>
            <div>
              <span className={styles.switchLabel}>Maximum Value</span>
              <p className={styles.fieldHint}>Maximum allowed value</p>
            </div>
            <Switch
              
              checked={hasValidation('max')}
              onCheckedChange={() =>
                toggleValidation('max', 'Value is too large')
              }
            />
          </div>

          {hasValidation('max') && (
            <>
              <div className={styles.field}>
                <Label htmlFor="max-value">Maximum Value</Label>
                <Input
                  id="max-value"
                  type="number"
                  value={(() => {
                    const val = getValidation('max')?.value;
                    return typeof val === 'number' ? val : '';
                  })()}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateValidation('max', {
                      value: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div className={styles.field}>
                <Label htmlFor="max-message">Error Message</Label>
                <Input
                  id="max-message"
                  value={getValidation('max')?.message || ''}
                  onChange={(e) =>
                    updateValidation('max', { message: e.target.value })
                  }
                  placeholder="Value is too large"
                />
              </div>
            </>
          )}
        </>
      )}

      <div className={styles.switchField}>
        <div>
          <span className={styles.switchLabel}>Pattern Validation</span>
          <p className={styles.fieldHint}>Use regex to validate input</p>
        </div>
        <Switch
          
          checked={hasValidation('pattern')}
          onCheckedChange={() =>
            toggleValidation('pattern', 'Invalid format')
          }
        />
      </div>

      {hasValidation('pattern') && (
        <>
          <div className={styles.field}>
            <Label htmlFor="pattern-value">Regular Expression</Label>
            <Input
              id="pattern-value"
              value={(() => {
                const val = getValidation('pattern')?.value;
                if (val instanceof RegExp) return val.source;
                return val?.toString() || '';
              })()}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateValidation('pattern', { value: e.target.value })
              }
              placeholder="^[A-Z]{3}-[0-9]{4}$"
            />
            <p className={styles.fieldHint}>
              Enter a valid regex pattern (without delimiters)
            </p>
          </div>
          <div className={styles.field}>
            <Label htmlFor="pattern-message">Error Message</Label>
            <Input
              id="pattern-message"
              value={getValidation('pattern')?.message || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateValidation('pattern', { message: e.target.value })
              }
              placeholder="Invalid format"
            />
          </div>
        </>
      )}

      {/* Custom Validation */}
      <div className={styles.switchField}>
        <div>
          <span className={styles.switchLabel}>Custom Validation</span>
          <p className={styles.fieldHint}>Write custom JavaScript validation function</p>
        </div>
        <Switch
          checked={hasValidation('custom')}
          onCheckedChange={() =>
            toggleValidation('custom', 'Validation failed')
          }
        />
      </div>

      {hasValidation('custom') && (
        <>
          <div className={styles.field}>
            <Label htmlFor="custom-function">Validation Function</Label>
            <textarea
              id="custom-function"
              className={styles.textarea}
              value={getValidation('custom')?.customFunction || ''}
              onChange={(e) =>
                updateValidation('custom', { customFunction: e.target.value })
              }
              placeholder="function(value) { return value.length > 5; }"
              rows={5}
            />
            <p className={styles.fieldHint}>
              Function receives the field value and should return true if valid, false otherwise.
              Example: <code>function(value) {`{`} return value.startsWith('A'); {`}`}</code>
            </p>
          </div>
          <div className={styles.field}>
            <Label htmlFor="custom-message">Error Message</Label>
            <Input
              id="custom-message"
              value={getValidation('custom')?.message || ''}
              onChange={(e) =>
                updateValidation('custom', { message: e.target.value })
              }
              placeholder="Validation failed"
            />
          </div>
        </>
      )}

      {/* Cross-Field Validation */}
      <div className={styles.switchField}>
        <div>
          <span className={styles.switchLabel}>Cross-Field Validation</span>
          <p className={styles.fieldHint}>Compare this field with another field</p>
        </div>
        <Switch
          checked={hasValidation('crossField')}
          onCheckedChange={() =>
            toggleValidation('crossField', 'Field comparison failed')
          }
        />
      </div>

      {hasValidation('crossField') && (
        <>
          <div className={styles.field}>
            <Label htmlFor="crossField-compare">Compare To Field</Label>
            <select
              id="crossField-compare"
              className={styles.select}
              value={getValidation('crossField')?.compareToFieldId || ''}
              onChange={(e) =>
                updateValidation('crossField', { compareToFieldId: e.target.value })
              }
            >
              <option value="">Select a field...</option>
              {state.fields
                .filter((f) => f.id !== field.id)
                .map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.label}
                  </option>
                ))}
            </select>
          </div>
          <div className={styles.field}>
            <Label htmlFor="crossField-operator">Comparison</Label>
            <select
              id="crossField-operator"
              className={styles.select}
              value={getValidation('crossField')?.comparisonOperator || 'equals'}
              onChange={(e) =>
                updateValidation('crossField', {
                  comparisonOperator: e.target.value as ComparisonOperator,
                })
              }
            >
              <option value="equals">Must equal</option>
              <option value="notEquals">Must not equal</option>
              <option value="greaterThan">Must be greater than</option>
              <option value="lessThan">Must be less than</option>
              <option value="greaterThanOrEqual">Must be greater than or equal to</option>
              <option value="lessThanOrEqual">Must be less than or equal to</option>
            </select>
            <p className={styles.fieldHint}>
              Example: "End Date" must be greater than "Start Date"
            </p>
          </div>
          <div className={styles.field}>
            <Label htmlFor="crossField-message">Error Message</Label>
            <Input
              id="crossField-message"
              value={getValidation('crossField')?.message || ''}
              onChange={(e) =>
                updateValidation('crossField', { message: e.target.value })
              }
              placeholder="Field comparison failed"
            />
          </div>
        </>
      )}
    </div>
  );
}
