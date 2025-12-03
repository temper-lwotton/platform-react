'use client';

import { useState, useEffect } from 'react';
import { Save, Loader2, Plus, Trash2 } from 'lucide-react';
import { useMediaSettings, useUpdateMediaSettings } from '@/hooks/cms';
import type { MediaSettings as MediaSettingsType, ImageSize } from '@/services/cms/types/settings';
import styles from './SettingsForm.module.scss';

const fileTypes = [
  { value: 'image/jpeg', label: 'JPEG' },
  { value: 'image/png', label: 'PNG' },
  { value: 'image/gif', label: 'GIF' },
  { value: 'image/webp', label: 'WebP' },
  { value: 'image/svg+xml', label: 'SVG' },
];

export function MediaSettings() {
  const { data: settingsData, isLoading } = useMediaSettings();
  const updateSettings = useUpdateMediaSettings();

  const [formData, setFormData] = useState<Partial<MediaSettingsType>>({});
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (settingsData?.data) {
      setFormData(settingsData.data);
    }
  }, [settingsData]);

  const handleChange = (field: keyof MediaSettingsType, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleFileTypeToggle = (fileType: string) => {
    const current = formData.allowedFileTypes || [];
    const newTypes = current.includes(fileType)
      ? current.filter(t => t !== fileType)
      : [...current, fileType];
    handleChange('allowedFileTypes', newTypes);
  };

  const handleImageSizeChange = (index: number, field: keyof ImageSize, value: any) => {
    const sizes = [...(formData.imageSizes || [])];
    sizes[index] = { ...sizes[index], [field]: value };
    handleChange('imageSizes', sizes);
  };

  const handleAddImageSize = () => {
    const sizes = [...(formData.imageSizes || [])];
    sizes.push({ name: '', width: 0, height: 0, crop: false });
    handleChange('imageSizes', sizes);
  };

  const handleRemoveImageSize = (index: number) => {
    const sizes = [...(formData.imageSizes || [])];
    sizes.splice(index, 1);
    handleChange('imageSizes', sizes);
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
        <h2 className={styles.title}>Media Settings</h2>
        <p className={styles.description}>
          Configure upload limits, image sizes, and AI-powered features
        </p>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Upload Settings</h3>

        <div className={styles.field}>
          <label htmlFor="maxUploadSize" className={styles.label}>
            Maximum Upload Size (MB)
          </label>
          <input
            id="maxUploadSize"
            type="number"
            min="1"
            max="100"
            value={formData.maxUploadSize || ''}
            onChange={(e) => handleChange('maxUploadSize', Number(e.target.value))}
            className={styles.input}
          />
          <p className={styles.hint}>
            Maximum file size allowed for uploads (1-100 MB)
          </p>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Allowed File Types</label>
          <div className={styles.checkboxGroup}>
            {fileTypes.map(type => (
              <div key={type.value} className={styles.checkbox}>
                <input
                  type="checkbox"
                  id={`file-type-${type.value}`}
                  checked={formData.allowedFileTypes?.includes(type.value) || false}
                  onChange={() => handleFileTypeToggle(type.value)}
                />
                <label htmlFor={`file-type-${type.value}`} className={styles.checkboxLabel}>
                  {type.label}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>AI Features</h3>

        <div className={styles.field}>
          <div className={styles.checkbox}>
            <input
              type="checkbox"
              id="enableAIAnalysis"
              checked={formData.enableAIAnalysis || false}
              onChange={(e) => handleChange('enableAIAnalysis', e.target.checked)}
            />
            <label htmlFor="enableAIAnalysis" className={styles.checkboxLabel}>
              <strong>Enable AI Analysis</strong>
              <p className={styles.hint}>
                Automatically analyze uploaded images for tags, objects, and content
              </p>
            </label>
          </div>
        </div>

        <div className={styles.field}>
          <div className={styles.checkbox}>
            <input
              type="checkbox"
              id="autoGenerateAltText"
              checked={formData.autoGenerateAltText || false}
              onChange={(e) => handleChange('autoGenerateAltText', e.target.checked)}
            />
            <label htmlFor="autoGenerateAltText" className={styles.checkboxLabel}>
              <strong>Auto-Generate Alt Text</strong>
              <p className={styles.hint}>
                Automatically generate accessibility-friendly alt text for images
              </p>
            </label>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Image Optimization</h3>

        <div className={styles.field}>
          <div className={styles.checkbox}>
            <input
              type="checkbox"
              id="autoOptimizeImages"
              checked={formData.autoOptimizeImages || false}
              onChange={(e) => handleChange('autoOptimizeImages', e.target.checked)}
            />
            <label htmlFor="autoOptimizeImages" className={styles.checkboxLabel}>
              <strong>Auto-Optimize Images</strong>
              <p className={styles.hint}>
                Automatically compress and optimize images on upload
              </p>
            </label>
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="defaultImageQuality" className={styles.label}>
            Default Image Quality
          </label>
          <input
            id="defaultImageQuality"
            type="range"
            min="1"
            max="100"
            value={formData.defaultImageQuality || 85}
            onChange={(e) => handleChange('defaultImageQuality', Number(e.target.value))}
            className={styles.input}
          />
          <p className={styles.hint}>
            Current: {formData.defaultImageQuality || 85}% (1-100, higher = better quality, larger file size)
          </p>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Image Sizes</h3>
        <p className={styles.hint} style={{ marginBottom: '1rem' }}>
          Define custom image sizes that will be generated on upload
        </p>

        <div className={styles.imageSizesList}>
          {(formData.imageSizes || []).map((size, index) => (
            <div key={index} className={styles.imageSizeItem}>
              <input
                type="text"
                value={size.name}
                onChange={(e) => handleImageSizeChange(index, 'name', e.target.value)}
                placeholder="Size name"
                className={styles.input}
              />
              <input
                type="number"
                value={size.width}
                onChange={(e) => handleImageSizeChange(index, 'width', Number(e.target.value))}
                placeholder="Width"
                className={styles.input}
              />
              <input
                type="number"
                value={size.height}
                onChange={(e) => handleImageSizeChange(index, 'height', Number(e.target.value))}
                placeholder="Height"
                className={styles.input}
              />
              <div className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={size.crop}
                  onChange={(e) => handleImageSizeChange(index, 'crop', e.target.checked)}
                />
                <span>Crop</span>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveImageSize(index)}
                title="Remove size"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleAddImageSize}
          className={styles.addButton}
        >
          <Plus size={16} />
          Add Image Size
        </button>
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
