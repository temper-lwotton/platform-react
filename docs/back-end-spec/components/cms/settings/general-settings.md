# Component: GeneralSettings

## Description
Settings form for basic site configuration including site identity (name, description, URL, admin email) and regional settings (timezone, date/time format, language, week start).

## Location
`src/components/cms/settings/GeneralSettings.tsx`

## Props Interface
None - self-contained form component.

## Data Requirements

### GeneralSettingsType
```typescript
// From @/services/cms/types/settings
interface GeneralSettings {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  adminEmail: string;
  timezone: string;
  dateFormat: string;
  timeFormat: string;
  language: string;
  weekStartsOn: number;
}
```

## Internal State

| State Variable | Type | Purpose |
|----------------|------|---------|
| `formData` | `Partial<GeneralSettingsType>` | Form field values |
| `hasChanges` | `boolean` | Dirty state tracking |

## Dependencies

### Hooks
- `useGeneralSettings` - Fetch current settings
- `useUpdateGeneralSettings` - Save mutation

### Icons
- `lucide-react` - Save, Loader2

## Events & Callbacks

| Event | Trigger | Description |
|-------|---------|-------------|
| `handleChange` | Field change | Update formData and set dirty |
| `handleSubmit` | Form submit | Save settings via mutation |

## Styling
- **CSS Module**: `SettingsForm.module.scss`
- **Layout**: Sectioned form with header, fields, footer

## Usage Example

```tsx
import { GeneralSettings } from '@/components/cms/settings';

// Inside SettingsLayout
<GeneralSettings />
```

## Form Sections

### Site Identity
- **Site Name**: Text input
- **Site Description**: Textarea
- **Site URL**: URL input
- **Admin Email**: Email input

### Regional Settings
- **Timezone**: Select (13 common timezones)
- **Date Format**: Select (5 format options)
- **Time Format**: Select (3 format options)
- **Language**: Select (8 languages)
- **Week Starts On**: Select (Sunday/Monday/Saturday)

## Configuration Options

### Timezones
```typescript
const timezones = [
  'America/New_York', 'America/Chicago', 'America/Denver',
  'America/Los_Angeles', 'America/Toronto', 'Europe/London',
  'Europe/Paris', 'Europe/Berlin', 'Asia/Tokyo', 'Asia/Shanghai',
  'Asia/Dubai', 'Australia/Sydney', 'Pacific/Auckland',
];
```

### Date Formats
- `YYYY-MM-DD` (2024-03-15)
- `MM/DD/YYYY` (03/15/2024)
- `DD/MM/YYYY` (15/03/2024)
- `MMMM D, YYYY` (March 15, 2024)
- `D MMMM YYYY` (15 March 2024)

## Features
- Loading state with spinner
- Save button disabled until changes made
- Success message after save
- Field hints explaining each option

## Related Components
- Parent: `SettingsLayout`
- See also: Other settings forms
