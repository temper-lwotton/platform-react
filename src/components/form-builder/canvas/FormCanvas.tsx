'use client';

import React from 'react';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { useFormBuilder } from '../FormBuilderProvider';
import { FormSection } from '@/types/form-builder';
import FormFieldItem from './FormFieldItem';
import FormSectionItem from './FormSectionItem';
import { Plus, FolderPlus, Trash2, Copy, Clipboard, X } from 'lucide-react';
import { Button } from '@/components/ui/primitives/Button';
import styles from './FormCanvas.module.scss';

export default function FormCanvas() {
  const {
    state,
    addSection,
    bulkDeleteFields,
    bulkDuplicateFields,
    copyFields,
    pasteFields,
    clearSelection,
  } = useFormBuilder();

  const handleAddSection = () => {
    const newSection: FormSection = {
      id: `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: 'New Section',
      description: '',
      collapsed: false,
      fieldIds: [],
    };
    addSection(newSection);
  };

  const handleBulkDelete = () => {
    if (confirm(`Delete ${state.selectedFieldIds.length} field${state.selectedFieldIds.length !== 1 ? 's' : ''}?`)) {
      bulkDeleteFields(state.selectedFieldIds);
    }
  };

  const handleBulkDuplicate = () => {
    bulkDuplicateFields(state.selectedFieldIds);
  };

  const handleCopy = () => {
    copyFields(state.selectedFieldIds);
  };

  const handlePaste = () => {
    pasteFields(state.selectedSectionId || undefined);
  };

  // Get fields that are not in any section
  const fieldsInSections = state.sections.flatMap((section) => section.fieldIds);
  const unsectionedFields = state.fields.filter((field) => !fieldsInSections.includes(field.id));

  // Make unsectioned area droppable
  const { setNodeRef: setUnsectionedRef, isOver: isOverUnsectioned } = useDroppable({
    id: 'unsectioned-area',
    data: {
      type: 'unsectioned',
    },
  });

  return (
    <div className={styles.canvas}>
      {state.fields.length === 0 && state.sections.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <Plus size={48} />
          </div>
          <h3>Start building your form</h3>
          <p>Click on a field type from the left to add it to your form</p>
          <p className={styles.hint}>Or organize your form into sections</p>
          <Button onClick={handleAddSection} variant="outline" size="sm">
            <FolderPlus size={16} />
            Add Section
          </Button>
        </div>
      ) : (
        <div className={styles.content}>
          {/* Bulk actions toolbar */}
          {state.selectedFieldIds.length > 0 && (
            <div className={styles.bulkToolbar}>
              <div className={styles.bulkInfo}>
                <span className={styles.bulkCount}>
                  {state.selectedFieldIds.length} field{state.selectedFieldIds.length !== 1 ? 's' : ''} selected
                </span>
                <button
                  className={styles.clearSelection}
                  onClick={clearSelection}
                  aria-label="Clear selection"
                >
                  <X size={14} />
                </button>
              </div>
              <div className={styles.bulkActions}>
                <Button onClick={handleBulkDelete} variant="ghost" size="sm">
                  <Trash2 size={16} />
                  Delete
                </Button>
                <Button onClick={handleBulkDuplicate} variant="ghost" size="sm">
                  <Copy size={16} />
                  Duplicate
                </Button>
                <Button onClick={handleCopy} variant="ghost" size="sm">
                  <Clipboard size={16} />
                  Copy
                </Button>
                {state.clipboard.length > 0 && (
                  <Button onClick={handlePaste} variant="ghost" size="sm">
                    <Clipboard size={16} />
                    Paste ({state.clipboard.length})
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Section management buttons */}
          {state.fields.length > 0 && (
            <div className={styles.toolbar}>
              <Button onClick={handleAddSection} variant="ghost" size="sm">
                <FolderPlus size={16} />
                Add Section
              </Button>
            </div>
          )}

          {/* Render sections */}
          {state.sections.length > 0 && (
            <div className={styles.sectionsList}>
              {state.sections.map((section) => (
                <FormSectionItem key={section.id} section={section} />
              ))}
            </div>
          )}

          {/* Render unsectioned fields */}
          {(unsectionedFields.length > 0 || state.sections.length > 0) && (
            <div
              ref={setUnsectionedRef}
              className={`${styles.unsectionedFields} ${isOverUnsectioned ? styles.dragOver : ''}`}
            >
              {state.sections.length > 0 && (
                <div className={styles.unsectionedHeader}>
                  <h4>Unsectioned Fields</h4>
                  <p>{unsectionedFields.length > 0 ? 'These fields are not in any section' : 'Drag fields here to remove them from sections'}</p>
                </div>
              )}
              {unsectionedFields.length > 0 ? (
                <SortableContext
                  items={unsectionedFields.map((f) => f.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className={styles.fieldsList}>
                    {unsectionedFields.map((field) => (
                      <FormFieldItem key={field.id} field={field} />
                    ))}
                  </div>
                </SortableContext>
              ) : state.sections.length > 0 ? (
                <div className={styles.emptyUnsectioned}>
                  <Plus size={24} />
                  <p>Drop fields here to remove from sections</p>
                </div>
              ) : null}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
