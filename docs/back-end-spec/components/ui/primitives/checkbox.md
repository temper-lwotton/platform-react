# **Component Specification: Checkbox**

## **1. Component Name**

**`Checkbox`**

## **2. Description**

A checkbox input component built on Radix UI Checkbox primitive.

* Provides accessible boolean selection
* Supports labels, helper text, and error states
* Includes indeterminate state support
* Full keyboard navigation

## **3. Location**

```
src/components/ui/primitives/Checkbox/Checkbox.tsx
```

## **4. Component Type**

**UI** – Presentational component managed by Radix UI.

## **5. Props Interface**

```typescript
interface CheckboxProps extends Omit<CheckboxPrimitive.CheckboxProps, 'asChild'> {
  size?: CheckboxSize;
  label?: React.ReactNode;
  helperText?: string;
  error?: string;
}

type CheckboxSize = 'sm' | 'md' | 'lg';
```

## **6. Props**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `size` | `CheckboxSize` | No | `'md'` | Checkbox size |
| `label` | `ReactNode` | No | - | Label content |
| `helperText` | `string` | No | - | Helper text below |
| `error` | `string` | No | - | Error message |
| `checked` | `boolean \| 'indeterminate'` | No | - | Controlled checked state |
| `defaultChecked` | `boolean` | No | - | Initial uncontrolled state |
| `onCheckedChange` | `(checked: boolean) => void` | No | - | Change handler |
| `disabled` | `boolean` | No | `false` | Disable checkbox |

## **7. Data Requirements**

*No external data – purely presentational.*

## **8. Internal State**

*None – controlled via Radix UI primitives.*

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
|-------------------|-------------|-------|
| `checked === true` | Check icon | Filled state |
| `checked === false` | Empty box | Default state |
| `checked === 'indeterminate'` | Minus icon | Partial selection |
| `error` provided | Error styling + message | Error state |
| `disabled === true` | Disabled styling | Non-interactive |
| Click label | Toggles checkbox | Label association |

## **10. Dependencies**

### **Child Components**

* `Icon` – Check icon indicator

### **External Libraries**

* `@radix-ui/react-checkbox`

## **11. Events & Callbacks**

| Event / Callback | Trigger | Description |
|------------------|---------|-------------|
| `onCheckedChange` | State changes | Called with new boolean/indeterminate value |

## **12. Styling**

* **Approach**: CSS Modules with SCSS
* **File**: `Checkbox.module.scss`

### **CSS Classes**

* `.container` – Wrapper container
* `.wrapper` – Checkbox + label wrapper
* `.root` – Checkbox root
* `.indicator` – Check indicator
* `.label` – Label text
* `.size-sm`, `.size-md`, `.size-lg` – Size variants
* `.error` – Error state

## **13. Accessibility Requirements**

* **Keyboard**: Space toggles, Tab focuses
* **ARIA**: Proper checkbox semantics via Radix
* **Focus**: Clear focus ring
* **Screen Reader**: Announces state and label

### **Improvements Needed**

* None – Radix provides full accessibility

## **14. Error Handling**

| Error Condition | Behaviour | Fallback |
|-----------------|-----------|----------|
| Invalid size | Default to 'md' | No error |

## **15. Performance & Lifecycle Notes**

### **Controlled Usage**

```tsx
const [checked, setChecked] = useState(false);

<Checkbox
  checked={checked}
  onCheckedChange={setChecked}
  label="Enable feature"
/>
```

### **Indeterminate Pattern**

```tsx
// For "select all" scenarios
<Checkbox
  checked={allSelected ? true : someSelected ? 'indeterminate' : false}
  onCheckedChange={handleSelectAll}
  label="Select all items"
/>
```

## **16. Usage Examples**

### **Basic Usage**

```tsx
import { Checkbox } from '@/components/ui/primitives/Checkbox';

<Checkbox
  label="I agree to the terms and conditions"
  checked={agreed}
  onCheckedChange={setAgreed}
/>
```

### **With Helper Text**

```tsx
<Checkbox
  label="Receive marketing emails"
  helperText="You can unsubscribe at any time"
  checked={marketingEmails}
  onCheckedChange={setMarketingEmails}
/>
```

### **With Error**

```tsx
<Checkbox
  label="Accept privacy policy"
  error="You must accept the privacy policy to continue"
  checked={accepted}
  onCheckedChange={setAccepted}
/>
```

### **Different Sizes**

```tsx
<Checkbox size="sm" label="Small checkbox" />
<Checkbox size="md" label="Medium checkbox" />
<Checkbox size="lg" label="Large checkbox" />
```

### **Indeterminate State**

```tsx
<Checkbox
  label="Select all items"
  checked={allSelected ? true : someSelected ? 'indeterminate' : false}
  onCheckedChange={handleSelectAll}
/>
```

## **17. Features Summary**

### **States**

| State | Visual |
|-------|--------|
| Unchecked | Empty box |
| Checked | Check icon |
| Indeterminate | Minus icon |
| Disabled | Faded styling |

### **Sizes**

| Size | Use Case |
|------|----------|
| `sm` | Compact lists |
| `md` | Standard forms |
| `lg` | Prominent options |

## **18. Testing Considerations**

### **Unit Tests**

* Toggles on click
* Toggles on space key
* Shows check when checked
* Shows error message
* Label click toggles
* Disabled prevents toggle

### **Mocking**

* No external dependencies to mock

### **Edge Cases**

* Rapid toggling
* Indeterminate to checked
* Long label text

## **19. Out of Scope / Non-Goals**

* **Radio behavior**: Use RadioGroup
* **Toggle switch**: Use Switch
* **Group validation**: Handle in form

## **20. Related Components & System Context**

### **Siblings**

* `Switch`
* `RadioGroup`

### **Used With**

* Form components
* List selections
* Settings

## **21. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
|----------|----------|---------------|-------|
| `Unchecked` | Default | checked: false | Empty |
| `Checked` | Selected | checked: true | Check shown |
| `Indeterminate` | Partial | checked: 'indeterminate' | Minus shown |
| `WithLabel` | Labeled | label provided | Label shown |
| `WithError` | Error | error provided | Error styling |
| `Disabled` | Disabled | disabled: true | Non-interactive |
| `Sizes` | All sizes | sm, md, lg | Size comparison |

### **Controls (Args) Required**

* `checked` (boolean/indeterminate) – Checked state
* `label` (text) – Label text
* `helperText` (text) – Helper text
* `error` (text) – Error message
* `size` (select) – Checkbox size
* `disabled` (boolean) – Disabled state

### **Mocking Requirements**

*None – stateless component*

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Verify keyboard navigation
* Check state announcement
* Verify label association

### **Interaction Tests**

* Click to toggle
* Space key toggle
* Label click
