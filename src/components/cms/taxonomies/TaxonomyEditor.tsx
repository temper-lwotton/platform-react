'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft } from 'lucide-react';
import {
  useTaxonomy,
  useCreateTaxonomy,
  useUpdateTaxonomy,
  usePostTypes,
} from '@/hooks/cms';
import Link from 'next/link';
import styles from './TaxonomyEditor.module.scss';

interface TaxonomyEditorProps {
  taxonomyId?: number;
}

export function TaxonomyEditor({ taxonomyId }: TaxonomyEditorProps) {
  const router = useRouter();
  const isEditMode = !!taxonomyId;

  // Form state
  const [name, setName] = useState('');
  const [singularLabel, setSingularLabel] = useState('');
  const [pluralLabel, setPluralLabel] = useState('');
  const [slug, setSlug] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [hierarchical, setHierarchical] = useState(false);
  const [showInMenu, setShowInMenu] = useState(true);
  const [showInRest, setShowInRest] = useState(true);
  const [selectedPostTypes, setSelectedPostTypes] = useState<number[]>([]);

  // Queries & Mutations
  const { data: taxonomyData } = useTaxonomy(taxonomyId!);
  const { data: postTypesData } = usePostTypes({ active: true });
  const createTaxonomy = useCreateTaxonomy();
  const updateTaxonomy = useUpdateTaxonomy();

  // Load existing taxonomy data
  useEffect(() => {
    if (taxonomyData?.data) {
      const tax = taxonomyData.data;
      setName(tax.name);
      setSingularLabel(tax.singularLabel);
      setPluralLabel(tax.pluralLabel);
      setSlug(tax.slug);
      setIsActive(tax.isActive);
      setHierarchical(tax.hierarchical);
      setShowInMenu(tax.showInMenu);
      setShowInRest(tax.showInRest);
      setSelectedPostTypes(tax.postTypes.map(pt => pt.id));
    }
  }, [taxonomyData]);

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

  const handlePostTypeToggle = (postTypeId: number) => {
    setSelectedPostTypes((prev) =>
      prev.includes(postTypeId)
        ? prev.filter((id) => id !== postTypeId)
        : [...prev, postTypeId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !singularLabel || !pluralLabel || !slug) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const data = {
        name,
        singularLabel,
        pluralLabel,
        slug,
        isActive,
        hierarchical,
        showInMenu,
        showInRest,
        postTypes: selectedPostTypes,
      };

      if (isEditMode) {
        await updateTaxonomy.mutateAsync({ id: taxonomyId, data });
      } else {
        await createTaxonomy.mutateAsync(data);
      }

      router.push('/admin/taxonomies');
    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to save taxonomy');
    }
  };

  const isSaving = createTaxonomy.isPending || updateTaxonomy.isPending;

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <Link href="/admin/taxonomies" className={styles.backButton}>
          <ArrowLeft className={styles.buttonIcon} />
          Back to Taxonomies
        </Link>
        <h1 className={styles.title}>
          {isEditMode ? 'Edit Taxonomy' : 'Create Taxonomy'}
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
                placeholder="e.g., category, tag, topic"
                className={styles.input}
                disabled={isEditMode}
                required
              />
              <p className={styles.helpText}>
                Lowercase, no spaces. Used internally (cannot be changed after creation)
              </p>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>
                Singular Label <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                value={singularLabel}
                onChange={(e) => setSingularLabel(e.target.value)}
                placeholder="e.g., Category, Tag, Topic"
                className={styles.input}
                required
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>
                Plural Label <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                value={pluralLabel}
                onChange={(e) => setPluralLabel(e.target.value)}
                placeholder="e.g., Categories, Tags, Topics"
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
                placeholder="e.g., categories, tags, topics"
                className={styles.input}
                required
              />
              <p className={styles.helpText}>
                Used in URLs and REST API endpoints
              </p>
            </div>
          </div>

          {/* Settings */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Settings</h2>

            <div className={styles.togglesList}>
              <label className={styles.toggleItem}>
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className={styles.checkbox}
                />
                <div className={styles.toggleContent}>
                  <span className={styles.toggleLabel}>Active</span>
                  <span className={styles.toggleDescription}>
                    Enable this taxonomy
                  </span>
                </div>
              </label>

              <label className={styles.toggleItem}>
                <input
                  type="checkbox"
                  checked={hierarchical}
                  onChange={(e) => setHierarchical(e.target.checked)}
                  className={styles.checkbox}
                />
                <div className={styles.toggleContent}>
                  <span className={styles.toggleLabel}>Hierarchical</span>
                  <span className={styles.toggleDescription}>
                    Allow parent/child relationships (like categories)
                  </span>
                </div>
              </label>

              <label className={styles.toggleItem}>
                <input
                  type="checkbox"
                  checked={showInMenu}
                  onChange={(e) => setShowInMenu(e.target.checked)}
                  className={styles.checkbox}
                />
                <div className={styles.toggleContent}>
                  <span className={styles.toggleLabel}>Show in Menu</span>
                  <span className={styles.toggleDescription}>
                    Display in admin navigation
                  </span>
                </div>
              </label>

              <label className={styles.toggleItem}>
                <input
                  type="checkbox"
                  checked={showInRest}
                  onChange={(e) => setShowInRest(e.target.checked)}
                  className={styles.checkbox}
                />
                <div className={styles.toggleContent}>
                  <span className={styles.toggleLabel}>Show in REST API</span>
                  <span className={styles.toggleDescription}>
                    Make available via REST API
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Post Types */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Associated Post Types</h2>
            <p className={styles.sectionDescription}>
              Select which post types can use this taxonomy
            </p>

            {postTypesData?.data && postTypesData.data.length > 0 ? (
              <div className={styles.postTypesList}>
                {postTypesData.data.map((postType) => (
                  <label key={postType.id} className={styles.postTypeItem}>
                    <input
                      type="checkbox"
                      checked={selectedPostTypes.includes(postType.id)}
                      onChange={() => handlePostTypeToggle(postType.id)}
                      className={styles.checkbox}
                    />
                    <div className={styles.postTypeContent}>
                      <span className={styles.postTypeLabel}>
                        {postType.singularLabel}
                      </span>
                      <span className={styles.postTypeDescription}>
                        {postType.name}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            ) : (
              <p className={styles.emptyText}>
                No post types available. Create a post type first.
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <Link href="/admin/taxonomies" className={styles.cancelButton}>
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSaving}
            className={styles.saveButton}
          >
            <Save className={styles.buttonIcon} />
            {isSaving ? 'Saving...' : isEditMode ? 'Update Taxonomy' : 'Create Taxonomy'}
          </button>
        </div>
      </form>
    </div>
  );
}
