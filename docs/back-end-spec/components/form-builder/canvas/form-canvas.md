# Component: FormCanvas

## Description
Main canvas area for the form builder where fields and sections are displayed. Supports drag-and-drop reordering, multi-selection, and bulk actions with droppable zone functionality.

## Location
`src/components/form-builder/canvas/FormCanvas.tsx`

## Props Interface
None - uses context for state.

## Data Requirements
Uses FormBuilderProvider context.

## Internal State
Inherits selection state from context.

## Dependencies

### Context
- `useFormBuilder` - Access fields, sections, selection, actions

### Icons
- `lucide-react` - Plus, Trash2, Copy, Layers

### Libraries
- `@dnd-kit/core` - useDroppable
- `@dnd-kit/sortable` - SortableContext, verticalListSortingStrategy

## Events & Callbacks

| Event | Trigger | Description |
|-------|---------|-------------|
| `handleBulkDelete` | Bulk delete button | Removes all selected fields |
| `handleBulkDuplicate` | Bulk duplicate button | Clones all selected fields |
| `handleAddSection` | Add section button | Creates new section with selected fields |

## Styling
- **CSS Module**: `FormCanvas.module.scss`

## Features
- Droppable zone for new fields
- Sortable field list
- Section containers
- Multi-field selection
- Bulk action bar
- Empty state with instructions
- Form title and description display

## UI Sections

### Form Header
- Editable form title
- Editable form description

### Bulk Actions Bar (when fields selected)
- Selected count display
- Duplicate button
- Delete button
- Create section button

### Canvas Content
- SortableContext wrapper
- Unsectioned fields
- Section containers with fields

### Empty State
- Plus icon
- "Drag fields here" instruction
- Helper text

## Droppable Configuration
```typescript
useDroppable({
  id: 'canvas',
  data: {
    type: 'canvas',
    accepts: ['field', 'section'],
  },
});
```

## Sortable Strategy
Uses `verticalListSortingStrategy` for field ordering.

## Related Components
- Parent: `FormBuilder`
- Children: `FormFieldItem`, `FormSectionItem`
