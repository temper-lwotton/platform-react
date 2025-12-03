'use client';

import { useState } from 'react';
import { Image, Upload, X } from 'lucide-react';
import styles from './FeaturedImagePanel.module.scss';

interface FeaturedImagePanelProps {
  imageUrl: string;
  onChange: (url: string) => void;
}

export function FeaturedImagePanel({ imageUrl, onChange }: FeaturedImagePanelProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // TODO: Implement actual file upload
      // For now, just use a placeholder
      const fakeUrl = URL.createObjectURL(file);
      onChange(fakeUrl);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    onChange('');
  };

  return (
    <div className={styles.panel}>
      <h3 className={styles.title}>Featured Image</h3>

      {imageUrl ? (
        <div className={styles.imagePreview}>
          <img src={imageUrl} alt="Featured" className={styles.image} />
          <button onClick={handleRemove} className={styles.removeButton} title="Remove image">
            <X className={styles.removeIcon} />
          </button>
        </div>
      ) : (
        <label className={styles.uploadArea}>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={isUploading}
            className={styles.fileInput}
          />
          <div className={styles.uploadContent}>
            <Upload className={styles.uploadIcon} />
            <span className={styles.uploadText}>
              {isUploading ? 'Uploading...' : 'Upload Image'}
            </span>
          </div>
        </label>
      )}
    </div>
  );
}
