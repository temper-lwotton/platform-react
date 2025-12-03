'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft } from 'lucide-react';
import {
  useTerm,
  useCreateTerm,
  useUpdateTerm,
  useTerms,
  useTaxonomy,
} from '@/hooks/cms';
import Link from 'next/link';
import styles from './TermEditor.module.scss';

interface TermEditorProps {
  taxonomyId: number;
  termId?: number;
}

export function TermEditor({ taxonomyId, termId }: TermEditorProps) {
  const router = useRouter();
  const isEditMode = !!termId;

  // Form state
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [parentId, setParentId] = useState<number | null>(null);

  // Queries & Mutations
  const { data: termData } = useTerm(termId!);
  const { data: taxonomyData } = useTaxonomy(taxonomyId);
  const { data: termsData } = useTerms(taxonomyId);
  const createTerm = useCreateTerm();
  const updateTerm = useUpdateTerm();

  const taxonomy = taxonomyData?.data;

  // Load existing term data
  useEffect(() => {
    if (termData?.data) {
      const term = termData.data;
      setName(term.name);
      setSlug(term.slug);
      setDescription(term.description || '');
      setParentId(term.parent);
    }
  }, [termData]);

  // Auto-generate slug from name
  useEffect(() => {
    if (!isEditMode && name) {
      const generatedSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      setSlug(generatedSlug);
    }
  }, [name, isEditMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !slug) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const data = {
        name,
        slug,
        description: description || undefined,
        parent: parentId,
      };

      if (isEditMode) {
        await updateTerm.mutateAsync({ id: termId, data });
      } else {
        await createTerm.mutateAsync({ taxonomyId, data });
      }

      router.push(`/admin/taxonomies/${taxonomyId}/terms`);
    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to save term');
    }
  };

  const isSaving = createTerm.isPending || updateTerm.isPending;

  // Filter out current term from parent options
  const availableParents = termsData?.data.filter(t => t.id !== termId) || [];

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <Link
          href={`/admin/taxonomies/${taxonomyId}/terms`}
          className={styles.backButton}
        >
          <ArrowLeft className={styles.buttonIcon} />
          Back to {taxonomy?.pluralLabel || 'Terms'}
        </Link>
        <h1 className={styles.title}>
          {isEditMode ? 'Edit' : 'Create'} {taxonomy?.singularLabel || 'Term'}
        </h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGrid}>
          {/* Basic Info */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Basic Information</h2>

            <div className={styles.field}>
              <label className={styles.label}>
                Name <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={`e.g., Technology, JavaScript, ${taxonomy?.singularLabel || 'Term'}`}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>
                Slug <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g., technology, javascript"
                className={styles.input}
                required
              />
              <p className={styles.helpText}>
                URL-friendly version (auto-generated from name)
              </p>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description..."
                rows={4}
                className={styles.textarea}
              />
            </div>
          </div>

          {/* Parent (if hierarchical) */}
          {taxonomy?.hierarchical && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Hierarchy</h2>
              <p className={styles.sectionDescription}>
                Set a parent term to create a hierarchical structure
              </p>

              <div className={styles.field}>
                <label className={styles.label}>Parent {taxonomy.singularLabel}</label>
                <select
                  value={parentId || ''}
                  onChange={(e) => setParentId(e.target.value ? Number(e.target.value) : null)}
                  className={styles.select}
                >
                  <option value="">None (Top Level)</option>
                  {availableParents.map((term) => (
                    <option key={term.id} value={term.id}>
                      {term.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <Link
            href={`/admin/taxonomies/${taxonomyId}/terms`}
            className={styles.cancelButton}
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSaving}
            className={styles.saveButton}
          >
            <Save className={styles.buttonIcon} />
            {isSaving ? 'Saving...' : isEditMode ? `Update ${taxonomy?.singularLabel || 'Term'}` : `Create ${taxonomy?.singularLabel || 'Term'}`}
          </button>
        </div>
      </form>
    </div>
  );
}
