# Component: PermalinkSettings

## Description
Settings form for URL structure configuration including permalink patterns, custom structures with available tags, category/tag base slugs, and trailing slash option.

## Location
`src/components/cms/settings/PermalinkSettings.tsx`

## Props Interface
None - self-contained form component.

## Data Requirements

### PermalinkConfig Type
```typescript
// From @/services/cms/types/seo
interface PermalinkConfig {
  structure: 'plain' | 'day-name' | 'month-name' | 'numeric' | 'post-name' | 'custom';
  customStructure: string;
  categoryBase: string;
  tagBase: string;
  trailingSlash: boolean;
}
```

## Internal State

| State Variable | Type | Purpose |
|----------------|------|---------|
| `formData` | `Partial<PermalinkConfig>` | Form field values |
| `hasChanges` | `boolean` | Dirty state tracking |

## Dependencies

### Hooks
- `usePermalinkConfig` - Fetch current config
- `useUpdatePermalinkConfig` - Save mutation

### Icons
- `lucide-react` - Save, Loader2, Link

## Styling
- **CSS Module**: `SettingsForm.module.scss`

## Usage Example

```tsx
import { PermalinkSettings } from '@/components/cms/settings';

<PermalinkSettings />
```

## Form Sections

### Permalink Structure
Radio group with options:
- **Plain**: `?p=123`
- **Day and name**: `/%year%/%monthnum%/%day%/%postname%/`
- **Month and name**: `/%year%/%monthnum%/%postname%/`
- **Numeric**: `/archives/%post_id%`
- **Post name**: `/%postname%/`
- **Custom Structure**: User-defined

### Custom Structure (when selected)
- Text input for custom pattern
- Available tags reference:
  - `%year%`, `%monthnum%`, `%day%`
  - `%hour%`, `%minute%`, `%second%`
  - `%post_id%`, `%postname%`
  - `%category%`, `%author%`

### Optional Settings
- **Category Base**: Text input (default: "category")
- **Tag Base**: Text input (default: "tag")
- **Trailing Slash**: Checkbox

## Permalink Structures

```typescript
const permalinkStructures = [
  { value: 'plain', label: 'Plain', example: '?p=123' },
  { value: 'day-name', label: 'Day and name', example: '/2024/03/15/sample-post' },
  { value: 'month-name', label: 'Month and name', example: '/2024/03/sample-post' },
  { value: 'numeric', label: 'Numeric', example: '/archives/123' },
  { value: 'post-name', label: 'Post name', example: '/sample-post' },
  { value: 'custom', label: 'Custom Structure', example: 'Custom permalink' },
];
```

## Available Tags Reference

| Tag | Description |
|-----|-------------|
| `%year%` | Year (4 digits) |
| `%monthnum%` | Month (01-12) |
| `%day%` | Day (01-31) |
| `%hour%` | Hour (00-23) |
| `%minute%` | Minute (00-59) |
| `%second%` | Second (00-59) |
| `%post_id%` | Unique post ID |
| `%postname%` | Post slug |
| `%category%` | Post category |
| `%author%` | Post author |

## Features
- Radio group with example URLs
- Dynamic custom structure field
- Tags reference documentation
- Loading state with spinner
- Save button disabled until changes
- Success message after save

## Related Components
- Parent: `SettingsLayout`
- See also: SEO configuration
