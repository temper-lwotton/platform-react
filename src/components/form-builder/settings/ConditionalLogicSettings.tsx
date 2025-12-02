'use client';

import React from 'react';
import { FormField, ConditionalLogic, ConditionalRule, ComparisonOperator } from '@/types/form-builder';
import { useFormBuilder } from '../FormBuilderProvider';
import { Plus, Trash2, AlertCircle } from 'lucide-react';
import styles from './ConditionalLogicSettings.module.scss';

interface ConditionalLogicSettingsProps {
  field: FormField;
}

const COMPARISON_OPERATORS: { value: ComparisonOperator; label: string }[] = [
  { value: 'equals', label: 'Equals' },
  { value: 'notEquals', label: 'Does not equal' },
  { value: 'contains', label: 'Contains' },
  { value: 'notContains', label: 'Does not contain' },
  { value: 'greaterThan', label: 'Greater than' },
  { value: 'lessThan', label: 'Less than' },
  { value: 'greaterThanOrEqual', label: 'Greater than or equal' },
  { value: 'lessThanOrEqual', label: 'Less than or equal' },
  { value: 'isEmpty', label: 'Is empty' },
  { value: 'isNotEmpty', label: 'Is not empty' },
];

const ACTIONS: { value: ConditionalLogic['action']; label: string; description: string }[] = [
  { value: 'show', label: 'Show', description: 'Show this field when conditions are met' },
  { value: 'hide', label: 'Hide', description: 'Hide this field when conditions are met' },
  { value: 'enable', label: 'Enable', description: 'Enable this field when conditions are met' },
  { value: 'disable', label: 'Disable', description: 'Disable this field when conditions are met' },
  { value: 'require', label: 'Require', description: 'Make this field required when conditions are met' },
];

export default function ConditionalLogicSettings({ field }: ConditionalLogicSettingsProps) {
  const { state, updateField } = useFormBuilder();
  const [enabled, setEnabled] = React.useState(!!field.conditionalLogic);

  const conditionalLogic = field.conditionalLogic || {
    action: 'show',
    logicType: 'all',
    conditions: [],
  };

  // Get all other fields that can be used in conditions
  const availableFields = state.fields.filter((f) => f.id !== field.id);

  const handleToggle = (checked: boolean) => {
    setEnabled(checked);
    if (checked) {
      // Enable with default logic
      updateField(field.id, {
        conditionalLogic: {
          action: 'show',
          logicType: 'all',
          conditions: [],
        },
      });
    } else {
      // Disable
      updateField(field.id, { conditionalLogic: undefined });
    }
  };

  const handleActionChange = (action: ConditionalLogic['action']) => {
    updateField(field.id, {
      conditionalLogic: { ...conditionalLogic, action },
    });
  };

  const handleLogicTypeChange = (logicType: ConditionalLogic['logicType']) => {
    updateField(field.id, {
      conditionalLogic: { ...conditionalLogic, logicType },
    });
  };

  const handleAddCondition = () => {
    const newCondition: ConditionalRule = {
      id: `condition-${Date.now()}`,
      fieldId: availableFields[0]?.id || '',
      operator: 'equals',
      value: '',
    };

    updateField(field.id, {
      conditionalLogic: {
        ...conditionalLogic,
        conditions: [...conditionalLogic.conditions, newCondition],
      },
    });
  };

  const handleRemoveCondition = (conditionId: string) => {
    updateField(field.id, {
      conditionalLogic: {
        ...conditionalLogic,
        conditions: conditionalLogic.conditions.filter((c) => c.id !== conditionId),
      },
    });
  };

  const handleConditionChange = (conditionId: string, updates: Partial<ConditionalRule>) => {
    updateField(field.id, {
      conditionalLogic: {
        ...conditionalLogic,
        conditions: conditionalLogic.conditions.map((c) =>
          c.id === conditionId ? { ...c, ...updates } : c
        ),
      },
    });
  };

  const needsValue = (operator: ComparisonOperator) => {
    return operator !== 'isEmpty' && operator !== 'isNotEmpty';
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h4 className={styles.title}>Conditional Logic</h4>
          <p className={styles.description}>
            Show, hide, enable, disable, or require this field based on other field values
          </p>
        </div>
        <label className={styles.toggle}>
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => handleToggle(e.target.checked)}
            className={styles.toggleInput}
          />
          <span className={styles.toggleSlider} />
        </label>
      </div>

      {enabled && (
        <div className={styles.content}>
          {availableFields.length === 0 ? (
            <div className={styles.emptyState}>
              <AlertCircle size={20} />
              <p>No other fields available. Add more fields to use conditional logic.</p>
            </div>
          ) : (
            <>
              {/* Action Selection */}
              <div className={styles.field}>
                <label className={styles.label}>Action</label>
                <p className={styles.hint}>What should happen when conditions are met?</p>
                <div className={styles.actionGrid}>
                  {ACTIONS.map((action) => (
                    <button
                      key={action.value}
                      type="button"
                      className={`${styles.actionButton} ${
                        conditionalLogic.action === action.value ? styles.active : ''
                      }`}
                      onClick={() => handleActionChange(action.value)}
                      title={action.description}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Logic Type */}
              {conditionalLogic.conditions.length > 1 && (
                <div className={styles.field}>
                  <label className={styles.label}>Logic Type</label>
                  <p className={styles.hint}>How should multiple conditions be evaluated?</p>
                  <div className={styles.radioGroup}>
                    <label className={styles.radio}>
                      <input
                        type="radio"
                        name="logicType"
                        checked={conditionalLogic.logicType === 'all'}
                        onChange={() => handleLogicTypeChange('all')}
                      />
                      <span>All conditions must be met (AND)</span>
                    </label>
                    <label className={styles.radio}>
                      <input
                        type="radio"
                        name="logicType"
                        checked={conditionalLogic.logicType === 'any'}
                        onChange={() => handleLogicTypeChange('any')}
                      />
                      <span>Any condition can be met (OR)</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Conditions */}
              <div className={styles.field}>
                <label className={styles.label}>
                  Conditions
                  {conditionalLogic.conditions.length > 0 &&
                    ` (${conditionalLogic.conditions.length})`}
                </label>
                <p className={styles.hint}>Define the conditions that trigger the action</p>

                {conditionalLogic.conditions.length === 0 ? (
                  <div className={styles.noConditions}>
                    <p>No conditions defined. Add at least one condition.</p>
                  </div>
                ) : (
                  <div className={styles.conditions}>
                    {conditionalLogic.conditions.map((condition, index) => {
                      const selectedField = state.fields.find((f) => f.id === condition.fieldId);
                      const showValue = needsValue(condition.operator);

                      return (
                        <div key={condition.id} className={styles.condition}>
                          <div className={styles.conditionHeader}>
                            <span className={styles.conditionNumber}>#{index + 1}</span>
                            <button
                              type="button"
                              className={styles.removeCondition}
                              onClick={() => handleRemoveCondition(condition.id)}
                              aria-label="Remove condition"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>

                          <div className={styles.conditionFields}>
                            {/* Field Selection */}
                            <div className={styles.conditionField}>
                              <label className={styles.conditionLabel}>Field</label>
                              <select
                                className={styles.select}
                                value={condition.fieldId}
                                onChange={(e) =>
                                  handleConditionChange(condition.id, { fieldId: e.target.value })
                                }
                              >
                                {availableFields.map((f) => (
                                  <option key={f.id} value={f.id}>
                                    {f.label}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Operator Selection */}
                            <div className={styles.conditionField}>
                              <label className={styles.conditionLabel}>Operator</label>
                              <select
                                className={styles.select}
                                value={condition.operator}
                                onChange={(e) =>
                                  handleConditionChange(condition.id, {
                                    operator: e.target.value as ComparisonOperator,
                                  })
                                }
                              >
                                {COMPARISON_OPERATORS.map((op) => (
                                  <option key={op.value} value={op.value}>
                                    {op.label}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Value Input */}
                            {showValue && (
                              <div className={styles.conditionField}>
                                <label className={styles.conditionLabel}>Value</label>
                                {selectedField?.options ? (
                                  <select
                                    className={styles.select}
                                    value={condition.value || ''}
                                    onChange={(e) =>
                                      handleConditionChange(condition.id, { value: e.target.value })
                                    }
                                  >
                                    <option value="">Select a value...</option>
                                    {selectedField.options.map((opt) => (
                                      <option key={opt.id} value={opt.value}>
                                        {opt.label}
                                      </option>
                                    ))}
                                  </select>
                                ) : (
                                  <input
                                    type={
                                      selectedField?.type === 'number' ||
                                      selectedField?.type === 'currency'
                                        ? 'number'
                                        : selectedField?.type === 'date'
                                        ? 'date'
                                        : 'text'
                                    }
                                    className={styles.input}
                                    value={condition.value || ''}
                                    onChange={(e) =>
                                      handleConditionChange(condition.id, { value: e.target.value })
                                    }
                                    placeholder="Enter value..."
                                  />
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <button
                  type="button"
                  className={styles.addCondition}
                  onClick={handleAddCondition}
                >
                  <Plus size={16} />
                  Add Condition
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
