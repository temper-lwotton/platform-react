# Component: BlockTemplatePicker

## Description
Modal dialog for selecting and inserting block templates into post content. Displays active templates in a searchable, filterable grid.

## Location
`src/components/cms/blocks/BlockTemplatePicker.tsx`

## Props Interface

```typescript
interface BlockTemplatePickerProps {
  onSelect: (blockJson: string) => void;
  onClose: () => void;
}
```

## Data Requirements

### Block Template Type
```typescript
interface BlockTemplate {
  id: number;
  name: string;
  description?: string;
  category?: string;
  blockJson: string;
  isActive: boolean;
}
```

## Internal State

| State Variable | Type | Purpose |
|----------------|------|---------|
| `search` | `string` | Search query |
| `categoryFilter` | `string` | Category filter |

## Dependencies

### Hooks
- `useBlockTemplates` - Fetch active templates

### Icons
- `lucide-react` - X, Search, Blocks, Plus

## Events & Callbacks

| Event | Trigger | Description |
|-------|---------|-------------|
| `handleSelect` | Template card click | Calls onSelect with blockJson, then onClose |
| `onClose` | Close button/overlay | Closes the modal |

## Styling
- **CSS Module**: `BlockTemplatePicker.module.scss`

## Features
- Modal overlay (click to close)
- Header with title and close button
- Search input with autofocus
- Category filter dropdown
- Template grid
- Template cards with click to insert
- Loading state
- Empty state for no results

## Modal Structure

### Overlay
- Dark background
- Click to close

### Modal Content

#### Header
- Blocks icon
- "Insert Block Template" title
- Close button (X)

#### Filters
- Search input with icon
- Category dropdown (from active templates)

#### Content Area
- Loading state
- Empty state (no matches or no templates)
- Template grid

### Template Card
- Blocks icon
- Template name
- Description (if present)
- Category badge (if present)
- Plus icon on hover

## Query Configuration
```typescript
useBlockTemplates({
  category: categoryFilter || undefined,
});
```

## Filtering Logic
```typescript
const filteredTemplates = templatesData?.data
  .filter((t) => t.isActive)
  .filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(search.toLowerCase()) ||
      template.description?.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });
```

## Usage Example

```tsx
{showBlockPicker && (
  <BlockTemplatePicker
    onSelect={(blockJson) => {
      // Insert block into editor
      insertBlockContent(blockJson);
    }}
    onClose={() => setShowBlockPicker(false)}
  />
)}
```

## Related Components
- Parent: `PostEditor`, `PageEditor`
- Data from: `BlockTemplatesList` (shares templates)
- See also: `BlockTemplateEditor`
