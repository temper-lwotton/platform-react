'use client';

import React from 'react';
import { FormSection } from '@/types/form-builder';
import { useFormBuilder } from '../FormBuilderProvider';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import {
  ChevronDown,
  ChevronRight,
  GripVertical,
  Trash2,
  Settings,
  Copy,
  Plus,
} from 'lucide-react';
import FormFieldItem from './FormFieldItem';
import styles from './FormSectionItem.module.scss';

interface FormSectionItemProps {
  section: FormSection;
}

export default function FormSectionItem({ section }: FormSectionItemProps) {
  const { state, deleteSection, duplicateSection, selectSection, toggleSection } = useFormBuilder();
  const isSelected = state.selectedSectionId === section.id;

  // Get fields that belong to this section
  const sectionFields = state.fields.filter((field) => section.fieldIds.includes(field.id));

  // Make the section body droppable
  const { setNodeRef, isOver } = useDroppable({
    id: `section-${section.id}`,
    data: {
      type: 'section',
      sectionId: section.id,
    },
  });

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete the section "${section.title}" and all its fields?`)) {
      deleteSection(section.id);
    }
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    duplicateSection(section.id);
  };

  const handleSelect = () => {
    selectSection(section.id);
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSection(section.id);
  };

  const className = [
    styles.sectionItem,
    isSelected ? styles.selected : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={className}>
      <div className={styles.sectionHeader} onClick={handleSelect}>
        <div className={styles.dragHandle}>
          <GripVertical size={16} />
        </div>

        <button
          className={styles.collapseButton}
          onClick={handleToggle}
          aria-label={section.collapsed ? 'Expand section' : 'Collapse section'}
        >
          {section.collapsed ? <ChevronRight size={18} /> : <ChevronDown size={18} />}
        </button>

        <div className={styles.content}>
          <div className={styles.title}>{section.title}</div>
          {section.description && (
            <div className={styles.description}>{section.description}</div>
          )}
          <div className={styles.badge}>
            {sectionFields.length} field{sectionFields.length !== 1 ? 's' : ''}
          </div>
        </div>

        <div className={styles.actions}>
          <button
            className={styles.actionButton}
            onClick={handleSelect}
            aria-label="Configure section"
          >
            <Settings size={16} />
          </button>
          <button
            className={styles.actionButton}
            onClick={handleDuplicate}
            aria-label="Duplicate section"
          >
            <Copy size={16} />
          </button>
          <button
            className={styles.actionButton}
            onClick={handleDelete}
            aria-label="Delete section"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {!section.collapsed && (
        <div
          ref={setNodeRef}
          className={`${styles.sectionBody} ${isOver ? styles.dragOver : ''}`}
        >
          {sectionFields.length === 0 ? (
            <div className={styles.emptySection}>
              <Plus size={24} />
              <p>No fields in this section yet</p>
              <p className={styles.hint}>Click a field type or drag fields here</p>
            </div>
          ) : (
            <SortableContext
              items={sectionFields.map((f) => f.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className={styles.fieldsList}>
                {sectionFields.map((field) => (
                  <FormFieldItem key={field.id} field={field} />
                ))}
              </div>
            </SortableContext>
          )}
        </div>
      )}
    </div>
  );
}
