/**
 * React Query hooks for User Roles and Permissions
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { permissionsAPI } from '@/services/cms/api';
import type {
  UserRole,
  Capability,
  UserWithRole,
  UpdateUserRoleRequest,
} from '@/services/cms/types/permissions';

// Query keys
export const permissionsKeys = {
  all: ['permissions'] as const,
  currentUser: () => [...permissionsKeys.all, 'current-user'] as const,
  users: () => [...permissionsKeys.all, 'users'] as const,
  user: (id: number) => [...permissionsKeys.all, 'user', id] as const,
  roles: () => [...permissionsKeys.all, 'roles'] as const,
  roleCapabilities: (role: UserRole) => [...permissionsKeys.all, 'role-capabilities', role] as const,
  check: (userId: number, capability: Capability) =>
    [...permissionsKeys.all, 'check', userId, capability] as const,
};

/**
 * Hook to fetch current user with their role and capabilities
 */
export function useCurrentUser() {
  return useQuery({
    queryKey: permissionsKeys.currentUser(),
    queryFn: () => permissionsAPI.getCurrentUser(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch all users with their roles
 */
export function useUsers() {
  return useQuery({
    queryKey: permissionsKeys.users(),
    queryFn: () => permissionsAPI.getUsers(),
  });
}

/**
 * Hook to fetch a specific user
 */
export function useUser(userId: number) {
  return useQuery({
    queryKey: permissionsKeys.user(userId),
    queryFn: () => permissionsAPI.getUser(userId),
    enabled: !!userId,
  });
}

/**
 * Hook to fetch all available roles
 */
export function useRoles() {
  return useQuery({
    queryKey: permissionsKeys.roles(),
    queryFn: () => permissionsAPI.getRoles(),
    staleTime: Infinity, // Roles don't change
  });
}

/**
 * Hook to fetch capabilities for a specific role
 */
export function useRoleCapabilities(role: UserRole) {
  return useQuery({
    queryKey: permissionsKeys.roleCapabilities(role),
    queryFn: () => permissionsAPI.getRoleCapabilities(role),
    enabled: !!role,
    staleTime: Infinity,
  });
}

/**
 * Hook to check if a user has a specific capability
 */
export function usePermissionCheck(userId: number, capability: Capability) {
  return useQuery({
    queryKey: permissionsKeys.check(userId, capability),
    queryFn: () => permissionsAPI.checkPermission(userId, capability),
    enabled: !!userId && !!capability,
    staleTime: 60 * 1000, // 1 minute
  });
}

/**
 * Hook to update a user's role
 */
export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpdateUserRoleRequest) =>
      permissionsAPI.updateUserRole(request),
    onSuccess: (response, variables) => {
      // Invalidate all user queries
      queryClient.invalidateQueries({ queryKey: permissionsKeys.users() });
      queryClient.invalidateQueries({ queryKey: permissionsKeys.user(variables.userId) });

      // If updating current user, invalidate current user query
      queryClient.invalidateQueries({ queryKey: permissionsKeys.currentUser() });
    },
  });
}

/**
 * Hook to check if current user has a capability (client-side)
 */
export function useHasCapability(capability: Capability): boolean {
  const { data: currentUser } = useCurrentUser();

  if (!currentUser?.data) return false;

  return currentUser.data.capabilities.includes(capability);
}

/**
 * Hook to check if current user has any of the given capabilities
 */
export function useHasAnyCapability(capabilities: Capability[]): boolean {
  const { data: currentUser } = useCurrentUser();

  if (!currentUser?.data) return false;

  return capabilities.some(cap => currentUser.data.capabilities.includes(cap));
}

/**
 * Hook to check if current user has all of the given capabilities
 */
export function useHasAllCapabilities(capabilities: Capability[]): boolean {
  const { data: currentUser } = useCurrentUser();

  if (!currentUser?.data) return false;

  return capabilities.every(cap => currentUser.data.capabilities.includes(cap));
}

/**
 * Hook to check if current user is an admin
 */
export function useIsAdmin(): boolean {
  const { data: currentUser } = useCurrentUser();

  return currentUser?.data?.role === 'admin';
}
