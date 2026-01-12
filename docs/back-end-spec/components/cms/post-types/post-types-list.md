# Component: PostTypesList

## Description
Admin listing page for managing post types (content types). Displays post types in a searchable grid with active/inactive filtering and CRUD operations.

## Location
`src/components/cms/post-types/PostTypesList.tsx`

## Props Interface
None - self-contained page component.

## Data Requirements

### Post Type Type
```typescript
interface PostType {
  id: number;
  name: string;
  singularLabel: string;
  pluralLabel: string;
  slug: string;
  isActive: boolean;
  public: boolean;
  hierarchical: boolean;
  supports: PostTypeSupport[];
}

type PostTypeSupport =
  | 'title'
  | 'editor'
  | 'author'
  | 'thumbnail'
  | 'excerpt'
  | 'revisions'
  | 'custom-fields'
  | 'comments'
  | 'trackbacks'
  | 'page-attributes';
```

## Internal State

| State Variable | Type | Purpose |
|----------------|------|---------|
| `search` | `string` | Search query |
| `showInactive` | `boolean` | Include inactive post types |

## Dependencies

### Hooks
- `usePostTypes` - Fetch post types
- `useDeletePostType` - Delete mutation

### Icons
- `lucide-react` - FolderOpen, Plus, Edit, Trash2, Search, Archive, CheckCircle, XCircle

### Libraries
- `next/link` - Navigation

## Events & Callbacks

| Event | Trigger | Description |
|-------|---------|-------------|
| `handleDelete` | Delete button | Deletes post type with confirmation |

## Styling
- **CSS Module**: `PostTypesList.module.scss`

## Features
- Search by name or labels
- Show inactive toggle
- Post type cards with metadata
- Active/inactive badges
- Public/hierarchical badges
- Supports list preview
- Edit/delete actions

## UI Sections

### Header
- "Post Types" title
- Subtitle
- "Add New Post Type" button

### Filters
- Search box
- Show inactive checkbox

### Post Types Grid
- Cards showing:
  - FolderOpen icon
  - Edit/Delete action buttons
  - Singular label
  - Plural label
  - Name and slug
  - Status badges (active/inactive, public, hierarchical)
  - Supports preview (first 3 + count)

### Empty State
- FolderOpen icon
- "No post types found" message
- Create button

## Query Configuration
```typescript
usePostTypes({
  active: showInactive ? undefined : true,
});
```

## Related Components
- Parent: Admin layout
- Links to: `PostTypeEditor`
