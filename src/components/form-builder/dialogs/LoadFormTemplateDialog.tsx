'use client';

import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/primitives/Button';
import { X, FileText, Trash2, Clock, Layers, CheckSquare } from 'lucide-react';
import { useFormBuilder } from '../FormBuilderProvider';
import { FormTemplate } from '@/types/form-builder';
import styles from './LoadFormTemplateDialog.module.scss';

interface LoadFormTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function LoadFormTemplateDialog({ open, onOpenChange }: LoadFormTemplateDialogProps) {
  const { state, loadFormTemplate, deleteFormTemplate } = useFormBuilder();
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const selectedTemplate = state.formTemplates.find((t) => t.id === selectedTemplateId);

  const handleLoad = () => {
    if (selectedTemplateId) {
      loadFormTemplate(selectedTemplateId);
      onOpenChange(false);
      setSelectedTemplateId(null);
    }
  };

  const handleDelete = (id: string) => {
    deleteFormTemplate(id);
    setShowDeleteConfirm(null);
    if (selectedTemplateId === id) {
      setSelectedTemplateId(null);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.content}>
          <div className={styles.header}>
            <Dialog.Title className={styles.title}>Load Form Template</Dialog.Title>
            <Dialog.Close asChild>
              <button className={styles.closeButton} aria-label="Close">
                <X size={20} />
              </button>
            </Dialog.Close>
          </div>

          <Dialog.Description className={styles.description}>
            Select a saved template to load into the form builder.
          </Dialog.Description>

          <div className={styles.body}>
            {state.formTemplates.length === 0 ? (
              <div className={styles.emptyState}>
                <FileText size={48} />
                <h3>No templates saved</h3>
                <p>Save your current form as a template to reuse it later.</p>
              </div>
            ) : (
              <div className={styles.layout}>
                {/* Template List */}
                <div className={styles.templateList}>
                  {state.formTemplates.map((template) => (
                    <div
                      key={template.id}
                      className={`${styles.templateItem} ${
                        selectedTemplateId === template.id ? styles.selected : ''
                      }`}
                      onClick={() => setSelectedTemplateId(template.id)}
                    >
                      <div className={styles.templateInfo}>
                        <h4 className={styles.templateName}>{template.name}</h4>
                        <p className={styles.templateMeta}>
                          <Clock size={12} />
                          {formatDate(template.updatedAt)}
                        </p>
                      </div>
                      <button
                        className={styles.deleteButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDeleteConfirm(template.id);
                        }}
                        aria-label="Delete template"
                      >
                        <Trash2 size={14} />
                      </button>

                      {/* Delete Confirmation */}
                      {showDeleteConfirm === template.id && (
                        <div className={styles.deleteConfirm}>
                          <p>Delete this template?</p>
                          <div className={styles.deleteActions}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowDeleteConfirm(null);
                              }}
                            >
                              Cancel
                            </button>
                            <button
                              className={styles.confirmDelete}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(template.id);
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Template Preview */}
                {selectedTemplate && (
                  <div className={styles.templatePreview}>
                    <h3>{selectedTemplate.name}</h3>
                    {selectedTemplate.description && (
                      <p className={styles.previewDescription}>{selectedTemplate.description}</p>
                    )}

                    <div className={styles.previewDetails}>
                      <h4>Form Details</h4>
                      <div className={styles.detailItem}>
                        <strong>Form Title:</strong>
                        <span>{selectedTemplate.formTitle}</span>
                      </div>
                      {selectedTemplate.formDescription && (
                        <div className={styles.detailItem}>
                          <strong>Description:</strong>
                          <span>{selectedTemplate.formDescription}</span>
                        </div>
                      )}
                    </div>

                    <div className={styles.previewStats}>
                      <div className={styles.stat}>
                        <CheckSquare size={16} />
                        <span>{selectedTemplate.fields.length} Fields</span>
                      </div>
                      {selectedTemplate.sections.length > 0 && (
                        <div className={styles.stat}>
                          <Layers size={16} />
                          <span>{selectedTemplate.sections.length} Sections</span>
                        </div>
                      )}
                    </div>

                    <div className={styles.previewFooter}>
                      <p className={styles.warning}>
                        <strong>Note:</strong> Loading this template will replace your current form.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className={styles.footer}>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleLoad}
              disabled={!selectedTemplateId}
            >
              <FileText size={16} />
              Load Template
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
