# Component: BroadcastsDashboard

## Description
Analytics dashboard for email broadcasts showing performance metrics, campaign statistics, and recent broadcast activity with visual charts and insights.

## Location
`src/components/cms/broadcasts/BroadcastsDashboard.tsx`

## Props Interface
None - self-contained dashboard component.

## Data Requirements

### Dashboard Statistics
```typescript
interface BroadcastStats {
  totalSent: number;
  avgOpenRate: number;
  avgClickRate: number;
  subscriberCount: number;
  unsubscribeRate: number;
  recentCampaigns: RecentCampaign[];
}

interface RecentCampaign {
  id: number;
  name: string;
  sentAt: string;
  recipientCount: number;
  openRate: number;
  clickRate: number;
}
```

## Internal State

| State Variable | Type | Purpose |
|----------------|------|---------|
| `dateRange` | `string` | Selected time period filter |

## Dependencies

### Hooks
- `useBroadcastStats` - Fetch dashboard metrics

### Icons
- `lucide-react` - Mail, Users, MousePointer, TrendingUp, Send, Eye

## Features
- Key metrics cards:
  - Total emails sent
  - Average open rate
  - Average click rate
  - Subscriber count
- Date range filter
- Performance trends chart
- Recent campaigns list with stats
- Quick actions (Create New, View All)

## Metrics Display

### Stats Cards
- Total Sent with trend indicator
- Open Rate percentage
- Click Rate percentage
- Active Subscribers

### Recent Campaigns
- Campaign name
- Sent date
- Recipient count
- Open and click rates
- Status indicator

## Related Components
- Parent: Admin layout
- Links to: `BroadcastsList`, `BroadcastEditor`
