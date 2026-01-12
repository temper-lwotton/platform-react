# Component: BasicSettings

## Description
Basic field settings panel for configuring label, placeholder, help text, required state, and field width.

## Location
`src/components/form-builder/settings/BasicSettings.tsx`

## Props Interface

```typescript
interface BasicSettingsProps {
  field: FormField;
}
```

## Data Requirements

### FormField Properties Used
```typescript
interface FormField {
  id: string;
  label: string;
  placeholder?: string;
  helpText?: string;
  required?: boolean;
  width?: 'full' | 'half' | 'third';
}
```

## Dependencies

### Context
- `useFormBuilder` - Access updateField action

### Components
- `Input` - Text inputs
- `Textarea` - Help text input
- `Label` - Form labels
- `Switch` - Required toggle
- `Select` - Width dropdown

### Icons
- None

### Libraries
- None

## Events & Callbacks

| Event | Trigger | Description |
|-------|---------|-------------|
| Label change | Input change | Updates field label |
| Placeholder change | Input change | Updates placeholder |
| Help text change | Textarea change | Updates help text |
| Required toggle | Switch change | Toggles required state |
| Width change | Select change | Updates field width |

## Styling
- **CSS Module**: `Settings.module.scss`

## Features
- Label input (required)
- Placeholder input
- Help text textarea
- Required switch toggle
- Width selector (full/half/third)
- Field hints for guidance

## UI Sections

### Label Field
- Input for field label
- Required indicator

### Placeholder Field
- Input for placeholder text
- Hint about display location

### Help Text Field
- Textarea for help text
- Hint about usage

### Required Toggle
- Switch component
- "Make this field required" label

### Width Selector
- Select dropdown
- Options: Full Width, Half Width, Third Width
- Hint about responsive behavior

## Width Options
```typescript
const widthOptions = [
  { value: 'full', label: 'Full Width' },
  { value: 'half', label: 'Half Width' },
  { value: 'third', label: 'Third Width' },
];
```

## Related Components
- Parent: `FieldSettingsPanel`
- Sibling: `ValidationSettings`, `OptionsSettings`, `AdvancedSettings`
