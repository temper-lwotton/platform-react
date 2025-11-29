import { ReactNode } from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import styles from './Dropdown.module.scss';

export interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
  className?: string;
}

export interface DropdownItemProps {
  children: ReactNode;
  onSelect?: () => void;
  disabled?: boolean;
  className?: string;
  destructive?: boolean;
}

export interface DropdownSeparatorProps {
  className?: string;
}

export interface DropdownLabelProps {
  children: ReactNode;
  className?: string;
}

export function Dropdown({
  trigger,
  children,
  align = 'end',
  sideOffset = 4,
  className = '',
}: DropdownProps) {
  return (
    <DropdownMenuPrimitive.Root>
      <DropdownMenuPrimitive.Trigger asChild>
        {trigger}
      </DropdownMenuPrimitive.Trigger>

      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          className={`${styles.content} ${className}`}
          align={align}
          sideOffset={sideOffset}
        >
          {children}
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
}

export function DropdownItem({
  children,
  onSelect,
  disabled = false,
  className = '',
  destructive = false,
}: DropdownItemProps) {
  return (
    <DropdownMenuPrimitive.Item
      className={`${styles.item} ${destructive ? styles.destructive : ''} ${className}`}
      onSelect={onSelect}
      disabled={disabled}
    >
      {children}
    </DropdownMenuPrimitive.Item>
  );
}

export function DropdownSeparator({ className = '' }: DropdownSeparatorProps) {
  return (
    <DropdownMenuPrimitive.Separator
      className={`${styles.separator} ${className}`}
    />
  );
}

export function DropdownLabel({ children, className = '' }: DropdownLabelProps) {
  return (
    <DropdownMenuPrimitive.Label
      className={`${styles.label} ${className}`}
    >
      {children}
    </DropdownMenuPrimitive.Label>
  );
}
