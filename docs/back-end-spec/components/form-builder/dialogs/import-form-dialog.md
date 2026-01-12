# Component: ImportFormDialog

## Description
Modal dialog for importing a form from JSON. Supports both file upload and direct JSON paste with validation and error handling.

## Location
`src/components/form-builder/dialogs/ImportFormDialog.tsx`

## Props Interface

```typescript
interface ImportFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
```

## Data Requirements
Uses FormBuilderProvider context for import action.

## Internal State

| State Variable | Type | Purpose |
|----------------|------|---------|
| `jsonText` | `string` | Pasted/loaded JSON content |
| `error` | `string \| null` | Error message display |
| `success` | `boolean` | Success state indicator |

## Dependencies

### Context
- `useFormBuilder` - Access importForm action

### Components
- `Button` - Action buttons

### Icons
- `lucide-react` - X, Upload, FileJson, AlertCircle

### Libraries
- `@radix-ui/react-dialog` - Dialog components

## Events & Callbacks

| Event | Trigger | Description |
|-------|---------|-------------|
| `handleFileUpload` | File input change | Reads JSON file |
| `handleImport` | Import button | Validates and imports JSON |
| `handleClose` | Close/Cancel | Resets state and closes |

## Styling
- **CSS Module**: `ImportFormDialog.module.scss`

## Features
- File upload (JSON files)
- Direct JSON paste
- Error message display
- Success message display
- Auto-close on success
- Form state reset

## UI Sections

### Header
- "Import Form" title
- Close button (X)

### Body
- Hint text
- Error box (conditional)
- Success box (conditional)
- File upload section
- Divider ("or paste JSON")
- JSON textarea

### Footer
- Cancel button
- Import Form button

## File Upload Handling
```typescript
const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    const text = event.target?.result as string;
    setJsonText(text);
    setError(null);
  };
  reader.onerror = () => setError('Failed to read file');
  reader.readAsText(file);
};
```

## Import Validation
```typescript
const handleImport = () => {
  if (!jsonText.trim()) {
    setError('Please paste JSON or upload a file');
    return;
  }

  const result = importForm(jsonText);

  if (result.success) {
    setSuccess(true);
    setTimeout(() => {
      onOpenChange(false);
    }, 1500);
  } else {
    setError(result.error || 'Import failed');
  }
};
```

## File Input Configuration
```typescript
<input
  type="file"
  accept=".json,application/json"
  onChange={handleFileUpload}
/>
```

## Related Components
- Parent: `FormBuilderToolbar`
- Related: Export functionality in toolbar
