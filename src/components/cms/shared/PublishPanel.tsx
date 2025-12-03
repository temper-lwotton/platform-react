'use client';

import { Save, Eye, Globe, Clock, CheckCircle } from 'lucide-react';
import { Post } from '@/types/cms';
import { format } from 'date-fns';
import styles from './PublishPanel.module.scss';

interface PublishPanelProps {
  post?: Post;
  onSaveDraft: () => void;
  onPublish: () => void;
  isDirty: boolean;
  isSaving: boolean;
  lastSaved: Date | null;
}

export function PublishPanel({
  post,
  onSaveDraft,
  onPublish,
  isDirty,
  isSaving,
  lastSaved,
}: PublishPanelProps) {
  return (
    <div className={styles.panel}>
      <h3 className={styles.title}>Publish</h3>

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
          {post?.isPublished ? 'Update' : 'Publish'}
        </button>
      </div>
    </div>
  );
}
