# Component: FieldTemplateItem

## Description
Saved field template item in the palette templates tab. Displays template name, description, and field type with drag-to-add and delete functionality.

## Location
`src/components/form-builder/palette/FieldTemplateItem.tsx`

## Props Interface

```typescript
interface FieldTemplateItemProps {
  template: FieldTemplate;
}
```

## Data Requirements

### FieldTemplate Type
```typescript
interface FieldTemplate {
  id: string;
  name: string;
  description?: string;
  field: FormField;
  createdAt: number;
  updatedAt: number;
}
```

## Dependencies

### Context
- `useFormBuilder` - Access deleteFieldTemplate action

### Icons
- `lucide-react` - Trash2, FileText

### Libraries
- `@dnd-kit/core` - useDraggable

## Events & Callbacks

| Event | Trigger | Description |
|-------|---------|-------------|
| `handleDelete` | Delete button | Removes template |
| Drag start | Mouse down + move | Initiates drag with template field |

## Styling
- **CSS Module**: `FieldTemplateItem.module.scss`

## Features
- Draggable to canvas
- Template name display
- Optional description
- Field type indicator
- Delete action
- Created date display

## Draggable Configuration
```typescript
useDraggable({
  id: `template-${template.id}`,
  data: {
    type: 'template',
    template,
    field: template.field,
  },
});
```

## UI Structure

### Item Container
- Draggable wrapper
- Template icon (FileText)
- Template info section
- Delete button

### Info Section
- Template name
- Description (truncated)
- Field type badge

## Related Components
- Parent: `FieldPalette`
- Related: `FieldPaletteItem`
