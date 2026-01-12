# **Component Specification: ToggleGroup**

## **1. Component Name**

**`ToggleGroup`**

## **2. Description**

A group of toggle buttons built on Radix UI ToggleGroup primitive.

* Supports single or multiple selection modes
* Button-style selection interface
* Includes icon and label support
* Configurable orientations

## **3. Location**

```
src/components/ui/primitives/ToggleGroup/ToggleGroup.tsx
```

## **4. Component Type**

**UI** – Presentational component managed by Radix UI.

## **5. Props Interface**

```typescript
interface ToggleOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface ToggleGroupSingleProps {
  type: 'single';
  options: ToggleOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  size?: ToggleGroupSize;
  orientation?: ToggleGroupOrientation;
  label?: string;
  disabled?: boolean;
  className?: string;
}

interface ToggleGroupMultipleProps {
  type: 'multiple';
  options: ToggleOption[];
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  // ... same other props
}

type ToggleGroupProps = ToggleGroupSingleProps | ToggleGroupMultipleProps;
type ToggleGroupSize = 'sm' | 'md' | 'lg';
type ToggleGroupOrientation = 'horizontal' | 'vertical';
```

## **6. Props**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `type` | `'single' \| 'multiple'` | Yes | `'multiple'` | Selection mode |
| `options` | `ToggleOption[]` | Yes | - | Toggle options |
| `value` | `string \| string[]` | No | - | Controlled selected value(s) |
| `defaultValue` | `string \| string[]` | No | - | Initial uncontrolled value(s) |
| `onValueChange` | `function` | No | - | Selection change handler |
| `size` | `ToggleGroupSize` | No | `'md'` | Button size |
| `orientation` | `ToggleGroupOrientation` | No | `'horizontal'` | Layout direction |
| `label` | `string` | No | - | Group label |
| `disabled` | `boolean` | No | `false` | Disable all toggles |

## **7. Data Requirements**

### **ToggleOption Type**

```typescript
interface ToggleOption {
  value: string;       // Unique identifier
  label: string;       // Display text
  icon?: ReactNode;    // Optional icon
  disabled?: boolean;  // Disable single option
}
```

## **8. Internal State**

*None – managed by Radix UI (or controlled via props).*

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
|-------------------|-------------|-------|
| `type === 'single'` | Radio-like behavior | One selection |
| `type === 'multiple'` | Checkbox-like behavior | Multiple selections |
| Option selected | Filled button | Active state |
| `orientation === 'horizontal'` | Side by side | Row layout |
| `orientation === 'vertical'` | Stacked | Column layout |
| `disabled === true` | All disabled | Non-interactive |

## **10. Dependencies**

### **External Libraries**

* `@radix-ui/react-toggle-group`

## **11. Events & Callbacks**

| Event / Callback | Trigger | Description |
|------------------|---------|-------------|
| `onValueChange` | Selection changes | Called with new value(s) |

## **12. Styling**

* **Approach**: CSS Modules with SCSS
* **File**: `ToggleGroup.module.scss`

### **CSS Classes**

* `.container` – Wrapper container
* `.group` – Toggle group
* `.item` – Toggle item
* `.icon` – Item icon
* `.itemLabel` – Item label text
* `.label` – Group label
* `.size-sm`, `.size-md`, `.size-lg` – Size variants
* `.orientation-horizontal`, `.orientation-vertical` – Layout options
* `.disabled`, `.itemDisabled` – Disabled states

## **13. Accessibility Requirements**

* **Keyboard**: Arrow keys navigate, Space/Enter toggle
* **ARIA**: Proper toggle group semantics via Radix
* **Focus**: Clear focus ring
* **Screen Reader**: Announces state and selection

### **Improvements Needed**

* None – Radix provides full accessibility

## **14. Error Handling**

| Error Condition | Behaviour | Fallback |
|-----------------|-----------|----------|
| Empty options | Empty group | Graceful |
| Invalid type | Default to 'multiple' | No error |

## **15. Performance & Lifecycle Notes**

### **Single vs Multiple**

```tsx
// Single selection (radio-like)
<ToggleGroup
  type="single"
  value={selected}
  onValueChange={setSelected}
  options={options}
/>

// Multiple selection (checkbox-like)
<ToggleGroup
  type="multiple"
  value={selectedArray}
  onValueChange={setSelectedArray}
  options={options}
/>
```

## **16. Usage Examples**

### **Single Selection**

```tsx
import { ToggleGroup } from '@/components/ui/primitives/ToggleGroup';

<ToggleGroup
  type="single"
  label="View Mode"
  options={[
    { value: 'grid', label: 'Grid', icon: <Icon icon="layoutGrid" /> },
    { value: 'list', label: 'List', icon: <Icon icon="list" /> },
  ]}
  value={viewMode}
  onValueChange={setViewMode}
/>
```

### **Multiple Selection**

```tsx
<ToggleGroup
  type="multiple"
  label="Filters"
  options={[
    { value: 'images', label: 'Images' },
    { value: 'videos', label: 'Videos' },
    { value: 'documents', label: 'Documents' },
  ]}
  value={activeFilters}
  onValueChange={setActiveFilters}
/>
```

### **Vertical Orientation**

```tsx
<ToggleGroup
  type="single"
  orientation="vertical"
  options={[
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' },
  ]}
  value={size}
  onValueChange={setSize}
/>
```

### **With Disabled Options**

```tsx
<ToggleGroup
  type="single"
  options={[
    { value: 'free', label: 'Free' },
    { value: 'pro', label: 'Pro' },
    { value: 'enterprise', label: 'Enterprise', disabled: true },
  ]}
  value={plan}
  onValueChange={setPlan}
/>
```

## **17. Features Summary**

### **Selection Types**

| Type | Behavior |
|------|----------|
| `single` | One option at a time |
| `multiple` | Multiple options simultaneously |

### **ToggleGroup vs RadioGroup**

| Component | Use Case |
|-----------|----------|
| `ToggleGroup` | Button-style selection, toolbars |
| `RadioGroup` | Form-style radio buttons |

### **Sizes**

| Size | Use Case |
|------|----------|
| `sm` | Compact toolbars |
| `md` | Standard UI |
| `lg` | Prominent selection |

## **18. Testing Considerations**

### **Unit Tests**

* Renders all options
* Single selection works
* Multiple selection works
* Keyboard navigation
* Disabled options not selectable
* Group disabled blocks all

### **Mocking**

* No external dependencies to mock

### **Edge Cases**

* Empty options array
* Single option
* All options disabled
* Long option labels

## **19. Out of Scope / Non-Goals**

* **Form radio**: Use RadioGroup
* **Checkbox list**: Use Checkbox
* **Custom icons**: Supported via icon prop
* **Grouped options**: Not supported

## **20. Related Components & System Context**

### **Siblings**

* `RadioGroup`
* `Checkbox`

### **Used In**

* Toolbars
* Filters
* View mode selectors

## **21. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
|----------|----------|---------------|-------|
| `Single` | Single selection | type: single | Radio-like |
| `Multiple` | Multiple selection | type: multiple | Checkbox-like |
| `WithIcons` | Icon options | Icons in options | Rich display |
| `Vertical` | Vertical layout | orientation: vertical | Column |
| `Disabled` | Disabled | disabled: true | Non-interactive |
| `Sizes` | All sizes | sm, md, lg | Size comparison |

### **Controls (Args) Required**

* `type` (select) – Selection type
* `options` (object) – Options array
* `orientation` (select) – Layout direction
* `size` (select) – Button size
* `label` (text) – Group label
* `disabled` (boolean) – Disabled state

### **Mocking Requirements**

*None – stateless component*

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Verify keyboard navigation
* Check option announcement
* Verify focus visible

### **Interaction Tests**

* Click option (single)
* Click option (multiple)
* Arrow key navigation
* Space/Enter toggle
