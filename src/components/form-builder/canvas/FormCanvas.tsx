'use client';

import React from 'react';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useFormBuilder } from '../FormBuilderProvider';
import FormFieldItem from './FormFieldItem';
import { Plus } from 'lucide-react';
import styles from './FormCanvas.module.scss';

export default function FormCanvas() {
  const { state } = useFormBuilder();

  return (
    <div className={styles.canvas}>
      {state.fields.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <Plus size={48} />
          </div>
          <h3>Start building your form</h3>
          <p>Click on a field type from the left to add it to your form</p>
        </div>
      ) : (
        <SortableContext
          items={state.fields.map((f) => f.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className={styles.fieldsList}>
            {state.fields.map((field) => (
              <FormFieldItem key={field.id} field={field} />
            ))}
          </div>
        </SortableContext>
      )}
    </div>
  );
}
