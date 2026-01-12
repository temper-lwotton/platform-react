# Component: DiscussionSettings

## Description
Settings form for comment and discussion configuration including comment requirements, threading, pagination, email notifications, and moderation options.

## Location
`src/components/cms/settings/DiscussionSettings.tsx`

## Props Interface
None - self-contained form component.

## Data Requirements

### DiscussionSettingsType
```typescript
// From @/services/cms/types/settings
interface DiscussionSettings {
  enableComments: boolean;
  requireNameEmail: boolean;
  requireRegistration: boolean;
  autoCloseComments: boolean;
  autoCloseCommentsDays: number;
  enableThreadedComments: boolean;
  threadedCommentsDepth: number;
  pageComments: boolean;
  commentsPerPage: number;
  commentOrder: 'asc' | 'desc';
  emailOnComment: boolean;
  emailOnModeration: boolean;
  moderationRequired: boolean;
}
```

## Internal State

| State Variable | Type | Purpose |
|----------------|------|---------|
| `formData` | `Partial<DiscussionSettingsType>` | Form field values |
| `hasChanges` | `boolean` | Dirty state tracking |

## Dependencies

### Hooks
- `useDiscussionSettings` - Fetch current settings
- `useUpdateDiscussionSettings` - Save mutation

### Icons
- `lucide-react` - Save, Loader2

## Styling
- **CSS Module**: `SettingsForm.module.scss`

## Usage Example

```tsx
import { DiscussionSettings } from '@/components/cms/settings';

<DiscussionSettings />
```

## Form Sections

### Default Settings
- **Enable Comments**: Checkbox
- **Require Name and Email**: Checkbox
- **Require Registration**: Checkbox
- **Auto-Close Comments**: Checkbox
- **Close Comments After (Days)**: Number - shown when auto-close enabled

### Threaded Comments
- **Enable Threaded Comments**: Checkbox
- **Thread Depth**: Number (2-10) - shown when threading enabled

### Pagination
- **Paginate Comments**: Checkbox
- **Comments Per Page**: Number (5-100) - shown when pagination enabled
- **Comment Order**: Select (Older First, Newer First) - shown when pagination enabled

### Email Notifications
- **Email on New Comment**: Checkbox
- **Email on Comment Held for Moderation**: Checkbox

### Moderation
- **Require Manual Approval**: Checkbox

## Conditional Fields
Multiple fields appear/hide based on parent checkbox state:
- Auto-close days when auto-close enabled
- Thread depth when threading enabled
- Comments per page and order when pagination enabled

## Features
- Loading state with spinner
- Extensive conditional fields
- Save button disabled until changes
- Success message after save
- Field hints for each option

## Related Components
- Parent: `SettingsLayout`
- See also: Comment components, Moderation queue
