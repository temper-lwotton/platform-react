import { forwardRef } from 'react';
import * as SeparatorPrimitive from '@radix-ui/react-separator';
import styles from './Separator.module.scss';

export type SeparatorOrientation = 'horizontal' | 'vertical';

export interface SeparatorProps {
  orientation?: SeparatorOrientation;
  decorative?: boolean;
  className?: string;
}

export const Separator = forwardRef<HTMLDivElement, SeparatorProps>(
  (
    {
      orientation = 'horizontal',
      decorative = true,
      className = '',
    },
    ref
  ) => {
    const separatorClasses = [
      styles.separator,
      styles[`orientation-${orientation}`],
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <SeparatorPrimitive.Root
        ref={ref}
        className={separatorClasses}
        orientation={orientation}
        decorative={decorative}
      />
    );
  }
);

Separator.displayName = 'Separator';
