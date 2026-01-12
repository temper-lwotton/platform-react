# Component: SaveFormTemplateDialog

## Description
Modal dialog for saving the entire current form as a reusable template. Includes name, description, and a summary of what will be saved.

## Location
`src/components/form-builder/dialogs/SaveFormTemplateDialog.tsx`

## Props Interface

```typescript
interface SaveFormTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
```

## Data Requirements
Uses FormBuilderProvider context for state and save action.

## Internal State

| State Variable | Type | Purpose |
|----------------|------|---------|
| `name` | `string` | Template name input |
| `description` | `string` | Template description input |
| `error` | `string` | Error message display |

## Dependencies

### Context
- `useFormBuilder` - Access state, saveFormAsTemplate action

### Components
- `Input` - Name input
- `Label` - Form labels
- `Button` - Action buttons
- `Textarea` - Description input

### Icons
- `lucide-react` - X, Save

### Libraries
- `@radix-ui/react-dialog` - Dialog components

## Events & Callbacks

| Event | Trigger | Description |
|-------|---------|-------------|
| `handleSave` | Save button | Validates and saves template |
| `handleCancel` | Cancel button | Resets state and closes |

## Styling
- **CSS Module**: `SaveFormTemplateDialog.module.scss`

## Features
- Template name input (required)
- Optional description
- Template content summary
- Validation (non-empty form required)
- Error display
- Form state reset

## UI Sections

### Header
- "Save as Template" title
- Close button (X)

### Description
- Hint about saving current form

### Body
- Name input field (required)
- Description textarea (optional)
- Error message (conditional)
- Template summary section

### Footer
- Cancel button
- Save Template button

## Template Summary Display
```typescript
<div className={styles.summary}>
  <h4>Template will include:</h4>
  <ul>
    <li>{state.fields.length} field{state.fields.length !== 1 ? 's' : ''}</li>
    {state.sections.length > 0 && (
      <li>{state.sections.length} section{state.sections.length !== 1 ? 's' : ''}</li>
    )}
    <li>All field configurations and validations</li>
    <li>Conditional logic and dependencies</li>
  </ul>
</div>
```

## Validation
```typescript
const handleSave = () => {
  if (!name.trim()) {
    setError('Please enter a template name');
    return;
  }

  if (state.fields.length === 0) {
    setError('Cannot save an empty form as a template');
    return;
  }

  saveFormAsTemplate(name.trim(), description.trim() || undefined);
  // Reset and close
};
```

## Related Components
- Parent: `FormBuilderToolbar`
- Related: `LoadFormTemplateDialog`
