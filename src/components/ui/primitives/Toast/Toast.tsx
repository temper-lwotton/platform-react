import { ReactNode } from 'react';
import * as ToastPrimitive from '@radix-ui/react-toast';
import { Icon } from '../../Icon';
import styles from './Toast.module.scss';

export interface ToastProviderProps {
  children: ReactNode;
  swipeDirection?: 'right' | 'left' | 'up' | 'down';
  duration?: number;
}

export interface ToastProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: string;
  variant?: 'default' | 'success' | 'error' | 'warning';
  duration?: number;
  children?: ReactNode;
}

export interface ToastViewportProps {
  className?: string;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

export function ToastProvider({
  children,
  swipeDirection = 'right',
  duration = 5000,
}: ToastProviderProps) {
  return (
    <ToastPrimitive.Provider swipeDirection={swipeDirection} duration={duration}>
      {children}
    </ToastPrimitive.Provider>
  );
}

export function Toast({
  open,
  onOpenChange,
  title,
  description,
  variant = 'default',
  duration,
  children,
}: ToastProps) {
  const getIcon = () => {
    switch (variant) {
      case 'success':
        return <Icon icon="check" size={20} className={styles.icon} />;
      case 'error':
        return <Icon icon="x" size={20} className={styles.icon} />;
      case 'warning':
        return <Icon icon="info" size={20} className={styles.icon} />;
      default:
        return null;
    }
  };

  return (
    <ToastPrimitive.Root
      open={open}
      onOpenChange={onOpenChange}
      duration={duration}
      className={`${styles.root} ${styles[`variant-${variant}`]}`}
    >
      {variant !== 'default' && <div className={styles.iconWrapper}>{getIcon()}</div>}

      <div className={styles.content}>
        {title && (
          <ToastPrimitive.Title className={styles.title}>
            {title}
          </ToastPrimitive.Title>
        )}
        {description && (
          <ToastPrimitive.Description className={styles.description}>
            {description}
          </ToastPrimitive.Description>
        )}
        {children}
      </div>

      <ToastPrimitive.Close className={styles.close}>
        <Icon icon="x" size={16} />
      </ToastPrimitive.Close>
    </ToastPrimitive.Root>
  );
}

export function ToastViewport({ className = '', position = 'bottom-right' }: ToastViewportProps) {
  return (
    <ToastPrimitive.Viewport
      className={`${styles.viewport} ${styles[`position-${position}`]} ${className}`}
    />
  );
}

export const ToastAction = ToastPrimitive.Action;
export const ToastClose = ToastPrimitive.Close;
