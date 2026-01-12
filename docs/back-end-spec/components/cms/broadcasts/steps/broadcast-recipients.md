# Component: BroadcastRecipients

## Description
Step 2 of the broadcast wizard for selecting email recipients. Allows choosing between all users or specific user segments.

## Location
`src/components/cms/broadcasts/steps/BroadcastRecipients.tsx`

## Props Interface

```typescript
interface BroadcastRecipientsProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
}
```

## Data Requirements

### Recipient Configuration
```typescript
interface RecipientData {
  recipientType: 'all' | 'segment' | 'custom';
  recipientSegment?: string;
  recipientCount: number;
}
```

### Segment Type (mock data)
```typescript
interface Segment {
  id: string;
  name: string;
  count: number;
}
```

## Internal State

| State Variable | Type | Purpose |
|----------------|------|---------|
| `recipientType` | `'all' \| 'segment' \| 'custom'` | Selected targeting method |
| `selectedSegment` | `string` | Chosen segment ID |

## Dependencies

### Icons
- `lucide-react` - Users, Filter, Search, UserCheck

## Events & Callbacks

| Event | Trigger | Description |
|-------|---------|-------------|
| `handleRecipientTypeChange` | Type card click | Changes targeting method |
| `handleSegmentChange` | Segment selection | Selects specific segment |
| `getRecipientCount` | Display calculation | Returns total recipients |
| `isValid` | Form validation | Validates selection |

## Styling
- **CSS Module**: `Steps.module.scss`

## Features
- Recipient type selection cards:
  - All Users - with total count
  - User Segment - with segment count
- Segment list when segment type selected
- Recipient count summary
- Continue button (disabled until valid)
- Selected indicator badges

## UI Sections

### Recipient Type Cards
Large clickable cards with:
- Icon (Users or Filter)
- Title
- Description
- Count information
- Selected checkmark badge

### Segment Selection (conditional)
- Shown when "User Segment" is selected
- List of available segments
- Each shows name and user count
- Selected state with checkmark

### Summary Panel
- Total recipients display
- Users icon
- Formatted count

## Available Segments (mock)
- All Users (5,234)
- Active Members (3,421)
- New Signups - Last 30 Days (456)
- Inactive Users (1,813)
- Premium Members (892)

## Validation
```typescript
const isValid = () => {
  if (recipientType === 'all') return true;
  if (recipientType === 'segment') return !!selectedSegment;
  return false;
};
```

## Related Components
- Parent: `BroadcastEditor`
- Previous: `BroadcastSetup`
- Next: `BroadcastDesign`
