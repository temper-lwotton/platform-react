/**
 * Permission Check Component
 * Conditionally renders children based on user capabilities
 */

import { useHasCapability, useHasAnyCapability, useHasAllCapabilities } from '@/hooks/cms';
import type { Capability } from '@/services/cms/types/permissions';

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

/**
 * Conditionally render content based on user permissions
 *
 * @example
 * <PermissionCheck capability="create_posts">
 *   <CreatePostButton />
 * </PermissionCheck>
 *
 * @example
 * <PermissionCheck anyOf={['edit_posts', 'delete_posts']}>
 *   <EditControls />
 * </PermissionCheck>
 */
export function PermissionCheck({
  children,
  capability,
  anyOf,
  allOf,
  fallback = null,
}: PermissionCheckProps) {
  const hasSingleCapability = useHasCapability(capability!);
  const hasAnyCapability = useHasAnyCapability(anyOf || []);
  const hasAllCapabilities = useHasAllCapabilities(allOf || []);

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

  return allowed ? <>{children}</> : <>{fallback}</>;
}

/**
 * Hook-based permission check (alternative to component)
 */
export function usePermissionCheck(
  capability?: Capability,
  anyOf?: Capability[],
  allOf?: Capability[]
): boolean {
  const hasSingleCapability = useHasCapability(capability!);
  const hasAnyCapability = useHasAnyCapability(anyOf || []);
  const hasAllCapabilities = useHasAllCapabilities(allOf || []);

  if (capability) {
    return hasSingleCapability;
  } else if (anyOf && anyOf.length > 0) {
    return hasAnyCapability;
  } else if (allOf && allOf.length > 0) {
    return hasAllCapabilities;
  }

  return true;
}
