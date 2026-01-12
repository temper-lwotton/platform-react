# Component: OptionsSettings

## Description
Options management panel for select, radio, and checkbox-group field types. Supports adding, removing, reordering options via drag-and-drop, and editing option labels and values.

## Location
`src/components/form-builder/settings/OptionsSettings.tsx`

## Props Interface

```typescript
interface OptionsSettingsProps {
  field: FormField;
}
```

## Data Requirements

### FieldOption Type
```typescript
interface FieldOption {
  id: string;
  label: string;
  value: string;
}
```

## Dependencies

### Context
- `useFormBuilder` - Access updateField action

### Components
- `Input` - Label and value inputs
- `Label` - Form labels
- `Button` - Add option button

### Icons
- `lucide-react` - Plus, Trash2, GripVertical

### Libraries
- `@dnd-kit/core` - DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent
- `@dnd-kit/sortable` - arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy
- `@dnd-kit/utilities` - CSS

## Events & Callbacks

| Event | Trigger | Description |
|-------|---------|-------------|
| `addOption` | Add button | Creates new option |
| `updateOption` | Input change | Updates option label/value |
| `deleteOption` | Delete button | Removes option (min 2) |
| `handleDragEnd` | Drag end | Reorders options |

## Styling
- **CSS Module**: `Settings.module.scss`

## Features
- Drag-and-drop option reordering
- Add new options
- Edit option labels
- Edit option values
- Delete options (minimum 2 required)
- Visual drag handles

## UI Sections

### Header
- "Options" label
- Hint about drag to reorder

### Options List
- DndContext wrapper
- SortableContext for options
- SortableOption items

### SortableOption Item
- Drag handle (GripVertical)
- Label input
- Value input
- Delete button

### Add Option Button
- Plus icon
- "Add Option" text
- Full width

## Sortable Configuration
```typescript
useSortable({ id: option.id });

const style = {
  transform: CSS.Transform.toString(transform),
  transition,
  opacity: isDragging ? 0.5 : 1,
};
```

## Option Creation
```typescript
const newOption: FieldOption = {
  id: `option-${Date.now()}`,
  label: `Option ${options.length + 1}`,
  value: `option${options.length + 1}`,
};
```

## Minimum Options Validation
```typescript
if (options.length <= 2) {
  alert('You must have at least 2 options');
  return;
}
```

## Related Components
- Parent: `FieldSettingsPanel`
- Sibling: `BasicSettings`, `ValidationSettings`, `AdvancedSettings`
