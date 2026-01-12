# Component: SettingsLayout

## Description
A sub-layout component for the settings section. Provides tabbed navigation sidebar linking to different settings pages with descriptions.

## Location
`src/components/cms/settings/SettingsLayout.tsx`

## Props Interface

```typescript
interface SettingsLayoutProps {
  children: React.ReactNode;
}
```

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `children` | `React.ReactNode` | Yes | - | Settings page content |

## Internal State
None - uses usePathname for active detection.

## Dependencies

### Icons
- `lucide-react` - Globe, Image, BookOpen, PenTool, MessageSquare, Link, Settings, Palette

### Next.js
- `next/link` - Tab navigation
- `usePathname` - Active tab detection

## Styling
- **CSS Module**: `SettingsLayout.module.scss`
- **Layout**: Header + sidebar/main content split

## Usage Example

```tsx
import { SettingsLayout } from '@/components/cms/settings';

export default function GeneralSettingsPage() {
  return (
    <SettingsLayout>
      <GeneralSettings />
    </SettingsLayout>
  );
}
```

## Settings Tabs

```typescript
const settingsTabs: SettingsTab[] = [
  {
    label: 'General',
    href: '/admin/settings/general',
    icon: Globe,
    description: 'Site name, description, timezone, and language',
  },
  {
    label: 'Theme',
    href: '/admin/settings/theme',
    icon: Palette,
    description: 'Platform theme, colors, and visual appearance',
  },
  {
    label: 'Media',
    href: '/admin/settings/media',
    icon: Image,
    description: 'Upload limits, image sizes, and AI settings',
  },
  {
    label: 'Reading',
    href: '/admin/settings/reading',
    icon: BookOpen,
    description: 'Posts per page, feed settings, and visibility',
  },
  {
    label: 'Writing',
    href: '/admin/settings/writing',
    icon: PenTool,
    description: 'Default status, autosave, and revisions',
  },
  {
    label: 'Discussion',
    href: '/admin/settings/discussion',
    icon: MessageSquare,
    description: 'Comments and moderation settings',
  },
  {
    label: 'Permalinks',
    href: '/admin/settings/permalinks',
    icon: LinkIcon,
    description: 'URL structure and slugs',
  },
];
```

## Layout Structure

```
┌─────────────────────────────────────────────┐
│ Settings                                    │
│ Configure your CMS preferences              │
├─────────────────┬───────────────────────────┤
│ Tab Navigation  │                           │
│                 │      Settings Content     │
│ - General       │         (children)        │
│ - Theme         │                           │
│ - Media         │                           │
│ - Reading       │                           │
│ - Writing       │                           │
│ - Discussion    │                           │
│ - Permalinks    │                           │
└─────────────────┴───────────────────────────┘
```

## Features
- **Header**: Settings icon, title, subtitle
- **Tab list**: Vertical navigation with icons
- **Tab descriptions**: Brief explanation per tab
- **Active state**: Highlighted current tab
- **Main content**: Renders children (specific settings form)

## Related Components
- Parent: CMS Layout
- Children: `GeneralSettings`, `ThemeSettings`, `MediaSettings`, etc.
