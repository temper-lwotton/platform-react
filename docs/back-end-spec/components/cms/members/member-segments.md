# Component: MemberSegments

## Description
Member segmentation management interface with AI-powered suggestions. Allows creating rule-based segments for targeted engagement, with performance metrics and member previews.

## Location
`src/components/cms/members/MemberSegments.tsx`

## Props Interface
None - self-contained admin page component.

## Data Requirements

### Segment Type
```typescript
interface Segment {
  id: string;
  name: string;
  description: string;
  rules: SegmentRule[];
  memberCount: number;
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
  performance: {
    engagementRate: number;
    openRate?: number;
    clickRate?: number;
    trend: 'up' | 'down' | 'stable';
  };
}
```

### Segment Rule Type
```typescript
interface SegmentRule {
  field: 'lifecycle_stage' | 'joined_date' | 'last_active' | 'reputation' | 'posts_count' | 'engagement_score' | 'tag';
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'within_days';
  value: string | number;
}
```

### AI Suggestion Type
```typescript
interface AISegmentSuggestion {
  id: string;
  name: string;
  description: string;
  rules: SegmentRule[];
  estimatedMembers: number;
  reasoning: string;
  confidence: number;
}
```

## Internal State

| State Variable | Type | Purpose |
|----------------|------|---------|
| `segments` | `Segment[]` | All segments |
| `aiSuggestions` | `AISegmentSuggestion[]` | AI-generated suggestions |
| `showCreateModal` | `boolean` | Create segment modal |
| `editingSegment` | `Segment \| null` | Segment being edited |
| `previewMembers` | `Member[]` | Preview of matching members |

## Dependencies

### Icons
- `lucide-react` - Users, Plus, Edit, Trash2, Target, Sparkles, TrendingUp, TrendingDown, Eye, Copy, Filter

## Events & Callbacks

| Event | Trigger | Description |
|-------|---------|-------------|
| `handleCreateSegment` | Create button | Opens create modal |
| `handleEditSegment` | Edit button | Opens edit modal with segment |
| `handleDeleteSegment` | Delete button | Deletes segment with confirmation |
| `handleAcceptSuggestion` | Accept AI suggestion | Creates segment from suggestion |
| `handlePreviewSegment` | Preview button | Shows matching members |

## Styling
- **CSS Module**: `MemberSegments.module.scss`

## Features
- Segment cards with stats
- System segments (non-editable)
- Rule-based targeting
- AI segment suggestions
- Member count preview
- Performance metrics
- Create/edit modal with rule builder
- Duplicate segment
- Export segment members

## UI Sections

### Header
- "Member Segments" title
- "Create Segment" button

### AI Suggestions Panel
- Sparkles icon header
- Suggestion cards with:
  - Suggested name
  - Description
  - Estimated members
  - AI confidence
  - Accept/dismiss buttons

### Segments Grid
- Segment cards showing:
  - Name and description
  - Member count
  - Rule summary
  - Performance metrics
  - System badge (if applicable)
  - Action buttons

### Create/Edit Modal
- Name input
- Description textarea
- Rule builder:
  - Field dropdown
  - Operator dropdown
  - Value input
  - Add rule button
- Live member count preview
- Save/Cancel buttons

### Preview Modal
- List of matching members
- Member cards
- Export option

## Rule Builder Fields

| Field | Operators | Value Type |
|-------|-----------|------------|
| lifecycle_stage | equals, not_equals | dropdown |
| joined_date | within_days | number |
| last_active | within_days | number |
| reputation | greater_than, less_than | number |
| posts_count | greater_than, less_than | number |
| engagement_score | greater_than, less_than | number |
| tag | equals, contains | text |

## Related Components
- Parent: Admin members section
- See also: `MemberProfile`, `MemberAnalytics`, `MembersDirectory`
