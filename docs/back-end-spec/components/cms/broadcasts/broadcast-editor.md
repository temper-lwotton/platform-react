# Component: BroadcastEditor

## Description
Full broadcast editing interface with multi-step wizard for creating and editing email campaigns. Manages campaign setup, recipient selection, email design, and send/schedule options.

## Location
`src/components/cms/broadcasts/BroadcastEditor.tsx`

## Props Interface

```typescript
interface BroadcastEditorProps {
  broadcastId?: number;
}
```

## Data Requirements

### Broadcast Type
```typescript
interface Broadcast {
  id: number;
  name: string;
  subject: string;
  preheader?: string;
  fromName: string;
  fromEmail: string;
  replyTo?: string;
  recipientType: 'all' | 'segment';
  recipientSegment?: string;
  recipientCount: number;
  emailContent: any;
  status: 'draft' | 'scheduled' | 'sending' | 'sent';
  scheduledFor?: string;
  sendType?: 'now' | 'scheduled';
}
```

## Internal State

| State Variable | Type | Purpose |
|----------------|------|---------|
| `currentStep` | `number` | Active wizard step (0-3) |
| `formData` | `object` | Accumulated form data across steps |

## Dependencies

### Components
- `BroadcastSetup` - Step 1: Campaign configuration
- `BroadcastRecipients` - Step 2: Recipient selection
- `BroadcastDesign` - Step 3: Email content
- `BroadcastReview` - Step 4: Review and send

### Hooks
- `useBroadcast` - Fetch existing broadcast
- `useCreateBroadcast` - Create mutation
- `useUpdateBroadcast` - Update mutation
- `useSendBroadcast` - Send/schedule mutation

## Styling
- **CSS Module**: `BroadcastEditor.module.scss`

## Features
- 4-step wizard navigation
- Step indicators with progress
- Data persistence across steps
- Edit mode with pre-populated data
- Create new broadcast flow
- Send immediately or schedule

## Wizard Steps

1. **Setup** - Campaign name, subject, sender info
2. **Recipients** - Choose all users or segment
3. **Design** - Build email content
4. **Review** - Summary and send/schedule options

## Related Components
- Parent: Admin layout
- Children: All broadcast step components
- See also: `BroadcastsList`
