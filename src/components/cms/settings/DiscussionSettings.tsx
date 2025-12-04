'use client';

import { useState, useEffect } from 'react';
import { Save, Loader2 } from 'lucide-react';
import { useDiscussionSettings, useUpdateDiscussionSettings } from '@/hooks/cms';
import type { DiscussionSettings as DiscussionSettingsType } from '@/services/cms/types/settings';
import styles from './SettingsForm.module.scss';

export function DiscussionSettings() {
  const { data: settingsData, isLoading } = useDiscussionSettings();
  const updateSettings = useUpdateDiscussionSettings();

  const [formData, setFormData] = useState<Partial<DiscussionSettingsType>>({});
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (settingsData?.data) {
      setFormData(settingsData.data);
    }
  }, [settingsData]);

  const handleChange = (field: keyof DiscussionSettingsType, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings.mutateAsync(formData);
    setHasChanges(false);
  };

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <Loader2 className={styles.spinner} />
        <p>Loading settings...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.header}>
        <h2 className={styles.title}>Discussion Settings</h2>
        <p className={styles.description}>
          Configure comment behavior and moderation options
        </p>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Default Settings</h3>

        <div className={styles.field}>
          <div className={styles.checkbox}>
            <input
              type="checkbox"
              id="enableComments"
              checked={formData.enableComments || false}
              onChange={(e) => handleChange('enableComments', e.target.checked)}
            />
            <label htmlFor="enableComments" className={styles.checkboxLabel}>
              <strong>Enable Comments</strong>
              <p className={styles.hint}>
                Allow people to submit comments on new posts
              </p>
            </label>
          </div>
        </div>

        <div className={styles.field}>
          <div className={styles.checkbox}>
            <input
              type="checkbox"
              id="requireNameEmail"
              checked={formData.requireNameEmail || false}
              onChange={(e) => handleChange('requireNameEmail', e.target.checked)}
            />
            <label htmlFor="requireNameEmail" className={styles.checkboxLabel}>
              <strong>Require Name and Email</strong>
              <p className={styles.hint}>
                Comment author must fill out name and email fields
              </p>
            </label>
          </div>
        </div>

        <div className={styles.field}>
          <div className={styles.checkbox}>
            <input
              type="checkbox"
              id="requireRegistration"
              checked={formData.requireRegistration || false}
              onChange={(e) => handleChange('requireRegistration', e.target.checked)}
            />
            <label htmlFor="requireRegistration" className={styles.checkboxLabel}>
              <strong>Require Registration</strong>
              <p className={styles.hint}>
                Users must be registered and logged in to comment
              </p>
            </label>
          </div>
        </div>

        <div className={styles.field}>
          <div className={styles.checkbox}>
            <input
              type="checkbox"
              id="autoCloseComments"
              checked={formData.autoCloseComments || false}
              onChange={(e) => handleChange('autoCloseComments', e.target.checked)}
            />
            <label htmlFor="autoCloseComments" className={styles.checkboxLabel}>
              <strong>Auto-Close Comments</strong>
              <p className={styles.hint}>
                Automatically close comments on old posts
              </p>
            </label>
          </div>
        </div>

        {formData.autoCloseComments && (
          <div className={styles.field}>
            <label htmlFor="autoCloseCommentsDays" className={styles.label}>
              Close Comments After (Days)
            </label>
            <input
              id="autoCloseCommentsDays"
              type="number"
              min="1"
              max="365"
              value={formData.autoCloseCommentsDays || ''}
              onChange={(e) => handleChange('autoCloseCommentsDays', Number(e.target.value))}
              className={styles.input}
            />
          </div>
        )}
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Threaded Comments</h3>

        <div className={styles.field}>
          <div className={styles.checkbox}>
            <input
              type="checkbox"
              id="enableThreadedComments"
              checked={formData.enableThreadedComments || false}
              onChange={(e) => handleChange('enableThreadedComments', e.target.checked)}
            />
            <label htmlFor="enableThreadedComments" className={styles.checkboxLabel}>
              <strong>Enable Threaded Comments</strong>
              <p className={styles.hint}>
                Allow users to reply to individual comments
              </p>
            </label>
          </div>
        </div>

        {formData.enableThreadedComments && (
          <div className={styles.field}>
            <label htmlFor="threadedCommentsDepth" className={styles.label}>
              Thread Depth
            </label>
            <input
              id="threadedCommentsDepth"
              type="number"
              min="2"
              max="10"
              value={formData.threadedCommentsDepth || ''}
              onChange={(e) => handleChange('threadedCommentsDepth', Number(e.target.value))}
              className={styles.input}
            />
            <p className={styles.hint}>
              Maximum number of reply levels (2-10)
            </p>
          </div>
        )}
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Pagination</h3>

        <div className={styles.field}>
          <div className={styles.checkbox}>
            <input
              type="checkbox"
              id="pageComments"
              checked={formData.pageComments || false}
              onChange={(e) => handleChange('pageComments', e.target.checked)}
            />
            <label htmlFor="pageComments" className={styles.checkboxLabel}>
              <strong>Paginate Comments</strong>
              <p className={styles.hint}>
                Break comments into pages
              </p>
            </label>
          </div>
        </div>

        {formData.pageComments && (
          <>
            <div className={styles.field}>
              <label htmlFor="commentsPerPage" className={styles.label}>
                Comments Per Page
              </label>
              <input
                id="commentsPerPage"
                type="number"
                min="5"
                max="100"
                value={formData.commentsPerPage || ''}
                onChange={(e) => handleChange('commentsPerPage', Number(e.target.value))}
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="commentOrder" className={styles.label}>
                Comment Order
              </label>
              <select
                id="commentOrder"
                value={formData.commentOrder || 'asc'}
                onChange={(e) => handleChange('commentOrder', e.target.value as any)}
                className={styles.select}
              >
                <option value="asc">Older First</option>
                <option value="desc">Newer First</option>
              </select>
            </div>
          </>
        )}
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Email Notifications</h3>

        <div className={styles.field}>
          <div className={styles.checkbox}>
            <input
              type="checkbox"
              id="emailOnComment"
              checked={formData.emailOnComment || false}
              onChange={(e) => handleChange('emailOnComment', e.target.checked)}
            />
            <label htmlFor="emailOnComment" className={styles.checkboxLabel}>
              <strong>Email on New Comment</strong>
              <p className={styles.hint}>
                Send email notification when anyone posts a comment
              </p>
            </label>
          </div>
        </div>

        <div className={styles.field}>
          <div className={styles.checkbox}>
            <input
              type="checkbox"
              id="emailOnModeration"
              checked={formData.emailOnModeration || false}
              onChange={(e) => handleChange('emailOnModeration', e.target.checked)}
            />
            <label htmlFor="emailOnModeration" className={styles.checkboxLabel}>
              <strong>Email on Comment Held for Moderation</strong>
              <p className={styles.hint}>
                Send email when comment is held for moderation
              </p>
            </label>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Moderation</h3>

        <div className={styles.field}>
          <div className={styles.checkbox}>
            <input
              type="checkbox"
              id="moderationRequired"
              checked={formData.moderationRequired || false}
              onChange={(e) => handleChange('moderationRequired', e.target.checked)}
            />
            <label htmlFor="moderationRequired" className={styles.checkboxLabel}>
              <strong>Require Manual Approval</strong>
              <p className={styles.hint}>
                All comments must be manually approved before appearing
              </p>
            </label>
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <button
          type="submit"
          disabled={!hasChanges || updateSettings.isPending}
          className={styles.saveButton}
        >
          {updateSettings.isPending ? (
            <>
              <Loader2 className={styles.spinner} />
              Saving...
            </>
          ) : (
            <>
              <Save className={styles.buttonIcon} />
              Save Changes
            </>
          )}
        </button>

        {updateSettings.isSuccess && !hasChanges && (
          <p className={styles.successMessage}>Settings saved successfully!</p>
        )}
      </div>
    </form>
  );
}
