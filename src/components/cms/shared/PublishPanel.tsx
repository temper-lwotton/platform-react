'use client';

import { Save, Eye, Globe, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Post } from '@/types/cms';
import { format } from 'date-fns';
import { useUnpublishPost } from '@/hooks/cms';
import styles from './PublishPanel.module.scss';

interface PostType {
  id: number;
  singularLabel: string;
}

interface PublishPanelProps {
  post?: Post;
  slug: string;
  onSlugChange: (slug: string) => void;
  selectedPostType: number | null;
  onPostTypeChange: (typeId: number) => void;
  postTypes?: PostType[];
  isEditMode: boolean;
  onSaveDraft: () => void;
  onPublish: () => void;
  isDirty: boolean;
  isSaving: boolean;
  lastSaved: Date | null;
}

export function PublishPanel({
  post,
  slug,
  onSlugChange,
  selectedPostType,
  onPostTypeChange,
  postTypes = [],
  isEditMode,
  onSaveDraft,
  onPublish,
  isDirty,
  isSaving,
  lastSaved,
}: PublishPanelProps) {
  const unpublishPost = useUnpublishPost();

  const handleUnpublish = async () => {
    if (post && confirm('Are you sure you want to unpublish this post? It will no longer be visible to the public.')) {
      try {
        await unpublishPost.mutateAsync(post.id);
      } catch (error) {
        alert('Failed to unpublish post');
      }
    }
  };

  // Generate URL preview
  const urlPreview = slug ? `${typeof window !== 'undefined' ? window.location.origin : ''}/posts/${slug}` : '';

  return (
    <div className={styles.panel}>
      <h3 className={styles.title}>Publish</h3>

      {/* Post Type Selector (only for new posts) */}
      {!isEditMode && (
        <div className={styles.postTypeSection}>
          <label htmlFor="post-type" className={styles.postTypeLabel}>
            Post Type
          </label>
          <select
            id="post-type"
            value={selectedPostType || ''}
            onChange={(e) => onPostTypeChange(Number(e.target.value))}
            className={styles.postTypeSelect}
          >
            <option value="">Select a post type</option>
            {postTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.singularLabel}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Status */}
      <div className={styles.status}>
        {post?.isPublished ? (
          <div className={styles.statusItem}>
            <CheckCircle className={styles.statusIcon} />
            <div>
              <div className={styles.statusLabel}>Published</div>
              {post.publishedAt && (
                <div className={styles.statusValue}>
                  {format(new Date(post.publishedAt), 'MMM d, yyyy')}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className={styles.statusItem}>
            <Clock className={styles.statusIcon} />
            <div>
              <div className={styles.statusLabel}>Draft</div>
              <div className={styles.statusValue}>Not published</div>
            </div>
          </div>
        )}

        {post?.hasUnpublishedChanges && (
          <div className={styles.changesNotice}>
            Unpublished changes
          </div>
        )}
      </div>

      {/* Slug Input */}
      <div className={styles.slugSection}>
        <label htmlFor="post-slug" className={styles.slugLabel}>
          URL Slug
        </label>
        <input
          id="post-slug"
          type="text"
          value={slug}
          onChange={(e) => onSlugChange(e.target.value)}
          placeholder="post-slug"
          className={styles.slugInput}
        />
        {slug && (
          <div className={styles.slugPreview}>
            <Globe className={styles.slugPreviewIcon} />
            <span className={styles.slugPreviewUrl}>{urlPreview}</span>
          </div>
        )}
      </div>

      {/* Last Saved */}
      {lastSaved && (
        <div className={styles.lastSaved}>
          Last saved: {format(lastSaved, 'HH:mm:ss')}
        </div>
      )}

      {/* Actions */}
      <div className={styles.actions}>
        <button
          onClick={onSaveDraft}
          disabled={isSaving || !isDirty}
          className={styles.saveDraftButton}
        >
          <Save className={styles.buttonIcon} />
          {isSaving ? 'Saving...' : 'Save Draft'}
        </button>

        {post?.isPublished && (
          <button className={styles.previewButton}>
            <Eye className={styles.buttonIcon} />
            Preview
          </button>
        )}

        <button
          onClick={onPublish}
          disabled={isSaving}
          className={styles.publishButton}
        >
          <Globe className={styles.buttonIcon} />
          {post?.isPublished ? 'Publish Changes' : 'Publish'}
        </button>

        {post?.isPublished && (
          <button
            onClick={handleUnpublish}
            disabled={unpublishPost.isPending}
            className={styles.unpublishButton}
          >
            <XCircle className={styles.buttonIcon} />
            {unpublishPost.isPending ? 'Unpublishing...' : 'Unpublish'}
          </button>
        )}
      </div>
    </div>
  );
}
