'use client';

import React, { useState } from 'react';
import { FormField, FieldOption } from '@/types/form-builder';
import { useFormBuilder } from '../FormBuilderProvider';
import { Input } from '@/components/ui/primitives/Input';
import { Label } from '@/components/ui/primitives/Label';
import { Button } from '@/components/ui/primitives/Button';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import styles from './Settings.module.scss';

interface OptionsSettingsProps {
  field: FormField;
}

function SortableOption({
  option,
  onUpdate,
  onDelete,
}: {
  option: FieldOption;
  onUpdate: (id: string, updates: Partial<FieldOption>) => void;
  onDelete: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: option.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={styles.optionItem}>
      <div className={styles.optionDragHandle} {...attributes} {...listeners}>
        <GripVertical size={16} />
      </div>
      <div className={styles.optionInputs}>
        <Input
          value={option.label}
          onChange={(e) => onUpdate(option.id, { label: e.target.value })}
          placeholder="Option label"
          size="sm"
        />
        <Input
          value={option.value}
          onChange={(e) => onUpdate(option.id, { value: e.target.value })}
          placeholder="Option value"
          size="sm"
        />
      </div>
      <button
        className={styles.optionDeleteButton}
        onClick={() => onDelete(option.id)}
        aria-label="Delete option"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}

export default function OptionsSettings({ field }: OptionsSettingsProps) {
  const { updateField } = useFormBuilder();
  const options = field.options || [];

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addOption = () => {
    const newOption: FieldOption = {
      id: `option-${Date.now()}`,
      label: `Option ${options.length + 1}`,
      value: `option${options.length + 1}`,
    };
    updateField(field.id, { options: [...options, newOption] });
  };

  const updateOption = (id: string, updates: Partial<FieldOption>) => {
    updateField(field.id, {
      options: options.map((opt) =>
        opt.id === id ? { ...opt, ...updates } : opt
      ),
    });
  };

  const deleteOption = (id: string) => {
    if (options.length <= 2) {
      alert('You must have at least 2 options');
      return;
    }
    updateField(field.id, {
      options: options.filter((opt) => opt.id !== id),
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = options.findIndex((opt) => opt.id === active.id);
      const newIndex = options.findIndex((opt) => opt.id === over.id);

      updateField(field.id, {
        options: arrayMove(options, oldIndex, newIndex),
      });
    }
  };

  return (
    <div className={styles.settingsSection}>
      <div className={styles.field}>
        <Label>Options</Label>
        <p className={styles.fieldHint}>
          Define the available options for this field. Drag to reorder.
        </p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={options.map((opt) => opt.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className={styles.optionsList}>
            {options.map((option) => (
              <SortableOption
                key={option.id}
                option={option}
                onUpdate={updateOption}
                onDelete={deleteOption}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <Button onClick={addOption} variant="outline" size="sm" fullWidth>
        <Plus size={16} />
        Add Option
      </Button>
    </div>
  );
}
