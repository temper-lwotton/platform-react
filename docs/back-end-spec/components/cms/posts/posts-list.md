# Component: PostsList

## Description
Admin posts listing page with search, filtering, bulk actions, and pagination. Displays posts in a table format with edit, view, duplicate, and delete actions.

## Location
`src/components/cms/posts/PostsList.tsx`

## Props Interface
None - self-contained page component.

## Data Requirements

### Post Type
```typescript
// From @/types/cms
interface Post {
  id: number;
  title: string;
  slug: string;
  isPublished: boolean;
  isDraft: boolean;
  hasUnpublishedChanges: boolean;
  lastModifiedAt: string;
  postType: {
    id: number;
    name: string;
    singularLabel: string;
    pluralLabel: string;
  };
  author: {
    id: number;
    name: string;
  };
}

type PostStatus = 'published' | 'draft' | 'has_changes';
```

### PostType Type
```typescript
interface PostType {
  id: number;
  name: string;
  singularLabel: string;
  pluralLabel: string;
  isActive: boolean;
}
```

### Paginated Response
```typescript
interface PostsResponse {
  data: Post[];
  meta: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
}
```

## Internal State

| State Variable | Type | Purpose |
|----------------|------|---------|
| `search` | `string` | Search query |
| `selectedPostType` | `string` | Post type filter |
| `selectedStatus` | `PostStatus \| ''` | Status filter |
| `page` | `number` | Current page number |
| `selectedPosts` | `number[]` | Selected post IDs for bulk actions |

## Dependencies

### Hooks
- `usePosts` - Fetch paginated posts with filters
- `usePostTypes` - Fetch post types for filter
- `useDeletePost` - Delete mutation
- `useDuplicatePost` - Duplicate mutation

### Icons
- `lucide-react` - FileText, Plus, Search, Filter, MoreVertical, Edit, Copy, Trash2, Eye

### Libraries
- `next/link` - Navigation
- `next/navigation` - useRouter
- `date-fns` - format

## Events & Callbacks

| Event | Trigger | Description |
|-------|---------|-------------|
| `handleDelete` | Delete button | Deletes post with confirmation |
| `handleDuplicate` | Duplicate button | Creates copy of post |
| `handleBulkDelete` | Bulk delete button | Deletes all selected posts |
| `togglePostSelection` | Row checkbox | Adds/removes post from selection |
| `toggleAllPosts` | Header checkbox | Selects/deselects all posts |

## Styling
- **CSS Module**: `PostsList.module.scss`

## Usage Example

```tsx
import { PostsList } from '@/components/cms/posts/PostsList';

// In admin/posts/page.tsx
export default function PostsPage() {
  return <PostsList />;
}
```

## Features
- Header with title and "Add New Post" button
- Search input with icon
- Post type filter dropdown
- Status filter dropdown (Published, Draft, Has Unpublished Changes)
- Bulk selection with select all checkbox
- Bulk delete action
- Posts table with columns:
  - Checkbox
  - Title (linked to edit page)
  - Type
  - Author
  - Status badge (color-coded)
  - Last Modified date
  - Actions (Edit, View, Duplicate, Delete)
- Pagination controls
- Empty state with create button
- Loading and error states

## Page Sections

### Header
- "Posts" title
- "Manage all your content" subtitle
- "Add New Post" button linking to `/admin/posts/new`

### Filters Bar
- Search input with Search icon
- Post type dropdown (from `usePostTypes`)
- Status dropdown: All, Published, Draft, Has Unpublished Changes

### Bulk Actions Bar
- Appears when posts are selected
- Shows selection count
- Bulk delete button

### Posts Table
| Column | Content |
|--------|---------|
| Checkbox | Row selection |
| Title | Linked to edit page |
| Type | Post type label |
| Author | Author name |
| Status | Color-coded badge |
| Last Modified | Formatted date |
| Actions | Edit, View (if published), Duplicate, Delete |

### Pagination
- Previous button
- "Page X of Y" indicator
- Next button

### Empty State
- FileText icon
- "No posts found" message
- "Create your first post to get started"
- Create Post button

## Query Configuration

```typescript
usePosts({
  search: search || undefined,
  postType: selectedPostType || undefined,
  status: selectedStatus || undefined,
  page,
  limit: 20,
});
```

## Related Components
- Parent: Admin layout
- Links to: `PostEditor`
