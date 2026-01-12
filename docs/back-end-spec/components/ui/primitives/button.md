# **Component Specification: Button**

## **1. Component Name**

**`Button`**

## **2. Description**

A versatile button component with multiple variants, sizes, and loading states.

* Built as a forwardRef component for seamless integration
* Supports primary, secondary, danger, success, outline, and ghost variants
* Includes loading spinner state
* Extends native HTML button attributes

## **3. Location**

```
src/components/ui/primitives/Button/Button.tsx
```

## **4. Component Type**

**UI** – Stateless presentational component.

## **5. Props Interface**

```typescript
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
}

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';
```

## **6. Props**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `variant` | `ButtonVariant` | No | `'primary'` | Visual style variant |
| `size` | `ButtonSize` | No | `'md'` | Button size |
| `fullWidth` | `boolean` | No | `false` | Expand to container width |
| `loading` | `boolean` | No | `false` | Show loading spinner |
| `disabled` | `boolean` | No | `false` | Disable button (inherited) |
| `className` | `string` | No | `''` | Additional CSS classes |
| `children` | `ReactNode` | Yes | - | Button content |

## **7. Data Requirements**

*No external data – purely presentational.*

## **8. Internal State**

*None – stateless component.*

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
|-------------------|-------------|-------|
| `loading === true` | Spinner + content | Automatically disabled |
| `disabled === true` | Disabled styling | Non-interactive |
| `fullWidth === true` | 100% width | Block display |
| Variant applied | Variant colors | Visual distinction |

## **10. Dependencies**

### **External Libraries**

* React `forwardRef`, `ButtonHTMLAttributes`

## **11. Events & Callbacks**

| Event / Callback | Inherited | Description |
|------------------|-----------|-------------|
| `onClick` | Yes | Standard button click handler |
| `onFocus` | Yes | Focus event handler |
| `onBlur` | Yes | Blur event handler |

## **12. Styling**

* **Approach**: CSS Modules with SCSS
* **File**: `Button.module.scss`

### **CSS Classes**

* `.button` – Base button styles
* `.variant-primary` – Primary styling
* `.variant-secondary` – Secondary styling
* `.variant-danger` – Danger/destructive styling
* `.variant-success` – Success styling
* `.variant-outline` – Outlined styling
* `.variant-ghost` – Ghost/minimal styling
* `.size-sm` – Small size
* `.size-md` – Medium size
* `.size-lg` – Large size
* `.fullWidth` – Full width modifier
* `.loading` – Loading state

## **13. Accessibility Requirements**

* **Keyboard**: Focusable via Tab, activates on Enter/Space
* **ARIA**: Inherits native button semantics
* **Focus**: Clear focus ring
* **Screen Reader**: Announces button label and state

### **Improvements Needed**

* Add `aria-busy` when loading
* Add `aria-disabled` when disabled

## **14. Error Handling**

| Error Condition | Behaviour | Fallback |
|-----------------|-----------|----------|
| Invalid variant | Default to primary | No error |
| Invalid size | Default to md | No error |

## **15. Performance & Lifecycle Notes**

### **Loading State**

```tsx
// When loading is true, button is automatically disabled
// Loading spinner rendered with aria-hidden="true"
<Button loading disabled>Saving...</Button>
```

### **ForwardRef Pattern**

```tsx
// Component uses forwardRef for ref forwarding
const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  // ...
});
```

## **16. Usage Examples**

### **Basic Usage**

```tsx
import { Button } from '@/components/ui/primitives/Button';

<Button onClick={handleClick}>Click me</Button>
```

### **With Variants**

```tsx
<Button variant="danger" size="lg">Delete</Button>
<Button variant="outline">Cancel</Button>
<Button variant="ghost">More options</Button>
```

### **Loading State**

```tsx
<Button loading disabled>Saving...</Button>
```

### **Full Width**

```tsx
<Button fullWidth variant="primary">Submit Form</Button>
```

### **With Icon**

```tsx
<Button variant="secondary">
  <Icon icon="plus" size={16} />
  Add Item
</Button>
```

## **17. Features Summary**

### **Variants**

| Variant | Use Case |
|---------|----------|
| `primary` | Primary actions |
| `secondary` | Secondary actions |
| `danger` | Destructive actions |
| `success` | Success/confirmation |
| `outline` | Subtle actions |
| `ghost` | Minimal styling |

### **Sizes**

| Size | Padding | Font Size |
|------|---------|-----------|
| `sm` | Compact | Small |
| `md` | Standard | Default |
| `lg` | Spacious | Large |

## **18. Testing Considerations**

### **Unit Tests**

* Renders with correct variant class
* Renders with correct size class
* Shows loading spinner when loading
* Disabled when loading
* Full width applies correctly
* Click handler fires

### **Mocking**

* No external dependencies to mock

### **Edge Cases**

* Rapid clicks
* Long content
* Icon-only button

## **19. Out of Scope / Non-Goals**

* **Link styling**: Use Link component
* **Toggle behavior**: Use Switch or Checkbox
* **Split button**: Separate component
* **Icon button**: Separate component

## **20. Related Components & System Context**

### **Used By**

* Most interactive components throughout the application

### **Siblings**

* `Input`
* `Select`
* `Checkbox`

## **21. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
|----------|----------|---------------|-------|
| `Primary` | Default button | variant: primary | Base |
| `Secondary` | Secondary action | variant: secondary | Subtle |
| `Danger` | Destructive | variant: danger | Red styling |
| `Success` | Confirmation | variant: success | Green styling |
| `Outline` | Outlined | variant: outline | Border only |
| `Ghost` | Minimal | variant: ghost | No background |
| `Loading` | Loading state | loading: true | Spinner shown |
| `Sizes` | All sizes | sm, md, lg | Size comparison |
| `FullWidth` | Full width | fullWidth: true | Block display |

### **Controls (Args) Required**

* `variant` (select) – Button variant
* `size` (select) – Button size
* `loading` (boolean) – Loading state
* `disabled` (boolean) – Disabled state
* `fullWidth` (boolean) – Full width

### **Mocking Requirements**

*None – stateless component*

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Verify focus visible
* Check color contrast
* Verify disabled state announcement

### **Interaction Tests**

* Click handler
* Focus/blur
* Keyboard activation
