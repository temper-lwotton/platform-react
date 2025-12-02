'use client';

import React from 'react';
import { useFormBuilder } from '../FormBuilderProvider';
import BasicSettings from './BasicSettings';
import ValidationSettings from './ValidationSettings';
import OptionsSettings from './OptionsSettings';
import AdvancedSettings from './AdvancedSettings';
import SectionSettings from './SectionSettings';
import * as Tabs from '@radix-ui/react-tabs';
import { X } from 'lucide-react';
import styles from './FieldSettingsPanel.module.scss';

export default function FieldSettingsPanel() {
  const { state, clearSelection, selectSection } = useFormBuilder();
  const selectedField = state.selectedFieldIds.length === 1
    ? state.fields.find((f) => f.id === state.selectedFieldIds[0])
    : undefined;
  const selectedSection = state.sections.find((s) => s.id === state.selectedSectionId);

  // Show section settings if a section is selected
  if (selectedSection) {
    return (
      <div className={styles.panel}>
        <div className={styles.header}>
          <h3>Section Settings</h3>
          <button
            className={styles.closeButton}
            onClick={() => selectSection(null)}
            aria-label="Close settings"
          >
            <X size={18} />
          </button>
        </div>
        <div className={styles.content}>
          <SectionSettings section={selectedSection} />
        </div>
      </div>
    );
  }

  if (!selectedField) {
    // Show multi-select info if multiple fields are selected
    if (state.selectedFieldIds.length > 1) {
      return (
        <div className={styles.panel}>
          <div className={styles.header}>
            <h3>Multiple Fields Selected</h3>
            <button
              className={styles.closeButton}
              onClick={() => clearSelection()}
              aria-label="Close settings"
            >
              <X size={18} />
            </button>
          </div>
          <div className={styles.multiSelectInfo}>
            <p className={styles.count}>{state.selectedFieldIds.length} fields selected</p>
            <p className={styles.hint}>Use bulk actions in the toolbar above to:</p>
            <ul>
              <li>Delete selected fields</li>
              <li>Duplicate selected fields</li>
              <li>Copy and paste fields</li>
            </ul>
            <p className={styles.hint}>Or select a single field to edit its settings.</p>
          </div>
        </div>
      );
    }

    return (
      <div className={styles.panel}>
        <div className={styles.emptyState}>
          <p>Select a field or section to configure its settings</p>
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
          onClick={() => clearSelection()}
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
