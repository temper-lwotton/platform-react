# **Component Specification: Label**

## **1. Component Name**

**`Label`**

## **2. Description**

A simple label component built on Radix UI Label primitive.

* Provides accessible form labels
* Proper association to form controls
* Supports explicit and implicit labeling
* Click-to-focus functionality

## **3. Location**

```
src/components/ui/primitives/Label/Label.tsx
```

## **4. Component Type**

**UI** – Stateless presentational component.

## **5. Props Interface**

```typescript
interface LabelProps extends RadixLabel.LabelProps {
  children: React.ReactNode;
}
```

## **6. Props**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `children` | `ReactNode` | Yes | - | Label text content |
| `htmlFor` | `string` | No | - | ID of associated form control |
| `className` | `string` | No | `''` | Additional CSS classes |

## **7. Data Requirements**

*No external data – purely presentational.*

## **8. Internal State**

*None – stateless component.*

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
|-------------------|-------------|-------|
| `htmlFor` provided | Explicit association | Click focuses control |
| No `htmlFor` | Implicit association | Wrapping input |
| With children | Label text | Any React node |

## **10. Dependencies**

### **External Libraries**

* `@radix-ui/react-label`

## **11. Events & Callbacks**

*No custom events – inherits LabelElement events.*

## **12. Styling**

* **Approach**: CSS Modules with SCSS
* **File**: `Label.module.scss`

### **CSS Classes**

* `.label` – Base label styles

## **13. Accessibility Requirements**

* **Click**: Clicking label focuses associated control
* **Screen Reader**: Announces label with control
* **ARIA**: Proper label-control association via Radix

### **Improvements Needed**

* None – Radix provides full accessibility

## **14. Error Handling**

| Error Condition | Behaviour | Fallback |
|-----------------|-----------|----------|
| Missing `htmlFor` | Implicit labeling works | Graceful |
| Invalid `htmlFor` | No association | Click does nothing |

## **15. Performance & Lifecycle Notes**

### **Association Methods**

```tsx
// Explicit association (preferred)
<Label htmlFor="email">Email Address</Label>
<input id="email" type="email" />

// Implicit association
<Label>
  Email Address
  <input type="email" />
</Label>
```

## **16. Usage Examples**

### **With htmlFor**

```tsx
import { Label } from '@/components/ui/primitives/Label';

<Label htmlFor="email">Email Address</Label>
<input id="email" type="email" />
```

### **With Input Component**

```tsx
<div>
  <Label htmlFor="username">Username</Label>
  <Input id="username" placeholder="Enter username" />
</div>
```

### **As Wrapper**

```tsx
<Label>
  Email Address
  <input type="email" />
</Label>
```

## **17. Features Summary**

### **Use Cases**

| Scenario | Recommended |
|----------|-------------|
| Custom label positioning | Use standalone Label |
| Multiple labels for one control | Use standalone Label |
| Labels for non-standard elements | Use standalone Label |
| Standard form fields | Use built-in label props |

### **Note**

Most form components (`Input`, `Select`, `Textarea`, etc.) include built-in label support via their `label` prop. Use this standalone `Label` component only for special cases.

## **18. Testing Considerations**

### **Unit Tests**

* Renders children
* htmlFor attribute applied
* Click focuses associated input
* Implicit labeling works

### **Mocking**

* No external dependencies to mock

### **Edge Cases**

* Long label text
* Multiple labels for same control
* Nested elements in label

## **19. Out of Scope / Non-Goals**

* **Required indicator**: Add via children
* **Error styling**: Add via className
* **Helper text**: Separate element
* **Floating labels**: Separate component

## **20. Related Components & System Context**

### **Used With**

* `Input`
* `Select`
* `Checkbox`
* `RadioGroup`
* `Switch`
* `Textarea`

### **Siblings**

* Other form primitives

## **21. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
|----------|----------|---------------|-------|
| `Default` | Basic label | With htmlFor | Base state |
| `AsWrapper` | Implicit association | Wrapping input | Alternative |
| `CustomStyling` | With className | Custom styles | Styled |

### **Controls (Args) Required**

* `children` (text) – Label text
* `htmlFor` (text) – Associated control ID

### **Mocking Requirements**

*None – stateless component*

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Verify label-input association
* Check click-to-focus

### **Interaction Tests**

* Click label
* Verify focus moves
