'use client';

import { useState, useEffect } from 'react';
import { Save, Loader2 } from 'lucide-react';
import { useWritingSettings, useUpdateWritingSettings } from '@/hooks/cms';
import type { WritingSettings as WritingSettingsType } from '@/services/cms/types/settings';
import styles from './SettingsForm.module.scss';

export function WritingSettings() {
  const { data: settingsData, isLoading } = useWritingSettings();
  const updateSettings = useUpdateWritingSettings();

  const [formData, setFormData] = useState<Partial<WritingSettingsType>>({});
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (settingsData?.data) {
      setFormData(settingsData.data);
    }
  }, [settingsData]);

  const handleChange = (field: keyof WritingSettingsType, value: any) => {
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
        <h2 className={styles.title}>Writing Settings</h2>
        <p className={styles.description}>
          Configure default options for creating and editing content
        </p>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Post Defaults</h3>

        <div className={styles.field}>
          <label htmlFor="defaultPostStatus" className={styles.label}>
            Default Post Status
          </label>
          <select
            id="defaultPostStatus"
            value={formData.defaultPostStatus || 'draft'}
            onChange={(e) => handleChange('defaultPostStatus', e.target.value as any)}
            className={styles.select}
          >
            <option value="draft">Draft</option>
            <option value="pending">Pending Review</option>
            <option value="published">Published</option>
          </select>
          <p className={styles.hint}>
            Status assigned to new posts by default
          </p>
        </div>

        <div className={styles.field}>
          <label htmlFor="defaultCommentStatus" className={styles.label}>
            Default Comment Status
          </label>
          <select
            id="defaultCommentStatus"
            value={formData.defaultCommentStatus || 'open'}
            onChange={(e) => handleChange('defaultCommentStatus', e.target.value as any)}
            className={styles.select}
          >
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
          <p className={styles.hint}>
            Allow comments on new posts by default
          </p>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Autosave & Revisions</h3>

        <div className={styles.field}>
          <div className={styles.checkbox}>
            <input
              type="checkbox"
              id="enableAutosave"
              checked={formData.enableAutosave || false}
              onChange={(e) => handleChange('enableAutosave', e.target.checked)}
            />
            <label htmlFor="enableAutosave" className={styles.checkboxLabel}>
              <strong>Enable Autosave</strong>
              <p className={styles.hint}>
                Automatically save drafts while editing
              </p>
            </label>
          </div>
        </div>

        {formData.enableAutosave && (
          <div className={styles.field}>
            <label htmlFor="autosaveInterval" className={styles.label}>
              Autosave Interval (seconds)
            </label>
            <input
              id="autosaveInterval"
              type="number"
              min="10"
              max="300"
              step="10"
              value={formData.autosaveInterval || ''}
              onChange={(e) => handleChange('autosaveInterval', Number(e.target.value))}
              className={styles.input}
            />
            <p className={styles.hint}>
              How often to automatically save drafts (10-300 seconds)
            </p>
          </div>
        )}

        <div className={styles.field}>
          <div className={styles.checkbox}>
            <input
              type="checkbox"
              id="enableRevisions"
              checked={formData.enableRevisions || false}
              onChange={(e) => handleChange('enableRevisions', e.target.checked)}
            />
            <label htmlFor="enableRevisions" className={styles.checkboxLabel}>
              <strong>Enable Revisions</strong>
              <p className={styles.hint}>
                Keep a history of post changes
              </p>
            </label>
          </div>
        </div>

        {formData.enableRevisions && (
          <div className={styles.field}>
            <label htmlFor="maxRevisions" className={styles.label}>
              Maximum Revisions
            </label>
            <input
              id="maxRevisions"
              type="number"
              min="0"
              max="100"
              value={formData.maxRevisions || ''}
              onChange={(e) => handleChange('maxRevisions', Number(e.target.value))}
              className={styles.input}
            />
            <p className={styles.hint}>
              Maximum number of revisions to keep (0 = unlimited)
            </p>
          </div>
        )}
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Content Features</h3>

        <div className={styles.field}>
          <div className={styles.checkbox}>
            <input
              type="checkbox"
              id="enableEmoji"
              checked={formData.enableEmoji || false}
              onChange={(e) => handleChange('enableEmoji', e.target.checked)}
            />
            <label htmlFor="enableEmoji" className={styles.checkboxLabel}>
              <strong>Enable Emoji</strong>
              <p className={styles.hint}>
                Convert text emoticons to emoji (e.g., :) to 😊)
              </p>
            </label>
          </div>
        </div>

        <div className={styles.field}>
          <div className={styles.checkbox}>
            <input
              type="checkbox"
              id="enableMarkdown"
              checked={formData.enableMarkdown || false}
              onChange={(e) => handleChange('enableMarkdown', e.target.checked)}
            />
            <label htmlFor="enableMarkdown" className={styles.checkboxLabel}>
              <strong>Enable Markdown</strong>
              <p className={styles.hint}>
                Allow Markdown syntax in post content
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
