# Component: AnalyticsDashboard

## Description
AI-powered analytics dashboard displaying space health metrics, actionable insights, weekly wins, predictions, and detailed engagement/content/user metrics.

## Location
`src/components/cms/analytics/AnalyticsDashboard.tsx`

## Props Interface
None - self-contained analytics page component.

## Data Requirements

### Insight Type
```typescript
interface Insight {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  metric?: string;
  actions: InsightAction[];
}

interface InsightAction {
  label: string;
  type: 'primary' | 'secondary';
}
```

### Metric Type
```typescript
interface Metric {
  label: string;
  value: string;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
}
```

### Prediction Type
```typescript
interface Prediction {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
  confidence?: 'high' | 'medium';
}
```

### Space Health Type
```typescript
interface SpaceHealth {
  score: number;
  status: 'Thriving' | 'Healthy' | 'Needs Attention';
  trend: number;
}
```

## Dependencies

### Icons
- `lucide-react` - TrendingUp, TrendingDown, AlertCircle, CheckCircle2, Sparkles, Users, MessageSquare, FileText, Calendar, Target, Zap

## Styling
- **CSS Module**: `AnalyticsDashboard.module.scss`

## Features
- Space health score (circular progress)
- Prioritized AI insights with actions
- Weekly wins metrics
- Predictive analytics
- Detailed metrics by category
- Trend indicators throughout

## UI Sections

### Header
- "Analytics & Insights" title
- Subtitle

### Space Health Section
- Health score circle (SVG)
- Status label (Thriving, etc.)
- Week-over-week trend

### What Needs Attention Section
- Insight cards with:
  - Icon
  - Priority badge (high/medium/low)
  - Title and description
  - Metric highlight
  - Primary/secondary action buttons

### This Week's Wins Section
- Metric cards with:
  - Label
  - Value
  - Trend indicator with percentage

### Looking Ahead Section
- Prediction cards with:
  - Icon
  - Prediction text
  - Confidence badge

### Detailed Metrics Section

#### Engagement Metrics
- Posts, Comments, Reactions, Shares
- Change percentages with trend

#### Content Metrics
- Published Posts, Drafts, Avg. Read Time, Top Category
- Change percentages with trend

#### User Metrics
- Total Members, Active This Week, New This Week, Retention Rate
- Change percentages with trend

## Related Components
- Parent: Admin analytics section
- See also: `MemberAnalytics`, `ContentDashboard`
