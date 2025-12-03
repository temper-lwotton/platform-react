'use client';

import { useState, useEffect } from 'react';
import { Save, Loader2 } from 'lucide-react';
import { useReadingSettings, useUpdateReadingSettings } from '@/hooks/cms';
import type { ReadingSettings as ReadingSettingsType } from '@/services/cms/types/settings';
import styles from './SettingsForm.module.scss';

export function ReadingSettings() {
  const { data: settingsData, isLoading } = useReadingSettings();
  const updateSettings = useUpdateReadingSettings();

  const [formData, setFormData] = useState<Partial<ReadingSettingsType>>({});
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (settingsData?.data) {
      setFormData(settingsData.data);
    }
  }, [settingsData]);

  const handleChange = (field: keyof ReadingSettingsType, value: any) => {
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
        <h2 className={styles.title}>Reading Settings</h2>
        <p className={styles.description}>
          Configure how content is displayed on your site
        </p>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Posts Display</h3>

        <div className={styles.field}>
          <label htmlFor="postsPerPage" className={styles.label}>
            Posts Per Page
          </label>
          <input
            id="postsPerPage"
            type="number"
            min="1"
            max="100"
            value={formData.postsPerPage || ''}
            onChange={(e) => handleChange('postsPerPage', Number(e.target.value))}
            className={styles.input}
          />
          <p className={styles.hint}>
            Number of posts to show per page in lists and archives
          </p>
        </div>

        <div className={styles.field}>
          <label htmlFor="defaultPostFormat" className={styles.label}>
            Default Post Format
          </label>
          <select
            id="defaultPostFormat"
            value={formData.defaultPostFormat || 'standard'}
            onChange={(e) => handleChange('defaultPostFormat', e.target.value as any)}
            className={styles.select}
          >
            <option value="standard">Standard</option>
            <option value="aside">Aside</option>
            <option value="gallery">Gallery</option>
            <option value="link">Link</option>
            <option value="image">Image</option>
            <option value="quote">Quote</option>
            <option value="status">Status</option>
            <option value="video">Video</option>
          </select>
          <p className={styles.hint}>
            Default format for new posts
          </p>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Feed Settings</h3>

        <div className={styles.field}>
          <label htmlFor="feedPostsPerPage" className={styles.label}>
            Feed Posts Per Page
          </label>
          <input
            id="feedPostsPerPage"
            type="number"
            min="1"
            max="50"
            value={formData.feedPostsPerPage || ''}
            onChange={(e) => handleChange('feedPostsPerPage', Number(e.target.value))}
            className={styles.input}
          />
          <p className={styles.hint}>
            Number of posts to include in RSS/Atom feeds
          </p>
        </div>

        <div className={styles.field}>
          <div className={styles.checkbox}>
            <input
              type="checkbox"
              id="feedShowSummary"
              checked={formData.feedShowSummary || false}
              onChange={(e) => handleChange('feedShowSummary', e.target.checked)}
            />
            <label htmlFor="feedShowSummary" className={styles.checkboxLabel}>
              <strong>Show Summary in Feeds</strong>
              <p className={styles.hint}>
                Show post excerpts instead of full content in feeds
              </p>
            </label>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Search Engine Visibility</h3>

        <div className={styles.field}>
          <div className={styles.checkbox}>
            <input
              type="checkbox"
              id="searchEngineVisibility"
              checked={formData.searchEngineVisibility || false}
              onChange={(e) => handleChange('searchEngineVisibility', e.target.checked)}
            />
            <label htmlFor="searchEngineVisibility" className={styles.checkboxLabel}>
              <strong>Allow Search Engines</strong>
              <p className={styles.hint}>
                Allow search engines to index this site (uncheck to discourage)
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
