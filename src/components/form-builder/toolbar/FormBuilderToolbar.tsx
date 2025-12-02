'use client';

import React from 'react';
import { useFormBuilder } from '../FormBuilderProvider';
import { Button } from '@/components/ui/primitives/Button';
import * as Tabs from '@radix-ui/react-tabs';
import { Save, Trash2, Eye, Edit3 } from 'lucide-react';
import styles from './FormBuilderToolbar.module.scss';

export default function FormBuilderToolbar() {
  const { state, dispatch, setMode, clearForm } = useFormBuilder();

  const handleClearForm = () => {
    if (
      state.fields.length > 0 &&
      confirm('Are you sure you want to clear this form? This action cannot be undone.')
    ) {
      clearForm();
    }
  };

  const handleSave = () => {
    // TODO: Implement save functionality (API integration)
    console.log('Saving form:', state);
    alert('Save functionality will be implemented with API integration');
  };

  return (
    <div className={styles.toolbar}>
      <div className={styles.formMeta}>
        <input
          type="text"
          className={styles.formTitle}
          value={state.formTitle}
          onChange={(e) =>
            dispatch({ type: 'SET_FORM_TITLE', payload: e.target.value })
          }
          placeholder="Form Title"
        />
        <input
          type="text"
          className={styles.formDescription}
          value={state.formDescription || ''}
          onChange={(e) =>
            dispatch({ type: 'SET_FORM_DESCRIPTION', payload: e.target.value })
          }
          placeholder="Form description (optional)"
        />
      </div>

      <div className={styles.actions}>
        <Tabs.Root
          value={state.mode}
          onValueChange={(value) => setMode(value as 'builder' | 'preview')}
          className={styles.modeTabs}
        >
          <Tabs.List className={styles.tabsList}>
            <Tabs.Trigger value="builder" className={styles.tabsTrigger}>
              <Edit3 size={16} />
              Builder
            </Tabs.Trigger>
            <Tabs.Trigger value="preview" className={styles.tabsTrigger}>
              <Eye size={16} />
              Preview
            </Tabs.Trigger>
          </Tabs.List>
        </Tabs.Root>

        <div className={styles.buttonGroup}>
          <Button
            onClick={handleClearForm}
            variant="outline"
            size="sm"
            disabled={state.fields.length === 0}
          >
            <Trash2 size={16} />
            Clear
          </Button>
          <Button onClick={handleSave} variant="primary" size="sm">
            <Save size={16} />
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
