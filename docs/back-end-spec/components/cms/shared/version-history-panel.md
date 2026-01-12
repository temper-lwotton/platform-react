# Component: VersionHistoryPanel

## Description
Version history timeline panel showing all saved versions of content with actions for restore, publish, duplicate, delete, and comparison. Features collapsible interface, autosave filtering, and multi-version selection for comparison.

## Location
`src/components/cms/shared/VersionHistoryPanel.tsx`

## Props Interface

```typescript
interface VersionHistoryPanelProps {
  postId: number;
  onViewVersion?: (versionId: number) => void;
  onCompareVersions?: (v1: number, v2: number) => void;
}
```

## Data Requirements

### PostVersionListItem Type
```typescript
// From @/types/cms
interface PostVersionListItem {
  id: number;
  versionNumber: number;
  title: string;
  isPublished: boolean;
  isAutosave: boolean;
  isLatest: boolean;
  changeDescription?: string;
  author: {
    id: number;
    name: string;
  };
  createdAt: string;
}
```

## Internal State

| State Variable | Type | Purpose |
|----------------|------|---------|
| `selectedVersions` | `number[]` | Version IDs selected for comparison (max 2) |
| `expandedPanel` | `boolean` | Panel expanded/collapsed state |
| `showAutosaves` | `boolean` | Toggle to show/hide autosave versions |

## Dependencies

### Hooks
- `useVersions` - Fetch version history
- `useRestoreVersion` - Restore content from version
- `usePublishVersion` - Publish specific version
- `useDuplicateVersion` - Create copy of version
- `useDeleteVersion` - Remove version

### Icons
- `lucide-react` - History, Clock, User, RotateCcw, Eye, CheckCircle, AlertCircle, Copy, Trash2

### Libraries
- `date-fns` - formatDistanceToNow

## Events & Callbacks

| Event | Trigger | Description |
|-------|---------|-------------|
| `handleVersionClick` | Version checkbox | Toggles version selection (max 2) |
| `handleRestore` | Restore button | Restores version with confirmation |
| `handlePublish` | Publish button | Publishes version with confirmation |
| `handleDuplicate` | Duplicate button | Creates copy of version |
| `handleDelete` | Delete button | Deletes version with confirmation |
| `handleCompare` | Compare button | Triggers version comparison callback |

## Styling
- **CSS Module**: `VersionHistoryPanel.module.scss`

## Usage Example

```tsx
import { VersionHistoryPanel } from '@/components/cms/shared/VersionHistoryPanel';

<VersionHistoryPanel
  postId={123}
  onViewVersion={(versionId) => console.log('View:', versionId)}
  onCompareVersions={(v1, v2) => setComparisonVersions({ v1, v2 })}
/>
```

## Features
- Collapsible panel with version count
- Show/hide autosaves toggle
- Multi-version selection for comparison (max 2)
- Compare button when 2 versions selected
- Timeline layout with version items
- Version badges: Published, Autosave, Latest
- Change description display
- Author and timestamp info
- Hover actions for each version
- Confirmation dialogs for destructive actions
- Loading and empty states

## Panel Sections

### Header
- History icon
- "Version History" title
- Version count badge
- Click to expand/collapse

### Filters
- "Show autosaves" checkbox

### Compare Button
- Appears when 2 versions selected
- "Compare Selected Versions" label

### Timeline (VersionItem sub-component)
Each version item displays:
- Selection checkbox
- Version number (v1, v2, etc.)
- Status badges:
  - Published (green with CheckCircle)
  - Autosave (amber with AlertCircle)
  - Latest (neutral)
- Title
- Change description (if any)
- Author name with icon
- Relative timestamp ("2 hours ago")

### Hover Actions
- View (Eye) - always available
- Restore (RotateCcw) - non-latest versions
- Publish (CheckCircle) - unpublished versions
- Duplicate (Copy) - always available
- Delete (Trash2) - unpublished, non-latest only

## Empty States
- Loading: "Loading versions..."
- No versions: "No versions yet" / "No manual versions yet"

## Related Components
- Parent: `PostEditor`, `PageEditor`
- See also: `VersionComparisonModal`
