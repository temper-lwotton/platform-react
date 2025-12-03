'use client';

import { useState, useEffect } from 'react';
import { Save, Loader2 } from 'lucide-react';
import { useGeneralSettings, useUpdateGeneralSettings } from '@/hooks/cms';
import type { GeneralSettings as GeneralSettingsType } from '@/services/cms/types/settings';
import styles from './SettingsForm.module.scss';

const timezones = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Toronto',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Asia/Dubai',
  'Australia/Sydney',
  'Pacific/Auckland',
];

const dateFormats = [
  { value: 'YYYY-MM-DD', label: '2024-03-15' },
  { value: 'MM/DD/YYYY', label: '03/15/2024' },
  { value: 'DD/MM/YYYY', label: '15/03/2024' },
  { value: 'MMMM D, YYYY', label: 'March 15, 2024' },
  { value: 'D MMMM YYYY', label: '15 March 2024' },
];

const timeFormats = [
  { value: 'HH:mm:ss', label: '14:30:00 (24-hour)' },
  { value: 'hh:mm A', label: '02:30 PM (12-hour)' },
  { value: 'HH:mm', label: '14:30 (24-hour, no seconds)' },
];

const languages = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'it', label: 'Italian' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'ja', label: 'Japanese' },
  { value: 'zh', label: 'Chinese' },
];

const weekStarts = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 6, label: 'Saturday' },
];

export function GeneralSettings() {
  const { data: settingsData, isLoading } = useGeneralSettings();
  const updateSettings = useUpdateGeneralSettings();

  const [formData, setFormData] = useState<Partial<GeneralSettingsType>>({});
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (settingsData?.data) {
      setFormData(settingsData.data);
    }
  }, [settingsData]);

  const handleChange = (field: keyof GeneralSettingsType, value: any) => {
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
        <h2 className={styles.title}>General Settings</h2>
        <p className={styles.description}>
          Configure basic site information and regional settings
        </p>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Site Identity</h3>

        <div className={styles.field}>
          <label htmlFor="siteName" className={styles.label}>
            Site Name
          </label>
          <input
            id="siteName"
            type="text"
            value={formData.siteName || ''}
            onChange={(e) => handleChange('siteName', e.target.value)}
            className={styles.input}
            placeholder="My Awesome Site"
          />
          <p className={styles.hint}>
            The name of your site, displayed in the browser title and navigation
          </p>
        </div>

        <div className={styles.field}>
          <label htmlFor="siteDescription" className={styles.label}>
            Site Description
          </label>
          <textarea
            id="siteDescription"
            value={formData.siteDescription || ''}
            onChange={(e) => handleChange('siteDescription', e.target.value)}
            className={styles.textarea}
            rows={3}
            placeholder="A brief description of your site"
          />
          <p className={styles.hint}>
            A short tagline or description for your site
          </p>
        </div>

        <div className={styles.field}>
          <label htmlFor="siteUrl" className={styles.label}>
            Site URL
          </label>
          <input
            id="siteUrl"
            type="url"
            value={formData.siteUrl || ''}
            onChange={(e) => handleChange('siteUrl', e.target.value)}
            className={styles.input}
            placeholder="https://example.com"
          />
          <p className={styles.hint}>
            The full URL of your site (used in sitemaps and permalinks)
          </p>
        </div>

        <div className={styles.field}>
          <label htmlFor="adminEmail" className={styles.label}>
            Admin Email
          </label>
          <input
            id="adminEmail"
            type="email"
            value={formData.adminEmail || ''}
            onChange={(e) => handleChange('adminEmail', e.target.value)}
            className={styles.input}
            placeholder="admin@example.com"
          />
          <p className={styles.hint}>
            Email address for admin notifications
          </p>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Regional Settings</h3>

        <div className={styles.field}>
          <label htmlFor="timezone" className={styles.label}>
            Timezone
          </label>
          <select
            id="timezone"
            value={formData.timezone || ''}
            onChange={(e) => handleChange('timezone', e.target.value)}
            className={styles.select}
          >
            {timezones.map(tz => (
              <option key={tz} value={tz}>{tz}</option>
            ))}
          </select>
          <p className={styles.hint}>
            Choose your local timezone for scheduling and timestamps
          </p>
        </div>

        <div className={styles.field}>
          <label htmlFor="dateFormat" className={styles.label}>
            Date Format
          </label>
          <select
            id="dateFormat"
            value={formData.dateFormat || ''}
            onChange={(e) => handleChange('dateFormat', e.target.value)}
            className={styles.select}
          >
            {dateFormats.map(format => (
              <option key={format.value} value={format.value}>
                {format.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="timeFormat" className={styles.label}>
            Time Format
          </label>
          <select
            id="timeFormat"
            value={formData.timeFormat || ''}
            onChange={(e) => handleChange('timeFormat', e.target.value)}
            className={styles.select}
          >
            {timeFormats.map(format => (
              <option key={format.value} value={format.value}>
                {format.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="language" className={styles.label}>
            Language
          </label>
          <select
            id="language"
            value={formData.language || ''}
            onChange={(e) => handleChange('language', e.target.value)}
            className={styles.select}
          >
            {languages.map(lang => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="weekStartsOn" className={styles.label}>
            Week Starts On
          </label>
          <select
            id="weekStartsOn"
            value={formData.weekStartsOn ?? 0}
            onChange={(e) => handleChange('weekStartsOn', Number(e.target.value))}
            className={styles.select}
          >
            {weekStarts.map(day => (
              <option key={day.value} value={day.value}>
                {day.label}
              </option>
            ))}
          </select>
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
