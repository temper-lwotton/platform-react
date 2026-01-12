# Component: TaxonomyEditor

## Description
Editor interface for creating and editing taxonomies. Includes fields for basic info, settings toggles, and post type associations.

## Location
`src/components/cms/taxonomies/TaxonomyEditor.tsx`

## Props Interface

```typescript
interface TaxonomyEditorProps {
  taxonomyId?: number;
}
```

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
  showInRest: boolean;
  postTypes: { id: number }[];
}
```

## Internal State

| State Variable | Type | Purpose |
|----------------|------|---------|
| `name` | `string` | Internal name |
| `singularLabel` | `string` | Singular display label |
| `pluralLabel` | `string` | Plural display label |
| `slug` | `string` | URL slug |
| `isActive` | `boolean` | Active status |
| `hierarchical` | `boolean` | Parent/child relationships |
| `showInMenu` | `boolean` | Show in admin menu |
| `showInRest` | `boolean` | Available via REST API |
| `selectedPostTypes` | `number[]` | Associated post type IDs |

## Dependencies

### Hooks
- `useTaxonomy` - Fetch existing taxonomy
- `useCreateTaxonomy` - Create mutation
- `useUpdateTaxonomy` - Update mutation
- `usePostTypes` - Fetch available post types

### Icons
- `lucide-react` - Save, ArrowLeft

### Libraries
- `next/link` - Navigation
- `next/navigation` - useRouter

## Events & Callbacks

| Event | Trigger | Description |
|-------|---------|-------------|
| `handlePostTypeToggle` | Post type checkbox | Toggles post type association |
| `handleSubmit` | Form submit | Creates or updates taxonomy |

## Styling
- **CSS Module**: `TaxonomyEditor.module.scss`

## Features
- Create/edit modes
- Auto-generate slug from name
- Name disabled in edit mode
- Settings toggles
- Post type association checkboxes

## UI Sections

### Header
- Back button
- Title (Create/Edit Taxonomy)

### Basic Information Section
- Name (required, disabled in edit)
- Singular Label (required)
- Plural Label (required)
- Slug (required, auto-generated)

### Settings Section
Toggles for:
- Active
- Hierarchical
- Show in Menu
- Show in REST API

### Associated Post Types Section
- List of active post types
- Checkboxes to select which post types use this taxonomy
- Empty state if no post types exist

### Actions
- Cancel button
- Save/Update button

## Related Components
- Parent: Admin taxonomies section
- Return to: `TaxonomiesList`
