# Component: LoadFormTemplateDialog

## Description
Modal dialog for loading a saved form template. Features template list with selection, preview panel showing template details, and delete confirmation.

## Location
`src/components/form-builder/dialogs/LoadFormTemplateDialog.tsx`

## Props Interface

```typescript
interface LoadFormTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
```

## Data Requirements

### FormTemplate Type
```typescript
interface FormTemplate {
  id: string;
  name: string;
  description?: string;
  formTitle: string;
  formDescription?: string;
  fields: FormField[];
  sections: FormSection[];
  createdAt: number;
  updatedAt: number;
}
```

## Internal State

| State Variable | Type | Purpose |
|----------------|------|---------|
| `selectedTemplateId` | `string \| null` | Currently selected template |
| `showDeleteConfirm` | `string \| null` | Template ID with delete confirm visible |

## Dependencies

### Context
- `useFormBuilder` - Access formTemplates, loadFormTemplate, deleteFormTemplate

### Components
- `Button` - Action buttons

### Icons
- `lucide-react` - X, FileText, Trash2, Clock, Layers, CheckSquare

### Libraries
- `@radix-ui/react-dialog` - Dialog components

## Events & Callbacks

| Event | Trigger | Description |
|-------|---------|-------------|
| `handleLoad` | Load button | Loads selected template |
| `handleDelete` | Delete confirm | Removes template |
| Template click | List item click | Selects template |

## Styling
- **CSS Module**: `LoadFormTemplateDialog.module.scss`

## Features
- Template list with selection
- Template preview panel
- Delete with confirmation
- Relative date formatting
- Field/section count display
- Empty state handling
- Warning about replacing current form

## UI Sections

### Header
- "Load Form Template" title
- Close button (X)

### Description
- Hint about loading templates

### Body

#### Empty State
- FileText icon
- "No templates saved" message
- Hint to save templates

#### Layout (when templates exist)
- Left: Template list
- Right: Template preview

### Template List Item
- Template name
- Last updated date
- Delete button
- Delete confirmation overlay

### Template Preview
- Template name
- Description (if exists)
- Form title
- Form description (if exists)
- Field count with icon
- Section count with icon
- Warning about replacing form

### Footer
- Cancel button
- Load Template button (disabled without selection)

## Date Formatting
```typescript
const formatDate = (timestamp: number) => {
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
};
```

## Delete Confirmation
```typescript
{showDeleteConfirm === template.id && (
  <div className={styles.deleteConfirm}>
    <p>Delete this template?</p>
    <div className={styles.deleteActions}>
      <button onClick={() => setShowDeleteConfirm(null)}>Cancel</button>
      <button onClick={() => handleDelete(template.id)}>Delete</button>
    </div>
  </div>
)}
```

## Related Components
- Parent: `FormBuilderToolbar`
- Related: `SaveFormTemplateDialog`
