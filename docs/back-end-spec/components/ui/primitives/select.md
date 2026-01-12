# **Component Specification: Select**

## **1. Component Name**

**`Select`**

## **2. Description**

A dropdown select component built on Radix UI Select primitive.

* Provides accessible selection from a list of options
* Supports labels, helper text, and error states
* Includes type-ahead search functionality
* Full keyboard navigation support

## **3. Location**

```
src/components/ui/primitives/Select/Select.tsx
```

## **4. Component Type**

**UI** – Presentational component managed by Radix UI.

## **5. Props Interface**

```typescript
interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  size?: SelectSize;
  fullWidth?: boolean;
  label?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
}

type SelectSize = 'sm' | 'md' | 'lg';
```

## **6. Props**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `options` | `SelectOption[]` | Yes | - | Array of selectable options |
| `value` | `string` | No | - | Controlled selected value |
| `defaultValue` | `string` | No | - | Initial uncontrolled value |
| `onValueChange` | `(value: string) => void` | No | - | Selection change handler |
| `placeholder` | `string` | No | `'Select an option...'` | Placeholder text |
| `disabled` | `boolean` | No | `false` | Disable selection |
| `size` | `SelectSize` | No | `'md'` | Component size |
| `fullWidth` | `boolean` | No | `false` | Expand to container width |
| `label` | `string` | No | - | Label text |
| `helperText` | `string` | No | - | Helper text below select |
| `error` | `string` | No | - | Error message |
| `required` | `boolean` | No | `false` | Mark as required |

## **7. Data Requirements**

### **SelectOption Type**

```typescript
interface SelectOption {
  value: string;   // Unique value for the option
  label: string;   // Display text
  disabled?: boolean; // Disable individual option
}
```

### **Example Data**

```typescript
const options: SelectOption[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived', disabled: true },
];
```

## **8. Internal State**

*None – controlled via Radix UI primitives.*

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
|-------------------|-------------|-------|
| No value selected | Placeholder shown | Default state |
| Value selected | Selected label shown | In trigger |
| Dropdown open | Options list visible | Below trigger |
| Option disabled | Grayed out, not selectable | Per-option |
| `error` provided | Error styling + message | Error state |
| `disabled === true` | Disabled styling | Non-interactive |

## **10. Dependencies**

### **Child Components**

* `Icon` – Chevron and check icons

### **External Libraries**

* `@radix-ui/react-select`

## **11. Events & Callbacks**

| Event / Callback | Trigger | Description |
|------------------|---------|-------------|
| `onValueChange` | Selection changes | Called with new value |

## **12. Styling**

* **Approach**: CSS Modules with SCSS
* **File**: `Select.module.scss`

### **CSS Classes**

* `.container` – Wrapper container
* `.trigger` – Trigger button
* `.content` – Dropdown content
* `.viewport` – Scrollable viewport
* `.item` – Option item
* `.indicator` – Check indicator
* `.size-sm`, `.size-md`, `.size-lg` – Size variants
* `.error`, `.fullWidth` – State modifiers

## **13. Accessibility Requirements**

* **Keyboard**: Arrow keys navigate, Enter/Space select
* **ARIA**: Proper combobox semantics via Radix
* **Focus**: Clear focus ring
* **Screen Reader**: Announces options and selection

### **Improvements Needed**

* None – Radix provides full accessibility

## **14. Error Handling**

| Error Condition | Behaviour | Fallback |
|-----------------|-----------|----------|
| Empty options | Empty dropdown | No crash |
| Invalid value | No selection shown | Placeholder |

## **15. Performance & Lifecycle Notes**

### **Type-Ahead Search**

* Radix provides built-in type-ahead
* Typing jumps to matching options

### **Scroll Management**

* Long lists scroll within viewport
* Selected item scrolled into view

## **16. Usage Examples**

### **Basic Usage**

```tsx
import { Select } from '@/components/ui/primitives/Select';

<Select
  options={[
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
  ]}
  value={selected}
  onValueChange={setSelected}
  placeholder="Choose an option"
/>
```

### **With Label and Validation**

```tsx
<Select
  label="Status"
  options={statusOptions}
  value={status}
  onValueChange={setStatus}
  error={errors.status}
  required
/>
```

### **Full Width with Helper Text**

```tsx
<Select
  fullWidth
  label="Category"
  helperText="Select the primary category for this post"
  options={categories}
  value={category}
  onValueChange={setCategory}
/>
```

## **17. Features Summary**

### **Sizes**

| Size | Height | Use Case |
|------|--------|----------|
| `sm` | Small | Compact forms |
| `md` | Medium | Standard forms |
| `lg` | Large | Prominent selects |

### **Label Features**

* Automatic label association
* Required asterisk indicator
* Helper text below
* Error message display

### **Option Features**

* Per-option disable
* Check indicator for selected
* Type-ahead search

## **18. Testing Considerations**

### **Unit Tests**

* Renders options
* Selection changes value
* Disabled options not selectable
* Placeholder shows when no value
* Error state displays
* Label renders correctly

### **Mocking**

* No external dependencies to mock

### **Edge Cases**

* Empty options array
* Many options (scroll)
* Long option labels
* All options disabled

## **19. Out of Scope / Non-Goals**

* **Multi-select**: Separate component
* **Searchable**: Separate combobox
* **Grouped options**: Not supported
* **Custom option rendering**: Not supported

## **20. Related Components & System Context**

### **Siblings**

* `Input`
* `RadioGroup`
* `Checkbox`

### **Used With**

* Forms
* Filters
* Settings panels

## **21. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
|----------|----------|---------------|-------|
| `Default` | Basic select | Standard options | Base state |
| `WithLabel` | Labeled | label provided | Label shown |
| `WithError` | Error state | error provided | Error styling |
| `Sizes` | All sizes | sm, md, lg | Size comparison |
| `Disabled` | Disabled | disabled: true | Non-interactive |
| `DisabledOptions` | Some disabled | Options with disabled | Per-option |
| `FullWidth` | Full width | fullWidth: true | Expands |

### **Controls (Args) Required**

* `options` (object) – Options array
* `placeholder` (text) – Placeholder text
* `label` (text) – Label text
* `error` (text) – Error message
* `size` (select) – Select size
* `fullWidth` (boolean) – Full width
* `disabled` (boolean) – Disabled state

### **Mocking Requirements**

*None – stateless component*

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Verify keyboard navigation
* Check option announcement
* Verify focus visible

### **Interaction Tests**

* Open dropdown
* Select option
* Keyboard navigation
* Type-ahead search
