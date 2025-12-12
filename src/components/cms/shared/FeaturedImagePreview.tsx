'use client';

import { useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import * as Switch from '@radix-ui/react-switch';
import { Icon } from '@/components/ui/Icon';
import styles from './FeaturedImagePreview.module.scss';

interface FeaturedImagePreviewProps {
  imageUrl: string;
  postTitle?: string;
}

type PreviewMode = 'showcase' | 'event' | 'exchange' | 'media' | 'opencall' | 'status';

interface CardPreview {
  id: PreviewMode;
  label: string;
  aspectRatio: string;
  description: string;
  minDimensions: string;
}

const CARD_PREVIEWS: CardPreview[] = [
  {
    id: 'showcase',
    label: 'Showcase Card',
    aspectRatio: '16:9',
    description: 'Main content cards on home feed',
    minDimensions: '1200×675px',
  },
  {
    id: 'event',
    label: 'Event Card',
    aspectRatio: 'Fixed 200px',
    description: 'Event listings and calendars',
    minDimensions: '800×200px',
  },
  {
    id: 'exchange',
    label: 'Exchange Card',
    aspectRatio: '2:1',
    description: 'Exchange and marketplace posts',
    minDimensions: '800×400px',
  },
  {
    id: 'media',
    label: 'Media Card',
    aspectRatio: '4:3',
    description: 'Media library thumbnails',
    minDimensions: '800×600px',
  },
  {
    id: 'opencall',
    label: 'Open Call Card',
    aspectRatio: '1:1 Square',
    description: 'Open calls and opportunities',
    minDimensions: '400×400px',
  },
  {
    id: 'status',
    label: 'Status Update',
    aspectRatio: 'Variable',
    description: 'Social feed posts',
    minDimensions: '600×400px',
  },
];

export function FeaturedImagePreview({ imageUrl, postTitle = 'Your Post Title' }: FeaturedImagePreviewProps) {
  const [selectedMode, setSelectedMode] = useState<PreviewMode>('showcase');
  const [showDarkMode, setShowDarkMode] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);

  if (!imageUrl) {
    return (
      <div className={styles.emptyState}>
        <Icon icon="image" size={48} />
        <p>Upload a featured image to see previews</p>
      </div>
    );
  }

  const selectedPreview = CARD_PREVIEWS.find(p => p.id === selectedMode)!;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h4 className={styles.title}>Preview Variations</h4>
        <p className={styles.subtitle}>See how your image appears across different card types</p>
      </div>

      {/* Preview Options */}
      <div className={styles.options}>
        <div className={styles.option}>
          <label htmlFor="dark-mode-toggle" className={styles.optionLabel}>
            <Icon icon="moon" size={14} />
            <span>Dark Mode</span>
          </label>
          <Switch.Root
            id="dark-mode-toggle"
            checked={showDarkMode}
            onCheckedChange={setShowDarkMode}
            className={styles.switch}
          >
            <Switch.Thumb className={styles.switchThumb} />
          </Switch.Root>
        </div>

        <div className={styles.option}>
          <label htmlFor="overlay-toggle" className={styles.optionLabel}>
            <Icon icon="layers" size={14} />
            <span>Text Overlay</span>
          </label>
          <Switch.Root
            id="overlay-toggle"
            checked={showOverlay}
            onCheckedChange={setShowOverlay}
            className={styles.switch}
          >
            <Switch.Thumb className={styles.switchThumb} />
          </Switch.Root>
        </div>
      </div>

      {/* Card Type Tabs */}
      <Tabs.Root value={selectedMode} onValueChange={(value) => setSelectedMode(value as PreviewMode)}>
        <Tabs.List className={styles.tabsList}>
          {CARD_PREVIEWS.map((preview) => (
            <Tabs.Trigger key={preview.id} value={preview.id} className={styles.tabsTrigger}>
              {preview.label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        {/* Preview Content */}
        <div className={styles.previewWrapper}>
          {CARD_PREVIEWS.map((preview) => (
            <Tabs.Content key={preview.id} value={preview.id} className={styles.tabsContent}>
              <div className={`${styles.previewCard} ${showDarkMode ? styles.darkMode : ''}`}>
                {/* Card Preview */}
                <div className={styles[`preview_${preview.id}`]}>
                  <div className={styles.imageContainer}>
                    <img src={imageUrl} alt="Featured image preview" className={styles.previewImage} />
                    {showOverlay && (
                      <div className={styles.imageOverlay}>
                        <h3 className={styles.overlayTitle}>{postTitle}</h3>
                        <div className={styles.overlayBadge}>Featured</div>
                      </div>
                    )}
                  </div>
                  <div className={styles.cardContent}>
                    <p className={styles.cardDescription}>Preview of {preview.label.toLowerCase()}</p>
                  </div>
                </div>
              </div>

              {/* Info Panel */}
              <div className={styles.infoPanel}>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Aspect Ratio:</span>
                  <span className={styles.infoValue}>{preview.aspectRatio}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Use Case:</span>
                  <span className={styles.infoValue}>{preview.description}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Recommended:</span>
                  <span className={styles.infoValue}>{preview.minDimensions}</span>
                </div>
              </div>
            </Tabs.Content>
          ))}
        </div>
      </Tabs.Root>

      {/* Image Quality Tips */}
      <div className={styles.tips}>
        <div className={styles.tip}>
          <Icon icon="info" size={16} />
          <div>
            <strong>Tip:</strong> For best results across all card types, use an image of at least 1200×800px
          </div>
        </div>
        <div className={styles.tip}>
          <Icon icon="zap" size={16} />
          <div>
            <strong>Pro Tip:</strong> Keep important content centered for better cropping in square formats
          </div>
        </div>
      </div>
    </div>
  );
}
