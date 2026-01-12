# Component: ToastProvider

## Description
A global toast notification provider using Radix Toast. Provides context for showing success, error, and info toasts throughout the application.

## Location
`src/components/ui/ToastProvider/ToastProvider.tsx`

## Props Interface

```typescript
interface ToastProviderProps {
  children: ReactNode;
}
```

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `children` | `ReactNode` | Yes | - | Application content |

## Context Interface

```typescript
interface ToastContextType {
  showToast: (options: ToastOptions | string) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
}

interface ToastOptions {
  title: string;
  description?: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
}
```

## Internal State

| State Variable | Type | Purpose |
|----------------|------|---------|
| `toasts` | `ToastItem[]` | Queue of active toasts |

## Dependencies

### Radix UI
- `@radix-ui/react-toast` - Toast primitives

### Child Components
- `Icon` - Type icons (check, alertCircle, bell, x)

## Exported Hook

```typescript
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}
```

## Styling
- **CSS Module**: `ToastProvider.module.scss`
- **Variants**: Success (green), Error (red), Info (blue)
- **Position**: Right side viewport

## Usage Example

```tsx
// In app root
import { ToastProvider } from '@/components/ui/ToastProvider';

<ToastProvider>
  <App />
</ToastProvider>

// In components
import { useToast } from '@/components/ui/ToastProvider';

function MyComponent() {
  const toast = useToast();

  const handleSave = async () => {
    try {
      await saveData();
      toast.success('Saved!', 'Your changes have been saved.');
    } catch {
      toast.error('Error', 'Failed to save changes.');
    }
  };
}
```

## Features
- **Toast types**: success, error, info
- **Auto-dismiss**: Configurable duration (default 3000ms, errors 5000ms)
- **Swipe to dismiss**: Swipe right to close
- **Multiple toasts**: Queue and stack support
- **Icons**: Type-specific icons
- **Close button**: Manual dismiss option
- **Legacy support**: Simple string message support

## Toast Structure

```tsx
<Toast.Root className={styles.root}>
  <div className={styles.content}>
    <div className={styles.icon}>
      {/* Type-specific icon */}
    </div>
    <div className={styles.text}>
      <Toast.Title>{title}</Toast.Title>
      <Toast.Description>{description}</Toast.Description>
    </div>
    <Toast.Close className={styles.close}>
      <Icon icon="x" />
    </Toast.Close>
  </div>
</Toast.Root>
```

## Related Components
- Context: `ToastContext`
- Hook: `useToast`
- Used by: App root layout
