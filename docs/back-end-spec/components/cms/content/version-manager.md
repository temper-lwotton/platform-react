# Component: VersionManager

## Description
Content version management interface for creating, viewing, and scheduling version switches. Displays all versions of a post with statistics, and allows scheduling automatic version transitions.

## Location
`src/components/cms/content/VersionManager.tsx`

## Props Interface

```typescript
interface VersionManagerProps {
  postId: string;
  postTitle: string;
}
```

## Data Requirements

### Content Version Type
```typescript
interface ContentVersion {
  id: string;
  versionNumber: number;
  title: string;
  content: string;
  isActive: boolean;
  createdAt: string;
  createdBy: string;
  publishedAt?: string;
  stats?: {
    views: number;
    engagement: number;
  };
}
```

### Scheduled Switch Type
```typescript
interface ScheduledSwitch {
  id: string;
  fromVersion: ContentVersion;
  toVersion: ContentVersion;
  scheduledFor: string;
  reason?: string;
  status: 'pending' | 'completed';
}
```

## Internal State

| State Variable | Type | Purpose |
|----------------|------|---------|
| `versions` | `ContentVersion[]` | All versions of the post |
| `scheduledSwitches` | `ScheduledSwitch[]` | Scheduled version changes |
| `showNewVersionModal` | `boolean` | New version modal visibility |
| `showScheduleModal` | `boolean` | Schedule switch modal visibility |
| `selectedVersion` | `ContentVersion \| null` | Version being previewed |
| `scheduleConfig` | `object` | Schedule form data |

## Dependencies

### Icons
- `lucide-react` - Layers, Plus, Eye, Edit, Copy, Trash2, CheckCircle, Clock, Calendar, ArrowRight, Sparkles, History, AlertCircle, Send

## Styling
- **CSS Module**: `VersionManager.module.scss`

## Features
- Active version banner with stats
- Version list with actions
- Scheduled switches sidebar
- Create new version modal
- Schedule switch modal
- Preview version modal
- AI recommendations
- Activate, duplicate, delete actions

## UI Sections

### Header
- Layers icon
- "Version Manager" title
- Post title subtitle
- "Create New Version" button

### Active Version Banner
- CheckCircle indicator
- Version number and title
- Published date
- Views and engagement stats

### Versions Section
- Section header with count
- "Schedule Version Switch" button
- Version cards (sorted by version number desc)

### Version Card
- Version number badge
- Title
- Created by and date
- Active badge (if applicable)
- Content preview
- Stats (views, engagement)
- Actions: Preview, Edit, Duplicate, Activate Now, Delete

### Scheduled Switches Section
- Clock icon header
- Empty state with create button
- Schedule cards showing:
  - Scheduled status
  - Cancel button
  - Date and time
  - From/To version visualization
  - Reason (if provided)

### AI Recommendation
- Sparkles icon
- A/B testing suggestion

### New Version Modal
Options:
- Start from Scratch
- Duplicate Active Version
- Restore Previous Version

### Schedule Switch Modal
Fields:
- From Version dropdown
- To Version dropdown
- Schedule Date & Time picker
- Reason textarea (optional)

### Preview Modal
- Version content preview
- "Activate This Version" button (for inactive versions)

## Version Actions
```typescript
const handleActivateNow = (versionId: string) => {
  // Makes version active immediately
};

const handleDuplicateVersion = (versionId: string) => {
  // Creates copy with new version number
};

const handleDeleteVersion = (versionId: string) => {
  // Removes non-active version
};

const handleScheduleSwitch = () => {
  // Creates scheduled version switch
};

const handleCancelSchedule = (scheduleId: string) => {
  // Removes scheduled switch
};
```

## Related Components
- Parent: Post editor
- See also: `ContentCalendar`, `VersionHistoryPanel`
