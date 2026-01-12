# **Component Specification: Textarea**

## **1. Component Name**

**`Textarea`**

## **2. Description**

A multi-line text input component with support for labels, helper text, error states, and character counting.

* Built as a forwardRef component with automatic ID generation
* Supports resize control
* Includes character count display
* Extends native HTML textarea attributes

## **3. Location**

```
src/components/ui/primitives/Textarea/Textarea.tsx
```

## **4. Component Type**

**UI** – Stateless presentational component (controlled via props).

## **5. Props Interface**

```typescript
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  size?: TextareaSize;
  variant?: TextareaVariant;
  fullWidth?: boolean;
  label?: string;
  helperText?: string;
  error?: string;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
  maxLength?: number;
  showCharCount?: boolean;
}

type TextareaSize = 'sm' | 'md' | 'lg';
type TextareaVariant = 'default' | 'error' | 'success';
```

## **6. Props**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `size` | `TextareaSize` | No | `'md'` | Component size |
| `variant` | `TextareaVariant` | No | `'default'` | Visual variant |
| `fullWidth` | `boolean` | No | `false` | Expand to container |
| `label` | `string` | No | - | Label text |
| `helperText` | `string` | No | - | Helper text below |
| `error` | `string` | No | - | Error message |
| `resize` | `string` | No | `'vertical'` | Resize behavior |
| `maxLength` | `number` | No | - | Maximum characters |
| `showCharCount` | `boolean` | No | `false` | Show character counter |

## **7. Data Requirements**

*No external data – purely presentational.*

## **8. Internal State**

*None – character count derived from controlled `value` prop.*

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
|-------------------|-------------|-------|
| `error` provided | Error variant + message | Overrides variant |
| `label` provided | Label above textarea | With association |
| `showCharCount === true` | Character counter | Shows currentLength/maxLength |
| `resize === 'none'` | No resize handle | Fixed size |
| `disabled === true` | Disabled styling | Non-interactive |
| `required === true` | Asterisk after label | Visual indicator |

## **10. Dependencies**

### **External Libraries**

* React `forwardRef`, `TextareaHTMLAttributes`

## **11. Events & Callbacks**

| Event / Callback | Inherited | Description |
|------------------|-----------|-------------|
| `onChange` | Yes | Text change handler |
| `onFocus` | Yes | Focus event handler |
| `onBlur` | Yes | Blur event handler |

## **12. Styling**

* **Approach**: CSS Modules with SCSS
* **File**: `Textarea.module.scss`

### **CSS Classes**

* `.container` – Wrapper container
* `.textarea` – Base textarea styles
* `.label` – Label text
* `.helperText` – Helper/error text
* `.charCount` – Character counter
* `.size-sm`, `.size-md`, `.size-lg` – Size variants
* `.variant-default`, `.variant-error`, `.variant-success` – Visual variants
* `.resize-none`, `.resize-vertical`, `.resize-horizontal`, `.resize-both` – Resize options
* `.disabled`, `.fullWidth` – State modifiers

## **13. Accessibility Requirements**

* **Keyboard**: Standard textarea navigation
* **ARIA**: Auto-generated ID for label association
* **Focus**: Clear focus ring
* **Screen Reader**: Label and error text announced

### **Improvements Needed**

* Add `aria-describedby` for helper/error text
* Announce character count

## **14. Error Handling**

| Error Condition | Behaviour | Fallback |
|-----------------|-----------|----------|
| Invalid variant | Default to 'default' | No error |
| Invalid size | Default to 'md' | No error |

## **15. Performance & Lifecycle Notes**

### **Character Count Display**

```tsx
// Shows currentLength/maxLength format
{showCharCount && maxLength && (
  <span className={styles.charCount}>
    {value?.length ?? 0}/{maxLength}
  </span>
)}
```

### **Error Priority**

```tsx
// Error prop automatically sets variant to 'error'
const effectiveVariant = error ? 'error' : variant;
```

## **16. Usage Examples**

### **Basic Usage**

```tsx
import { Textarea } from '@/components/ui/primitives/Textarea';

<Textarea
  placeholder="Enter your message"
  value={message}
  onChange={(e) => setMessage(e.target.value)}
/>
```

### **With Label and Character Count**

```tsx
<Textarea
  label="Description"
  maxLength={500}
  showCharCount
  value={description}
  onChange={(e) => setDescription(e.target.value)}
/>
```

### **With Error State**

```tsx
<Textarea
  label="Bio"
  error="Bio is required"
  value={bio}
  onChange={(e) => setBio(e.target.value)}
/>
```

### **Disable Resize**

```tsx
<Textarea
  label="Fixed size textarea"
  resize="none"
  rows={4}
/>
```

### **Full Width with Helper**

```tsx
<Textarea
  fullWidth
  label="Feedback"
  helperText="Your feedback helps us improve"
  rows={6}
/>
```

## **17. Features Summary**

### **Variants**

| Variant | Use Case |
|---------|----------|
| `default` | Normal state |
| `error` | Validation error |
| `success` | Valid input |

### **Resize Options**

| Resize | Behavior |
|--------|----------|
| `none` | Fixed size |
| `vertical` | Vertical only (default) |
| `horizontal` | Horizontal only |
| `both` | Both directions |

### **Sizes**

| Size | Use Case |
|------|----------|
| `sm` | Compact forms |
| `md` | Standard forms |
| `lg` | Large text areas |

## **18. Testing Considerations**

### **Unit Tests**

* Renders with label
* Shows error message
* Shows character count
* Respects maxLength
* Resize option works
* Full width applies

### **Mocking**

* No external dependencies to mock

### **Edge Cases**

* Very long text
* At maxLength limit
* Over maxLength (paste)
* Empty value

## **19. Out of Scope / Non-Goals**

* **Rich text**: Use rich text editor
* **Auto-resize**: Not built-in
* **Markdown preview**: Separate component
* **Code editing**: Use code editor

## **20. Related Components & System Context**

### **Siblings**

* `Input`
* `Select`

### **Used In**

* Post editors
* Comment forms
* Feedback forms

## **21. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
|----------|----------|---------------|-------|
| `Default` | Basic textarea | No props | Base state |
| `WithLabel` | Labeled | label provided | Label shown |
| `WithError` | Error state | error provided | Error styling |
| `WithCharCount` | Character counter | showCharCount: true | Counter shown |
| `NoResize` | Fixed size | resize: none | No handle |
| `FullWidth` | Full width | fullWidth: true | Expands |
| `Sizes` | All sizes | sm, md, lg | Size comparison |

### **Controls (Args) Required**

* `label` (text) – Label text
* `placeholder` (text) – Placeholder text
* `helperText` (text) – Helper text
* `error` (text) – Error message
* `size` (select) – Textarea size
* `resize` (select) – Resize option
* `maxLength` (number) – Max characters
* `showCharCount` (boolean) – Show counter
* `fullWidth` (boolean) – Full width

### **Mocking Requirements**

*None – stateless component*

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Verify label association
* Check error announcement
* Verify focus visible

### **Interaction Tests**

* Type in textarea
* Check character count updates
* Resize handle
