# Component: TermEditor

## Description
Editor interface for creating and editing terms within a taxonomy. Supports parent selection for hierarchical taxonomies.

## Location
`src/components/cms/taxonomies/TermEditor.tsx`

## Props Interface

```typescript
interface TermEditorProps {
  taxonomyId: number;
  termId?: number;
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
| `name` | `string` | Term name |
| `slug` | `string` | URL-friendly slug |
| `description` | `string` | Optional description |
| `parentId` | `number \| null` | Parent term ID |

## Dependencies

### Hooks
- `useTerm` - Fetch existing term
- `useCreateTerm` - Create mutation
- `useUpdateTerm` - Update mutation
- `useTerms` - Fetch sibling terms for parent select
- `useTaxonomy` - Fetch taxonomy metadata

### Icons
- `lucide-react` - Save, ArrowLeft

### Libraries
- `next/link` - Navigation
- `next/navigation` - useRouter

## Events & Callbacks

| Event | Trigger | Description |
|-------|---------|-------------|
| `handleSubmit` | Form submit | Creates or updates term |

## Styling
- **CSS Module**: `TermEditor.module.scss`

## Features
- Create/edit modes
- Auto-generate slug from name
- Parent selection (for hierarchical taxonomies)
- Dynamic labels based on taxonomy

## UI Sections

### Header
- Back to terms link
- Title (Create/Edit [Term Type])

### Basic Information Section
- Name (required)
- Slug (required, auto-generated)
- Description (textarea, optional)

### Hierarchy Section (if hierarchical)
- Parent select dropdown
- "None (Top Level)" option
- Excludes current term from parent options

### Actions
- Cancel button
- Save/Update button

## Related Components
- Parent: `TermsList`
- Return to: `/admin/taxonomies/[id]/terms`
