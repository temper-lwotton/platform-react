# Component: PostTypeEditor

## Description
Editor interface for creating and editing post types (content types). Includes fields for basic info, settings toggles, menu appearance, and supported features.

## Location
`src/components/cms/post-types/PostTypeEditor.tsx`

## Props Interface

```typescript
interface PostTypeEditorProps {
  postTypeId?: number;
}
```

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
  hasArchive: boolean;
  hierarchical: boolean;
  showInMenu: boolean;
  menuIcon: string;
  menuPosition: number;
  supports: PostTypeSupport[];
}
```

### Supported Features
```typescript
const AVAILABLE_SUPPORTS = [
  { value: 'title', label: 'Title', description: 'Post title field' },
  { value: 'editor', label: 'Editor', description: 'Rich text content editor' },
  { value: 'author', label: 'Author', description: 'Author attribution' },
  { value: 'thumbnail', label: 'Featured Image', description: 'Thumbnail/featured image' },
  { value: 'excerpt', label: 'Excerpt', description: 'Short summary text' },
  { value: 'revisions', label: 'Revisions', description: 'Version history' },
  { value: 'custom-fields', label: 'Custom Fields', description: 'Meta fields' },
  { value: 'comments', label: 'Comments', description: 'Comment system' },
  { value: 'trackbacks', label: 'Trackbacks', description: 'Trackback support' },
  { value: 'page-attributes', label: 'Page Attributes', description: 'Order, parent, template' },
];
```

## Internal State

| State Variable | Type | Purpose |
|----------------|------|---------|
| `name` | `string` | Internal name |
| `singularLabel` | `string` | Singular display label |
| `pluralLabel` | `string` | Plural display label |
| `slug` | `string` | URL slug |
| `isActive` | `boolean` | Active status |
| `isPublic` | `boolean` | Public visibility |
| `hasArchive` | `boolean` | Archive page enabled |
| `hierarchical` | `boolean` | Parent/child relationships |
| `showInMenu` | `boolean` | Show in admin menu |
| `menuIcon` | `string` | Menu icon name |
| `menuPosition` | `number` | Menu ordering |
| `supports` | `PostTypeSupport[]` | Enabled features |

## Dependencies

### Hooks
- `usePostType` - Fetch existing post type
- `useCreatePostType` - Create mutation
- `useUpdatePostType` - Update mutation

### Icons
- `lucide-react` - Save, ArrowLeft

### Libraries
- `next/link` - Navigation
- `next/navigation` - useRouter

## Events & Callbacks

| Event | Trigger | Description |
|-------|---------|-------------|
| `handleSupportToggle` | Support checkbox | Toggles feature support |
| `handleSubmit` | Form submit | Creates or updates post type |

## Styling
- **CSS Module**: `PostTypeEditor.module.scss`

## Features
- Create/edit modes
- Auto-generate slug from name
- Name disabled in edit mode
- Settings toggles
- Icon selector
- Menu position input
- Feature checkboxes with descriptions

## UI Sections

### Header
- Back button
- Title (Create/Edit Post Type)

### Basic Information Section
- Name (required, disabled in edit)
- Singular Label (required)
- Plural Label (required)
- Slug (required, auto-generated)

### Settings Section
Toggles for:
- Active
- Public
- Has Archive
- Hierarchical
- Show in Menu

### Menu Appearance Section
- Menu Icon selector
- Menu Position number input

### Supported Features Section
- Feature checkboxes with labels and descriptions

### Actions
- Cancel button
- Save/Update button

## Related Components
- Parent: Admin post types section
- Return to: `PostTypesList`
