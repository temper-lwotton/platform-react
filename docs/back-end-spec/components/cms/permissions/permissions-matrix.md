# Component: PermissionsMatrix

## Description
Visual matrix display showing complete capability breakdown by role. Groups capabilities by category and displays which roles have access to each capability.

## Location
`src/components/cms/permissions/PermissionsMatrix.tsx`

## Props Interface
None - self-contained display component.

## Data Requirements

### Role Configuration Type
```typescript
interface RoleConfig {
  displayName: string;
  color: string;
  capabilities: string[];
}

// From useRoles hook
interface RolesData {
  data: Record<UserRole, RoleConfig>;
}
```

### Capability Group Type
```typescript
interface CapabilityGroup {
  name: string;
  description: string;
  capabilities: string[];
}

// Imported from services
const CAPABILITY_GROUPS: CapabilityGroup[];
```

### User Roles
```typescript
type UserRole = 'admin' | 'editor' | 'author' | 'contributor' | 'viewer';
```

## Dependencies

### Hooks
- `useRoles` - Fetch role configurations

### Icons
- `lucide-react` - Shield, Check, X

### Types
- `CAPABILITY_GROUPS` from `@/services/cms/types/permissions`
- `UserRole` from `@/services/cms/types/permissions`

## Styling
- **CSS Module**: `PermissionsMatrix.module.scss`

## Features
- Grouped capability display
- Color-coded role headers
- Check/X indicators for access
- Capability code display
- Group descriptions

## UI Sections

### Header
- Shield icon
- "Permissions Matrix" title
- Subtitle

### Capability Groups
For each group:
- Group header with name and description
- Matrix table

### Matrix Table
- **Header Row**: Capability column + role columns
- **Role Headers**: Colored badge for each role
- **Capability Rows**:
  - Capability code
  - Check (✓) or X (✗) for each role

## Role Order
Display columns in hierarchical order:
1. Admin
2. Editor
3. Author
4. Contributor
5. Viewer

## Example Capability Groups
- Content Management (create_posts, edit_posts, delete_posts, etc.)
- User Management (manage_users, ban_users, etc.)
- Settings (manage_settings, etc.)
- Moderation (moderate_content, etc.)

## Usage Example

```tsx
// In admin permissions page
<PermissionsMatrix />
```

## Conditional Rendering
- Returns `null` if roles data not loaded
- Displays full matrix once data available

## Related Components
- See also: `UserRolesManager`, `PermissionCheck`
