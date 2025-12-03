'use client';

import { useState } from 'react';
import { Image as ImageIcon, X } from 'lucide-react';
import { MediaPicker } from '../media/MediaPicker';
import { MediaItem } from '@/lib/media-api';
import styles from './FeaturedImagePanel.module.scss';

interface FeaturedImagePanelProps {
  imageUrl: string;
  onChange: (url: string) => void;
}

export function FeaturedImagePanel({ imageUrl, onChange }: FeaturedImagePanelProps) {
  const [showPicker, setShowPicker] = useState(false);

  const handleSelect = (media: MediaItem | MediaItem[]) => {
    if (Array.isArray(media)) {
      // Multiple selection - use first item
      onChange(media[0]?.url || '');
    } else {
      onChange(media.url);
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
        <button
          onClick={() => setShowPicker(true)}
          className={styles.uploadArea}
        >
          <div className={styles.uploadContent}>
            <ImageIcon className={styles.uploadIcon} />
            <span className={styles.uploadText}>Select from Media Library</span>
          </div>
        </button>
      )}

      {/* Media Picker Modal */}
      {showPicker && (
        <MediaPicker
          onSelect={handleSelect}
          onClose={() => setShowPicker(false)}
          mode="single"
          allowUpload={true}
        />
      )}
    </div>
  );
}
