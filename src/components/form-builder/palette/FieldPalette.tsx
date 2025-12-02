'use client';

import React from 'react';
import { FIELD_PALETTE_ITEMS } from '../field-palette-config';
import FieldPaletteItem from './FieldPaletteItem';
import * as Separator from '@radix-ui/react-separator';
import styles from './FieldPalette.module.scss';

export default function FieldPalette() {
  // Group fields by category
  const basicFields = FIELD_PALETTE_ITEMS.filter((item) =>
    ['text', 'textarea', 'email', 'number', 'tel'].includes(item.type)
  );

  const choiceFields = FIELD_PALETTE_ITEMS.filter((item) =>
    ['select', 'radio', 'checkbox', 'checkbox-group'].includes(item.type)
  );

  const dateTimeFields = FIELD_PALETTE_ITEMS.filter((item) =>
    ['date', 'time'].includes(item.type)
  );

  const advancedFields = FIELD_PALETTE_ITEMS.filter((item) =>
    ['file', 'switch', 'rating', 'slider'].includes(item.type)
  );

  return (
    <div className={styles.palette}>
      <div className={styles.header}>
        <h3>Field Types</h3>
        <p>Click to add to form</p>
      </div>

      <div className={styles.sections}>
        <section className={styles.section}>
          <h4 className={styles.sectionTitle}>Basic Inputs</h4>
          <div className={styles.items}>
            {basicFields.map((item) => (
              <FieldPaletteItem key={item.type} item={item} />
            ))}
          </div>
        </section>

        <Separator.Root className={styles.separator} />

        <section className={styles.section}>
          <h4 className={styles.sectionTitle}>Choice Fields</h4>
          <div className={styles.items}>
            {choiceFields.map((item) => (
              <FieldPaletteItem key={item.type} item={item} />
            ))}
          </div>
        </section>

        <Separator.Root className={styles.separator} />

        <section className={styles.section}>
          <h4 className={styles.sectionTitle}>Date & Time</h4>
          <div className={styles.items}>
            {dateTimeFields.map((item) => (
              <FieldPaletteItem key={item.type} item={item} />
            ))}
          </div>
        </section>

        <Separator.Root className={styles.separator} />

        <section className={styles.section}>
          <h4 className={styles.sectionTitle}>Advanced</h4>
          <div className={styles.items}>
            {advancedFields.map((item) => (
              <FieldPaletteItem key={item.type} item={item} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
