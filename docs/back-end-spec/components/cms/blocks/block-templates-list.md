# Component: BlockTemplatesList

## Description
Admin listing page for managing reusable content block templates. Displays templates in a grid with search, category filtering, and active/inactive status filtering.

## Location
`src/components/cms/blocks/BlockTemplatesList.tsx`

## Props Interface
None - self-contained page component.

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
  author: {
    id: number;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}
```

### Templates Response
```typescript
interface BlockTemplatesResponse {
  data: BlockTemplate[];
  meta: {
    total: number;
    page: number;
    pages: number;
  };
}
```

## Internal State

| State Variable | Type | Purpose |
|----------------|------|---------|
| `search` | `string` | Search query |
| `categoryFilter` | `string` | Category filter |
| `showInactive` | `boolean` | Include inactive templates |

## Dependencies

### Hooks
- `useBlockTemplates` - Fetch templates
- `useDeleteBlockTemplate` - Delete mutation

### Icons
- `lucide-react` - Blocks, Plus, Edit, Trash2, Search, CheckCircle, XCircle, Copy

### Libraries
- `next/link` - Navigation
- `date-fns` - formatDistanceToNow

## Events & Callbacks

| Event | Trigger | Description |
|-------|---------|-------------|
| `handleDelete` | Delete button | Deletes template with confirmation |

## Styling
- **CSS Module**: `BlockTemplatesList.module.scss`

## Features
- Header with "Add New Template" button
- Search input
- Category filter dropdown
- "Show inactive" checkbox
- Templates grid
- Template cards with actions
- Empty state with create button
- Loading and error states

## UI Sections

### Header
- "Block Templates" title
- Subtitle
- Link to new template page

### Filters
- Search box with icon
- Category dropdown (dynamic from templates)
- Show inactive checkbox

### Templates Grid
Card layout with:
- Blocks icon header
- Edit/Delete action buttons
- Template name
- Description
- Metadata (category, author, updated date)
- Active/Inactive status badge

### Empty State
- Blocks icon
- "No block templates found" message
- Create button

## Query Configuration
```typescript
useBlockTemplates({
  category: categoryFilter || undefined,
});
```

## Filtering Logic
```typescript
const filteredTemplates = templatesData?.data.filter((template) => {
  const matchesSearch = template.name.toLowerCase().includes(search.toLowerCase()) ||
    template.description?.toLowerCase().includes(search.toLowerCase());
  const matchesStatus = showInactive ? true : template.isActive;
  return matchesSearch && matchesStatus;
});
```

## Related Components
- Parent: Admin layout
- Links to: `BlockTemplateEditor`
- Used by: `BlockTemplatePicker`
