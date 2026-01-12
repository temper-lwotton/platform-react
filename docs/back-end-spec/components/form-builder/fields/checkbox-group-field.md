# Component: CheckboxGroupField

## Description
Multi-checkbox field component for selecting multiple options. Renders a group of checkboxes based on field options with toggle selection behavior.

## Location
`src/components/form-builder/fields/CheckboxGroupField.tsx`

## Props Interface

```typescript
interface CheckboxGroupFieldProps {
  field: FormField;
  value: string[];
  onChange?: (value: string[]) => void;
  disabled?: boolean;
}
```

## Data Requirements

### FormField Properties Used
```typescript
interface FormField {
  id: string;
  options?: FieldOption[];
}

interface FieldOption {
  id: string;
  label: string;
  value: string;
}
```

## Dependencies

### Components
- `Checkbox` - Individual checkbox input
- `Label` - Checkbox label

### Icons
- None

### Libraries
- None

## Events & Callbacks

| Event | Trigger | Description |
|-------|---------|-------------|
| `handleToggle` | Checkbox change | Adds/removes value from array |

## Styling
- **CSS Module**: `CheckboxGroupField.module.scss`

## Features
- Multiple selection support
- Array value management
- Individual option labels
- Disabled state support
- Unique IDs per checkbox

## Toggle Logic
```typescript
const handleToggle = (optionValue: string, checked: boolean) => {
  if (checked) {
    onChange?.([...value, optionValue]);
  } else {
    onChange?.(value.filter((v) => v !== optionValue));
  }
};
```

## Render Structure
```tsx
<div className={styles.checkboxGroup}>
  {field.options?.map((option) => (
    <div key={option.id} className={styles.checkboxOption}>
      <Checkbox
        checked={value.includes(option.value)}
        onCheckedChange={(checked) =>
          handleToggle(option.value, checked as boolean)
        }
        id={`${field.id}-${option.id}`}
        disabled={disabled}
      />
      <Label htmlFor={`${field.id}-${option.id}`}>
        {option.label}
      </Label>
    </div>
  ))}
</div>
```

## Related Components
- Parent: `FieldRenderer`
- Uses: `Checkbox`, `Label`
