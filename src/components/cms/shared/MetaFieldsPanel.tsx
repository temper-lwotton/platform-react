'use client';

import { Plus, X } from 'lucide-react';
import { useState } from 'react';
import styles from './MetaFieldsPanel.module.scss';

interface MetaFieldsPanelProps {
  fields: Record<string, any>;
  onChange: (fields: Record<string, any>) => void;
}

export function MetaFieldsPanel({ fields, onChange }: MetaFieldsPanelProps) {
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  const handleAdd = () => {
    if (!newKey.trim()) return;

    onChange({
      ...fields,
      [newKey]: newValue,
    });

    setNewKey('');
    setNewValue('');
  };

  const handleRemove = (key: string) => {
    const newFields = { ...fields };
    delete newFields[key];
    onChange(newFields);
  };

  const handleUpdate = (key: string, value: any) => {
    onChange({
      ...fields,
      [key]: value,
    });
  };

  return (
    <div className={styles.panel}>
      <h3 className={styles.title}>Custom Fields</h3>

      {/* Existing Fields */}
      {Object.entries(fields).length > 0 && (
        <div className={styles.fieldsList}>
          {Object.entries(fields).map(([key, value]) => (
            <div key={key} className={styles.field}>
              <div className={styles.fieldHeader}>
                <span className={styles.fieldKey}>{key}</span>
                <button
                  onClick={() => handleRemove(key)}
                  className={styles.removeButton}
                  title="Remove field"
                >
                  <X className={styles.removeIcon} />
                </button>
              </div>
              <input
                type="text"
                value={value || ''}
                onChange={(e) => handleUpdate(key, e.target.value)}
                className={styles.input}
                placeholder="Value"
              />
            </div>
          ))}
        </div>
      )}

      {/* Add New Field */}
      <div className={styles.addField}>
        <input
          type="text"
          value={newKey}
          onChange={(e) => setNewKey(e.target.value)}
          placeholder="Field name"
          className={styles.input}
        />
        <input
          type="text"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          placeholder="Value"
          className={styles.input}
        />
        <button onClick={handleAdd} className={styles.addButton} disabled={!newKey.trim()}>
          <Plus className={styles.buttonIcon} />
          Add
        </button>
      </div>
    </div>
  );
}
