# Component: ModerationAnalytics

## Description
Analytics dashboard for moderation activities. Displays time series charts, AI-detected patterns, moderator performance metrics, and rule effectiveness.

## Location
`src/components/cms/moderation/ModerationAnalytics.tsx`

## Props Interface
None - self-contained analytics page component.

## Data Requirements

### Moderation Stats Type
```typescript
interface ModerationStats {
  totalFlagged: number;
  totalApproved: number;
  totalRejected: number;
  totalEscalated: number;
  avgResponseTime: string;
  aiAccuracy: number;
}
```

### Time Series Data
```typescript
interface TimeSeriesPoint {
  date: string;
  flagged: number;
  approved: number;
  rejected: number;
  escalated: number;
}
```

### AI Pattern Type
```typescript
interface AIPattern {
  id: string;
  type: 'spam_wave' | 'coordinated_attack' | 'emerging_topic' | 'user_behavior';
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  affectedItems: number;
  detectedAt: string;
}
```

### Moderator Performance
```typescript
interface ModeratorStats {
  id: string;
  name: string;
  avatar?: string;
  actionsCount: number;
  avgResponseTime: string;
  accuracy: number;
  overturnRate: number;
}
```

## Internal State

| State Variable | Type | Purpose |
|----------------|------|---------|
| `timeRange` | `'7d' \| '30d' \| '90d'` | Date range for data |
| `stats` | `ModerationStats` | Aggregate statistics |
| `timeSeries` | `TimeSeriesPoint[]` | Chart data |
| `patterns` | `AIPattern[]` | AI-detected patterns |
| `moderators` | `ModeratorStats[]` | Moderator performance |

## Dependencies

### Icons
- `lucide-react` - BarChart3, TrendingUp, TrendingDown, Clock, Target, Shield, AlertTriangle, Sparkles, Users

## Styling
- **CSS Module**: `ModerationAnalytics.module.scss`

## Features
- Time range selector
- Key metrics cards
- Activity time series chart
- AI-detected patterns list
- Moderator leaderboard
- Rule effectiveness metrics
- Category breakdown
- Response time trends

## UI Sections

### Header
- "Moderation Analytics" title
- Time range selector (7d/30d/90d)

### Key Metrics
- Total flagged items
- Approval rate
- Average response time
- AI accuracy

### Activity Chart
- Line/bar chart showing:
  - Flagged items
  - Approved items
  - Rejected items
  - Escalated items

### AI Patterns Panel
- Detected patterns list
- Severity badges
- Affected item counts
- Pattern type icons

### Moderator Performance
- Leaderboard table
- Actions count
- Response time
- Accuracy percentage
- Overturn rate

### Category Breakdown
- Pie/bar chart by content type
- Flag reason distribution

## Related Components
- Parent: Admin moderation section
- See also: `ModerationQueue`, `AutoModerationRules`
