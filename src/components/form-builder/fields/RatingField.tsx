'use client';

import React, { useState } from 'react';
import { Star } from 'lucide-react';
import styles from './RatingField.module.scss';

interface RatingFieldProps {
  value: number;
  onChange?: (value: number) => void;
  max?: number;
  disabled?: boolean;
}

export default function RatingField({
  value,
  onChange,
  max = 5,
  disabled = false,
}: RatingFieldProps) {
  const [hover, setHover] = useState<number | null>(null);

  return (
    <div className={styles.rating}>
      {Array.from({ length: max }, (_, i) => i + 1).map((star) => (
        <button
          key={star}
          type="button"
          className={`${styles.star} ${
            star <= (hover ?? value) ? styles.filled : ''
          }`}
          onClick={() => !disabled && onChange?.(star)}
          onMouseEnter={() => !disabled && setHover(star)}
          onMouseLeave={() => setHover(null)}
          aria-label={`Rate ${star} out of ${max}`}
          disabled={disabled}
        >
          <Star
            size={24}
            fill={star <= (hover ?? value) ? 'currentColor' : 'none'}
          />
        </button>
      ))}
      {value > 0 && (
        <span className={styles.ratingText}>
          {value} / {max}
        </span>
      )}
    </div>
  );
}
