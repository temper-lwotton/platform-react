'use client';

import React from 'react';
import { useFormBuilder } from '../FormBuilderProvider';
import BasicSettings from './BasicSettings';
import ValidationSettings from './ValidationSettings';
import OptionsSettings from './OptionsSettings';
import AdvancedSettings from './AdvancedSettings';
import * as Tabs from '@radix-ui/react-tabs';
import { X } from 'lucide-react';
import styles from './FieldSettingsPanel.module.scss';

export default function FieldSettingsPanel() {
  const { state, selectField } = useFormBuilder();
  const selectedField = state.fields.find((f) => f.id === state.selectedFieldId);

  if (!selectedField) {
    return (
      <div className={styles.panel}>
        <div className={styles.emptyState}>
          <p>Select a field to configure its settings</p>
        </div>
      </div>
    );
  }

  const hasOptions = ['select', 'radio', 'checkbox-group'].includes(
    selectedField.type
  );

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h3>Field Settings</h3>
        <button
          className={styles.closeButton}
          onClick={() => selectField(null)}
          aria-label="Close settings"
        >
          <X size={18} />
        </button>
      </div>

      <Tabs.Root defaultValue="basic" className={styles.tabs}>
        <Tabs.List className={styles.tabsList}>
          <Tabs.Trigger value="basic" className={styles.tabsTrigger}>
            Basic
          </Tabs.Trigger>
          <Tabs.Trigger value="validation" className={styles.tabsTrigger}>
            Validation
          </Tabs.Trigger>
          {hasOptions && (
            <Tabs.Trigger value="options" className={styles.tabsTrigger}>
              Options
            </Tabs.Trigger>
          )}
          <Tabs.Trigger value="advanced" className={styles.tabsTrigger}>
            Advanced
          </Tabs.Trigger>
        </Tabs.List>

        <div className={styles.tabsContent}>
          <Tabs.Content value="basic" className={styles.tabPanel}>
            <BasicSettings field={selectedField} />
          </Tabs.Content>

          <Tabs.Content value="validation" className={styles.tabPanel}>
            <ValidationSettings field={selectedField} />
          </Tabs.Content>

          {hasOptions && (
            <Tabs.Content value="options" className={styles.tabPanel}>
              <OptionsSettings field={selectedField} />
            </Tabs.Content>
          )}

          <Tabs.Content value="advanced" className={styles.tabPanel}>
            <AdvancedSettings field={selectedField} />
          </Tabs.Content>
        </div>
      </Tabs.Root>
    </div>
  );
}
