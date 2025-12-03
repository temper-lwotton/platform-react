'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { LexicalEditor } from '@/components/ui/Lexical';
import {
  useBlockTemplate,
  useCreateBlockTemplate,
  useUpdateBlockTemplate,
} from '@/hooks/cms';
import { Save, Eye, ArrowLeft } from 'lucide-react';
import styles from './BlockTemplateEditor.module.scss';

interface BlockTemplateEditorProps {
  templateId?: number;
}

export function BlockTemplateEditor({ templateId }: BlockTemplateEditorProps) {
  const router = useRouter();
  const isEditMode = !!templateId;

  // State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [contentHtml, setContentHtml] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isDirty, setIsDirty] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Queries & Mutations
  const { data: templateData } = useBlockTemplate(templateId!);
  const createTemplate = useCreateBlockTemplate();
  const updateTemplate = useUpdateBlockTemplate();

  // Load existing template data
  useEffect(() => {
    if (templateData?.data) {
      const template = templateData.data;
      setName(template.name);
      setDescription(template.description || '');
      setCategory(template.category || '');
      setIsActive(template.isActive);
      // Would load blockJson into editor here
    }
  }, [templateData]);

  // Mark as dirty when content changes
  useEffect(() => {
    if (isEditMode && templateData?.data) {
      setIsDirty(true);
    }
  }, [name, description, category, content, isActive]);

  const handleContentChange = useCallback((text: string, html: string) => {
    setContent(text);
    setContentHtml(html);
  }, []);

  const handleSave = async () => {
    if (!name.trim()) {
      alert('Please enter a template name');
      return;
    }

    try {
      // For now, using empty blockJson - would convert from Lexical state
      const blockJson = JSON.stringify({
        root: {
          children: [],
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'root',
          version: 1,
        },
      });

      const data = {
        name: name.trim(),
        description: description.trim() || undefined,
        category: category.trim() || undefined,
        blockJson,
        isActive,
      };

      if (isEditMode && templateId) {
        await updateTemplate.mutateAsync({ id: templateId, data });
        alert('Block template updated successfully');
      } else {
        const result = await createTemplate.mutateAsync(data);
        router.push(`/admin/block-templates/${result.data.id}/edit`);
      }

      setIsDirty(false);
    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to save block template');
    }
  };

  const isSaving = createTemplate.isPending || updateTemplate.isPending;

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <button
          onClick={() => router.push('/admin/block-templates')}
          className={styles.backButton}
        >
          <ArrowLeft className={styles.backIcon} />
          Back to Templates
        </button>
        <h1 className={styles.title}>
          {isEditMode ? 'Edit Block Template' : 'New Block Template'}
        </h1>
      </div>

      {/* Main Editor */}
      <div className={styles.editor}>
        <div className={styles.mainArea}>
          {/* Template Info */}
          <div className={styles.infoSection}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Template Name <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Call to Action Button"
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what this block template is for..."
                className={styles.textarea}
                rows={3}
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Category</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g., Marketing, Content, Forms"
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className={styles.checkbox}
                  />
                  <span>Active</span>
                </label>
              </div>
            </div>
          </div>

          {/* Content Editor */}
          <div className={styles.contentSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Block Content</h2>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className={styles.previewButton}
              >
                <Eye className={styles.buttonIcon} />
                {showPreview ? 'Hide' : 'Show'} Preview
              </button>
            </div>

            {showPreview ? (
              <div className={styles.preview}>
                <div
                  className={styles.previewContent}
                  dangerouslySetInnerHTML={{ __html: contentHtml }}
                />
              </div>
            ) : (
              <div className={styles.editorWrapper}>
                <LexicalEditor
                  value={content}
                  onChange={handleContentChange}
                  mode="standard"
                  placeholder="Create your reusable block content here..."
                />
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className={styles.sidebar}>
          <div className={styles.savePanel}>
            <h3 className={styles.savePanelTitle}>Publish</h3>

            <button
              onClick={handleSave}
              disabled={isSaving || (!isDirty && isEditMode)}
              className={styles.saveButton}
            >
              <Save className={styles.buttonIcon} />
              {isSaving ? 'Saving...' : isEditMode ? 'Update' : 'Create'}
            </button>

            {isEditMode && (
              <p className={styles.helpText}>
                This template can be inserted into any post
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
