'use client';

import React from 'react';
import { FieldPaletteItem as FieldPaletteItemType } from '@/types/form-builder';
import { useFormBuilder } from '../FormBuilderProvider';
import { FormField } from '@/types/form-builder';
import * as Tooltip from '@radix-ui/react-tooltip';
import * as LucideIcons from 'lucide-react';
import styles from './FieldPaletteItem.module.scss';

interface FieldPaletteItemProps {
  item: FieldPaletteItemType;
}

export default function FieldPaletteItem({ item }: FieldPaletteItemProps) {
  const { addField } = useFormBuilder();
  const [isAdding, setIsAdding] = React.useState(false);

  // Dynamically get the icon component
  const IconComponent = (LucideIcons as any)[item.icon];

  const handleClick = () => {
    setIsAdding(true);

    const newField: FormField = {
      id: `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: item.type,
      ...item.defaultConfig,
      label: item.defaultConfig.label || item.label,
      validations: item.defaultConfig.validations || [],
    };

    addField(newField);

    // Reset animation state
    setTimeout(() => setIsAdding(false), 300);
  };

  return (
    <Tooltip.Provider delayDuration={300}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button
            onClick={handleClick}
            className={`${styles.item} ${isAdding ? styles.adding : ''}`}
            type="button"
            aria-label={`Add ${item.label} field`}
            disabled={isAdding}
          >
            <div className={styles.icon}>
              {IconComponent && <IconComponent size={18} />}
            </div>
            <div className={styles.content}>
              <span className={styles.label}>{item.label}</span>
            </div>
          </button>
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
