# Component: BroadcastReview

## Description
Step 4 (final) of the broadcast wizard for reviewing campaign details and choosing when to send. Displays summary, email preview, send options, and pre-send checklist.

## Location
`src/components/cms/broadcasts/steps/BroadcastReview.tsx`

## Props Interface

```typescript
interface BroadcastReviewProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
}
```

## Data Requirements

### Review Data
```typescript
interface ReviewData {
  name: string;
  subject: string;
  preheader?: string;
  fromName: string;
  fromEmail: string;
  recipientCount: number;
  emailContent: any;
  sendType: 'now' | 'scheduled';
  scheduledDate?: string;
}
```

## Internal State

| State Variable | Type | Purpose |
|----------------|------|---------|
| `sendType` | `'now' \| 'scheduled'` | Send timing option |
| `scheduledDate` | `string` | ISO datetime for scheduling |

## Dependencies

### Icons
- `lucide-react` - CheckCircle, Mail, Users, Calendar, Clock, Eye

## Events & Callbacks

| Event | Trigger | Description |
|-------|---------|-------------|
| `handleSendTypeChange` | Send option click | Changes send timing |
| `handleScheduledDateChange` | Date input | Sets schedule datetime |

## Styling
- **CSS Module**: `Steps.module.scss`

## Features
- Campaign summary grid
- Email preview panel
- Send options (Now vs Scheduled)
- Datetime picker for scheduling
- Pre-send checklist with completion indicators

## UI Sections

### Campaign Summary
Grid of summary items with icons:
- Campaign Name
- Subject Line
- Recipients count
- From name and email

### Email Preview
- Preview header with Eye icon
- Email metadata display:
  - From line
  - Subject line
  - Preheader (if present)
- Email body content area

### Send Options
Two clickable option cards:
1. **Send Now** - CheckCircle icon, immediate send
2. **Schedule for Later** - Calendar icon, shows datetime picker

### Scheduled Date Input (conditional)
- Clock icon label
- Datetime-local input
- Minimum set to current time

### Pre-Send Checklist
Completion indicators for:
- Campaign details complete (name + subject)
- Recipients selected (count > 0)
- Email content designed (has content)
- Send time scheduled (when applicable)

## Send Options Display

```typescript
// Send Now card
{
  icon: CheckCircle,
  title: 'Send Now',
  description: 'Send this campaign immediately to all recipients'
}

// Schedule card
{
  icon: Calendar,
  title: 'Schedule for Later',
  description: 'Choose a specific date and time to send'
}
```

## Related Components
- Parent: `BroadcastEditor`
- Previous: `BroadcastDesign`
