# Component: PermissionCheck

## Description
Utility component and hook for conditionally rendering content based on user permissions. Supports single capability checks, any-of checks, and all-of checks.

## Location
`src/components/cms/permissions/PermissionCheck.tsx`

## Props Interface

```typescript
interface PermissionCheckProps {
  children: React.ReactNode;
  /** Single capability required */
  capability?: Capability;
  /** User must have ANY of these capabilities */
  anyOf?: Capability[];
  /** User must have ALL of these capabilities */
  allOf?: Capability[];
  /** Content to show when permission is denied */
  fallback?: React.ReactNode;
}
```

## Data Requirements

### Capability Type
```typescript
type Capability =
  | 'create_posts'
  | 'edit_posts'
  | 'delete_posts'
  | 'publish_posts'
  | 'manage_users'
  | 'ban_users'
  | 'moderate_content'
  | 'manage_settings'
  // ... other capabilities
  ;
```

## Dependencies

### Hooks
- `useHasCapability` - Check single capability
- `useHasAnyCapability` - Check any of capabilities
- `useHasAllCapabilities` - Check all capabilities

### Types
- `Capability` from `@/services/cms/types/permissions`

## Features
- Single capability check
- Any-of capability check
- All-of capability check
- Fallback content support
- Hook alternative for imperative checks

## Check Modes

### Single Capability
```tsx
<PermissionCheck capability="create_posts">
  <CreatePostButton />
</PermissionCheck>
```

### Any Of (OR logic)
```tsx
<PermissionCheck anyOf={['edit_posts', 'delete_posts']}>
  <EditControls />
</PermissionCheck>
```

### All Of (AND logic)
```tsx
<PermissionCheck allOf={['edit_posts', 'publish_posts']}>
  <PublishButton />
</PermissionCheck>
```

### With Fallback
```tsx
<PermissionCheck
  capability="manage_users"
  fallback={<UnauthorizedMessage />}
>
  <UserManagement />
</PermissionCheck>
```

## Logic Flow

```typescript
let allowed = false;

if (capability) {
  allowed = hasSingleCapability;
} else if (anyOf && anyOf.length > 0) {
  allowed = hasAnyCapability;
} else if (allOf && allOf.length > 0) {
  allowed = hasAllCapabilities;
} else {
  // No capability check specified, allow by default
  allowed = true;
}
```

## Exported Hook

### usePermissionCheck

```typescript
function usePermissionCheck(
  capability?: Capability,
  anyOf?: Capability[],
  allOf?: Capability[]
): boolean;
```

Usage:
```tsx
function MyComponent() {
  const canEdit = usePermissionCheck('edit_posts');

  if (!canEdit) {
    return <div>Not authorized</div>;
  }

  return <EditForm />;
}
```

## Default Behavior
- If no capability checks are specified, content is rendered (allowed = true)
- Fallback defaults to `null` if not provided

## Related Components
- Used by: Various admin components
- See also: `UserRolesManager`, `PermissionsMatrix`
