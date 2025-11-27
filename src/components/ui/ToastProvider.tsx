'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import * as Toast from '@radix-ui/react-toast';

interface ToastContextType {
  showToast: (message: string) => void;
}

interface ToastItem {
  id: string;
  message: string;
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

  const showToast = (msg: string) => {
    const id = Date.now().toString() + Math.random().toString(36);
    setToasts((prev) => [...prev, { id, message: msg, open: true }]);
  };

  const handleOpenChange = (id: string, open: boolean) => {
    if (!open) {
      // Remove toast from array after animation completes
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      <Toast.Provider swipeDirection="right" duration={3000}>
        {children}
        {toasts.map((toast) => (
          <Toast.Root
            key={toast.id}
            className="toast-root"
            open={toast.open}
            onOpenChange={(open) => handleOpenChange(toast.id, open)}
          >
            <Toast.Description className="toast-description">
              {toast.message}
            </Toast.Description>
          </Toast.Root>
        ))}
        <Toast.Viewport className="toast-viewport" />
      </Toast.Provider>
    </ToastContext.Provider>
  );
}
