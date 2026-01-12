# Component: TermsList

## Description
Admin listing page for managing terms within a specific taxonomy. Displays terms in a searchable table with parent hierarchy support and CRUD operations.

## Location
`src/components/cms/taxonomies/TermsList.tsx`

## Props Interface

```typescript
interface TermsListProps {
  taxonomyId: number;
}
```

## Data Requirements

### Term Type
```typescript
interface Term {
  id: number;
  name: string;
  slug: string;
  description?: string;
  parent?: number;
  count: number;
}
```

### Taxonomy Type
```typescript
interface Taxonomy {
  singularLabel: string;
  pluralLabel: string;
  hierarchical: boolean;
}
```

## Internal State

| State Variable | Type | Purpose |
|----------------|------|---------|
| `search` | `string` | Search query |

## Dependencies

### Hooks
- `useTerms` - Fetch terms for taxonomy
- `useDeleteTerm` - Delete mutation
- `useTaxonomy` - Fetch taxonomy metadata

### Icons
- `lucide-react` - Tag, Plus, Edit, Trash2, Search, ArrowLeft, FileText

### Libraries
- `next/link` - Navigation

## Events & Callbacks

| Event | Trigger | Description |
|-------|---------|-------------|
| `handleDelete` | Delete button | Deletes term with confirmation |

## Styling
- **CSS Module**: `TermsList.module.scss`

## Features
- Search by name, slug, or description
- Table layout with columns
- Parent term display (if hierarchical)
- Post count per term
- Edit/delete actions

## UI Sections

### Header
- Back to taxonomies link
- Taxonomy plural label as title
- Subtitle with taxonomy singular label
- "Add New [Term]" button

### Filters
- Search box

### Terms Table
| Column | Content |
|--------|---------|
| Name | Term icon + name |
| Slug | URL slug |
| Description | Description or dash |
| Parent | Parent term name (if hierarchical) |
| Count | Post count with icon |
| Actions | Edit/Delete buttons |

### Empty State
- Tag icon
- "No terms found" message
- Create button

## Related Components
- Parent: `TaxonomiesList`
- Links to: `TermEditor`
