import { ReactNode } from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import styles from './Popover.module.scss';

export interface PopoverProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'right' | 'bottom' | 'left';
  sideOffset?: number;
  className?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export interface PopoverCloseProps {
  children: ReactNode;
  className?: string;
}

export function Popover({
  trigger,
  children,
  align = 'center',
  side = 'bottom',
  sideOffset = 8,
  className = '',
  open,
  onOpenChange,
}: PopoverProps) {
  return (
    <PopoverPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <PopoverPrimitive.Trigger asChild>
        {trigger}
      </PopoverPrimitive.Trigger>

      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          className={`${styles.content} ${className}`}
          align={align}
          side={side}
          sideOffset={sideOffset}
        >
          {children}
          <PopoverPrimitive.Arrow className={styles.arrow} />
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}

export function PopoverClose({ children, className = '' }: PopoverCloseProps) {
  return (
    <PopoverPrimitive.Close className={className}>
      {children}
    </PopoverPrimitive.Close>
  );
}
