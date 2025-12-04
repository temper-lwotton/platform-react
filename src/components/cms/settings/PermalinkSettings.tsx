'use client';

import { useState, useEffect } from 'react';
import { Save, Loader2, Link as LinkIcon } from 'lucide-react';
import { usePermalinkConfig, useUpdatePermalinkConfig } from '@/hooks/cms';
import type { PermalinkConfig } from '@/services/cms/types/seo';
import styles from './SettingsForm.module.scss';

const permalinkStructures = [
  {
    value: 'plain' as const,
    label: 'Plain',
    example: 'https://example.com/?p=123',
    structure: '?p=123',
  },
  {
    value: 'day-name' as const,
    label: 'Day and name',
    example: 'https://example.com/2024/03/15/sample-post',
    structure: '/%year%/%monthnum%/%day%/%postname%/',
  },
  {
    value: 'month-name' as const,
    label: 'Month and name',
    example: 'https://example.com/2024/03/sample-post',
    structure: '/%year%/%monthnum%/%postname%/',
  },
  {
    value: 'numeric' as const,
    label: 'Numeric',
    example: 'https://example.com/archives/123',
    structure: '/archives/%post_id%',
  },
  {
    value: 'post-name' as const,
    label: 'Post name',
    example: 'https://example.com/sample-post',
    structure: '/%postname%/',
  },
  {
    value: 'custom' as const,
    label: 'Custom Structure',
    example: 'Custom permalink structure',
    structure: '',
  },
];

const availableTags = [
  { tag: '%year%', description: 'The year of the post (4 digits)' },
  { tag: '%monthnum%', description: 'Month of the year (01-12)' },
  { tag: '%day%', description: 'Day of the month (01-31)' },
  { tag: '%hour%', description: 'Hour of the day (00-23)' },
  { tag: '%minute%', description: 'Minute of the hour (00-59)' },
  { tag: '%second%', description: 'Second of the minute (00-59)' },
  { tag: '%post_id%', description: 'The unique post ID' },
  { tag: '%postname%', description: 'The post slug' },
  { tag: '%category%', description: 'The post category' },
  { tag: '%author%', description: 'The post author' },
];

export function PermalinkSettings() {
  const { data: configData, isLoading } = usePermalinkConfig();
  const updateConfig = useUpdatePermalinkConfig();

  const [formData, setFormData] = useState<Partial<PermalinkConfig>>({
    structure: 'post-name',
    customStructure: '',
    categoryBase: 'category',
    tagBase: 'tag',
    trailingSlash: true,
  });
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (configData?.data) {
      setFormData(configData.data);
    }
  }, [configData]);

  const handleChange = (field: keyof PermalinkConfig, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateConfig.mutateAsync(formData as PermalinkConfig);
    setHasChanges(false);
  };

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <Loader2 className={styles.spinner} />
        <p>Loading permalink settings...</p>
      </div>
    );
  }

  const selectedStructure = permalinkStructures.find(s => s.value === formData.structure);

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.header}>
        <h2 className={styles.title}>Permalink Settings</h2>
        <p className={styles.description}>
          Configure how your post URLs are structured
        </p>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Permalink Structure</h3>
        <p className={styles.hint} style={{ marginBottom: '1rem' }}>
          Choose how you want your post URLs to appear. SEO-friendly permalinks improve your search rankings.
        </p>

        <div className={styles.radioGroup}>
          {permalinkStructures.map((structure) => (
            <label key={structure.value} className={styles.radioOption}>
              <input
                type="radio"
                name="structure"
                value={structure.value}
                checked={formData.structure === structure.value}
                onChange={(e) => handleChange('structure', e.target.value)}
                className={styles.radio}
              />
              <div className={styles.radioContent}>
                <div className={styles.radioLabel}>{structure.label}</div>
                <div className={styles.radioExample}>{structure.example}</div>
              </div>
            </label>
          ))}
        </div>

        {formData.structure === 'custom' && (
          <div className={styles.field} style={{ marginTop: '1rem' }}>
            <label htmlFor="customStructure" className={styles.label}>
              Custom Structure
            </label>
            <input
              id="customStructure"
              type="text"
              value={formData.customStructure || ''}
              onChange={(e) => handleChange('customStructure', e.target.value)}
              className={styles.input}
              placeholder="/%year%/%monthnum%/%postname%/"
            />
            <p className={styles.hint}>
              Use the structure tags below to create a custom permalink format
            </p>

            <div className={styles.tagsList}>
              <h4 className={styles.tagsTitle}>Available structure tags:</h4>
              {availableTags.map((item) => (
                <div key={item.tag} className={styles.tagItem}>
                  <code className={styles.tag}>{item.tag}</code>
                  <span className={styles.tagDescription}>{item.description}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Optional Settings</h3>

        <div className={styles.field}>
          <label htmlFor="categoryBase" className={styles.label}>
            Category Base
          </label>
          <input
            id="categoryBase"
            type="text"
            value={formData.categoryBase || ''}
            onChange={(e) => handleChange('categoryBase', e.target.value)}
            className={styles.input}
            placeholder="category"
          />
          <p className={styles.hint}>
            Customize the base prefix for category URLs (e.g., /category/technology)
          </p>
        </div>

        <div className={styles.field}>
          <label htmlFor="tagBase" className={styles.label}>
            Tag Base
          </label>
          <input
            id="tagBase"
            type="text"
            value={formData.tagBase || ''}
            onChange={(e) => handleChange('tagBase', e.target.value)}
            className={styles.input}
            placeholder="tag"
          />
          <p className={styles.hint}>
            Customize the base prefix for tag URLs (e.g., /tag/javascript)
          </p>
        </div>

        <div className={styles.checkboxField}>
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={formData.trailingSlash || false}
              onChange={(e) => handleChange('trailingSlash', e.target.checked)}
            />
            <span>Add trailing slash to URLs</span>
          </label>
          <p className={styles.hint}>
            When enabled, URLs will end with a slash (e.g., /sample-post/ instead of /sample-post)
          </p>
        </div>
      </div>

      <div className={styles.footer}>
        <button
          type="submit"
          disabled={!hasChanges || updateConfig.isPending}
          className={styles.saveButton}
        >
          {updateConfig.isPending ? (
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

        {updateConfig.isSuccess && !hasChanges && (
          <p className={styles.successMessage}>Permalink settings saved successfully!</p>
        )}
      </div>
    </form>
  );
}
