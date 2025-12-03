/**
 * User Roles and Permissions Type Definitions
 */

// Available user roles
export type UserRole = 'admin' | 'editor' | 'author' | 'contributor' | 'viewer';

// Capability categories
export type Capability =
  // Post capabilities
  | 'create_posts'
  | 'edit_posts'
  | 'edit_others_posts'
  | 'delete_posts'
  | 'delete_others_posts'
  | 'publish_posts'
  | 'read_private_posts'
  // Post type capabilities
  | 'manage_post_types'
  | 'create_post_types'
  | 'edit_post_types'
  | 'delete_post_types'
  // Taxonomy capabilities
  | 'manage_taxonomies'
  | 'create_taxonomies'
  | 'edit_taxonomies'
  | 'delete_taxonomies'
  | 'assign_terms'
  // Media capabilities
  | 'upload_files'
  | 'manage_media'
  | 'delete_media'
  | 'edit_media'
  // User capabilities
  | 'manage_users'
  | 'create_users'
  | 'edit_users'
  | 'delete_users'
  | 'assign_roles'
  // Settings capabilities
  | 'manage_settings'
  | 'manage_general_settings'
  | 'manage_media_settings'
  | 'manage_reading_settings'
  | 'manage_writing_settings'
  | 'manage_discussion_settings'
  | 'manage_permalink_settings'
  // Block template capabilities
  | 'manage_block_templates'
  | 'create_block_templates'
  | 'edit_block_templates'
  | 'delete_block_templates'
  // Version capabilities
  | 'view_revisions'
  | 'restore_revisions'
  | 'delete_revisions'
  // Advanced capabilities
  | 'manage_options'
  | 'export_content'
  | 'import_content'
  | 'view_analytics';

// Role configuration
export interface RoleConfig {
  name: UserRole;
  displayName: string;
  description: string;
  capabilities: Capability[];
  color?: string; // For UI badges
}

// User with role information
export interface UserWithRole {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  role: UserRole;
  capabilities: Capability[];
  createdAt: string;
  lastLogin?: string;
}

// Permission check result
export interface PermissionCheck {
  allowed: boolean;
  reason?: string;
}

// Role update request
export interface UpdateUserRoleRequest {
  userId: number;
  role: UserRole;
}

// Custom capabilities per user (overrides)
export interface UserCapabilityOverride {
  userId: number;
  grantedCapabilities: Capability[];
  revokedCapabilities: Capability[];
}

// Predefined role configurations
export const ROLE_CONFIGS: Record<UserRole, RoleConfig> = {
  admin: {
    name: 'admin',
    displayName: 'Administrator',
    description: 'Full access to all features and settings',
    color: '#ef4444',
    capabilities: [
      // All capabilities
      'create_posts',
      'edit_posts',
      'edit_others_posts',
      'delete_posts',
      'delete_others_posts',
      'publish_posts',
      'read_private_posts',
      'manage_post_types',
      'create_post_types',
      'edit_post_types',
      'delete_post_types',
      'manage_taxonomies',
      'create_taxonomies',
      'edit_taxonomies',
      'delete_taxonomies',
      'assign_terms',
      'upload_files',
      'manage_media',
      'delete_media',
      'edit_media',
      'manage_users',
      'create_users',
      'edit_users',
      'delete_users',
      'assign_roles',
      'manage_settings',
      'manage_general_settings',
      'manage_media_settings',
      'manage_reading_settings',
      'manage_writing_settings',
      'manage_discussion_settings',
      'manage_permalink_settings',
      'manage_block_templates',
      'create_block_templates',
      'edit_block_templates',
      'delete_block_templates',
      'view_revisions',
      'restore_revisions',
      'delete_revisions',
      'manage_options',
      'export_content',
      'import_content',
      'view_analytics',
    ],
  },
  editor: {
    name: 'editor',
    displayName: 'Editor',
    description: 'Can publish and manage posts including posts by other users',
    color: '#3b82f6',
    capabilities: [
      'create_posts',
      'edit_posts',
      'edit_others_posts',
      'delete_posts',
      'delete_others_posts',
      'publish_posts',
      'read_private_posts',
      'assign_terms',
      'upload_files',
      'manage_media',
      'edit_media',
      'manage_block_templates',
      'create_block_templates',
      'edit_block_templates',
      'delete_block_templates',
      'view_revisions',
      'restore_revisions',
      'view_analytics',
    ],
  },
  author: {
    name: 'author',
    displayName: 'Author',
    description: 'Can publish and manage their own posts',
    color: '#8b5cf6',
    capabilities: [
      'create_posts',
      'edit_posts',
      'delete_posts',
      'publish_posts',
      'assign_terms',
      'upload_files',
      'manage_media',
      'view_revisions',
    ],
  },
  contributor: {
    name: 'contributor',
    displayName: 'Contributor',
    description: 'Can write and manage their own posts but cannot publish',
    color: '#f59e0b',
    capabilities: [
      'create_posts',
      'edit_posts',
      'delete_posts',
      'assign_terms',
      'view_revisions',
    ],
  },
  viewer: {
    name: 'viewer',
    displayName: 'Viewer',
    description: 'Can only view published content',
    color: '#6b7280',
    capabilities: [],
  },
};

// Capability groups for UI organization
export interface CapabilityGroup {
  name: string;
  description: string;
  capabilities: Capability[];
}

export const CAPABILITY_GROUPS: CapabilityGroup[] = [
  {
    name: 'Posts',
    description: 'Create, edit, and manage posts',
    capabilities: [
      'create_posts',
      'edit_posts',
      'edit_others_posts',
      'delete_posts',
      'delete_others_posts',
      'publish_posts',
      'read_private_posts',
    ],
  },
  {
    name: 'Post Types',
    description: 'Manage custom post types',
    capabilities: [
      'manage_post_types',
      'create_post_types',
      'edit_post_types',
      'delete_post_types',
    ],
  },
  {
    name: 'Taxonomies',
    description: 'Manage categories and tags',
    capabilities: [
      'manage_taxonomies',
      'create_taxonomies',
      'edit_taxonomies',
      'delete_taxonomies',
      'assign_terms',
    ],
  },
  {
    name: 'Media',
    description: 'Upload and manage media files',
    capabilities: [
      'upload_files',
      'manage_media',
      'delete_media',
      'edit_media',
    ],
  },
  {
    name: 'Users',
    description: 'Manage user accounts and roles',
    capabilities: [
      'manage_users',
      'create_users',
      'edit_users',
      'delete_users',
      'assign_roles',
    ],
  },
  {
    name: 'Settings',
    description: 'Configure site settings',
    capabilities: [
      'manage_settings',
      'manage_general_settings',
      'manage_media_settings',
      'manage_reading_settings',
      'manage_writing_settings',
      'manage_discussion_settings',
      'manage_permalink_settings',
    ],
  },
  {
    name: 'Block Templates',
    description: 'Manage reusable content blocks',
    capabilities: [
      'manage_block_templates',
      'create_block_templates',
      'edit_block_templates',
      'delete_block_templates',
    ],
  },
  {
    name: 'Revisions',
    description: 'View and restore content versions',
    capabilities: [
      'view_revisions',
      'restore_revisions',
      'delete_revisions',
    ],
  },
  {
    name: 'Advanced',
    description: 'Advanced features and analytics',
    capabilities: [
      'manage_options',
      'export_content',
      'import_content',
      'view_analytics',
    ],
  },
];
