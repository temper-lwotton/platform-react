import { ReactNode } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Icon } from '../../Icon';
import styles from './Dialog.module.scss';

export interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: ReactNode;
  children: ReactNode;
  className?: string;
}

export interface DialogContentProps {
  children: ReactNode;
  className?: string;
  showClose?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export interface DialogHeaderProps {
  children: ReactNode;
  className?: string;
}

export interface DialogTitleProps {
  children: ReactNode;
  className?: string;
}

export interface DialogDescriptionProps {
  children: ReactNode;
  className?: string;
}

export interface DialogFooterProps {
  children: ReactNode;
  className?: string;
}

export function Dialog({ open, onOpenChange, trigger, children, className = '' }: DialogProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      {trigger && (
        <DialogPrimitive.Trigger asChild>
          {trigger}
        </DialogPrimitive.Trigger>
      )}
      {children}
    </DialogPrimitive.Root>
  );
}

export function DialogContent({
  children,
  className = '',
  showClose = true,
  size = 'md',
}: DialogContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className={styles.overlay} />
      <DialogPrimitive.Content className={`${styles.content} ${styles[`size-${size}`]} ${className}`}>
        {children}
        {showClose && (
          <DialogPrimitive.Close className={styles.close}>
            <Icon icon="x" size={20} />
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export function DialogHeader({ children, className = '' }: DialogHeaderProps) {
  return <div className={`${styles.header} ${className}`}>{children}</div>;
}

export function DialogTitle({ children, className = '' }: DialogTitleProps) {
  return (
    <DialogPrimitive.Title className={`${styles.title} ${className}`}>
      {children}
    </DialogPrimitive.Title>
  );
}

export function DialogDescription({ children, className = '' }: DialogDescriptionProps) {
  return (
    <DialogPrimitive.Description className={`${styles.description} ${className}`}>
      {children}
    </DialogPrimitive.Description>
  );
}

export function DialogFooter({ children, className = '' }: DialogFooterProps) {
  return <div className={`${styles.footer} ${className}`}>{children}</div>;
}

export const DialogClose = DialogPrimitive.Close;
