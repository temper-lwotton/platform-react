'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import * as Toast from '@radix-ui/react-toast';
import { Icon } from '../Icon';
import styles from './ToastProvider.module.scss';

interface ToastOptions {
  title: string;
  description?: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
}

interface ToastContextType {
  showToast: (options: ToastOptions | string) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
}

interface ToastItem {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'error' | 'info';
  duration: number;
  open: boolean;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = (options: ToastOptions | string) => {
    const id = Date.now().toString() + Math.random().toString(36);

    // Support legacy string messages
    if (typeof options === 'string') {
      setToasts((prev) => [...prev, {
        id,
        title: options,
        type: 'info',
        duration: 3000,
        open: true
      }]);
      return;
    }

    setToasts((prev) => [...prev, {
      id,
      title: options.title,
      description: options.description,
      type: options.type || 'info',
      duration: options.duration || 3000,
      open: true
    }]);
  };

  const success = (title: string, description?: string) => {
    showToast({ title, description, type: 'success' });
  };

  const error = (title: string, description?: string) => {
    showToast({ title, description, type: 'error', duration: 5000 });
  };

  const info = (title: string, description?: string) => {
    showToast({ title, description, type: 'info' });
  };

  const handleOpenChange = (id: string, open: boolean) => {
    if (!open) {
      // Remove toast from array after animation completes
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }
  };

  return (
    <ToastContext.Provider value={{ showToast, success, error, info }}>
      <Toast.Provider swipeDirection="right">
        {children}
        {toasts.map((toast) => (
          <Toast.Root
            key={toast.id}
            className={`${styles.root} ${styles[`root${toast.type.charAt(0).toUpperCase() + toast.type.slice(1)}`]}`}
            open={toast.open}
            duration={toast.duration}
            onOpenChange={(open) => handleOpenChange(toast.id, open)}
          >
            <div className={styles.content}>
              <div className={styles.icon}>
                {toast.type === 'success' && <Icon icon="check" size={20} />}
                {toast.type === 'error' && <Icon icon="alertCircle" size={20} />}
                {toast.type === 'info' && <Icon icon="bell" size={20} />}
              </div>
              <div className={styles.text}>
                <Toast.Title className={styles.title}>
                  {toast.title}
                </Toast.Title>
                {toast.description && (
                  <Toast.Description className={styles.description}>
                    {toast.description}
                  </Toast.Description>
                )}
              </div>
              <Toast.Close className={styles.close}>
                <Icon icon="x" size={16} />
              </Toast.Close>
            </div>
          </Toast.Root>
        ))}
        <Toast.Viewport className={styles.viewport} />
      </Toast.Provider>
    </ToastContext.Provider>
  );
}
