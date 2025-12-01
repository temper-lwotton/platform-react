'use client';

import { useState } from 'react';
import { MediaItem } from '@/types/media';
import { Badge } from '../primitives/Badge';
import { Icon } from '../Icon';
import { Avatar } from '../primitives/Avatar';
import styles from './MediaCard.module.scss';

interface MediaCardProps {
  media: MediaItem;
  onEdit: (media: MediaItem) => void;
  onGenerateAltText: (media: MediaItem) => void;
  onSmartCrop: (media: MediaItem) => void;
  onDelete?: (media: MediaItem) => void;
  onSelect?: (media: MediaItem) => void;
  isSelected?: boolean;
}

export default function MediaCard({
  media,
  onEdit,
  onGenerateAltText,
  onSmartCrop,
  onDelete,
  onSelect,
  isSelected = false,
}: MediaCardProps) {
  const [showActions, setShowActions] = useState(false);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const topTags = media.aiAnalysis.tags
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 3);

  return (
    <div
      className={`${styles.card} ${isSelected ? styles.selected : ''}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Image Preview */}
      <div className={styles.imageContainer}>
        <img
          src={media.thumbnailUrl}
          alt={media.altText || 'Untitled image'}
          className={styles.image}
        />

        {/* Orientation Badge */}
        <div className={styles.topBadges}>
          <Badge variant="outline" size="sm">
            {media.orientation}
          </Badge>
          {media.aiAnalysis.peopleCount > 0 && (
            <Badge variant="outline" size="sm">
              <Icon icon="users" size={12} />
              {media.aiAnalysis.peopleCount}
            </Badge>
          )}
        </div>

        {/* Selection Checkbox */}
        {onSelect && (
          <button
            className={`${styles.selectButton} ${isSelected ? styles.visible : ''}`}
            onClick={() => onSelect(media)}
            aria-label="Select image"
          >
            <Icon icon={isSelected ? 'check-square' : 'square'} size={20} />
          </button>
        )}

        {/* Hover Actions */}
        {showActions && (
          <div className={styles.actions}>
            <button
              className={styles.actionButton}
              onClick={() => onGenerateAltText(media)}
              title="Generate alt text"
            >
              <Icon icon="wand-2" size={16} />
            </button>
            <button
              className={styles.actionButton}
              onClick={() => onSmartCrop(media)}
              title="Smart crop"
            >
              <Icon icon="crop" size={16} />
            </button>
            <button
              className={styles.actionButton}
              onClick={() => onEdit(media)}
              title="Edit details"
            >
              <Icon icon="pencil" size={16} />
            </button>
            {onDelete && (
              <button
                className={`${styles.actionButton} ${styles.deleteButton}`}
                onClick={() => onDelete(media)}
                title="Delete"
              >
                <Icon icon="x" size={16} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Media Info */}
      <div className={styles.info}>
        <div className={styles.header}>
          <h3 className={styles.filename}>
            {media.seoFilename || media.filename}
          </h3>
          {!media.altText && (
            <Icon
              icon="alert-circle"
              size={14}
              className={styles.warningIcon}
            />
          )}
        </div>

        {/* AI Tags */}
        <div className={styles.tags}>
          {topTags.map((tag) => (
            <Badge key={tag.id} variant="outline" size="sm">
              {tag.label}
            </Badge>
          ))}
        </div>

        {/* Dominant Colors */}
        <div className={styles.colors}>
          {media.aiAnalysis.dominantColors.slice(0, 5).map((color, index) => (
            <div
              key={index}
              className={styles.colorSwatch}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <div className={styles.user}>
            <Avatar
              alt={media.uploadedBy.name}
              src={media.uploadedBy.avatar}
              size="sm"
            />
            <span className={styles.userName}>{media.uploadedBy.name}</span>
          </div>
          <div className={styles.meta}>
            <span className={styles.metaItem}>
              {media.width} × {media.height}
            </span>
            <span className={styles.metaItem}>{formatFileSize(media.size)}</span>
            <span className={styles.metaItem}>{formatDate(media.uploadedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
