'use client';

import { useState } from 'react';
import { MediaItem } from '@/types/media';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../primitives/Dialog/Dialog';
import { Button } from '../primitives/Button';
import { Icon } from '../Icon';
import styles from './AltTextGenerator.module.scss';

interface AltTextGeneratorProps {
  media: MediaItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (mediaId: string, altText: string) => void;
}

export default function AltTextGenerator({
  media,
  isOpen,
  onClose,
  onSave,
}: AltTextGeneratorProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [customText, setCustomText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleRegenerate = () => {
    setIsGenerating(true);
    // Simulate AI generation delay
    setTimeout(() => {
      setIsGenerating(false);
    }, 1500);
  };

  const handleSave = () => {
    if (!media) return;

    let textToSave = '';
    if (selectedOption !== null && selectedOption < 3) {
      textToSave = media.aiAnalysis.suggestedAltTexts[selectedOption];
    } else if (customText.trim()) {
      textToSave = customText.trim();
    }

    if (textToSave) {
      onSave(media.id, textToSave);
      handleClose();
    }
  };

  const handleClose = () => {
    setSelectedOption(null);
    setCustomText('');
    onClose();
  };

  if (!media) return null;

  const options = media.aiAnalysis.suggestedAltTexts;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>Generate Alt Text</DialogTitle>
          <DialogDescription>
            Choose from AI-generated alt text options or write your own
          </DialogDescription>
        </DialogHeader>

        <div className={styles.content}>
          {/* Image Preview */}
          <div className={styles.preview}>
            <img
              src={media.thumbnailUrl}
              alt="Preview"
              className={styles.previewImage}
            />
            <div className={styles.previewInfo}>
              <p className={styles.filename}>{media.filename}</p>
              <p className={styles.dimensions}>
                {media.width} × {media.height}
              </p>
            </div>
          </div>

          {/* AI-Generated Options */}
          <div className={styles.options}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>AI-Generated Options</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRegenerate}
                disabled={isGenerating}
              >
                <Icon icon={isGenerating ? 'loader-2' : 'refresh-cw'} size={14} />
                {isGenerating ? 'Generating...' : 'Regenerate'}
              </Button>
            </div>

            {isGenerating ? (
              <div className={styles.generating}>
                <Icon icon="loader-2" size={24} className={styles.spinner} />
                <p>Generating new alt text options...</p>
              </div>
            ) : (
              <div className={styles.optionsList}>
                {options.map((option, index) => (
                  <button
                    key={index}
                    className={`${styles.option} ${
                      selectedOption === index ? styles.selected : ''
                    }`}
                    onClick={() => {
                      setSelectedOption(index);
                      setCustomText('');
                    }}
                  >
                    <div className={styles.optionHeader}>
                      <Icon
                        icon={selectedOption === index ? 'check-circle-2' : 'circle'}
                        size={18}
                        className={styles.optionIcon}
                      />
                      <span className={styles.optionLabel}>Option {index + 1}</span>
                    </div>
                    <p className={styles.optionText}>{option}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Custom Text */}
          <div className={styles.custom}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>Custom Alt Text</h3>
            </div>
            <textarea
              className={styles.textarea}
              placeholder="Write your own alt text..."
              value={customText}
              onChange={(e) => {
                setCustomText(e.target.value);
                if (e.target.value.trim()) {
                  setSelectedOption(null);
                }
              }}
              rows={3}
            />
            <p className={styles.hint}>
              Describe what the image shows. Be concise but descriptive.
            </p>
          </div>

          {/* Current Alt Text */}
          {media.altText && (
            <div className={styles.current}>
              <h4 className={styles.currentLabel}>Current Alt Text:</h4>
              <p className={styles.currentText}>{media.altText}</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={selectedOption === null && !customText.trim()}
          >
            Save Alt Text
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
