# Component: FieldPaletteItem

## Description
Individual draggable field type item in the palette. Displays field type icon, label, and provides drag-to-add functionality with favorite toggle.

## Location
`src/components/form-builder/palette/FieldPaletteItem.tsx`

## Props Interface

```typescript
interface FieldPaletteItemProps {
  type: FieldType;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}
```

## Data Requirements

### FieldType Enum
```typescript
type FieldType =
  | 'text'
  | 'email'
  | 'tel'
  | 'number'
  | 'textarea'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'checkbox-group'
  | 'date'
  | 'time'
  | 'file'
  | 'file-multiple'
  | 'switch'
  | 'rating'
  | 'slider'
  | 'signature'
  | 'color'
  | 'url'
  | 'currency';
```

## Dependencies

### Context
- `useFormBuilder` - Access favorites, toggle favorite

### Icons
- `lucide-react` - Star (for favorite toggle)

### Libraries
- `@dnd-kit/core` - useDraggable

## Events & Callbacks

| Event | Trigger | Description |
|-------|---------|-------------|
| `handleFavoriteClick` | Star button | Toggles field type favorite |
| Drag start | Mouse down + move | Initiates drag operation |

## Styling
- **CSS Module**: `FieldPaletteItem.module.scss`

## Features
- Draggable to canvas
- Field type icon display
- Favorite toggle button
- Filled star for favorited types
- Drag cursor indicator

## Draggable Configuration
```typescript
useDraggable({
  id: `field-${type}`,
  data: {
    type: 'field',
    fieldType: type,
    label,
  },
});
```

## UI Structure

### Item Container
- Draggable wrapper
- Icon container
- Label text
- Favorite star button

### States
- Default: Normal display
- Dragging: Reduced opacity
- Favorited: Filled star icon

## Related Components
- Parent: `FieldPalette`
- Related: `FieldTemplateItem`
