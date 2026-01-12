# **Component Specification: RadioGroup**

## **1. Component Name**

**`RadioGroup`**

## **2. Description**

A radio button group component built on Radix UI RadioGroup primitive.

* Provides accessible single-selection from a list of options
* Supports horizontal and vertical orientations
* Includes per-option helper text
* Full keyboard navigation support

## **3. Location**

```
src/components/ui/primitives/Radio/Radio.tsx
```

## **4. Component Type**

**UI** – Presentational component managed by Radix UI.

## **5. Props Interface**

```typescript
interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
  helperText?: string;
}

interface RadioGroupProps {
  options: RadioOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  size?: RadioSize;
  orientation?: RadioOrientation;
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

type RadioSize = 'sm' | 'md' | 'lg';
type RadioOrientation = 'horizontal' | 'vertical';
```

## **6. Props**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `options` | `RadioOption[]` | Yes | - | Array of radio options |
| `value` | `string` | No | - | Controlled selected value |
| `defaultValue` | `string` | No | - | Initial uncontrolled value |
| `onValueChange` | `(value: string) => void` | No | - | Selection change handler |
| `name` | `string` | No | - | Form field name |
| `size` | `RadioSize` | No | `'md'` | Radio button size |
| `orientation` | `RadioOrientation` | No | `'vertical'` | Layout direction |
| `label` | `string` | No | - | Group label |
| `error` | `string` | No | - | Error message |
| `helperText` | `string` | No | - | Helper text |
| `required` | `boolean` | No | `false` | Mark as required |
| `disabled` | `boolean` | No | `false` | Disable all options |

## **7. Data Requirements**

### **RadioOption Type**

```typescript
interface RadioOption {
  value: string;      // Unique value
  label: string;      // Display text
  disabled?: boolean; // Disable single option
  helperText?: string; // Per-option helper text
}
```

## **8. Internal State**

*None – controlled via Radix UI primitives.*

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
|-------------------|-------------|-------|
| Option selected | Filled indicator | Selected state |
| No selection | Empty indicators | Default state |
| `orientation === 'horizontal'` | Horizontal layout | Side by side |
| `orientation === 'vertical'` | Vertical layout | Stacked |
| `error` provided | Error styling + message | Error state |
| `disabled === true` | All options disabled | Non-interactive |
| Option disabled | Single option disabled | Per-option |

## **10. Dependencies**

### **External Libraries**

* `@radix-ui/react-radio-group`

## **11. Events & Callbacks**

| Event / Callback | Trigger | Description |
|------------------|---------|-------------|
| `onValueChange` | Selection changes | Called with new value |

## **12. Styling**

* **Approach**: CSS Modules with SCSS
* **File**: `Radio.module.scss`

### **CSS Classes**

* `.container` – Wrapper container
* `.group` – Radio group
* `.item` – Radio item wrapper
* `.radio` – Radio button
* `.indicator` – Selected indicator
* `.label` – Option label
* `.size-sm`, `.size-md`, `.size-lg` – Size variants
* `.orientation-horizontal`, `.orientation-vertical` – Layout options
* `.disabled`, `.itemDisabled` – Disabled states

## **13. Accessibility Requirements**

* **Keyboard**: Arrow keys navigate, Space/Enter select
* **ARIA**: Proper radiogroup semantics via Radix
* **Focus**: Clear focus ring
* **Screen Reader**: Announces options and selection

### **Improvements Needed**

* None – Radix provides full accessibility

## **14. Error Handling**

| Error Condition | Behaviour | Fallback |
|-----------------|-----------|----------|
| Empty options | Empty group | No crash |
| Invalid value | No selection | Graceful |

## **15. Performance & Lifecycle Notes**

### **Controlled Usage**

```tsx
const [selected, setSelected] = useState('option1');

<RadioGroup
  options={options}
  value={selected}
  onValueChange={setSelected}
/>
```

## **16. Usage Examples**

### **Basic Usage**

```tsx
import { RadioGroup } from '@/components/ui/primitives/Radio';

<RadioGroup
  label="Select an option"
  options={[
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ]}
  value={selected}
  onValueChange={setSelected}
/>
```

### **Horizontal Layout**

```tsx
<RadioGroup
  label="View mode"
  orientation="horizontal"
  options={[
    { value: 'grid', label: 'Grid' },
    { value: 'list', label: 'List' },
  ]}
  value={viewMode}
  onValueChange={setViewMode}
/>
```

### **With Per-Option Helper Text**

```tsx
<RadioGroup
  label="Subscription plan"
  options={[
    { value: 'free', label: 'Free', helperText: 'Basic features' },
    { value: 'pro', label: 'Pro', helperText: 'All features, $10/mo' },
    { value: 'enterprise', label: 'Enterprise', helperText: 'Custom pricing' },
  ]}
  value={plan}
  onValueChange={setPlan}
/>
```

### **With Disabled Option**

```tsx
<RadioGroup
  label="Priority"
  options={[
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High', disabled: true },
  ]}
  value={priority}
  onValueChange={setPriority}
/>
```

## **17. Features Summary**

### **Exports**

| Export | Purpose |
|--------|---------|
| `RadioGroup` | Main component |
| `Radio` | Alias for RadioGroup |

### **Orientations**

| Orientation | Layout |
|-------------|--------|
| `vertical` | Stacked options |
| `horizontal` | Side-by-side options |

### **Sizes**

| Size | Use Case |
|------|----------|
| `sm` | Compact forms |
| `md` | Standard forms |
| `lg` | Prominent options |

## **18. Testing Considerations**

### **Unit Tests**

* Renders all options
* Selection changes value
* Keyboard navigation works
* Disabled options not selectable
* Group disabled blocks all
* Error state displays

### **Mocking**

* No external dependencies to mock

### **Edge Cases**

* Empty options array
* Single option
* All options disabled
* Long option labels

## **19. Out of Scope / Non-Goals**

* **Multiple selection**: Use Checkbox
* **Button style**: Use ToggleGroup
* **Custom icons**: Not supported
* **Grouped options**: Not supported

## **20. Related Components & System Context**

### **Siblings**

* `Checkbox`
* `Switch`
* `Select`
* `ToggleGroup`

### **Used In**

* Settings forms
* Filters
* Preference selectors

## **21. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
|----------|----------|---------------|-------|
| `Default` | Basic group | Standard options | Base state |
| `Horizontal` | Horizontal layout | orientation: horizontal | Side by side |
| `WithHelperText` | Per-option helpers | helperText per option | Descriptions |
| `WithError` | Error state | error provided | Error styling |
| `DisabledOption` | Single disabled | Option with disabled | Per-option |
| `DisabledGroup` | All disabled | disabled: true | Group level |
| `Sizes` | All sizes | sm, md, lg | Size comparison |

### **Controls (Args) Required**

* `options` (object) – Options array
* `label` (text) – Group label
* `orientation` (select) – Layout direction
* `size` (select) – Radio size
* `error` (text) – Error message
* `disabled` (boolean) – Disabled state

### **Mocking Requirements**

*None – stateless component*

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Verify keyboard navigation
* Check option announcement
* Verify focus visible

### **Interaction Tests**

* Click option
* Arrow key navigation
* Space/Enter selection
