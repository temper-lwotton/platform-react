# Component: WritingSettings

## Description
Settings form for content creation configuration including default post/comment status, autosave, revisions, and content features like emoji and markdown support.

## Location
`src/components/cms/settings/WritingSettings.tsx`

## Props Interface
None - self-contained form component.

## Data Requirements

### WritingSettingsType
```typescript
// From @/services/cms/types/settings
interface WritingSettings {
  defaultPostStatus: 'draft' | 'pending' | 'published';
  defaultCommentStatus: 'open' | 'closed';
  enableAutosave: boolean;
  autosaveInterval: number;
  enableRevisions: boolean;
  maxRevisions: number;
  enableEmoji: boolean;
  enableMarkdown: boolean;
}
```

## Internal State

| State Variable | Type | Purpose |
|----------------|------|---------|
| `formData` | `Partial<WritingSettingsType>` | Form field values |
| `hasChanges` | `boolean` | Dirty state tracking |

## Dependencies

### Hooks
- `useWritingSettings` - Fetch current settings
- `useUpdateWritingSettings` - Save mutation

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
import { WritingSettings } from '@/components/cms/settings';

<WritingSettings />
```

## Form Sections

### Post Defaults
- **Default Post Status**: Select (Draft, Pending Review, Published)
- **Default Comment Status**: Select (Open, Closed)

### Autosave & Revisions
- **Enable Autosave**: Checkbox
- **Autosave Interval**: Number input (10-300 seconds) - shown only when autosave enabled
- **Enable Revisions**: Checkbox
- **Maximum Revisions**: Number input (0 = unlimited) - shown only when revisions enabled

### Content Features
- **Enable Emoji**: Checkbox - Convert emoticons to emoji
- **Enable Markdown**: Checkbox - Allow markdown syntax

## Conditional Fields
- Autosave interval field appears only when autosave is enabled
- Max revisions field appears only when revisions are enabled

## Features
- Loading state with spinner
- Conditional field display
- Save button disabled until changes
- Success message after save
- Field hints for each option

## Related Components
- Parent: `SettingsLayout`
- See also: `ReadingSettings`, `LexicalEditor`
