'use client';

import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FormField } from '@/types/form-builder';
import { useFormBuilder } from '../FormBuilderProvider';
import { GripVertical, Trash2, Settings, Copy, GitBranch, CheckSquare, Square, Star } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { getFieldPaletteItem } from '../field-palette-config';
import SaveAsTemplateDialog from '../dialogs/SaveAsTemplateDialog';
import styles from './FormFieldItem.module.scss';

interface FormFieldItemProps {
  field: FormField;
  isDragOverlay?: boolean;
}

export default function FormFieldItem({
  field,
  isDragOverlay = false,
}: FormFieldItemProps) {
  const { state, deleteField, duplicateField, selectField } = useFormBuilder();
  const isSelected = state.selectedFieldIds.includes(field.id);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);

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

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    duplicateField(field.id);
  };

  const handleSelect = (e: React.MouseEvent) => {
    const isMulti = e.metaKey || e.ctrlKey;
    const isRange = e.shiftKey;
    selectField(field.id, isMulti, isRange);
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
      <div className={styles.selectionIndicator}>
        {isSelected ? (
          <CheckSquare size={18} className={styles.checkboxChecked} />
        ) : (
          <Square size={18} className={styles.checkboxUnchecked} />
        )}
      </div>
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

        <div className={styles.badges}>
          {field.validations && field.validations.length > 0 && (
            <div className={styles.validations}>
              {field.validations.length} validation
              {field.validations.length !== 1 ? 's' : ''}
            </div>
          )}
          {field.conditionalLogic && (
            <div className={styles.conditionalBadge} title="Conditional field">
              <GitBranch size={12} />
              Conditional
            </div>
          )}
        </div>
      </div>

      <div className={styles.actions}>
        <button
          className={styles.actionButton}
          onClick={(e) => {
            e.stopPropagation();
            selectField(field.id);
          }}
          aria-label="Configure field"
        >
          <Settings size={16} />
        </button>
        <button
          className={styles.actionButton}
          onClick={(e) => {
            e.stopPropagation();
            setSaveDialogOpen(true);
          }}
          aria-label="Save as template"
        >
          <Star size={16} />
        </button>
        <button
          className={styles.actionButton}
          onClick={handleDuplicate}
          aria-label="Duplicate field"
        >
          <Copy size={16} />
        </button>
        <button
          className={styles.actionButton}
          onClick={handleDelete}
          aria-label="Delete field"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <SaveAsTemplateDialog
        fieldId={field.id}
        open={saveDialogOpen}
        onOpenChange={setSaveDialogOpen}
      />
    </div>
  );
}
