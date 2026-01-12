# Component: FieldRenderer

## Description
Universal field renderer component that renders the appropriate input component based on field type. Handles all 20+ field types with proper props passing and styling.

## Location
`src/components/form-builder/fields/FieldRenderer.tsx`

## Props Interface

```typescript
interface FieldRendererProps {
  field: FormField;
  value?: any;
  onChange?: (value: any) => void;
  error?: string;
  disabled?: boolean;
}
```

## Data Requirements

### FormField Type
```typescript
interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  helpText?: string;
  required?: boolean;
  width?: 'full' | 'half' | 'third';
  options?: FieldOption[];
  min?: number;
  max?: number;
  step?: number;
  rows?: number;
  accept?: string;
  multiple?: boolean;
  defaultValue?: any;
}
```

## Dependencies

### Components
- `Input` - Text-based inputs
- `Textarea` - Multi-line text
- `Label` - Field labels
- `Select` - Dropdown select
- `Radio`, `RadioGroup` - Radio buttons
- `Checkbox` - Single checkbox
- `Switch` - Toggle switch
- `RatingField` - Star rating
- `SliderField` - Range slider
- `CheckboxGroupField` - Multiple checkboxes
- `SignatureField` - Signature pad

### Icons
- None

### Libraries
- None

## Styling
- **CSS Module**: `FieldRenderer.module.scss`

## Features
- Type-based field rendering
- Width classes (full, half, third)
- Label with required indicator
- Help text display
- Error display passthrough
- Disabled state support

## Supported Field Types

### Text-Based Fields
| Type | Input Type | Additional Props |
|------|------------|------------------|
| text | text | placeholder |
| email | email | placeholder |
| tel | text | placeholder |
| url | url | placeholder |

### Number Fields
| Type | Input Type | Additional Props |
|------|------------|------------------|
| number | number | min, max, step, placeholder |
| currency | number | min=0, step=0.01, $ symbol |

### Text Area
| Type | Component | Props |
|------|-----------|-------|
| textarea | Textarea | rows, placeholder |

### Selection Fields
| Type | Component | Props |
|------|-----------|-------|
| select | Select | options, placeholder |
| radio | RadioGroup | options |
| checkbox | Checkbox | label |
| checkbox-group | CheckboxGroupField | field, value |

### Date/Time Fields
| Type | Input Type | Props |
|------|------------|-------|
| date | date | min, max |
| time | time | - |

### File Fields
| Type | Input Type | Props |
|------|------------|-------|
| file | file | accept, multiple |
| file-multiple | file | accept, multiple=true |

### Interactive Fields
| Type | Component | Props |
|------|-----------|-------|
| switch | Switch | label |
| rating | RatingField | max |
| slider | SliderField | min, max, step |
| signature | SignatureField | - |

### Special Fields
| Type | Input Type | Props |
|------|------------|-------|
| color | color | defaultValue |

## Width Classes
```typescript
const widthClass = field.width === 'half'
  ? styles.halfWidth
  : field.width === 'third'
  ? styles.thirdWidth
  : styles.fullWidth;
```

## Label Display Logic
```typescript
// Don't render label for checkbox and switch
const showLabel = !['checkbox', 'switch'].includes(field.type);
```

## Render Structure
```tsx
<div className={`${styles.fieldWrapper} ${widthClass}`}>
  {showLabel && (
    <Label htmlFor={field.id}>
      {field.label}
      {field.required && <span className={styles.required}>*</span>}
    </Label>
  )}
  {renderField()}
  {field.helpText && !error && (
    <p className={styles.helpText}>{field.helpText}</p>
  )}
</div>
```

## Related Components
- Parent: `FormPreview`
- Children: `RatingField`, `SliderField`, `CheckboxGroupField`, `SignatureField`
