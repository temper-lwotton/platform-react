# Component: ThemeSettings

## Description
Settings form for platform theming including pre-built theme selection, custom color configuration, and color mode (light/dark/system) preferences.

## Location
`src/components/cms/settings/ThemeSettings.tsx`

## Props Interface
None - self-contained form component.

## Data Requirements

### ThemeSettingsType
```typescript
// From @/services/cms/types/settings
interface ThemeSettings {
  platformTheme: 'innovation-spectrum' | 'deep-focus' | 'bright-studio' | 'coastal-fusion' | 'custom';
  customPrimaryColor?: string;
  customInfoColor?: string;
  customCtaColor?: string;
  customAccentColor?: string;
  defaultColorMode: 'light' | 'dark' | 'system';
  allowUserOverride: boolean;
}
```

## Internal State

| State Variable | Type | Purpose |
|----------------|------|---------|
| `formData` | `Partial<ThemeSettingsType>` | Form field values |
| `hasChanges` | `boolean` | Dirty state tracking |

## Dependencies

### Hooks
- `useThemeSettings` - Fetch current settings
- `useUpdateThemeSettings` - Save mutation

### Icons
- `lucide-react` - Save, Loader2, Palette, Check

## Styling
- **CSS Module**: `SettingsForm.module.scss`
- **Special**: Theme card grid with color swatches

## Usage Example

```tsx
import { ThemeSettings } from '@/components/cms/settings';

<ThemeSettings />
```

## Form Sections

### Platform Theme
Visual card grid with theme options:

```typescript
const themes = [
  {
    value: 'innovation-spectrum',
    label: 'Innovation Spectrum',
    description: 'Multi-color theme with purple, blue, orange, and lime accents',
    colors: ['#8b5cf6', '#3b82f6', '#f97316', '#C0F23C'],
  },
  {
    value: 'deep-focus',
    label: 'Deep Focus',
    description: 'Dark navy with cyan accents for focused atmosphere',
    colors: ['#1e3a8a', '#0ea5e9', '#06b6d4', '#38bdf8'],
  },
  {
    value: 'bright-studio',
    label: 'Bright Studio',
    description: 'Light and airy with pink and orange accents',
    colors: ['#ec4899', '#f97316', '#fb923c', '#fdba74'],
  },
  {
    value: 'coastal-fusion',
    label: 'Coastal Fusion',
    description: 'Ocean-inspired with teal, lavender, and magenta',
    colors: ['#00997d', '#008bcc', '#e74c85', '#997ac7'],
  },
  {
    value: 'custom',
    label: 'Custom Theme',
    description: 'Define your own color palette',
    colors: [],
  },
];
```

### Custom Colors (when custom theme selected)
- **Primary Color**: Color picker + hex input
- **Info Color**: Color picker + hex input
- **CTA Color**: Color picker + hex input
- **Accent Color**: Color picker + hex input

### Color Mode
- **Default Color Mode**: Select (Light, Dark, System Preference)
- **Allow User Override**: Checkbox

## Features
- Visual theme card selection with color swatches
- Check icon on selected theme
- Dynamic custom color fields
- Color picker + text input combination
- Loading state with spinner
- Save button disabled until changes
- Success message after save

## Theme Card Structure

```tsx
<button className={`${styles.themeCard} ${isActive ? styles.themeCardActive : ''}`}>
  {isActive && <Check icon />}
  <div className={styles.themeCardHeader}>
    <Palette icon />
    <h4>{theme.label}</h4>
  </div>
  <p>{theme.description}</p>
  <div className={styles.themeColorPreview}>
    {theme.colors.map(color => (
      <div style={{ backgroundColor: color }} />
    ))}
  </div>
</button>
```

## Related Components
- Parent: `SettingsLayout`
- See also: `ThemeToggle`, `ThemeContext`
