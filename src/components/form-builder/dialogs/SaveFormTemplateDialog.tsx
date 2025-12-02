'use client';

import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Input } from '@/components/ui/primitives/Input';
import { Label } from '@/components/ui/primitives/Label';
import { Button } from '@/components/ui/primitives/Button';
import { Textarea } from '@/components/ui/primitives/Textarea';
import { X, Save } from 'lucide-react';
import { useFormBuilder } from '../FormBuilderProvider';
import styles from './SaveFormTemplateDialog.module.scss';

interface SaveFormTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SaveFormTemplateDialog({ open, onOpenChange }: SaveFormTemplateDialogProps) {
  const { saveFormAsTemplate, state } = useFormBuilder();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSave = () => {
    // Validate
    if (!name.trim()) {
      setError('Please enter a template name');
      return;
    }

    if (state.fields.length === 0) {
      setError('Cannot save an empty form as a template');
      return;
    }

    // Save template
    saveFormAsTemplate(name.trim(), description.trim() || undefined);

    // Reset and close
    setName('');
    setDescription('');
    setError('');
    onOpenChange(false);
  };

  const handleCancel = () => {
    setName('');
    setDescription('');
    setError('');
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.content}>
          <div className={styles.header}>
            <Dialog.Title className={styles.title}>Save as Template</Dialog.Title>
            <Dialog.Close asChild>
              <button className={styles.closeButton} aria-label="Close">
                <X size={20} />
              </button>
            </Dialog.Close>
          </div>

          <Dialog.Description className={styles.description}>
            Save your current form configuration as a reusable template.
          </Dialog.Description>

          <div className={styles.body}>
            <div className={styles.field}>
              <Label htmlFor="template-name">Template Name *</Label>
              <Input
                id="template-name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError('');
                }}
                placeholder="e.g., Contact Form, Registration Form"
                autoFocus
              />
            </div>

            <div className={styles.field}>
              <Label htmlFor="template-description">Description (Optional)</Label>
              <Textarea
                id="template-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what this template is for..."
                rows={3}
              />
            </div>

            {error && (
              <div className={styles.error}>
                {error}
              </div>
            )}

            <div className={styles.summary}>
              <h4>Template will include:</h4>
              <ul>
                <li>{state.fields.length} field{state.fields.length !== 1 ? 's' : ''}</li>
                {state.sections.length > 0 && (
                  <li>{state.sections.length} section{state.sections.length !== 1 ? 's' : ''}</li>
                )}
                <li>All field configurations and validations</li>
                <li>Conditional logic and dependencies</li>
              </ul>
            </div>
          </div>

          <div className={styles.footer}>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
              <Save size={16} />
              Save Template
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
