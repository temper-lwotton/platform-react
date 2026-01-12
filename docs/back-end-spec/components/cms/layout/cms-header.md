# Component: CMSHeader

## Description
The top header bar for the CMS admin area. Shows menu toggle, back to site link, notifications, and user menu with profile and logout options.

## Location
`src/components/cms/layout/CMSHeader.tsx`

## Props Interface

```typescript
interface CMSHeaderProps {
  onMenuClick: () => void;
}
```

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `onMenuClick` | `() => void` | Yes | - | Sidebar toggle callback |

## Internal State
None - uses hooks for auth state.

## Dependencies

### Hooks
- `useAuth` - Get current user ID
- `useRouter` - Navigation

### Icons
- `lucide-react` - Menu, Bell, User, LogOut, Home

### Utilities
- `logout` from `@/lib/auth` - Clear auth state

## Events & Callbacks

| Event | Trigger | Description |
|-------|---------|-------------|
| `onMenuClick` | Menu button click | Toggle sidebar |
| `handleLogout` | Logout click | Clear auth and redirect |

## Styling
- **CSS Module**: `CMSHeader.module.scss`
- **Layout**: Left (menu, back link) + Right (notifications, user menu)

## Usage Example

```tsx
import { CMSHeader } from '@/components/cms/layout';

<CMSHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
```

## Features
- **Menu toggle button**: Hamburger icon to toggle sidebar
- **Back to Site**: Home icon with "Back to Site" link
- **Notifications button**: Bell icon with badge indicator
- **User section**:
  - Display name and role
  - User avatar button
  - Dropdown menu with Profile and Logout options

## Logout Flow

```typescript
const handleLogout = () => {
  logout();  // Clear tokens
  window.dispatchEvent(new CustomEvent('auth:logout'));  // Notify app
  router.push('/login');  // Redirect
};
```

## Related Components
- Parent: `CMSLayout`
- See also: `UserMenu` (frontend version)
