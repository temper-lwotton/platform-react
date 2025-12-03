'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft } from 'lucide-react';
import {
  usePostType,
  useCreatePostType,
  useUpdatePostType,
} from '@/hooks/cms';
import { PostTypeSupport } from '@/types/cms';
import Link from 'next/link';
import styles from './PostTypeEditor.module.scss';

interface PostTypeEditorProps {
  postTypeId?: number;
}

const AVAILABLE_SUPPORTS: { value: PostTypeSupport; label: string; description: string }[] = [
  { value: 'title', label: 'Title', description: 'Post title field' },
  { value: 'editor', label: 'Editor', description: 'Rich text content editor' },
  { value: 'author', label: 'Author', description: 'Author attribution' },
  { value: 'thumbnail', label: 'Featured Image', description: 'Thumbnail/featured image' },
  { value: 'excerpt', label: 'Excerpt', description: 'Short summary text' },
  { value: 'revisions', label: 'Revisions', description: 'Version history' },
  { value: 'custom-fields', label: 'Custom Fields', description: 'Meta fields' },
  { value: 'comments', label: 'Comments', description: 'Comment system' },
  { value: 'trackbacks', label: 'Trackbacks', description: 'Trackback support' },
  { value: 'page-attributes', label: 'Page Attributes', description: 'Order, parent, template' },
];

const ICON_OPTIONS = [
  'document', 'folder', 'file-text', 'book', 'newspaper',
  'calendar', 'image', 'video', 'music', 'shopping-cart',
  'users', 'briefcase', 'mail', 'globe', 'star',
];

export function PostTypeEditor({ postTypeId }: PostTypeEditorProps) {
  const router = useRouter();
  const isEditMode = !!postTypeId;

  // Form state
  const [name, setName] = useState('');
  const [singularLabel, setSingularLabel] = useState('');
  const [pluralLabel, setPluralLabel] = useState('');
  const [slug, setSlug] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isPublic, setIsPublic] = useState(true);
  const [hasArchive, setHasArchive] = useState(false);
  const [hierarchical, setHierarchical] = useState(false);
  const [showInMenu, setShowInMenu] = useState(true);
  const [menuIcon, setMenuIcon] = useState('document');
  const [menuPosition, setMenuPosition] = useState<number>(5);
  const [supports, setSupports] = useState<PostTypeSupport[]>([
    'title',
    'editor',
    'author',
    'thumbnail',
    'excerpt',
    'revisions',
  ]);

  // Queries & Mutations
  const { data: postTypeData } = usePostType(postTypeId!);
  const createPostType = useCreatePostType();
  const updatePostType = useUpdatePostType();

  // Load existing post type data
  useEffect(() => {
    if (postTypeData?.data) {
      const pt = postTypeData.data;
      setName(pt.name);
      setSingularLabel(pt.singularLabel);
      setPluralLabel(pt.pluralLabel);
      setSlug(pt.slug);
      setIsActive(pt.isActive);
      setIsPublic(pt.public);
      setHasArchive(pt.hasArchive);
      setHierarchical(pt.hierarchical);
      setShowInMenu(pt.showInMenu);
      setMenuIcon(pt.menuIcon || 'document');
      setMenuPosition(pt.menuPosition || 5);
      setSupports(pt.supports);
    }
  }, [postTypeData]);

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

  const handleSupportToggle = (support: PostTypeSupport) => {
    setSupports((prev) =>
      prev.includes(support)
        ? prev.filter((s) => s !== support)
        : [...prev, support]
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
        public: isPublic,
        hasArchive,
        hierarchical,
        showInMenu,
        menuIcon,
        menuPosition,
        supports,
      };

      if (isEditMode) {
        await updatePostType.mutateAsync({ id: postTypeId, data });
      } else {
        await createPostType.mutateAsync(data);
      }

      router.push('/admin/post-types');
    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to save post type');
    }
  };

  const isSaving = createPostType.isPending || updatePostType.isPending;

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <Link href="/admin/post-types" className={styles.backButton}>
          <ArrowLeft className={styles.buttonIcon} />
          Back to Post Types
        </Link>
        <h1 className={styles.title}>
          {isEditMode ? 'Edit Post Type' : 'Create Post Type'}
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
                placeholder="e.g., article, product, event"
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
                placeholder="e.g., Article, Product, Event"
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
                placeholder="e.g., Articles, Products, Events"
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
                placeholder="e.g., articles, products, events"
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
                    Enable this post type
                  </span>
                </div>
              </label>

              <label className={styles.toggleItem}>
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className={styles.checkbox}
                />
                <div className={styles.toggleContent}>
                  <span className={styles.toggleLabel}>Public</span>
                  <span className={styles.toggleDescription}>
                    Visible to the public (frontend)
                  </span>
                </div>
              </label>

              <label className={styles.toggleItem}>
                <input
                  type="checkbox"
                  checked={hasArchive}
                  onChange={(e) => setHasArchive(e.target.checked)}
                  className={styles.checkbox}
                />
                <div className={styles.toggleContent}>
                  <span className={styles.toggleLabel}>Has Archive</span>
                  <span className={styles.toggleDescription}>
                    Enable archive page (list view)
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
                    Allow parent/child relationships (like pages)
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
            </div>
          </div>

          {/* Menu Appearance */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Menu Appearance</h2>

            <div className={styles.field}>
              <label className={styles.label}>Menu Icon</label>
              <select
                value={menuIcon}
                onChange={(e) => setMenuIcon(e.target.value)}
                className={styles.select}
              >
                {ICON_OPTIONS.map((icon) => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Menu Position</label>
              <input
                type="number"
                value={menuPosition}
                onChange={(e) => setMenuPosition(Number(e.target.value))}
                min={0}
                max={100}
                className={styles.input}
              />
              <p className={styles.helpText}>
                Lower numbers appear first in the menu
              </p>
            </div>
          </div>

          {/* Supported Features */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Supported Features</h2>
            <p className={styles.sectionDescription}>
              Select which features this post type supports
            </p>

            <div className={styles.supportsList}>
              {AVAILABLE_SUPPORTS.map((support) => (
                <label key={support.value} className={styles.supportItem}>
                  <input
                    type="checkbox"
                    checked={supports.includes(support.value)}
                    onChange={() => handleSupportToggle(support.value)}
                    className={styles.checkbox}
                  />
                  <div className={styles.supportContent}>
                    <span className={styles.supportLabel}>{support.label}</span>
                    <span className={styles.supportDescription}>
                      {support.description}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <Link href="/admin/post-types" className={styles.cancelButton}>
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSaving}
            className={styles.saveButton}
          >
            <Save className={styles.buttonIcon} />
            {isSaving ? 'Saving...' : isEditMode ? 'Update Post Type' : 'Create Post Type'}
          </button>
        </div>
      </form>
    </div>
  );
}
