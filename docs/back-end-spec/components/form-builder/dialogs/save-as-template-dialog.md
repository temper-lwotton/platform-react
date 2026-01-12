# Component: SaveAsTemplateDialog

## Description
Modal dialog for saving a field configuration as a reusable template. Allows naming and describing the template before saving.

## Location
`src/components/form-builder/dialogs/SaveAsTemplateDialog.tsx`

## Props Interface

```typescript
interface SaveAsTemplateDialogProps {
  fieldId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
```

## Data Requirements
Uses FormBuilderProvider context to access field data and save action.

## Internal State

| State Variable | Type | Purpose |
|----------------|------|---------|
| `name` | `string` | Template name input |
| `description` | `string` | Template description input |

## Dependencies

### Context
- `useFormBuilder` - Access state fields, saveFieldAsTemplate action

### Components
- `Button` - Action buttons

### Icons
- `lucide-react` - X, Save

### Libraries
- `@radix-ui/react-dialog` - Dialog components

## Events & Callbacks

| Event | Trigger | Description |
|-------|---------|-------------|
| `handleSave` | Save button | Saves field as template |
| Close | X button/overlay | Closes dialog |

## Styling
- **CSS Module**: `SaveAsTemplateDialog.module.scss`

## Features
- Template name input (required)
- Optional description
- Field preview info
- Validation before save
- Form reset on close

## UI Sections

### Header
- "Save as Template" title
- Close button (X)

### Body
- Hint text
- Field preview (label and type)
- Template name input (required)
- Description textarea (optional)

### Footer
- Cancel button
- Save Template button (disabled without name)

## Validation
```typescript
const handleSave = () => {
  if (!name.trim()) return;
  saveFieldAsTemplate(fieldId, name.trim(), description.trim() || undefined);
  // Reset and close
};
```

## Field Preview Display
```typescript
<div className={styles.previewField}>
  <div className={styles.previewLabel}>Field being saved:</div>
  <div className={styles.previewValue}>
    {field.label} ({field.type})
  </div>
</div>
```

## Related Components
- Parent: `FieldSettingsPanel`
- Related: `FieldTemplateItem` (displays saved templates)
