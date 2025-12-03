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
import KeyboardShortcutsHelp from './KeyboardShortcutsHelp';
import * as Tooltip from '@radix-ui/react-tooltip';
import { FormField } from '@/types/form-builder';
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
    addField,
    selectField,
  } = useFormBuilder();
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [showShortcutsHelp, setShowShortcutsHelp] = React.useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  // Helper function to create a field with default config
  const createQuickField = (type: FormField['type'], label: string): FormField => {
    return {
      id: `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      label,
      validations: [],
      required: false,
    };
  };

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore shortcuts when typing in inputs/textareas
      const target = event.target as HTMLElement;
      const isInputField = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      // Show shortcuts help with ?
      if (event.key === '?' && !isInputField && state.mode === 'builder') {
        event.preventDefault();
        setShowShortcutsHelp((prev) => !prev);
        return;
      }

      // Quick field insertion (only in builder mode, not in input fields)
      if (state.mode === 'builder' && !isInputField && !event.metaKey && !event.ctrlKey && !event.altKey) {
        let field: FormField | null = null;

        switch (event.key.toLowerCase()) {
          case 't':
            field = createQuickField('text', 'Text Field');
            break;
          case 'e':
            field = createQuickField('email', 'Email Address');
            break;
          case 'n':
            field = createQuickField('number', 'Number');
            break;
          case 'p':
            field = createQuickField('tel', 'Phone Number');
            break;
          case 's':
            field = createQuickField('select', 'Select');
            break;
          case 'r':
            field = createQuickField('radio', 'Radio Group');
            break;
          case 'c':
            field = createQuickField('checkbox', 'Checkbox');
            break;
          case 'd':
            field = createQuickField('date', 'Date');
            break;
          case 'f':
            field = createQuickField('file', 'File Upload');
            break;
        }

        if (field) {
          event.preventDefault();
          addField(field, state.selectedSectionId || undefined);
          return;
        }
      }

      // Arrow key navigation between fields
      if (!isInputField && (event.key === 'ArrowUp' || event.key === 'ArrowDown')) {
        if (state.selectedFieldIds.length === 1 && state.fields.length > 0) {
          event.preventDefault();
          const currentIndex = state.fields.findIndex((f) => f.id === state.selectedFieldIds[0]);

          if (currentIndex !== -1) {
            let newIndex: number;
            if (event.key === 'ArrowUp') {
              newIndex = currentIndex > 0 ? currentIndex - 1 : state.fields.length - 1;
            } else {
              newIndex = currentIndex < state.fields.length - 1 ? currentIndex + 1 : 0;
            }
            selectField(state.fields[newIndex].id);
          }
          return;
        }
      }

      // Enter to focus settings panel (when field is selected)
      if (event.key === 'Enter' && !isInputField && state.selectedFieldIds.length === 1) {
        event.preventDefault();
        // The field is already selected, settings panel should be visible
        // We could add auto-focus to first input in settings panel here
        return;
      }

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
    addField,
    selectField,
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

      <KeyboardShortcutsHelp
        open={showShortcutsHelp}
        onOpenChange={setShowShortcutsHelp}
      />
    </div>
  );
}

export default function FormBuilder({ formId }: { formId: number | null }) {
  return (
    <Tooltip.Provider>
      <FormBuilderProvider formId={formId}>
        <FormBuilderContent />
      </FormBuilderProvider>
    </Tooltip.Provider>
  );
}
