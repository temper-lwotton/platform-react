'use client';

import React from 'react';
import { FormSection } from '@/types/form-builder';
import { useFormBuilder } from '../FormBuilderProvider';
import { Input } from '@/components/ui/primitives/Input';
import { Textarea } from '@/components/ui/primitives/Textarea';
import { Label } from '@/components/ui/primitives/Label';
import styles from './Settings.module.scss';

interface SectionSettingsProps {
  section: FormSection;
}

export default function SectionSettings({ section }: SectionSettingsProps) {
  const { state, updateSection } = useFormBuilder();

  const sectionFields = state.fields.filter((field) => section.fieldIds.includes(field.id));

  return (
    <div className={styles.settingsSection}>
      <div className={styles.field}>
        <Label htmlFor="section-title">Section Title</Label>
        <Input
          id="section-title"
          value={section.title}
          onChange={(e) => updateSection(section.id, { title: e.target.value })}
          placeholder="Section title..."
        />
      </div>

      <div className={styles.field}>
        <Label htmlFor="section-description">Description (Optional)</Label>
        <Textarea
          id="section-description"
          value={section.description || ''}
          onChange={(e) => updateSection(section.id, { description: e.target.value })}
          placeholder="Describe this section..."
          rows={3}
        />
        <p className={styles.fieldHint}>
          Help users understand what information belongs in this section
        </p>
      </div>

      <div className={styles.infoBox}>
        <h4>Section Information</h4>
        <dl className={styles.configList}>
          <div className={styles.configItem}>
            <dt>Section ID:</dt>
            <dd>{section.id}</dd>
          </div>
          <div className={styles.configItem}>
            <dt>Fields:</dt>
            <dd>{sectionFields.length}</dd>
          </div>
          <div className={styles.configItem}>
            <dt>Collapsed:</dt>
            <dd>{section.collapsed ? 'Yes' : 'No'}</dd>
          </div>
        </dl>
      </div>

      {sectionFields.length > 0 && (
        <div className={styles.infoBox}>
          <h4>Fields in this Section</h4>
          <ul className={styles.featureList}>
            {sectionFields.map((field) => (
              <li key={field.id}>
                {field.label} ({field.type})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
