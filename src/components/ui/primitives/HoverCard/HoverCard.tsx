import { ReactNode } from 'react';
import * as HoverCardPrimitive from '@radix-ui/react-hover-card';
import styles from './HoverCard.module.scss';

export interface HoverCardProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'right' | 'bottom' | 'left';
  sideOffset?: number;
  openDelay?: number;
  closeDelay?: number;
  className?: string;
}

export function HoverCard({
  trigger,
  children,
  align = 'center',
  side = 'bottom',
  sideOffset = 8,
  openDelay = 200,
  closeDelay = 100,
  className = '',
}: HoverCardProps) {
  return (
    <HoverCardPrimitive.Root openDelay={openDelay} closeDelay={closeDelay}>
      <HoverCardPrimitive.Trigger asChild>
        {trigger}
      </HoverCardPrimitive.Trigger>

      <HoverCardPrimitive.Portal>
        <HoverCardPrimitive.Content
          className={`${styles.content} ${className}`}
          align={align}
          side={side}
          sideOffset={sideOffset}
        >
          {children}
          <HoverCardPrimitive.Arrow className={styles.arrow} />
        </HoverCardPrimitive.Content>
      </HoverCardPrimitive.Portal>
    </HoverCardPrimitive.Root>
  );
}
