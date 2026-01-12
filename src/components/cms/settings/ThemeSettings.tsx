'use client';

import { useState, useEffect } from 'react';
import { Save, Loader2, Palette, Check } from 'lucide-react';
import { useThemeSettings, useUpdateThemeSettings } from '@/hooks/cms';
import type { ThemeSettings as ThemeSettingsType } from '@/services/cms/types/settings';
import styles from './SettingsForm.module.scss';

const themes = [
  {
    value: 'innovation-spectrum',
    label: 'Innovation Spectrum',
    description: 'Multi-color theme with purple, blue, orange, and lime accents for energy and creativity',
    colors: ['#8b5cf6', '#3b82f6', '#f97316', '#C0F23C'],
  },
  {
    value: 'deep-focus',
    label: 'Deep Focus',
    description: 'Dark navy with cyan accents for a focused, professional atmosphere',
    colors: ['#1e3a8a', '#0ea5e9', '#06b6d4', '#38bdf8'],
  },
  {
    value: 'bright-studio',
    label: 'Bright Studio',
    description: 'Light and airy with pink and orange accents for a warm, inviting feel',
    colors: ['#ec4899', '#f97316', '#fb923c', '#fdba74'],
  },
  {
    value: 'coastal-fusion',
    label: 'Coastal Fusion',
    description: 'Ocean-inspired palette with teal, lavender, and magenta for a fresh, modern aesthetic',
    colors: ['#00997d', '#008bcc', '#e74c85', '#997ac7'],
  },
  {
    value: 'custom',
    label: 'Custom Theme',
    description: 'Define your own color palette for complete control',
    colors: [],
  },
];

const colorModes = [
  { value: 'light', label: 'Light Mode' },
  { value: 'dark', label: 'Dark Mode' },
  { value: 'system', label: 'System Preference' },
];

export function ThemeSettings() {
  const { data: settingsData, isLoading } = useThemeSettings();
  const updateSettings = useUpdateThemeSettings();

  const [formData, setFormData] = useState<Partial<ThemeSettingsType>>({});
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (settingsData?.data) {
      setFormData(settingsData.data);
    }
  }, [settingsData]);

  const handleChange = (field: keyof ThemeSettingsType, value: any) => {
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

  const isCustomTheme = formData.platformTheme === 'custom';

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.header}>
        <h2 className={styles.title}>Theme Settings</h2>
        <p className={styles.description}>
          Configure the visual theme for your platform. Changes will apply globally for all users.
        </p>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Platform Theme</h3>

        <div className={styles.field}>
          <label className={styles.label}>
            Select Theme
          </label>
          <div className={styles.themeGrid}>
            {themes.map(theme => (
              <button
                key={theme.value}
                type="button"
                onClick={() => handleChange('platformTheme', theme.value)}
                className={`${styles.themeCard} ${formData.platformTheme === theme.value ? styles.themeCardActive : ''}`}
              >
                {formData.platformTheme === theme.value && (
                  <div className={styles.themeCardCheck}>
                    <Check size={16} />
                  </div>
                )}
                <div className={styles.themeCardHeader}>
                  <Palette size={20} />
                  <h4 className={styles.themeCardTitle}>{theme.label}</h4>
                </div>
                <p className={styles.themeCardDescription}>{theme.description}</p>
                {theme.colors.length > 0 && (
                  <div className={styles.themeColorPreview}>
                    {theme.colors.map((color, i) => (
                      <div
                        key={i}
                        className={styles.themeColorSwatch}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isCustomTheme && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Custom Colors</h3>

          <div className={styles.field}>
            <label htmlFor="customPrimaryColor" className={styles.label}>
              Primary Color
            </label>
            <div className={styles.colorInput}>
              <input
                id="customPrimaryColor"
                type="color"
                value={formData.customPrimaryColor || '#8b5cf6'}
                onChange={(e) => handleChange('customPrimaryColor', e.target.value)}
                className={styles.colorPicker}
              />
              <input
                type="text"
                value={formData.customPrimaryColor || '#8b5cf6'}
                onChange={(e) => handleChange('customPrimaryColor', e.target.value)}
                className={styles.input}
                placeholder="#8b5cf6"
              />
            </div>
            <p className={styles.hint}>
              Used for primary actions, active states, and brand elements
            </p>
          </div>

          <div className={styles.field}>
            <label htmlFor="customInfoColor" className={styles.label}>
              Info Color
            </label>
            <div className={styles.colorInput}>
              <input
                id="customInfoColor"
                type="color"
                value={formData.customInfoColor || '#3b82f6'}
                onChange={(e) => handleChange('customInfoColor', e.target.value)}
                className={styles.colorPicker}
              />
              <input
                type="text"
                value={formData.customInfoColor || '#3b82f6'}
                onChange={(e) => handleChange('customInfoColor', e.target.value)}
                className={styles.input}
                placeholder="#3b82f6"
              />
            </div>
            <p className={styles.hint}>
              Used for informational elements and navigation
            </p>
          </div>

          <div className={styles.field}>
            <label htmlFor="customCtaColor" className={styles.label}>
              CTA Color
            </label>
            <div className={styles.colorInput}>
              <input
                id="customCtaColor"
                type="color"
                value={formData.customCtaColor || '#f97316'}
                onChange={(e) => handleChange('customCtaColor', e.target.value)}
                className={styles.colorPicker}
              />
              <input
                type="text"
                value={formData.customCtaColor || '#f97316'}
                onChange={(e) => handleChange('customCtaColor', e.target.value)}
                className={styles.input}
                placeholder="#f97316"
              />
            </div>
            <p className={styles.hint}>
              Used for call-to-action buttons and urgent elements
            </p>
          </div>

          <div className={styles.field}>
            <label htmlFor="customAccentColor" className={styles.label}>
              Accent Color
            </label>
            <div className={styles.colorInput}>
              <input
                id="customAccentColor"
                type="color"
                value={formData.customAccentColor || '#C0F23C'}
                onChange={(e) => handleChange('customAccentColor', e.target.value)}
                className={styles.colorPicker}
              />
              <input
                type="text"
                value={formData.customAccentColor || '#C0F23C'}
                onChange={(e) => handleChange('customAccentColor', e.target.value)}
                className={styles.input}
                placeholder="#C0F23C"
              />
            </div>
            <p className={styles.hint}>
              Used for success states, highlights, and activity indicators
            </p>
          </div>
        </div>
      )}

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Color Mode</h3>

        <div className={styles.field}>
          <label htmlFor="defaultColorMode" className={styles.label}>
            Default Color Mode
          </label>
          <select
            id="defaultColorMode"
            value={formData.defaultColorMode || 'light'}
            onChange={(e) => handleChange('defaultColorMode', e.target.value)}
            className={styles.select}
          >
            {colorModes.map(mode => (
              <option key={mode.value} value={mode.value}>
                {mode.label}
              </option>
            ))}
          </select>
          <p className={styles.hint}>
            Choose the default color mode for users who haven't set a preference
          </p>
        </div>

        <div className={styles.field}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={formData.allowUserOverride ?? true}
              onChange={(e) => handleChange('allowUserOverride', e.target.checked)}
              className={styles.checkbox}
            />
            <span>Allow users to override theme</span>
          </label>
          <p className={styles.hint}>
            When enabled, users can choose their own light/dark mode preference
          </p>
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
          <p className={styles.successMessage}>Theme settings saved successfully!</p>
        )}
      </div>
    </form>
  );
}
