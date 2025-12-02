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
  const { state, reorderFields, undo, redo, canUndo, canRedo } = useFormBuilder();
  const [activeId, setActiveId] = React.useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  // Keyboard shortcuts for undo/redo
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
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
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, canUndo, canRedo]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) return;

    // Reordering existing fields within the canvas
    const oldIndex = state.fields.findIndex((f) => f.id === active.id);
    const newIndex = state.fields.findIndex((f) => f.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      reorderFields(oldIndex, newIndex);
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
