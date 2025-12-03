/**
 * Permissions and User Roles API Service
 * Mock implementation using localStorage (replace with actual API calls later)
 */

import type {
  UserRole,
  Capability,
  UserWithRole,
  UpdateUserRoleRequest,
  PermissionCheck,
  ROLE_CONFIGS,
} from '../types/permissions';
import { ROLE_CONFIGS as ROLES } from '../types/permissions';

const STORAGE_KEY_USERS = 'cms_users_roles';
const STORAGE_KEY_CURRENT_USER = 'cms_current_user_id';

// Mock user data
const mockUsers: UserWithRole[] = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@example.com',
    avatar: null,
    role: 'admin',
    capabilities: ROLES.admin.capabilities,
    createdAt: '2024-01-01T00:00:00Z',
    lastLogin: '2024-03-15T10:30:00Z',
  },
  {
    id: 2,
    name: 'John Editor',
    email: 'editor@example.com',
    avatar: null,
    role: 'editor',
    capabilities: ROLES.editor.capabilities,
    createdAt: '2024-01-15T00:00:00Z',
    lastLogin: '2024-03-14T14:20:00Z',
  },
  {
    id: 3,
    name: 'Jane Author',
    email: 'author@example.com',
    avatar: null,
    role: 'author',
    capabilities: ROLES.author.capabilities,
    createdAt: '2024-02-01T00:00:00Z',
    lastLogin: '2024-03-15T09:15:00Z',
  },
  {
    id: 4,
    name: 'Bob Contributor',
    email: 'contributor@example.com',
    avatar: null,
    role: 'contributor',
    capabilities: ROLES.contributor.capabilities,
    createdAt: '2024-02-15T00:00:00Z',
    lastLogin: '2024-03-13T16:45:00Z',
  },
  {
    id: 5,
    name: 'Alice Viewer',
    email: 'viewer@example.com',
    avatar: null,
    role: 'viewer',
    capabilities: ROLES.viewer.capabilities,
    createdAt: '2024-03-01T00:00:00Z',
    lastLogin: '2024-03-15T11:00:00Z',
  },
];

/**
 * Get users from localStorage or return defaults
 */
function getStoredUsers(): UserWithRole[] {
  if (typeof window === 'undefined') return mockUsers;

  try {
    const stored = localStorage.getItem(STORAGE_KEY_USERS);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load users:', error);
  }
  return mockUsers;
}

/**
 * Save users to localStorage
 */
function saveUsers(users: UserWithRole[]): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
  } catch (error) {
    console.error('Failed to save users:', error);
  }
}

/**
 * Get current user ID from localStorage (default to admin)
 */
function getCurrentUserId(): number {
  if (typeof window === 'undefined') return 1;

  try {
    const stored = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
    if (stored) {
      return parseInt(stored, 10);
    }
  } catch (error) {
    console.error('Failed to load current user ID:', error);
  }
  return 1; // Default to admin
}

/**
 * Set current user ID
 */
export function setCurrentUserId(userId: number): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY_CURRENT_USER, userId.toString());
  } catch (error) {
    console.error('Failed to save current user ID:', error);
  }
}

/**
 * Get current user with their role and capabilities
 */
export async function getCurrentUser(): Promise<{ data: UserWithRole; success: boolean }> {
  await new Promise(resolve => setTimeout(resolve, 100));

  const users = getStoredUsers();
  const currentUserId = getCurrentUserId();
  const user = users.find(u => u.id === currentUserId) || users[0];

  return {
    data: user,
    success: true,
  };
}

/**
 * Get all users with their roles
 */
export async function getUsers(): Promise<{ data: UserWithRole[]; success: boolean }> {
  await new Promise(resolve => setTimeout(resolve, 100));

  const users = getStoredUsers();

  return {
    data: users,
    success: true,
  };
}

/**
 * Get a specific user by ID
 */
export async function getUser(userId: number): Promise<{ data: UserWithRole | null; success: boolean }> {
  await new Promise(resolve => setTimeout(resolve, 100));

  const users = getStoredUsers();
  const user = users.find(u => u.id === userId) || null;

  return {
    data: user,
    success: true,
  };
}

/**
 * Update a user's role
 */
export async function updateUserRole(
  request: UpdateUserRoleRequest
): Promise<{ data: UserWithRole; success: boolean }> {
  await new Promise(resolve => setTimeout(resolve, 200));

  const users = getStoredUsers();
  const userIndex = users.findIndex(u => u.id === request.userId);

  if (userIndex === -1) {
    throw new Error('User not found');
  }

  const newRole = request.role;
  const newCapabilities = ROLES[newRole].capabilities;

  users[userIndex] = {
    ...users[userIndex],
    role: newRole,
    capabilities: newCapabilities,
  };

  saveUsers(users);

  return {
    data: users[userIndex],
    success: true,
  };
}

/**
 * Check if a user has a specific capability
 */
export async function checkPermission(
  userId: number,
  capability: Capability
): Promise<{ data: PermissionCheck; success: boolean }> {
  await new Promise(resolve => setTimeout(resolve, 50));

  const users = getStoredUsers();
  const user = users.find(u => u.id === userId);

  if (!user) {
    return {
      data: {
        allowed: false,
        reason: 'User not found',
      },
      success: true,
    };
  }

  const allowed = user.capabilities.includes(capability);

  return {
    data: {
      allowed,
      reason: allowed ? undefined : `User does not have the '${capability}' capability`,
    },
    success: true,
  };
}

/**
 * Check if current user has a capability (client-side helper)
 */
export function hasCapability(capability: Capability): boolean {
  if (typeof window === 'undefined') return false;

  const users = getStoredUsers();
  const currentUserId = getCurrentUserId();
  const user = users.find(u => u.id === currentUserId);

  return user ? user.capabilities.includes(capability) : false;
}

/**
 * Check if current user has any of the given capabilities
 */
export function hasAnyCapability(capabilities: Capability[]): boolean {
  if (typeof window === 'undefined') return false;

  const users = getStoredUsers();
  const currentUserId = getCurrentUserId();
  const user = users.find(u => u.id === currentUserId);

  return user ? capabilities.some(cap => user.capabilities.includes(cap)) : false;
}

/**
 * Check if current user has all of the given capabilities
 */
export function hasAllCapabilities(capabilities: Capability[]): boolean {
  if (typeof window === 'undefined') return false;

  const users = getStoredUsers();
  const currentUserId = getCurrentUserId();
  const user = users.find(u => u.id === currentUserId);

  return user ? capabilities.every(cap => user.capabilities.includes(cap)) : false;
}

/**
 * Get all available roles
 */
export async function getRoles(): Promise<{ data: typeof ROLE_CONFIGS; success: boolean }> {
  await new Promise(resolve => setTimeout(resolve, 50));

  return {
    data: ROLES,
    success: true,
  };
}

/**
 * Get capabilities for a specific role
 */
export async function getRoleCapabilities(
  role: UserRole
): Promise<{ data: Capability[]; success: boolean }> {
  await new Promise(resolve => setTimeout(resolve, 50));

  return {
    data: ROLES[role].capabilities,
    success: true,
  };
}
