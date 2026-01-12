# Component: FieldPalette

## Description
Sidebar palette containing all available field types organized by category. Features tabs for fields, templates, and favorites, plus a search filter for quick field discovery.

## Location
`src/components/form-builder/palette/FieldPalette.tsx`

## Props Interface
None - self-contained palette using context.

## Data Requirements

### Field Category Type
```typescript
interface FieldCategory {
  id: string;
  label: string;
  fields: {
    type: FieldType;
    label: string;
    icon: React.ComponentType<{ size?: number }>;
  }[];
}
```

## Internal State

| State Variable | Type | Purpose |
|----------------|------|---------|
| `activeTab` | `'fields' \| 'templates' \| 'favorites'` | Current palette tab |
| `search` | `string` | Search filter text |
| `expandedCategories` | `string[]` | Expanded category IDs |

## Dependencies

### Context
- `useFormBuilder` - Access templates and favorites

### Icons
- `lucide-react` - Search, Type, Mail, Phone, Hash, AlignLeft, ChevronDown, Circle, CheckSquare, Calendar, Clock, Upload, ToggleLeft, Star, Sliders, PenTool, Palette, Link, DollarSign, FileText, Heart, Layers

### Libraries
- None

## Styling
- **CSS Module**: `FieldPalette.module.scss`

## Features
- Three-tab interface (Fields, Templates, Favorites)
- Search filtering across all fields
- Category collapsible sections
- Drag-to-add field functionality
- Template management
- Favorite field types

## Field Categories

### Basic Fields
- Text, Email, Phone, Number, Textarea

### Selection Fields
- Select, Radio, Checkbox, Checkbox Group

### Date & Time
- Date, Time

### Media
- File Upload, Multi-File Upload

### Interactive
- Switch, Rating, Slider, Signature

### Special
- Color Picker, URL, Currency

## UI Sections

### Header
- "Field Palette" title
- Search input

### Tab Bar
| Tab | Icon | Content |
|-----|------|---------|
| Fields | Layers | Field categories |
| Templates | FileText | Saved field templates |
| Favorites | Heart | Favorited field types |

### Fields Tab Content
- Collapsible category headers
- Draggable field items
- Field count per category

### Templates Tab Content
- Saved field templates list
- Empty state if no templates

### Favorites Tab Content
- Quick access to favorited fields
- Instructions to favorite

## Related Components
- Parent: `FormBuilder`
- Children: `FieldPaletteItem`, `FieldTemplateItem`
