# Component: UserRolesManager

## Description
Admin interface for managing user roles and permissions. Displays users in a table with role assignment capabilities and provides a role descriptions legend.

## Location
`src/components/cms/permissions/UserRolesManager.tsx`

## Props Interface
None - self-contained admin page component.

## Data Requirements

### User Type
```typescript
interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  capabilities: string[];
  lastLogin?: string;
}

type UserRole = 'admin' | 'editor' | 'author' | 'contributor' | 'viewer';
```

### Role Configuration Type
```typescript
interface RoleConfig {
  displayName: string;
  description: string;
  color: string;
  capabilities: string[];
}

// Imported from services
const ROLE_CONFIGS: Record<UserRole, RoleConfig>;
```

## Internal State

| State Variable | Type | Purpose |
|----------------|------|---------|
| `editingUserId` | `number \| null` | User ID currently being edited |
| `selectedRole` | `UserRole \| null` | Selected role for edit |

## Dependencies

### Hooks
- `useUsers` - Fetch all users
- `useCurrentUser` - Get logged-in user
- `useUpdateUserRole` - Role change mutation

### Icons
- `lucide-react` - Users, Shield, Loader2, Check, X

### Libraries
- `date-fns` - formatDistanceToNow

### Types
- `ROLE_CONFIGS` from `@/services/cms/types/permissions`
- `UserRole` from `@/services/cms/types/permissions`

## Events & Callbacks

| Event | Trigger | Description |
|-------|---------|-------------|
| `handleStartEdit` | Change Role button | Enters edit mode for user |
| `handleCancelEdit` | Cancel button | Cancels role edit |
| `handleSaveRole` | Save button | Saves new role assignment |

## Styling
- **CSS Module**: `UserRolesManager.module.scss`

## Features
- User table with role display
- Inline role editing
- Current user highlighting
- Role badges with colors
- Capabilities count
- Last login display
- Role descriptions legend
- Admin-only editing

## UI Sections

### Header
- Users icon
- "User Roles & Permissions" title
- Subtitle

### Users Table
| Column | Content |
|--------|---------|
| User | Avatar, name, "You" badge |
| Email | User email |
| Role | Role badge or dropdown (when editing) |
| Capabilities | Count of capabilities |
| Last Login | Relative time or "Never" |
| Actions | Change Role / Save/Cancel buttons |

### Edit Mode
- Role select dropdown
- Save button (check icon)
- Cancel button (X icon)
- Loading state during save

### Roles Legend
- Section header "Role Descriptions"
- Grid of role cards:
  - Role badge with color
  - Description text
  - Capabilities count

## Loading State
- Loader spinner
- "Loading users..." text

## Authorization
- Only admin users can change roles
- Current user's row is highlighted
- Edit button disabled for non-admins

## Usage Example

```tsx
// In admin routes page
<UserRolesManager />
```

## Related Components
- Parent: Admin users section
- See also: `PermissionsMatrix`, `PermissionCheck`
