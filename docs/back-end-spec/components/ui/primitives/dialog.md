# **Component Specification: Dialog**

## **1. Component Name**

**`Dialog`**

## **2. Description**

A modal dialog system built on Radix UI Dialog primitive.

* Provides accessible, customizable modal dialogs
* Includes header, content, description, and footer sections
* Supports controlled and uncontrolled modes
* Portal rendering with overlay

## **3. Location**

```
src/components/ui/primitives/Dialog/Dialog.tsx
```

## **4. Component Type**

**UI** – Presentational component system managed by Radix UI.

## **5. Props Interface**

### **Dialog (Root)**

```typescript
interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: ReactNode;
  children: ReactNode;
  className?: string;
}
```

### **DialogContent**

```typescript
interface DialogContentProps {
  children: ReactNode;
  className?: string;
  showClose?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}
```

### **DialogHeader, DialogTitle, DialogDescription, DialogFooter**

```typescript
interface DialogSectionProps {
  children: ReactNode;
  className?: string;
}
```

## **6. Props**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `open` | `boolean` | No | - | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | No | - | Open state change handler |
| `trigger` | `ReactNode` | No | - | Element that opens dialog |
| `showClose` | `boolean` | No | `true` | Show close button |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | No | `'md'` | Dialog width size |

## **7. Data Requirements**

*No external data – purely presentational.*

## **8. Internal State**

*None – controlled via Radix UI primitives.*

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
|-------------------|-------------|-------|
| `open === true` | Dialog + overlay | Modal visible |
| `open === false` | Nothing | Hidden |
| `showClose === true` | X button in corner | Default |
| Click overlay | Dialog closes | Click outside |
| Press Escape | Dialog closes | Keyboard |

## **10. Dependencies**

### **Child Components**

* `Icon` – Close button icon

### **External Libraries**

* `@radix-ui/react-dialog`

## **11. Events & Callbacks**

| Event / Callback | Trigger | Description |
|------------------|---------|-------------|
| `onOpenChange` | Open/close actions | State change handler |

## **12. Styling**

* **Approach**: CSS Modules with SCSS
* **File**: `Dialog.module.scss`

### **CSS Classes**

* `.overlay` – Background overlay
* `.content` – Dialog container
* `.header` – Header section
* `.title` – Title text
* `.description` – Description text
* `.footer` – Footer section
* `.close` – Close button
* `.size-sm`, `.size-md`, `.size-lg`, `.size-xl` – Size variants

## **13. Accessibility Requirements**

* **Keyboard**: Escape closes, Tab trapped
* **ARIA**: Title and Description linked via aria attributes
* **Focus**: Focus trapped within dialog
* **Screen Reader**: Announces dialog, title, and description

### **Improvements Needed**

* None – Radix provides full accessibility

## **14. Error Handling**

| Error Condition | Behaviour | Fallback |
|-----------------|-----------|----------|
| No title | No title rendered | Graceful |
| Invalid size | Default to 'md' | No error |

## **15. Performance & Lifecycle Notes**

### **Portal Rendering**

* Dialog content rendered in portal
* Overlay and content in same portal

### **Focus Management**

* Focus moves to dialog on open
* Focus returns to trigger on close
* Focus trapped within dialog

## **16. Usage Examples**

### **Controlled Dialog**

```tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/primitives/Dialog';

const [open, setOpen] = useState(false);

<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent size="md">
    <DialogHeader>
      <DialogTitle>Confirm Action</DialogTitle>
      <DialogDescription>
        Are you sure you want to proceed? This action cannot be undone.
      </DialogDescription>
    </DialogHeader>

    <div className={styles.body}>
      {/* Dialog body content */}
    </div>

    <DialogFooter>
      <Button variant="ghost" onClick={() => setOpen(false)}>
        Cancel
      </Button>
      <Button variant="danger" onClick={handleConfirm}>
        Delete
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### **With Trigger**

```tsx
<Dialog trigger={<Button>Open Dialog</Button>}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
    </DialogHeader>
    {/* Content */}
  </DialogContent>
</Dialog>
```

## **17. Features Summary**

### **Exported Components**

| Component | Purpose |
|-----------|---------|
| `Dialog` | Root wrapper |
| `DialogContent` | Content container with overlay |
| `DialogHeader` | Header section |
| `DialogTitle` | Title text (Radix Title) |
| `DialogDescription` | Description text (Radix Description) |
| `DialogFooter` | Footer section |
| `DialogClose` | Close trigger (re-exported) |

### **Sizes**

| Size | Width | Use Case |
|------|-------|----------|
| `sm` | ~300px | Simple confirmations |
| `md` | ~500px | Standard dialogs |
| `lg` | ~700px | Complex forms |
| `xl` | ~900px | Large content |

## **18. Testing Considerations**

### **Unit Tests**

* Opens on trigger click
* Closes on overlay click
* Closes on Escape key
* Shows close button when showClose=true
* Renders title and description
* Footer renders correctly

### **Mocking**

* No external dependencies to mock

### **Edge Cases**

* Very long content (scrolling)
* Multiple dialogs
* Nested dialogs

## **19. Out of Scope / Non-Goals**

* **Non-modal**: Use Popover
* **Side panel**: Separate component
* **Wizard**: Separate component
* **Toast**: Use Toast component

## **20. Related Components & System Context**

### **Used By**

* Confirmation dialogs
* Form modals
* Media pickers

### **Siblings**

* `Popover`
* `Dropdown`

## **21. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
|----------|----------|---------------|-------|
| `Default` | Basic dialog | Standard content | Base state |
| `WithTrigger` | Trigger element | trigger prop | Click to open |
| `Sizes` | All sizes | sm, md, lg, xl | Size comparison |
| `NoClose` | No close button | showClose: false | Clean header |
| `Confirmation` | Delete confirm | Danger variant | Use case |
| `Form` | Form dialog | Form content | Complex content |

### **Controls (Args) Required**

* `size` (select) – Dialog size
* `showClose` (boolean) – Show close button
* `open` (boolean) – Open state

### **Mocking Requirements**

*None – stateless component*

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Verify focus trap
* Check escape closes
* Verify title announcement

### **Interaction Tests**

* Open dialog
* Close via button
* Close via overlay
* Close via escape
