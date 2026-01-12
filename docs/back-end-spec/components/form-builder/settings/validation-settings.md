# Component: ValidationSettings

## Description
Comprehensive validation configuration panel supporting multiple validation types including required, email, min/max length, pattern matching, custom functions, and cross-field validation.

## Location
`src/components/form-builder/settings/ValidationSettings.tsx`

## Props Interface

```typescript
interface ValidationSettingsProps {
  field: FormField;
}
```

## Data Requirements

### Validation Type
```typescript
interface Validation {
  id: string;
  type: ValidationType;
  value?: string | number;
  message?: string;
  enabled: boolean;
}

type ValidationType =
  | 'required'
  | 'email'
  | 'minLength'
  | 'maxLength'
  | 'min'
  | 'max'
  | 'pattern'
  | 'custom'
  | 'crossField';
```

### Cross-Field Validation Type
```typescript
interface CrossFieldValidation {
  targetFieldId: string;
  operator: 'equals' | 'notEquals' | 'greaterThan' | 'lessThan';
  message: string;
}
```

## Internal State

| State Variable | Type | Purpose |
|----------------|------|---------|
| `showCustomEditor` | `boolean` | Custom function editor visibility |

## Dependencies

### Context
- `useFormBuilder` - Access updateField, all fields

### Components
- `Input` - Value inputs
- `Textarea` - Pattern and custom function inputs
- `Label` - Form labels
- `Switch` - Enable toggles
- `Select` - Operator/field selects

### Icons
- `lucide-react` - Plus, Trash2, Code

### Libraries
- None

## Events & Callbacks

| Event | Trigger | Description |
|-------|---------|-------------|
| `handleAddValidation` | Add button | Adds new validation rule |
| `handleRemoveValidation` | Remove button | Removes validation rule |
| `handleUpdateValidation` | Input change | Updates validation config |
| `handleToggleValidation` | Switch toggle | Enables/disables rule |

## Styling
- **CSS Module**: `Settings.module.scss`

## Features
- Multiple validation types
- Per-validation enable/disable
- Custom error messages
- Pattern with regex support
- Custom JavaScript function
- Cross-field comparison
- Validation hints

## Validation Types

### Text Validations
| Type | Value Input | Description |
|------|-------------|-------------|
| required | None | Field must have value |
| email | None | Must be valid email |
| minLength | Number | Minimum character count |
| maxLength | Number | Maximum character count |
| pattern | Regex string | Must match pattern |

### Number Validations
| Type | Value Input | Description |
|------|-------------|-------------|
| min | Number | Minimum value |
| max | Number | Maximum value |

### Advanced Validations
| Type | Configuration | Description |
|------|---------------|-------------|
| custom | JavaScript function | Custom validation logic |
| crossField | Field + operator | Compare with another field |

## Custom Function Format
```javascript
(value, allValues) => {
  // Return true if valid
  // Return false or error message string if invalid
  return value.length > 0;
}
```

## Cross-Field Operators
- `equals` - Must equal target field
- `notEquals` - Must not equal target field
- `greaterThan` - Must be greater than target
- `lessThan` - Must be less than target

## UI Sections

### Validation List
- Enable/disable switch per rule
- Type label
- Value input (if applicable)
- Custom message input
- Remove button

### Add Validation
- Type selector dropdown
- Add button

### Custom Function Editor
- Code textarea
- Syntax hints
- Available variables info

### Cross-Field Config
- Target field selector
- Operator selector
- Error message input

## Related Components
- Parent: `FieldSettingsPanel`
- Sibling: `BasicSettings`, `OptionsSettings`, `AdvancedSettings`
