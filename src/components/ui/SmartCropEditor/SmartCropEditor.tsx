'use client';

import { useState } from 'react';
import { MediaItem, AspectRatio } from '@/types/media';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../primitives/Dialog/Dialog';
import { Button } from '../primitives/Button';
import { RadioGroup } from '../primitives/Radio';
import { Switch } from '../primitives/Switch';
import { Icon } from '../Icon';
import styles from './SmartCropEditor.module.scss';

interface SmartCropEditorProps {
  media: MediaItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (mediaId: string, aspectRatio: AspectRatio, useGenerativeFill: boolean) => void;
}

const aspectRatios: { value: AspectRatio; label: string; icon: string }[] = [
  { value: '1:1', label: 'Square', icon: 'square' },
  { value: '4:3', label: 'Landscape', icon: 'rectangle-horizontal' },
  { value: '16:9', label: 'Widescreen', icon: 'rectangle-horizontal' },
  { value: '9:16', label: 'Portrait', icon: 'rectangle-vertical' },
  { value: '3:4', label: 'Tall', icon: 'rectangle-vertical' },
];

export default function SmartCropEditor({
  media,
  isOpen,
  onClose,
  onSave,
}: SmartCropEditorProps) {
  const [selectedRatio, setSelectedRatio] = useState<AspectRatio>('1:1');
  const [useGenerativeFill, setUseGenerativeFill] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSave = () => {
    if (!media) return;

    setIsProcessing(true);
    // Simulate AI processing delay
    setTimeout(() => {
      onSave(media.id, selectedRatio, useGenerativeFill);
      setIsProcessing(false);
      handleClose();
    }, 2000);
  };

  const handleClose = () => {
    setSelectedRatio('1:1');
    setUseGenerativeFill(true);
    onClose();
  };

  if (!media) return null;

  const getCropPreviewStyle = () => {
    const [widthRatio, heightRatio] = selectedRatio.split(':').map(Number);
    const targetAspect = widthRatio / heightRatio;
    const currentAspect = media.width / media.height;

    if (currentAspect > targetAspect) {
      // Image is wider - crop width
      return {
        width: `${(targetAspect / currentAspect) * 100}%`,
        height: '100%',
      };
    } else {
      // Image is taller - crop height
      return {
        width: '100%',
        height: `${(currentAspect / targetAspect) * 100}%`,
      };
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent size="xl">
        <DialogHeader>
          <DialogTitle>Smart Crop with AI</DialogTitle>
          <DialogDescription>
            Select aspect ratio and let AI intelligently crop or generate missing areas
          </DialogDescription>
        </DialogHeader>

        <div className={styles.content}>
          {/* Original Image Info */}
          <div className={styles.originalInfo}>
            <div className={styles.infoItem}>
              <Icon icon="image" size={16} />
              <span>{media.filename}</span>
            </div>
            <div className={styles.infoItem}>
              <Icon icon="maximize" size={16} />
              <span>
                {media.width} × {media.height} ({media.orientation})
              </span>
            </div>
          </div>

          {/* Aspect Ratio Selection */}
          <div className={styles.section}>
            <RadioGroup
              label="Target Aspect Ratio"
              value={selectedRatio}
              onValueChange={(value) => setSelectedRatio(value as AspectRatio)}
              options={aspectRatios.map((ratio) => ({
                value: ratio.value,
                label: `${ratio.label} (${ratio.value})`,
              }))}
              orientation="horizontal"
            />
          </div>

          {/* Preview */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Preview</h3>
            <div className={styles.previewContainer}>
              <div className={styles.previewWrapper}>
                <img
                  src={media.url}
                  alt="Original"
                  className={styles.previewImage}
                />
                <div className={styles.cropOverlay} style={getCropPreviewStyle()}>
                  <div className={styles.cropFrame} />
                  {useGenerativeFill && (
                    <div className={styles.generativeBadge}>
                      <Icon icon="sparkles" size={12} />
                      <span>AI Fill</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Generative Fill Option */}
          <div className={styles.section}>
            <div className={styles.optionCard}>
              <div className={styles.optionHeader}>
                <div className={styles.optionTitle}>
                  <Icon icon="sparkles" size={20} className={styles.sparkleIcon} />
                  <h4>Generative Fill</h4>
                </div>
                <Switch
                  checked={useGenerativeFill}
                  onCheckedChange={setUseGenerativeFill}
                />
              </div>
              <p className={styles.optionDescription}>
                {useGenerativeFill
                  ? 'AI will generate missing areas of the image to fill the new aspect ratio, maintaining composition and style.'
                  : 'Image will be cropped to fit the aspect ratio. Parts of the image may be cut off.'}
              </p>
              {useGenerativeFill && (
                <div className={styles.featureList}>
                  <div className={styles.feature}>
                    <Icon icon="check" size={14} />
                    <span>Maintains subject focus</span>
                  </div>
                  <div className={styles.feature}>
                    <Icon icon="check" size={14} />
                    <span>Extends background naturally</span>
                  </div>
                  <div className={styles.feature}>
                    <Icon icon="check" size={14} />
                    <span>Preserves image quality</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* AI Detection Info */}
          {media.aiAnalysis.faces && media.aiAnalysis.faces.length > 0 && (
            <div className={styles.detectionInfo}>
              <Icon icon="info" size={16} />
              <p>
                AI detected {media.aiAnalysis.faces.length} face(s). Smart crop will
                ensure they remain visible.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={handleClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={isProcessing}>
            {isProcessing ? (
              <>
                <Icon icon="loader-2" size={16} className={styles.spinner} />
                Processing...
              </>
            ) : (
              <>
                <Icon icon="wand-2" size={16} />
                Create Smart Crop
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
