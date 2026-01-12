# Component: ReadingSettings

## Description
Settings form for content display configuration including posts per page, default post format, feed settings, and search engine visibility.

## Location
`src/components/cms/settings/ReadingSettings.tsx`

## Props Interface
None - self-contained form component.

## Data Requirements

### ReadingSettingsType
```typescript
// From @/services/cms/types/settings
interface ReadingSettings {
  postsPerPage: number;
  defaultPostFormat: 'standard' | 'aside' | 'gallery' | 'link' | 'image' | 'quote' | 'status' | 'video';
  feedPostsPerPage: number;
  feedShowSummary: boolean;
  searchEngineVisibility: boolean;
}
```

## Internal State

| State Variable | Type | Purpose |
|----------------|------|---------|
| `formData` | `Partial<ReadingSettingsType>` | Form field values |
| `hasChanges` | `boolean` | Dirty state tracking |

## Dependencies

### Hooks
- `useReadingSettings` - Fetch current settings
- `useUpdateReadingSettings` - Save mutation

### Icons
- `lucide-react` - Save, Loader2

## Events & Callbacks

| Event | Trigger | Description |
|-------|---------|-------------|
| `handleChange` | Field change | Update formData |
| `handleSubmit` | Form submit | Save settings |

## Styling
- **CSS Module**: `SettingsForm.module.scss`

## Usage Example

```tsx
import { ReadingSettings } from '@/components/cms/settings';

<ReadingSettings />
```

## Form Sections

### Posts Display
- **Posts Per Page**: Number input (1-100)
- **Default Post Format**: Select dropdown
  - Standard, Aside, Gallery, Link, Image, Quote, Status, Video

### Feed Settings
- **Feed Posts Per Page**: Number input (1-50)
- **Show Summary in Feeds**: Checkbox - Show excerpts vs full content

### Search Engine Visibility
- **Allow Search Engines**: Checkbox - Enable/disable indexing

## Features
- Loading state with spinner
- Save button disabled until changes
- Success message after save
- Field hints for each option

## Related Components
- Parent: `SettingsLayout`
- See also: `WritingSettings`
