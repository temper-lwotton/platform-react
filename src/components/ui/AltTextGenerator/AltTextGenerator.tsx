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
import { Textarea } from '../primitives/Textarea';
import { RadioGroup } from '../primitives/Radio';
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
  const [selectedOption, setSelectedOption] = useState<string>('');
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
    if (selectedOption === 'custom') {
      textToSave = customText.trim();
    } else if (selectedOption) {
      const optionIndex = parseInt(selectedOption);
      textToSave = media.aiAnalysis.suggestedAltTexts[optionIndex];
    }

    if (textToSave) {
      onSave(media.id, textToSave);
      handleClose();
    }
  };

  const handleClose = () => {
    setSelectedOption('');
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
              <RadioGroup
                value={selectedOption !== 'custom' ? selectedOption : ''}
                onValueChange={(value) => {
                  setSelectedOption(value);
                  setCustomText('');
                }}
                options={options.map((option, index) => ({
                  value: String(index),
                  label: `Option ${index + 1}`,
                  helperText: option,
                }))}
                orientation="vertical"
              />
            )}
          </div>

          {/* Custom Text */}
          <div className={styles.custom}>
            <Textarea
              label="Custom Alt Text"
              placeholder="Write your own alt text..."
              value={customText}
              onChange={(e) => {
                setCustomText(e.target.value);
                if (e.target.value.trim()) {
                  setSelectedOption('custom');
                }
              }}
              rows={3}
              helperText="Describe what the image shows. Be concise but descriptive."
            />
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
            disabled={!selectedOption && !customText.trim()}
          >
            Save Alt Text
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
