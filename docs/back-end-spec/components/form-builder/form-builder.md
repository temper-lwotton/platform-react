# Component: FormBuilder

## Description
Main form builder component providing a complete drag-and-drop interface for creating forms. Features a three-panel layout with field palette, canvas, and settings panel, plus extensive keyboard shortcut support.

## Location
`src/components/form-builder/FormBuilder.tsx`

## Props Interface
None - top-level builder component.

## Data Requirements
Uses FormBuilderProvider context for all state management. See FormBuilderProvider for data types.

## Internal State

| State Variable | Type | Purpose |
|----------------|------|---------|
| `showShortcuts` | `boolean` | Keyboard shortcuts help visibility |
| `activeId` | `UniqueIdentifier \| null` | Currently dragged item ID |
| `overId` | `UniqueIdentifier \| null` | Current drop target ID |

## Dependencies

### Context
- `FormBuilderProvider` - State management wrapper

### Hooks
- `useFormBuilder` - Access form builder state and actions
- `useSensor`, `useSensors` - dnd-kit sensor configuration

### Icons
- `lucide-react` - Keyboard

### Libraries
- `@dnd-kit/core` - DndContext, DragOverlay, PointerSensor, KeyboardSensor, closestCenter, DragStartEvent, DragEndEvent, DragOverEvent
- `@dnd-kit/sortable` - sortableKeyboardCoordinates

## Events & Callbacks

| Event | Trigger | Description |
|-------|---------|-------------|
| `handleDragStart` | Drag begins | Captures active item ID |
| `handleDragOver` | Drag over target | Tracks drop target |
| `handleDragEnd` | Drag ends | Handles field/section drops and reordering |
| `handleKeyDown` | Keyboard events | Global keyboard shortcut handler |

## Keyboard Shortcuts

### Quick Field Insertion
| Key | Action |
|-----|--------|
| `T` | Add Text field |
| `E` | Add Email field |
| `N` | Add Number field |
| `P` | Add Phone field |
| `S` | Add Select field |
| `R` | Add Radio field |
| `C` | Add Checkbox field |
| `D` | Add Date field |
| `F` | Add File field |

### Navigation & Editing
| Keys | Action |
|------|--------|
| `Arrow Up/Down` | Navigate between fields |
| `Enter` | Select focused field |
| `Escape` | Clear selection |
| `?` | Toggle shortcuts help |
| `Cmd/Ctrl + Z` | Undo |
| `Cmd/Ctrl + Shift + Z` | Redo |
| `Cmd/Ctrl + A` | Select all fields |
| `Cmd/Ctrl + C` | Copy selected fields |
| `Cmd/Ctrl + V` | Paste fields |
| `Cmd/Ctrl + D` | Duplicate selected |
| `Delete/Backspace` | Delete selected |

## Styling
- **CSS Module**: `FormBuilder.module.scss`

## Features
- Drag-and-drop field placement
- Multi-panel layout (palette, canvas, settings)
- Keyboard-first workflow support
- DndContext wraps entire builder
- Drag overlay for visual feedback
- Section-aware drag handling

## UI Sections

### Container
- Keyboard event listener div
- DndContext wrapper

### Main Layout
- FieldPalette (left)
- FormCanvas (center)
- FieldSettingsPanel (right)

### Overlays
- DragOverlay with active field preview
- KeyboardShortcutsHelp modal

## Drag & Drop Logic

### Field Types Handled
- `field-*` - New field from palette
- `section` - New section creation
- `canvas-field-*` - Existing canvas field

### Drop Behavior
- New fields: Inserted at drop position
- Existing fields: Reordered via arrayMove
- Sections: Created with dropped fields

## Related Components
- Child: `FormBuilderProvider`, `FieldPalette`, `FormCanvas`, `FieldSettingsPanel`, `KeyboardShortcutsHelp`
- Parent: Form builder page
