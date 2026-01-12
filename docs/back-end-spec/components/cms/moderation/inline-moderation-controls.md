# Component: InlineModerationControls

## Description
Compact contextual moderation controls that can be embedded inline with content. Supports both compact icon-only mode and full mode with labels. Provides quick moderation actions for approve, flag, hide, warn, delete, and ban.

## Location
`src/components/cms/moderation/InlineModerationControls.tsx`

## Props Interface

```typescript
interface InlineModerationControlsProps {
  contentId: string;
  contentType: 'post' | 'comment' | 'reply';
  authorId: string;
  variant?: 'compact' | 'full';
  onAction?: (action: ModerationAction) => void;
}

type ModerationAction = 'approve' | 'flag' | 'hide' | 'warn' | 'delete' | 'ban';
```

## Data Requirements

### Current User
```typescript
interface CurrentUser {
  id: string;
  role: 'admin' | 'moderator' | 'member';
  capabilities: string[];
}
```

## Internal State

| State Variable | Type | Purpose |
|----------------|------|---------|
| `isProcessing` | `boolean` | Loading state during action |
| `showConfirm` | `ModerationAction \| null` | Which action needs confirmation |

## Dependencies

### Hooks
- `useCurrentUser` - Get current user permissions
- `useModerationAction` - Execute moderation actions

### Icons
- `lucide-react` - Check, Flag, EyeOff, AlertTriangle, Trash2, Ban, Loader2

## Events & Callbacks

| Event | Trigger | Description |
|-------|---------|-------------|
| `handleAction` | Action button click | Initiates moderation action |
| `confirmAction` | Confirm dialog OK | Executes the action |
| `cancelAction` | Confirm dialog cancel | Cancels pending action |

## Styling
- **CSS Module**: `InlineModerationControls.module.scss`

## Features
- Compact (icon-only) and full (with labels) modes
- Confirmation dialog for destructive actions
- Loading state during processing
- Permission-based action visibility
- Tooltip hints

## Action Buttons

| Action | Icon | Requires Confirmation | Permission |
|--------|------|----------------------|------------|
| Approve | Check | No | moderate_content |
| Flag | Flag | No | flag_content |
| Hide | EyeOff | No | hide_content |
| Warn | AlertTriangle | Yes | warn_users |
| Delete | Trash2 | Yes | delete_content |
| Ban | Ban | Yes | ban_users |

## Usage Example

```tsx
<InlineModerationControls
  contentId={post.id}
  contentType="post"
  authorId={post.authorId}
  variant="compact"
  onAction={(action) => console.log(`Action: ${action}`)}
/>
```

## Related Components
- Used by: `ModerationQueue`, `PostCard`, `CommentThread`
- See also: `FloatingModerationPanel`
