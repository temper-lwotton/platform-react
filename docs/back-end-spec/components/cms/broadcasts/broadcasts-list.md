# Component: BroadcastsList

## Description
Admin listing page for email broadcast campaigns with search, status filtering, and actions to create, edit, duplicate, and delete broadcasts.

## Location
`src/components/cms/broadcasts/BroadcastsList.tsx`

## Props Interface
None - self-contained page component.

## Data Requirements

### Broadcast Type
```typescript
interface Broadcast {
  id: number;
  name: string;
  subject: string;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
  scheduledFor?: string;
  sentAt?: string;
  recipientCount: number;
  openRate?: number;
  clickRate?: number;
  createdAt: string;
}
```

### Paginated Response
```typescript
interface BroadcastsResponse {
  data: Broadcast[];
  meta: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
}
```

## Internal State

| State Variable | Type | Purpose |
|----------------|------|---------|
| `search` | `string` | Search query |
| `statusFilter` | `string` | Status filter |
| `page` | `number` | Current page |

## Dependencies

### Hooks
- `useBroadcasts` - Fetch paginated broadcasts
- `useDeleteBroadcast` - Delete mutation
- `useDuplicateBroadcast` - Duplicate mutation

### Icons
- `lucide-react` - Mail, Plus, Search, Edit, Trash2, Copy, Eye, Send, Clock, CheckCircle

## Features
- Header with "New Broadcast" button
- Search input
- Status filter tabs (All, Draft, Scheduled, Sent, Failed)
- Broadcasts table with columns:
  - Name and subject
  - Status badge (color-coded)
  - Recipients count
  - Open rate (percentage)
  - Click rate (percentage)
  - Actions (Edit, View Stats, Duplicate, Delete)
- Pagination controls
- Empty state with create button

## Related Components
- Parent: Admin layout
- Links to: `BroadcastEditor`, `CampaignComposer`
