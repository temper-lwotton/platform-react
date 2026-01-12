# **Component Specification: Input**

## **1. Component Name**

**`Input`**

## **2. Description**

A flexible text input component with support for labels, helper text, error states, and icon adornments.

* Built as a forwardRef component with automatic ID generation
* Supports left and right icons
* Includes label and helper text integration
* Extends native HTML input attributes

## **3. Location**

```
src/components/ui/primitives/Input/Input.tsx
```

## **4. Component Type**

**UI** – Stateless presentational component (controlled via props).

## **5. Props Interface**

```typescript
interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: InputSize;
  variant?: InputVariant;
  fullWidth?: boolean;
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

type InputSize = 'sm' | 'md' | 'lg';
type InputVariant = 'default' | 'error' | 'success';
```

## **6. Props**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `size` | `InputSize` | No | `'md'` | Input size |
| `variant` | `InputVariant` | No | `'default'` | Visual variant |
| `fullWidth` | `boolean` | No | `false` | Expand to container width |
| `label` | `string` | No | - | Label text above input |
| `helperText` | `string` | No | - | Helper text below input |
| `error` | `string` | No | - | Error message (overrides variant) |
| `leftIcon` | `ReactNode` | No | - | Icon on left side |
| `rightIcon` | `ReactNode` | No | - | Icon on right side |

## **7. Data Requirements**

*No external data – purely presentational.*

## **8. Internal State**

*None – controlled via props.*

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
|-------------------|-------------|-------|
| `error` provided | Error variant + message | Overrides variant prop |
| `label` provided | Label above input | With htmlFor association |
| `required === true` | Asterisk after label | Visual indicator |
| `leftIcon` provided | Icon on left | Input padding adjusted |
| `rightIcon` provided | Icon on right | Input padding adjusted |
| `disabled === true` | Disabled styling | Non-interactive |

## **10. Dependencies**

### **External Libraries**

* React `forwardRef`, `InputHTMLAttributes`

## **11. Events & Callbacks**

| Event / Callback | Inherited | Description |
|------------------|-----------|-------------|
| `onChange` | Yes | Input value change handler |
| `onFocus` | Yes | Focus event handler |
| `onBlur` | Yes | Blur event handler |

## **12. Styling**

* **Approach**: CSS Modules with SCSS
* **File**: `Input.module.scss`

### **CSS Classes**

* `.container` – Wrapper container
* `.input` – Base input styles
* `.label` – Label text
* `.helperText` – Helper/error text
* `.iconWrapper` – Icon container
* `.size-sm`, `.size-md`, `.size-lg` – Size variants
* `.variant-default`, `.variant-error`, `.variant-success` – Visual variants
* `.hasLeftIcon`, `.hasRightIcon` – Icon padding modifiers
* `.disabled`, `.fullWidth` – State modifiers

## **13. Accessibility Requirements**

* **Keyboard**: Standard input navigation
* **ARIA**: Auto-generated ID for label association
* **Focus**: Clear focus ring
* **Screen Reader**: Label, error, and helper text announced

### **Improvements Needed**

* Add `aria-describedby` for helper/error text
* Add `aria-invalid` for error state

## **14. Error Handling**

| Error Condition | Behaviour | Fallback |
|-----------------|-----------|----------|
| Invalid variant | Default to 'default' | No error |
| Invalid size | Default to 'md' | No error |

## **15. Performance & Lifecycle Notes**

### **Auto ID Generation**

```typescript
// Unique ID generated if not provided
const id = props.id ?? `input-${useId()}`;
```

### **Error Priority**

```typescript
// Error prop automatically sets variant to 'error'
const effectiveVariant = error ? 'error' : variant;
```

## **16. Usage Examples**

### **Basic Usage**

```tsx
import { Input } from '@/components/ui/primitives/Input';

<Input
  placeholder="Enter your name"
  value={name}
  onChange={(e) => setName(e.target.value)}
/>
```

### **With Label and Helper Text**

```tsx
<Input
  label="Email Address"
  helperText="We'll never share your email"
  type="email"
  required
/>
```

### **With Error State**

```tsx
<Input
  label="Password"
  type="password"
  error="Password must be at least 8 characters"
/>
```

### **With Icons**

```tsx
<Input
  placeholder="Search..."
  leftIcon={<Icon icon="search" size={16} />}
  rightIcon={
    <button onClick={clearSearch}>
      <Icon icon="x" size={14} />
    </button>
  }
/>
```

### **Full Width**

```tsx
<Input fullWidth label="Full Name" />
```

## **17. Features Summary**

### **Variants**

| Variant | Use Case |
|---------|----------|
| `default` | Normal state |
| `error` | Validation error |
| `success` | Valid input |

### **Sizes**

| Size | Height | Use Case |
|------|--------|----------|
| `sm` | Small | Compact forms |
| `md` | Medium | Standard forms |
| `lg` | Large | Hero inputs |

### **Label Features**

* Automatic label-input association
* Required asterisk indicator
* Helper text below input
* Error message display

## **18. Testing Considerations**

### **Unit Tests**

* Renders with label
* Shows error message
* Shows helper text
* Renders left/right icons
* Full width applies
* Disabled state works
* Required asterisk shows

### **Mocking**

* No external dependencies to mock

### **Edge Cases**

* Long label text
* Long error message
* Both icons present
* Empty value

## **19. Out of Scope / Non-Goals**

* **Multi-line**: Use Textarea
* **Rich text**: Use rich text editor
* **Masked input**: Separate component
* **Auto-complete**: Separate component

## **20. Related Components & System Context**

### **Siblings**

* `Button`
* `Textarea`
* `Select`

### **Used With**

* Form components
* Search interfaces

## **21. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
|----------|----------|---------------|-------|
| `Default` | Basic input | No props | Base state |
| `WithLabel` | Labeled input | label provided | Label shown |
| `WithError` | Error state | error provided | Error styling |
| `WithIcons` | Icon adornments | leftIcon, rightIcon | Both icons |
| `Sizes` | All sizes | sm, md, lg | Size comparison |
| `FullWidth` | Full width | fullWidth: true | Expands |
| `Disabled` | Disabled | disabled: true | Non-interactive |

### **Controls (Args) Required**

* `label` (text) – Label text
* `placeholder` (text) – Placeholder text
* `helperText` (text) – Helper text
* `error` (text) – Error message
* `size` (select) – Input size
* `fullWidth` (boolean) – Full width
* `disabled` (boolean) – Disabled state

### **Mocking Requirements**

*None – stateless component*

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Verify label association
* Check error announcement
* Verify focus visible

### **Interaction Tests**

* Type in input
* Clear input
* Focus/blur
