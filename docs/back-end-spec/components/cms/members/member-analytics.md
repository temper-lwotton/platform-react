# Component: MemberAnalytics

## Description
Comprehensive analytics dashboard for tracking member growth, engagement, and community health. Features time series charts, lifecycle distribution, top contributors, and AI-powered insights.

## Location
`src/components/cms/members/MemberAnalytics.tsx`

## Props Interface
None - self-contained analytics page component.

## Data Requirements

### Metric Card Type
```typescript
interface MetricCard {
  label: string;
  value: string | number;
  change: number;
  changeLabel: string;
  icon: 'users' | 'user-plus' | 'activity' | 'award';
}
```

### Time Series Point Type
```typescript
interface TimeSeriesPoint {
  date: string;
  newMembers: number;
  activeMembers: number;
  churnedMembers: number;
}
```

### Lifecycle Data Type
```typescript
interface LifecycleData {
  stage: string;
  count: number;
  percentage: number;
  color: string;
}
```

### Top Contributor Type
```typescript
interface TopContributor {
  id: string;
  name: string;
  avatar?: string;
  posts: number;
  comments: number;
  reputation: number;
  engagementScore: number;
}
```

### AI Insight Type
```typescript
interface AIInsight {
  type: 'success' | 'warning' | 'info';
  title: string;
  description: string;
  recommendation?: string;
}
```

## Internal State

| State Variable | Type | Purpose |
|----------------|------|---------|
| `timeRange` | `'7d' \| '30d' \| '90d' \| '1y'` | Selected time range |

## Dependencies

### Icons
- `lucide-react` - TrendingUp, Users, UserPlus, Activity, Award, Target, Clock, Sparkles, ArrowUp, ArrowDown, Calendar

## Styling
- **CSS Module**: `MemberAnalytics.module.scss`

## Features
- Time range selector
- Key metrics cards with trends
- AI insights with recommendations
- Member growth bar chart
- Active members line chart
- Lifecycle distribution visualization
- Top contributors leaderboard

## UI Sections

### Header
- "Member Analytics" title
- Subtitle
- Time range selector buttons (7d, 30d, 90d, 1y)

### Key Metrics Grid
- Total Members card
- New This Month card
- Active Members card
- Average Engagement card
- Each with value, change percentage, and trend arrow

### AI Insights Section
- Sparkles icon header
- Insight cards with:
  - Type icon (success/warning/info)
  - Title
  - Description
  - Recommendation text

### Charts Grid

#### Member Growth Chart
- Bar chart showing:
  - New members (blue bars)
  - Churned members (red bars)
- Legend
- X-axis date labels

#### Active Members Chart
- Line chart with gradient fill
- Data points
- X-axis date labels

### Bottom Grid

#### Lifecycle Distribution
- Target icon header
- Horizontal bar chart
- Stage labels with counts and percentages
- Color-coded by stage:
  - New (green)
  - Active (blue)
  - Power Users (purple)
  - Champions (gold)
  - At Risk (orange)
  - Inactive (gray)

#### Top Contributors
- Award icon header
- Ranked list showing:
  - Rank number
  - Avatar or initials
  - Name
  - Stats (posts, comments)
  - Engagement score

## Related Components
- Parent: Admin members section
- See also: `MembersDirectory`, `MemberProfile`, `MemberSegments`
