'use client';

import React from 'react';
import * as Slider from '@radix-ui/react-slider';
import styles from './SliderField.module.scss';

interface SliderFieldProps {
  value: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export default function SliderField({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
}: SliderFieldProps) {
  return (
    <div className={styles.sliderWrapper}>
      <Slider.Root
        className={styles.sliderRoot}
        value={[value]}
        onValueChange={(values) => onChange?.(values[0])}
        min={min}
        max={max}
        step={step}
      >
        <Slider.Track className={styles.sliderTrack}>
          <Slider.Range className={styles.sliderRange} />
        </Slider.Track>
        <Slider.Thumb className={styles.sliderThumb} aria-label="Value" />
      </Slider.Root>
      <div className={styles.sliderValue}>
        <span className={styles.currentValue}>{value}</span>
        <span className={styles.range}>
          ({min} - {max})
        </span>
      </div>
    </div>
  );
}
