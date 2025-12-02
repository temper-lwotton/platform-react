'use client';

import React, { useState, useRef } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useFormBuilder } from '../FormBuilderProvider';
import { Button } from '@/components/ui/primitives/Button';
import { X, Upload, FileJson, AlertCircle } from 'lucide-react';
import styles from './ImportFormDialog.module.scss';

interface ImportFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ImportFormDialog({
  open,
  onOpenChange,
}: ImportFormDialogProps) {
  const { importForm } = useFormBuilder();
  const [jsonText, setJsonText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setJsonText(text);
      setError(null);
      setSuccess(false);
    };
    reader.onerror = () => {
      setError('Failed to read file');
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    if (!jsonText.trim()) {
      setError('Please paste JSON or upload a file');
      return;
    }

    const result = importForm(jsonText);

    if (result.success) {
      setSuccess(true);
      setError(null);
      setTimeout(() => {
        setJsonText('');
        setSuccess(false);
        onOpenChange(false);
      }, 1500);
    } else {
      setError(result.error || 'Import failed');
      setSuccess(false);
    }
  };

  const handleClose = () => {
    setJsonText('');
    setError(null);
    setSuccess(false);
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.content}>
          <div className={styles.header}>
            <Dialog.Title className={styles.title}>Import Form</Dialog.Title>
            <Dialog.Close asChild>
              <button className={styles.closeButton} aria-label="Close" onClick={handleClose}>
                <X size={18} />
              </button>
            </Dialog.Close>
          </div>

          <div className={styles.body}>
            <p className={styles.hint}>
              Import a form from a JSON file or paste JSON directly.
            </p>

            {error && (
              <div className={styles.errorBox}>
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className={styles.successBox}>
                <AlertCircle size={16} />
                <span>Form imported successfully!</span>
              </div>
            )}

            <div className={styles.uploadSection}>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleFileUpload}
                className={styles.fileInput}
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                size="sm"
              >
                <FileJson size={16} />
                Choose JSON File
              </Button>
            </div>

            <div className={styles.divider}>
              <span>or paste JSON</span>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="json-input" className={styles.label}>
                Form JSON
              </label>
              <textarea
                id="json-input"
                className={styles.textarea}
                placeholder='{"version":"1.0","formTitle":"My Form",...}'
                value={jsonText}
                onChange={(e) => {
                  setJsonText(e.target.value);
                  setError(null);
                  setSuccess(false);
                }}
                rows={12}
                spellCheck={false}
              />
            </div>
          </div>

          <div className={styles.footer}>
            <Button onClick={handleClose} variant="outline" size="sm">
              Cancel
            </Button>
            <Button
              onClick={handleImport}
              variant="primary"
              size="sm"
              disabled={!jsonText.trim() || success}
            >
              <Upload size={16} />
              Import Form
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
