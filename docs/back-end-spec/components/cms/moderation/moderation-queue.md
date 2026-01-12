# Component: ModerationQueue

## Description
Full moderation queue interface with AI-powered insights, priority filtering, and quick moderation actions. Displays flagged content items with user context, AI analysis, and action buttons.

## Location
`src/components/cms/moderation/ModerationQueue.tsx`

## Props Interface
None - self-contained page component.

## Data Requirements

### Moderation Item Type
```typescript
interface ModerationItem {
  id: string;
  type: 'post' | 'comment' | 'reply';
  content: string;
  contentPreview: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    reputation: number;
    joinedDate: string;
    previousFlags: number;
  };
  flaggedAt: string;
  flaggedBy: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  aiAnalysis?: {
    confidence: number;
    category: string;
    reasoning: string;
    suggestedAction: 'approve' | 'reject' | 'warn' | 'escalate';
  };
  status: 'pending' | 'approved' | 'rejected' | 'escalated';
}
```

### AI Insight Type
```typescript
interface AIInsight {
  type: 'warning' | 'info' | 'success';
  title: string;
  description: string;
  relatedItemIds?: string[];
}
```

## Internal State

| State Variable | Type | Purpose |
|----------------|------|---------|
| `items` | `ModerationItem[]` | Flagged content items |
| `aiInsights` | `AIInsight[]` | AI-generated insights |
| `priorityFilter` | `'all' \| 'high' \| 'medium' \| 'low'` | Priority filter |
| `selectedItem` | `ModerationItem \| null` | Selected item for detail view |

## Dependencies

### Icons
- `lucide-react` - Flag, Shield, AlertTriangle, CheckCircle, XCircle, User, Clock, Sparkles, ChevronRight, Eye, Ban, MessageSquare

## Events & Callbacks

| Event | Trigger | Description |
|-------|---------|-------------|
| `handleApprove` | Approve button | Approves content and clears flag |
| `handleReject` | Reject button | Removes content |
| `handleWarn` | Warn button | Warns the author |
| `handleBan` | Ban button | Bans the user |
| `handleEscalate` | Escalate button | Escalates to senior moderator |

## Styling
- **CSS Module**: `ModerationQueue.module.scss`

## Features
- Priority filtering (high/medium/low)
- AI confidence scores on each item
- User context panel (reputation, join date, previous flags)
- Quick action buttons
- AI insights section
- Content preview with full text expansion
- Bulk moderation capabilities
- Status badges

## UI Sections

### Header
- "Moderation Queue" title
- Item count badge
- Priority filter tabs

### AI Insights Panel
- Sparkles icon
- Pattern detection alerts
- User behavior insights
- Recommendation cards

### Queue List
- Item cards with:
  - Content type badge
  - Author info
  - Content preview
  - Flag reason
  - AI analysis section
  - Action buttons

### Item Detail Modal
- Full content view
- Complete author profile
- AI reasoning
- Moderation history
- Action buttons

## Related Components
- Child of: Admin layout
- Uses: `InlineModerationControls`
- See also: `AppealsQueue`, `ModerationAnalytics`
