'use client';

import styles from './TypingIndicator.module.scss';

interface TypingIndicatorProps {
  names?: string[];
}

export function TypingIndicator({ names = [] }: TypingIndicatorProps) {
  if (names.length === 0) return null;

  const displayText = names.length === 1
    ? `${names[0]} is typing`
    : names.length === 2
      ? `${names[0]} and ${names[1]} are typing`
      : `${names[0]} and ${names.length - 1} others are typing`;

  return (
    <div className={styles.indicator}>
      <div className={styles.dots}>
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.dot} />
      </div>
      <span className={styles.text}>{displayText}</span>
    </div>
  );
}
