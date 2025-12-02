'use client';

import React, { useState } from 'react';
import { FieldTemplate } from '@/types/form-builder';
import { useFormBuilder } from '../FormBuilderProvider';
import * as LucideIcons from 'lucide-react';
import { Trash2 } from 'lucide-react';
import { getFieldPaletteItem } from '../field-palette-config';
import styles from './FieldPaletteItem.module.scss';

interface FieldTemplateItemProps {
  template: FieldTemplate;
}

export default function FieldTemplateItem({ template }: FieldTemplateItemProps) {
  const { addFieldFromTemplate, state, deleteTemplate } = useFormBuilder();
  const [isAdding, setIsAdding] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    // Don't add field if clicking on delete button
    if ((e.target as HTMLElement).closest(`.${styles.deleteButton}`)) {
      return;
    }

    setIsAdding(true);

    // Add field from template to the selected section if one is selected
    const sectionId = state.selectedSectionId || undefined;
    addFieldFromTemplate(template.id, sectionId);

    setTimeout(() => setIsAdding(false), 300);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Delete template "${template.name}"?`)) {
      deleteTemplate(template.id);
    }
  };

  // Get icon from field type
  const paletteItem = getFieldPaletteItem(template.field.type);
  const IconComponent = paletteItem
    ? (LucideIcons as any)[paletteItem.icon]
    : null;

  return (
    <div
      className={`${styles.paletteItem} ${isAdding ? styles.adding : ''}`}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={styles.icon}>
        {IconComponent && <IconComponent size={20} />}
      </div>
      <div className={styles.content}>
        <div className={styles.label}>{template.name}</div>
        {template.description && (
          <div className={styles.description}>{template.description}</div>
        )}
      </div>
      {!template.isBuiltIn && isHovered && (
        <button
          className={styles.deleteButton}
          onClick={handleDelete}
          aria-label="Delete template"
        >
          <Trash2 size={14} />
        </button>
      )}
    </div>
  );
}
