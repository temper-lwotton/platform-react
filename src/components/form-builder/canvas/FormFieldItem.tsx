'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FormField } from '@/types/form-builder';
import { useFormBuilder } from '../FormBuilderProvider';
import { GripVertical, Trash2, Settings } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { getFieldPaletteItem } from '../field-palette-config';
import styles from './FormFieldItem.module.scss';

interface FormFieldItemProps {
  field: FormField;
  isDragOverlay?: boolean;
}

export default function FormFieldItem({
  field,
  isDragOverlay = false,
}: FormFieldItemProps) {
  const { state, deleteField, selectField } = useFormBuilder();
  const isSelected = state.selectedFieldId === field.id;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: field.id,
    disabled: isDragOverlay,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const paletteItem = getFieldPaletteItem(field.type);
  const IconComponent = paletteItem
    ? (LucideIcons as any)[paletteItem.icon]
    : null;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this field?')) {
      deleteField(field.id);
    }
  };

  const handleSelect = () => {
    selectField(field.id);
  };

  const className = [
    styles.fieldItem,
    isSelected ? styles.selected : '',
    isDragging ? styles.dragging : '',
    isDragOverlay ? styles.overlay : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={className}
      onClick={handleSelect}
    >
      <div className={styles.dragHandle} {...attributes} {...listeners}>
        <GripVertical size={16} />
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.fieldInfo}>
            {IconComponent && (
              <div className={styles.icon}>
                <IconComponent size={16} />
              </div>
            )}
            <div className={styles.label}>
              {field.label}
              {field.required && <span className={styles.required}>*</span>}
            </div>
          </div>
          <div className={styles.type}>{paletteItem?.label}</div>
        </div>

        {field.helpText && (
          <div className={styles.helpText}>{field.helpText}</div>
        )}

        {field.validations.length > 0 && (
          <div className={styles.validations}>
            {field.validations.length} validation
            {field.validations.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      <div className={styles.actions}>
        <button
          className={styles.actionButton}
          onClick={handleSelect}
          aria-label="Configure field"
        >
          <Settings size={16} />
        </button>
        <button
          className={styles.actionButton}
          onClick={handleDelete}
          aria-label="Delete field"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
