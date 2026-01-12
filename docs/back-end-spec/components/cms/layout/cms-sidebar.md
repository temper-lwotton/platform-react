# Component: CMSSidebar

## Description
The main navigation sidebar for the CMS admin area. Shows organized navigation sections for Dashboard, Content, Moderation, Members, Administration, and Communications.

## Location
`src/components/cms/layout/CMSSidebar.tsx`

## Props Interface

```typescript
interface CMSSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}
```

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `isOpen` | `boolean` | Yes | - | Sidebar expanded state |
| `onToggle` | `() => void` | Yes | - | Toggle callback |

## Internal State
None - path tracked via usePathname.

## Dependencies

### Icons
- `lucide-react` - All navigation icons

### Next.js
- `next/link` - Navigation links
- `usePathname` - Active route detection

## Styling
- **CSS Module**: `CMSSidebar.module.scss`
- **States**: Open (full), Closed (icons only)

## Usage Example

```tsx
import { CMSSidebar } from '@/components/cms/layout';

<CMSSidebar
  isOpen={sidebarOpen}
  onToggle={() => setSidebarOpen(!sidebarOpen)}
/>
```

## Navigation Structure

```typescript
const navSections: NavSection[] = [
  {
    items: [
      { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
      { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    ],
  },
  {
    title: 'Content',
    items: [
      { label: 'Pages', href: '/admin/pages', icon: FileText },
      { label: 'Taxonomies', href: '/admin/taxonomies', icon: Tags },
      { label: 'Media', href: '/admin/media', icon: Image },
    ],
  },
  {
    title: 'Moderation & Safety',
    items: [
      { label: 'Moderation Queue', href: '/admin/moderation', icon: Shield },
      { label: 'Auto-Mod Rules', href: '/admin/moderation/rules', icon: Zap },
      { label: 'Mod Analytics', href: '/admin/moderation/analytics', icon: TrendingUp },
      { label: 'Appeals', href: '/admin/moderation/appeals', icon: AlertCircle },
    ],
  },
  {
    title: 'Members',
    items: [
      { label: 'Member Directory', href: '/admin/members', icon: Users },
      { label: 'Segments', href: '/admin/members/segments', icon: Target },
      { label: 'Onboarding', href: '/admin/members/onboarding', icon: CheckCircle },
      { label: 'Analytics', href: '/admin/members/analytics', icon: BarChart3 },
    ],
  },
  {
    title: 'Administration',
    items: [
      { label: 'User Roles', href: '/admin/users/roles', icon: Shield },
      { label: 'Settings', href: '/admin/settings', icon: Settings },
    ],
  },
  {
    title: 'Communications',
    items: [
      { label: 'Broadcasts', href: '/admin/broadcasts', icon: Radio },
    ],
  },
];
```

## Features
- **Logo/Brand**: "CMS Admin" title when expanded
- **Toggle button**: Chevron to collapse/expand
- **Section titles**: Category headers (hidden when collapsed)
- **Nav items**: Icon + label (label hidden when collapsed)
- **Active state**: Highlighted current route
- **Badge support**: Optional count badges
- **Footer**: Version info when expanded
- **Tooltips**: Item labels on hover when collapsed

## Active Detection

```typescript
const isActive = pathname === item.href ||
  (item.href !== '/admin' && pathname.startsWith(item.href));
```

## Related Components
- Parent: `CMSLayout`
- See also: `HomeSidebar` (frontend), `SpaceSidebar`
