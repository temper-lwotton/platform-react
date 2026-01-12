# Component: CampaignComposer

## Description
Unified campaign creation interface combining broadcast setup with content creation. Provides a streamlined workflow for creating email campaigns with integrated template selection and recipient targeting.

## Location
`src/components/cms/broadcasts/CampaignComposer.tsx`

## Props Interface

```typescript
interface CampaignComposerProps {
  campaignId?: number;
}
```

## Data Requirements

### Campaign Type
```typescript
interface Campaign {
  id: number;
  name: string;
  subject: string;
  preheader?: string;
  fromName: string;
  fromEmail: string;
  template: string;
  content: any;
  recipients: {
    type: 'all' | 'segment';
    segmentId?: string;
    count: number;
  };
  schedule: {
    type: 'immediate' | 'scheduled';
    scheduledFor?: string;
  };
  status: 'draft' | 'scheduled' | 'sent';
}
```

## Internal State

| State Variable | Type | Purpose |
|----------------|------|---------|
| `campaignData` | `Partial<Campaign>` | Form data |
| `activeTab` | `string` | Current editor tab |
| `isDirty` | `boolean` | Unsaved changes flag |

## Dependencies

### Components
- `EmailBuilder` - Content creation
- `BlockEmailEditor` - Block-based editing

### Hooks
- `useCampaign` - Fetch existing campaign
- `useCreateCampaign` - Create mutation
- `useUpdateCampaign` - Update mutation
- `useSendCampaign` - Send/schedule mutation
- `useSegments` - Fetch recipient segments

## Features
- Tabbed interface for different sections
- Real-time preview
- Recipient count display
- Template selection
- Schedule picker
- Test email sending
- Save draft functionality

## Editor Tabs
1. Content - Email body and template
2. Recipients - Target audience selection
3. Schedule - Send timing options
4. Settings - From name, subject, etc.

## Related Components
- Parent: Admin layout
- See also: `BroadcastEditor`
