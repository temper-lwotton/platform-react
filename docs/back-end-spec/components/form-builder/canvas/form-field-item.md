# Component: FormFieldItem

## Description
Individual field component displayed in the form canvas. Supports drag-and-drop reordering, selection states, and field type icons with sortable functionality.

## Location
`src/components/form-builder/canvas/FormFieldItem.tsx`

## Props Interface

```typescript
interface FormFieldItemProps {
  field: FormField;
  isSelected: boolean;
  isFocused: boolean;
}
```

## Data Requirements

### FormField Type
```typescript
interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  helpText?: string;
  required?: boolean;
  width?: 'full' | 'half' | 'third';
  options?: FieldOption[];
  validations?: Validation[];
  conditionalLogic?: ConditionalLogic;
  defaultValue?: any;
  // Type-specific properties
  min?: number;
  max?: number;
  step?: number;
  rows?: number;
  accept?: string;
  multiple?: boolean;
}
```

## Dependencies

### Context
- `useFormBuilder` - Access selection actions

### Icons
- `lucide-react` - GripVertical, Type, Mail, Phone, Hash, AlignLeft, ChevronDown, Circle, CheckSquare, Calendar, Clock, Upload, ToggleLeft, Star, Sliders, PenTool, Palette, Link, DollarSign

### Libraries
- `@dnd-kit/sortable` - useSortable
- `@dnd-kit/utilities` - CSS

## Events & Callbacks

| Event | Trigger | Description |
|-------|---------|-------------|
| `onClick` | Field click | Selects field |
| `onShiftClick` | Shift+click | Range selection |
| `onCtrlClick` | Ctrl/Cmd+click | Toggle selection |

## Styling
- **CSS Module**: `FormFieldItem.module.scss`

## Features
- Sortable drag handle
- Field type icon display
- Selection highlighting
- Focus indicator
- Required indicator
- Width indicator
- Keyboard navigation support

## Field Type Icons

| Type | Icon |
|------|------|
| text | Type |
| email | Mail |
| tel | Phone |
| number | Hash |
| textarea | AlignLeft |
| select | ChevronDown |
| radio | Circle |
| checkbox | CheckSquare |
| checkbox-group | CheckSquare |
| date | Calendar |
| time | Clock |
| file | Upload |
| switch | ToggleLeft |
| rating | Star |
| slider | Sliders |
| signature | PenTool |
| color | Palette |
| url | Link |
| currency | DollarSign |

## Sortable Configuration
```typescript
useSortable({
  id: `canvas-field-${field.id}`,
  data: {
    type: 'canvas-field',
    field,
  },
});
```

## CSS Transform
```typescript
const style = {
  transform: CSS.Transform.toString(transform),
  transition,
  opacity: isDragging ? 0.5 : 1,
};
```

## Related Components
- Parent: `FormCanvas`, `FormSectionItem`
- Sibling: Other `FormFieldItem` instances
