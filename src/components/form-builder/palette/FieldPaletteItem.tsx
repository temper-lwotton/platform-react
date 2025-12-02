'use client';

import React from 'react';
import { FieldPaletteItem as FieldPaletteItemType } from '@/types/form-builder';
import { useFormBuilder } from '../FormBuilderProvider';
import { FormField } from '@/types/form-builder';
import * as Tooltip from '@radix-ui/react-tooltip';
import * as LucideIcons from 'lucide-react';
import { Star } from 'lucide-react';
import styles from './FieldPaletteItem.module.scss';

interface FieldPaletteItemProps {
  item: FieldPaletteItemType;
}

export default function FieldPaletteItem({ item }: FieldPaletteItemProps) {
  const { state, addField, toggleFavoriteFieldType } = useFormBuilder();
  const [isAdding, setIsAdding] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  const isFavorite = state.favoriteFieldTypes.includes(item.type);

  // Dynamically get the icon component
  const IconComponent = (LucideIcons as any)[item.icon];

  const handleClick = (e: React.MouseEvent) => {
    // Don't add field if clicking on star button
    if ((e.target as HTMLElement).closest(`.${styles.starButton}`)) {
      return;
    }

    setIsAdding(true);

    const newField: FormField = {
      id: `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: item.type,
      ...item.defaultConfig,
      label: item.defaultConfig.label || item.label,
      validations: item.defaultConfig.validations || [],
    };

    // Add field to the selected section if one is selected
    const sectionId = state.selectedSectionId || undefined;
    addField(newField, sectionId);

    // Reset animation state
    setTimeout(() => setIsAdding(false), 300);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavoriteFieldType(item.type);
  };

  return (
    <Tooltip.Provider delayDuration={300}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <div
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`${styles.item} ${isAdding ? styles.adding : ''}`}
            role="button"
            aria-label={`Add ${item.label} field`}
            tabIndex={0}
          >
            <div className={styles.icon}>
              {IconComponent && <IconComponent size={18} />}
            </div>
            <div className={styles.content}>
              <span className={styles.label}>{item.label}</span>
            </div>
            {(isFavorite || isHovered) && (
              <button
                className={`${styles.starButton} ${isFavorite ? styles.favorited : ''}`}
                onClick={handleToggleFavorite}
                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Star size={14} fill={isFavorite ? 'currentColor' : 'none'} />
              </button>
            )}
          </div>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content className={styles.tooltipContent} sideOffset={5}>
            <div className={styles.tooltipTitle}>{item.label}</div>
            <div className={styles.tooltipDescription}>{item.description}</div>
            <div className={styles.tooltipHint}>Click to add to form</div>
            <Tooltip.Arrow className={styles.tooltipArrow} />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
