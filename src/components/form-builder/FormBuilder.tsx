'use client';

import React from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { FormBuilderProvider, useFormBuilder } from './FormBuilderProvider';
import FormBuilderToolbar from './toolbar/FormBuilderToolbar';
import FieldPalette from './palette/FieldPalette';
import FormCanvas from './canvas/FormCanvas';
import FieldSettingsPanel from './settings/FieldSettingsPanel';
import FormPreview from './preview/FormPreview';
import * as Tooltip from '@radix-ui/react-tooltip';
import styles from './FormBuilder.module.scss';

function FormBuilderContent() {
  const {
    state,
    reorderFields,
    undo,
    redo,
    canUndo,
    canRedo,
    selectAllFields,
    clearSelection,
    bulkDeleteFields,
    bulkDuplicateFields,
    copyFields,
    pasteFields,
  } = useFormBuilder();
  const [activeId, setActiveId] = React.useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore shortcuts when typing in inputs/textareas
      const target = event.target as HTMLElement;
      const isInputField = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      // Cmd/Ctrl + Z for undo
      if ((event.metaKey || event.ctrlKey) && event.key === 'z' && !event.shiftKey) {
        if (canUndo) {
          event.preventDefault();
          undo();
        }
      }
      // Cmd/Ctrl + Shift + Z for redo
      else if ((event.metaKey || event.ctrlKey) && event.key === 'z' && event.shiftKey) {
        if (canRedo) {
          event.preventDefault();
          redo();
        }
      }
      // Cmd/Ctrl + A for select all (only in builder mode, not in input fields)
      else if ((event.metaKey || event.ctrlKey) && event.key === 'a' && state.mode === 'builder' && !isInputField) {
        if (state.fields.length > 0) {
          event.preventDefault();
          selectAllFields();
        }
      }
      // Cmd/Ctrl + C for copy (only if fields are selected)
      else if ((event.metaKey || event.ctrlKey) && event.key === 'c' && !isInputField) {
        if (state.selectedFieldIds.length > 0) {
          event.preventDefault();
          copyFields(state.selectedFieldIds);
        }
      }
      // Cmd/Ctrl + V for paste (only if clipboard has content)
      else if ((event.metaKey || event.ctrlKey) && event.key === 'v' && !isInputField) {
        if (state.clipboard.length > 0) {
          event.preventDefault();
          pasteFields(state.selectedSectionId || undefined);
        }
      }
      // Cmd/Ctrl + D for duplicate (only if fields are selected)
      else if ((event.metaKey || event.ctrlKey) && event.key === 'd') {
        if (state.selectedFieldIds.length > 0) {
          event.preventDefault();
          bulkDuplicateFields(state.selectedFieldIds);
        }
      }
      // Delete/Backspace for delete (only if fields are selected and not in input fields)
      else if ((event.key === 'Delete' || event.key === 'Backspace') && !isInputField) {
        if (state.selectedFieldIds.length > 0) {
          event.preventDefault();
          if (confirm(`Delete ${state.selectedFieldIds.length} field${state.selectedFieldIds.length !== 1 ? 's' : ''}?`)) {
            bulkDeleteFields(state.selectedFieldIds);
          }
        }
      }
      // Escape for clear selection
      else if (event.key === 'Escape') {
        if (state.selectedFieldIds.length > 0) {
          event.preventDefault();
          clearSelection();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    undo,
    redo,
    canUndo,
    canRedo,
    state.mode,
    state.fields,
    state.selectedFieldIds,
    state.clipboard,
    state.selectedSectionId,
    selectAllFields,
    clearSelection,
    bulkDeleteFields,
    bulkDuplicateFields,
    copyFields,
    pasteFields,
  ]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeFieldId = active.id as string;
    const oldIndex = state.fields.findIndex((f) => f.id === activeFieldId);

    if (oldIndex === -1) return;

    // Determine source section
    const fromSectionId = state.sections.find((s) =>
      s.fieldIds.includes(activeFieldId)
    )?.id;

    // Check if dropped over a section
    if (over.data?.current?.type === 'section') {
      const toSectionId = over.data.current.sectionId as string;
      const toSection = state.sections.find((s) => s.id === toSectionId);

      if (toSection) {
        // Moving to a different section or the same section
        const newIndex = toSection.fieldIds.length > 0
          ? state.fields.findIndex((f) => f.id === toSection.fieldIds[toSection.fieldIds.length - 1]) + 1
          : state.fields.length;

        reorderFields(oldIndex, newIndex, fromSectionId, toSectionId);
        return;
      }
    }

    // Check if dropped over unsectioned area
    if (over.data?.current?.type === 'unsectioned') {
      // Move to end of unsectioned fields
      const fieldsInSections = state.sections.flatMap((s) => s.fieldIds);
      const unsectionedFields = state.fields.filter((f) => !fieldsInSections.includes(f.id));
      const newIndex = unsectionedFields.length > 0
        ? state.fields.findIndex((f) => f.id === unsectionedFields[unsectionedFields.length - 1].id) + 1
        : 0;

      reorderFields(oldIndex, newIndex, fromSectionId, undefined);
      return;
    }

    // Dropped over another field - reorder within same context
    const overFieldId = over.id as string;
    const newIndex = state.fields.findIndex((f) => f.id === overFieldId);

    if (newIndex !== -1 && oldIndex !== newIndex) {
      // Determine destination section
      const toSectionId = state.sections.find((s) =>
        s.fieldIds.includes(overFieldId)
      )?.id;

      reorderFields(oldIndex, newIndex, fromSectionId, toSectionId);
    }
  };

  const activeField = state.fields.find((f) => f.id === activeId);

  return (
    <div className={styles.formBuilder}>
      <FormBuilderToolbar />

      <div className={styles.mainContent}>
        {state.mode === 'builder' ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <aside className={styles.palette}>
              <FieldPalette />
            </aside>

            <main className={styles.canvas}>
              <FormCanvas />
            </main>

            <aside className={styles.settings}>
              <FieldSettingsPanel />
            </aside>

            <DragOverlay>
              {activeField && (
                <div className={styles.dragOverlay}>
                  {/* Field preview during reordering */}
                  <div className={styles.dragPreview}>
                    {activeField.label}
                  </div>
                </div>
              )}
            </DragOverlay>
          </DndContext>
        ) : (
          <main className={styles.preview}>
            <FormPreview />
          </main>
        )}
      </div>
    </div>
  );
}

export default function FormBuilder() {
  return (
    <Tooltip.Provider>
      <FormBuilderProvider>
        <FormBuilderContent />
      </FormBuilderProvider>
    </Tooltip.Provider>
  );
}
