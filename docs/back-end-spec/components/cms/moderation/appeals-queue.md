# Component: AppealsQueue

## Description
Interface for managing user appeals against moderation decisions. Displays appeal timeline, original content, moderation action details, and provides approve/reject decision controls.

## Location
`src/components/cms/moderation/AppealsQueue.tsx`

## Props Interface
None - self-contained page component.

## Data Requirements

### Appeal Type
```typescript
interface Appeal {
  id: string;
  contentId: string;
  contentType: 'post' | 'comment' | 'reply';
  originalContent: string;
  moderationAction: {
    type: 'rejected' | 'hidden' | 'warned' | 'banned';
    reason: string;
    moderatorId: string;
    moderatorName: string;
    actionedAt: string;
  };
  appellant: {
    id: string;
    name: string;
    avatar?: string;
    reputation: number;
    memberSince: string;
  };
  appealReason: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  timeline: AppealEvent[];
}
```

### Appeal Event Type
```typescript
interface AppealEvent {
  id: string;
  type: 'submitted' | 'reviewed' | 'info_requested' | 'response' | 'decided';
  description: string;
  actor?: string;
  timestamp: string;
}
```

## Internal State

| State Variable | Type | Purpose |
|----------------|------|---------|
| `appeals` | `Appeal[]` | All appeals |
| `statusFilter` | `'all' \| 'pending' \| 'approved' \| 'rejected'` | Status filter |
| `selectedAppeal` | `Appeal \| null` | Selected appeal for detail view |
| `decisionNote` | `string` | Note for approval/rejection |

## Dependencies

### Icons
- `lucide-react` - MessageSquare, CheckCircle, XCircle, Clock, User, AlertTriangle, History, Send, ChevronRight

## Events & Callbacks

| Event | Trigger | Description |
|-------|---------|-------------|
| `handleApproveAppeal` | Approve button | Upholds appeal, reverses moderation |
| `handleRejectAppeal` | Reject button | Denies appeal, maintains moderation |
| `handleRequestInfo` | Request info button | Requests more information from appellant |
| `handleSelectAppeal` | Appeal card click | Opens appeal detail view |

## Styling
- **CSS Module**: `AppealsQueue.module.scss`

## Features
- Status filter tabs
- Appeal cards with preview
- Timeline view of events
- Original content display
- Moderation action details
- Appellant profile info
- Decision controls with notes
- Request additional information

## UI Sections

### Header
- "Appeals Queue" title
- Pending count badge
- Status filter tabs

### Appeals List
- Appeal cards showing:
  - Appellant info
  - Content preview
  - Original action type
  - Appeal reason preview
  - Submitted date
  - Status badge

### Appeal Detail Modal
- Full appellant profile
- Complete timeline
- Original content
- Moderation action details
- Appeal reason (full)
- Decision panel with:
  - Note textarea
  - Approve button
  - Reject button
  - Request info button

### Timeline Section
- Chronological events
- Event type icons
- Actor names
- Timestamps

## Related Components
- Parent: Admin moderation section
- See also: `ModerationQueue`, `ModerationAnalytics`
