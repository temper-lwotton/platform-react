'use client';

import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useFormBuilder } from '../FormBuilderProvider';
import { Button } from '@/components/ui/primitives/Button';
import { X, Save } from 'lucide-react';
import styles from './SaveAsTemplateDialog.module.scss';

interface SaveAsTemplateDialogProps {
  fieldId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SaveAsTemplateDialog({
  fieldId,
  open,
  onOpenChange,
}: SaveAsTemplateDialogProps) {
  const { state, saveFieldAsTemplate } = useFormBuilder();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const field = state.fields.find((f) => f.id === fieldId);

  const handleSave = () => {
    if (!name.trim()) return;

    saveFieldAsTemplate(fieldId, name.trim(), description.trim() || undefined);
    setName('');
    setDescription('');
    onOpenChange(false);
  };

  if (!field) return null;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.content}>
          <div className={styles.header}>
            <Dialog.Title className={styles.title}>
              Save as Template
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className={styles.closeButton} aria-label="Close">
                <X size={18} />
              </button>
            </Dialog.Close>
          </div>

          <div className={styles.body}>
            <p className={styles.hint}>
              Save this field configuration as a reusable template.
            </p>

            <div className={styles.previewField}>
              <div className={styles.previewLabel}>Field being saved:</div>
              <div className={styles.previewValue}>
                {field.label} ({field.type})
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="template-name" className={styles.label}>
                Template Name <span className={styles.required}>*</span>
              </label>
              <input
                id="template-name"
                type="text"
                className={styles.input}
                placeholder="e.g., Company Email Field"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="template-description" className={styles.label}>
                Description (optional)
              </label>
              <textarea
                id="template-description"
                className={styles.textarea}
                placeholder="Describe when to use this template..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <div className={styles.footer}>
            <Button
              onClick={() => onOpenChange(false)}
              variant="outline"
              size="sm"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              variant="primary"
              size="sm"
              disabled={!name.trim()}
            >
              <Save size={16} />
              Save Template
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
