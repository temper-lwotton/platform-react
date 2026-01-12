# **Component Specification: Popover**

## **1. Component Name**

**`Popover`**

## **2. Description**

A floating content container built on Radix UI Popover primitive.

* Displays content in a floating panel
* Triggered by clicking an element
* Includes arrow pointer
* Supports controlled and uncontrolled modes

## **3. Location**

```
src/components/ui/primitives/Popover/Popover.tsx
```

## **4. Component Type**

**UI** – Presentational component managed by Radix UI.

## **5. Props Interface**

### **Popover**

```typescript
interface PopoverProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'right' | 'bottom' | 'left';
  sideOffset?: number;
  className?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}
```

### **PopoverClose**

```typescript
interface PopoverCloseProps {
  children: ReactNode;
  className?: string;
}
```

## **6. Props**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `trigger` | `ReactNode` | Yes | - | Element that opens popover |
| `children` | `ReactNode` | Yes | - | Popover content |
| `align` | `'start' \| 'center' \| 'end'` | No | `'center'` | Horizontal alignment |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | No | `'bottom'` | Placement side |
| `sideOffset` | `number` | No | `8` | Distance from trigger |
| `open` | `boolean` | No | - | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | No | - | Open state handler |

## **7. Data Requirements**

*No external data – purely presentational.*

## **8. Internal State**

*None – managed by Radix UI (or controlled via props).*

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
|-------------------|-------------|-------|
| Trigger clicked | Popover opens | Content visible |
| Click outside | Popover closes | Auto-dismiss |
| Press Escape | Popover closes | Keyboard |
| `open === true` (controlled) | Popover visible | Manual control |

## **10. Dependencies**

### **External Libraries**

* `@radix-ui/react-popover`

## **11. Events & Callbacks**

| Event / Callback | Trigger | Description |
|------------------|---------|-------------|
| `onOpenChange` | Open/close events | State change handler |

## **12. Styling**

* **Approach**: CSS Modules with SCSS
* **File**: `Popover.module.scss`

### **CSS Classes**

* `.content` – Popover container
* `.arrow` – Arrow pointer

## **13. Accessibility Requirements**

* **Keyboard**: Escape closes, Tab navigates
* **Focus**: Focus management via Radix
* **Screen Reader**: Content announced

### **Improvements Needed**

* None – Radix provides full accessibility

## **14. Error Handling**

| Error Condition | Behaviour | Fallback |
|-----------------|-----------|----------|
| Invalid side | Default to 'bottom' | No error |
| Invalid align | Default to 'center' | No error |

## **15. Performance & Lifecycle Notes**

### **Controlled vs Uncontrolled**

```tsx
// Uncontrolled (Radix manages state)
<Popover trigger={<Button>Open</Button>}>
  <Content />
</Popover>

// Controlled (you manage state)
const [open, setOpen] = useState(false);

<Popover
  open={open}
  onOpenChange={setOpen}
  trigger={<Button>Open</Button>}
>
  <Content />
</Popover>
```

## **16. Usage Examples**

### **Basic Popover**

```tsx
import { Popover, PopoverClose } from '@/components/ui/primitives/Popover';

<Popover trigger={<Button>Open Popover</Button>}>
  <div className={styles.popoverContent}>
    <h4>Popover Title</h4>
    <p>Popover content goes here</p>
  </div>
</Popover>
```

### **Controlled Popover**

```tsx
const [open, setOpen] = useState(false);

<Popover
  open={open}
  onOpenChange={setOpen}
  trigger={<Button>Show Info</Button>}
  side="right"
  align="start"
>
  <div className={styles.infoPanel}>
    <h4>Additional Information</h4>
    <p>More details about this item...</p>
    <PopoverClose>
      <Button variant="ghost" size="sm">Close</Button>
    </PopoverClose>
  </div>
</Popover>
```

### **Settings Popover**

```tsx
<Popover
  trigger={<Icon icon="settings" />}
  align="end"
>
  <div className={styles.settingsPopover}>
    <Switch label="Notifications" />
    <Switch label="Dark mode" />
    <Separator />
    <Button variant="outline" fullWidth>More Settings</Button>
  </div>
</Popover>
```

## **17. Features Summary**

### **Exported Components**

| Component | Purpose |
|-----------|---------|
| `Popover` | Main popover container |
| `PopoverClose` | Closes popover when clicked |

### **Positioning**

| Side | Placement |
|------|-----------|
| `top` | Above trigger |
| `right` | Right of trigger |
| `bottom` | Below trigger (default) |
| `left` | Left of trigger |

### **Popover vs Dropdown vs Dialog**

| Component | Use Case |
|-----------|----------|
| `Popover` | Rich content, forms, settings panels |
| `Dropdown` | Action menus, simple lists |
| `Dialog` | Important actions, confirmations, full forms |

## **18. Testing Considerations**

### **Unit Tests**

* Opens on trigger click
* Closes on click outside
* Closes on Escape
* Controlled state works
* Arrow renders correctly

### **Mocking**

* No external dependencies to mock

### **Edge Cases**

* Near viewport edge (repositioning)
* Very large content
* Nested popovers

## **19. Out of Scope / Non-Goals**

* **Action menus**: Use Dropdown
* **Modal content**: Use Dialog
* **Hover trigger**: Use HoverCard
* **Tooltips**: Separate component

## **20. Related Components & System Context**

### **Used By**

* Settings panels
* Info cards
* Filters

### **Siblings**

* `Dropdown`
* `HoverCard`
* `Dialog`

## **21. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
|----------|----------|---------------|-------|
| `Default` | Basic popover | Bottom placement | Base state |
| `Controlled` | Manual control | open + onOpenChange | State managed |
| `Sides` | All sides | top, right, bottom, left | Positioning |
| `Alignments` | All alignments | start, center, end | Horizontal |
| `WithClose` | Close button | PopoverClose | Dismiss action |

### **Controls (Args) Required**

* `side` (select) – Placement side
* `align` (select) – Horizontal alignment
* `sideOffset` (number) – Distance from trigger
* `open` (boolean) – Open state

### **Mocking Requirements**

*None – stateless component*

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Verify focus management
* Check escape closes
* Verify content accessible

### **Interaction Tests**

* Click trigger to open
* Click outside to close
* Press Escape to close
* Click PopoverClose
