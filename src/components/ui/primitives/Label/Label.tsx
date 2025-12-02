import React from 'react';
import * as RadixLabel from '@radix-ui/react-label';
import styles from './Label.module.scss';

export interface LabelProps extends RadixLabel.LabelProps {
  children: React.ReactNode;
}

export function Label({ children, className, ...props }: LabelProps) {
  return (
    <RadixLabel.Root className={`${styles.label} ${className || ''}`} {...props}>
      {children}
    </RadixLabel.Root>
  );
}
