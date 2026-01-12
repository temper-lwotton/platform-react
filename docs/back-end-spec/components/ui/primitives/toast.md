# **Component Specification: Toast**

## **1. Component Name**

**`Toast`**

## **2. Description**

A notification toast system built on Radix UI Toast primitive.

* Provides non-blocking notifications
* Multiple variants for different message types
* Auto-dismiss and swipe-to-dismiss functionality
* Stackable toast viewport

## **3. Location**

```
src/components/ui/primitives/Toast/Toast.tsx
```

## **4. Component Type**

**UI** – Presentational component system managed by Radix UI.

## **5. Props Interface**

### **ToastProvider**

```typescript
interface ToastProviderProps {
  children: ReactNode;
  swipeDirection?: 'right' | 'left' | 'up' | 'down';
  duration?: number;
}
```

### **Toast**

```typescript
interface ToastProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: string;
  variant?: 'default' | 'success' | 'error' | 'warning';
  duration?: number;
  children?: ReactNode;
}
```

### **ToastViewport**

```typescript
interface ToastViewportProps {
  className?: string;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}
```

## **6. Props**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `open` | `boolean` | No | - | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | No | - | Open state handler |
| `title` | `string` | No | - | Toast title |
| `description` | `string` | No | - | Toast description |
| `variant` | `string` | No | `'default'` | Visual variant |
| `duration` | `number` | No | `5000` | Auto-dismiss time (ms) |
| `swipeDirection` | `string` | No | `'right'` | Swipe dismiss direction |
| `position` | `string` | No | `'bottom-right'` | Viewport position |

## **7. Data Requirements**

*No external data – purely presentational.*

## **8. Internal State**

*None per toast – managed by Radix UI.*

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
|-------------------|-------------|-------|
| `open === true` | Toast visible | In viewport |
| `open === false` | Toast hidden | Dismissed |
| Duration expires | Auto-dismiss | After delay |
| Swipe gesture | Dismisses | Direction-based |
| `variant === 'success'` | Green styling | Check icon |
| `variant === 'error'` | Red styling | X icon |
| `variant === 'warning'` | Yellow styling | Info icon |

## **10. Dependencies**

### **Child Components**

* `Icon` – Variant icons (check, x, info)

### **External Libraries**

* `@radix-ui/react-toast`

## **11. Events & Callbacks**

| Event / Callback | Trigger | Description |
|------------------|---------|-------------|
| `onOpenChange` | Open/close events | State change handler |

## **12. Styling**

* **Approach**: CSS Modules with SCSS
* **File**: `Toast.module.scss`

### **CSS Classes**

* `.root` – Toast container
* `.iconWrapper` – Icon container
* `.icon` – Variant icon
* `.content` – Text content
* `.title` – Title text
* `.description` – Description text
* `.close` – Close button
* `.viewport` – Toast viewport
* `.variant-default`, `.variant-success`, `.variant-error`, `.variant-warning` – Variants
* `.position-top-right`, `.position-bottom-right`, etc. – Positions

## **13. Accessibility Requirements**

* **Screen Reader**: Toasts announced
* **Motion**: Respects reduced motion
* **Dismissal**: Swipe or click to dismiss
* **Focus**: Auto-focus management

### **Improvements Needed**

* None – Radix provides full accessibility

## **14. Error Handling**

| Error Condition | Behaviour | Fallback |
|-----------------|-----------|----------|
| Invalid variant | Default to 'default' | No error |
| Invalid position | Default to 'bottom-right' | No error |

## **15. Performance & Lifecycle Notes**

### **App-Level Setup**

```tsx
// Wrap app with provider
function App() {
  return (
    <ToastProvider duration={5000}>
      {/* App content */}
      <ToastViewport position="bottom-right" />
    </ToastProvider>
  );
}
```

### **Variant Icons**

| Variant | Icon |
|---------|------|
| `success` | check |
| `error` | x |
| `warning` | info |
| `default` | none |

## **16. Usage Examples**

### **App-Level Setup**

```tsx
import {
  ToastProvider,
  Toast,
  ToastViewport,
} from '@/components/ui/primitives/Toast';

function App() {
  return (
    <ToastProvider duration={5000}>
      {/* App content */}
      <ToastViewport position="bottom-right" />
    </ToastProvider>
  );
}
```

### **Using Toasts**

```tsx
function MyComponent() {
  const [toastOpen, setToastOpen] = useState(false);

  const showToast = () => setToastOpen(true);

  return (
    <>
      <Button onClick={showToast}>Save</Button>

      <Toast
        open={toastOpen}
        onOpenChange={setToastOpen}
        variant="success"
        title="Saved successfully"
        description="Your changes have been saved."
      />
    </>
  );
}
```

### **Different Variants**

```tsx
<Toast variant="success" title="Success!" description="Action completed" />
<Toast variant="error" title="Error" description="Something went wrong" />
<Toast variant="warning" title="Warning" description="Please review" />
<Toast variant="default" title="Info" description="FYI notification" />
```

### **Custom Content**

```tsx
<Toast open={open} onOpenChange={setOpen}>
  <div className={styles.customToast}>
    <img src={user.avatar} alt="" />
    <p>{user.name} sent you a message</p>
    <Button size="sm">Reply</Button>
  </div>
</Toast>
```

## **17. Features Summary**

### **Exported Components**

| Component | Purpose |
|-----------|---------|
| `ToastProvider` | Context provider |
| `Toast` | Individual toast notification |
| `ToastViewport` | Toast container/positioning |
| `ToastAction` | Action button (re-exported) |
| `ToastClose` | Close button (re-exported) |

### **Positions**

| Position | Placement |
|----------|-----------|
| `top-right` | Top right corner |
| `top-left` | Top left corner |
| `top-center` | Top center |
| `bottom-right` | Bottom right (default) |
| `bottom-left` | Bottom left |
| `bottom-center` | Bottom center |

## **18. Testing Considerations**

### **Unit Tests**

* Shows toast when open
* Auto-dismisses after duration
* Swipe dismisses
* Correct variant styling
* Icon renders for variant

### **Mocking**

* Timer mocks for duration testing

### **Edge Cases**

* Multiple toasts
* Rapid open/close
* Very long content
* Custom children

## **19. Out of Scope / Non-Goals**

* **Persistent**: Not for permanent messages
* **Modal**: Use Dialog for blocking
* **Inline**: Use alert for inline messages
* **Queue management**: Manual implementation

## **20. Related Components & System Context**

### **Parent**

* `ToastProvider` (app-level)

### **Used With**

* Action confirmations
* Error notifications
* System messages

## **21. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
|----------|----------|---------------|-------|
| `Default` | Default variant | variant: default | Base state |
| `Success` | Success message | variant: success | Green |
| `Error` | Error message | variant: error | Red |
| `Warning` | Warning message | variant: warning | Yellow |
| `WithDescription` | Title + desc | Both provided | Full content |
| `CustomContent` | Custom children | children prop | Rich content |
| `Positions` | All positions | Various positions | Placement |

### **Controls (Args) Required**

* `variant` (select) – Toast variant
* `title` (text) – Toast title
* `description` (text) – Toast description
* `duration` (number) – Auto-dismiss time
* `open` (boolean) – Open state

### **Mocking Requirements**

* Timer mocks

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Verify announcement
* Check reduced motion
* Verify dismissal

### **Interaction Tests**

* Trigger toast
* Wait for auto-dismiss
* Swipe to dismiss
* Click close
