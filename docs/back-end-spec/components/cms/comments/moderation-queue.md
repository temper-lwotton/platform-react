# Component: ModerationQueue (Comments)

## Description
Comment moderation interface for reviewing and managing comments across all posts. Supports status filtering, bulk actions, and individual comment moderation.

## Location
`src/components/cms/comments/ModerationQueue.tsx`

## Props Interface
None - self-contained page component.

## Data Requirements

### Comment Type
```typescript
interface Comment {
  id: number;
  postId: number;
  content: string;
  author: {
    name: string;
    email: string;
  };
  status: CommentStatus;
  createdAt: string;
}

type CommentStatus = 'pending' | 'approved' | 'spam' | 'trash';
```

### Comment Stats Type
```typescript
interface CommentStats {
  total: number;
  pending: number;
  approved: number;
  spam: number;
  trash: number;
  todayCount: number;
}
```

## Internal State

| State Variable | Type | Purpose |
|----------------|------|---------|
| `activeTab` | `FilterTab` | Current status filter |
| `selectedIds` | `number[]` | Selected comment IDs |

## Dependencies

### Hooks
- `useComments` - Fetch comments
- `useCommentStats` - Fetch statistics
- `useUpdateComment` - Status change mutation
- `useDeleteComment` - Delete mutation
- `useBulkUpdateComments` - Bulk action mutation

### Icons
- `lucide-react` - MessageSquare, Check, X, Trash2, AlertTriangle, Loader2

### Libraries
- `date-fns` - formatDistanceToNow

## Events & Callbacks

| Event | Trigger | Description |
|-------|---------|-------------|
| `handleStatusChange` | Action button | Changes comment status |
| `handleDelete` | Delete button | Permanently deletes comment |
| `handleBulkAction` | Bulk action button | Applies action to selected |
| `toggleSelection` | Checkbox | Toggles comment selection |
| `toggleSelectAll` | Select all checkbox | Selects/deselects all |

## Styling
- **CSS Module**: `ModerationQueue.module.scss`

## Features
- Stats summary bar
- Status filter tabs with counts
- Select all checkbox
- Bulk actions (approve, spam, trash, delete)
- Individual comment cards
- Author info display
- Post reference
- Action buttons per comment

## UI Sections

### Header
- MessageSquare icon
- "Comment Moderation" title
- Subtitle

### Stats Bar
- Total count
- Today's count
- Pending review count (highlighted)

### Filter Tabs
| Tab | Status |
|-----|--------|
| All | All comments |
| Pending | Awaiting review |
| Approved | Published |
| Spam | Marked as spam |
| Trash | Trashed |

### Bulk Actions Bar (when items selected)
- Selected count
- Approve button
- Spam button
- Trash button
- Delete button (danger)

### Comments List
- Select all row
- Comment items with:
  - Checkbox
  - Author name and email
  - Post ID reference
  - Created time
  - Comment content
  - Action buttons (status-dependent)

### Loading/Empty States
- Spinner with loading text
- Empty state with icon and message

## Related Components
- Parent: Admin comments section
- Different from: `cms/moderation/ModerationQueue` (content moderation)
