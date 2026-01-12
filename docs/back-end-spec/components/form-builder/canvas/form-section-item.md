# Component: FormSectionItem

## Description
Section container component for grouping fields within the form canvas. Supports drag-and-drop of fields into sections, collapsible state, and section management.

## Location
`src/components/form-builder/canvas/FormSectionItem.tsx`

## Props Interface

```typescript
interface FormSectionItemProps {
  section: FormSection;
}
```

## Data Requirements

### FormSection Type
```typescript
interface FormSection {
  id: string;
  title: string;
  description?: string;
  fieldIds: string[];
  collapsed?: boolean;
}
```

## Dependencies

### Context
- `useFormBuilder` - Access fields, sections, actions

### Icons
- `lucide-react` - ChevronDown, ChevronRight, Trash2, GripVertical

### Libraries
- `@dnd-kit/core` - useDroppable
- `@dnd-kit/sortable` - SortableContext, useSortable, verticalListSortingStrategy
- `@dnd-kit/utilities` - CSS

## Events & Callbacks

| Event | Trigger | Description |
|-------|---------|-------------|
| `handleToggleCollapse` | Header click | Toggles section collapse |
| `handleDelete` | Delete button | Removes section (fields remain) |

## Styling
- **CSS Module**: `FormSectionItem.module.scss`

## Features
- Draggable section header
- Droppable zone for fields
- Collapsible field display
- Field count indicator
- Section title and description
- Delete section action

## UI Sections

### Section Header
- Drag handle (GripVertical)
- Collapse toggle (ChevronDown/Right)
- Section title
- Field count badge
- Delete button

### Section Content (when expanded)
- Section description (if present)
- SortableContext for fields
- FormFieldItem list
- Empty state if no fields

## Droppable Configuration
```typescript
useDroppable({
  id: `section-${section.id}`,
  data: {
    type: 'section',
    sectionId: section.id,
  },
});
```

## Sortable Configuration
```typescript
useSortable({
  id: `section-${section.id}`,
  data: {
    type: 'section-container',
    section,
  },
});
```

## Related Components
- Parent: `FormCanvas`
- Children: `FormFieldItem`
