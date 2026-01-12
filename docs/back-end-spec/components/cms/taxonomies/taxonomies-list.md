# Component: TaxonomiesList

## Description
Admin listing page for managing taxonomies. Displays taxonomies in a searchable grid with links to terms management and CRUD operations.

## Location
`src/components/cms/taxonomies/TaxonomiesList.tsx`

## Props Interface
None - self-contained page component.

## Data Requirements

### Taxonomy Type
```typescript
interface Taxonomy {
  id: number;
  name: string;
  singularLabel: string;
  pluralLabel: string;
  slug: string;
  isActive: boolean;
  hierarchical: boolean;
  showInMenu: boolean;
  termsCount: number;
  postTypes: {
    id: number;
    singularLabel: string;
  }[];
}
```

## Internal State

| State Variable | Type | Purpose |
|----------------|------|---------|
| `search` | `string` | Search query |
| `showInactive` | `boolean` | Include inactive taxonomies |

## Dependencies

### Hooks
- `useTaxonomies` - Fetch taxonomies
- `useDeleteTaxonomy` - Delete mutation

### Icons
- `lucide-react` - Tags, Plus, Edit, Trash2, Search, List, CheckCircle, XCircle

### Libraries
- `next/link` - Navigation

## Events & Callbacks

| Event | Trigger | Description |
|-------|---------|-------------|
| `handleDelete` | Delete button | Deletes taxonomy with confirmation |

## Styling
- **CSS Module**: `TaxonomiesList.module.scss`

## Features
- Search by name or labels
- Show inactive toggle
- Taxonomy cards with metadata
- Terms count display
- Associated post types display
- Status badges
- Manage terms link
- Edit/delete actions

## UI Sections

### Header
- "Taxonomies" title
- Subtitle
- "Add New Taxonomy" button

### Filters
- Search box
- Show inactive checkbox

### Taxonomies Grid
- Cards showing:
  - Tags icon
  - Action buttons (Terms, Edit, Delete)
  - Singular label
  - Plural label
  - Name, slug, terms count
  - Status badges (active/inactive, hierarchical, show in menu)
  - Associated post types

### Empty State
- Tags icon
- "No taxonomies found" message
- Create button

## Related Components
- Parent: Admin layout
- Links to: `TaxonomyEditor`, `TermsList`
