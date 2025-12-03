/**
 * CMS Type Definitions
 * Based on the WordPress-inspired CMS API
 */

// ============================================================================
// Common Types
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface Author {
  id: number;
  name: string;
  email?: string;
}

// ============================================================================
// Post Types
// ============================================================================

export interface PostType {
  id: number;
  name: string;
  singularLabel: string;
  pluralLabel: string;
  slug: string;
  isActive: boolean;
  public: boolean;
  hasArchive: boolean;
  hierarchical: boolean;
  showInMenu: boolean;
  menuIcon?: string;
  menuPosition?: number;
  supports: PostTypeSupport[];
  capabilities: Record<string, any>;
  space: number | null;
  createdAt: string;
  updatedAt: string;
}

export type PostTypeSupport =
  | 'title'
  | 'editor'
  | 'author'
  | 'thumbnail'
  | 'excerpt'
  | 'revisions'
  | 'custom-fields'
  | 'comments'
  | 'trackbacks'
  | 'page-attributes';

export interface CreatePostTypeInput {
  name: string;
  singularLabel: string;
  pluralLabel: string;
  slug: string;
  isActive?: boolean;
  public?: boolean;
  hasArchive?: boolean;
  hierarchical?: boolean;
  showInMenu?: boolean;
  menuIcon?: string;
  menuPosition?: number;
  supports?: PostTypeSupport[];
  capabilities?: Record<string, any>;
}

export interface UpdatePostTypeInput extends Partial<CreatePostTypeInput> {}

// ============================================================================
// Posts
// ============================================================================

export interface Post {
  id: number;
  title: string;
  slug: string;
  postType: {
    id: number;
    name: string;
    singularLabel: string;
  };
  author: Author;
  space: number | null;
  parent: number | null;
  menuOrder: number;
  featuredImage?: string;
  publishedVersion: PostVersionSummary | null;
  latestVersion: PostVersionSummary | null;
  publishedAt: string | null;
  lastModifiedAt: string;
  createdAt: string;
  updatedAt: string;
  archivedAt: string | null;
  isPublished: boolean;
  isDraft: boolean;
  hasUnpublishedChanges: boolean;
  terms: Term[];
}

export interface PostVersionSummary {
  id: number;
  versionNumber: number;
}

export type PostStatus = 'published' | 'draft' | 'has_changes' | 'archived';

export interface PostListParams {
  postType?: string;
  space?: number;
  author?: number;
  status?: PostStatus;
  search?: string;
  archived?: boolean;
  orderBy?: string;
  order?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
}

export interface CreatePostInput {
  postType: number;
  title: string;
  slug?: string;
  space?: number | null;
  parent?: number | null;
  menuOrder?: number;
  featuredImage?: string;
  contentJson: LexicalEditorState;
  excerpt?: string;
  meta?: Record<string, any>;
  terms?: number[];
}

export interface UpdatePostInput extends Partial<CreatePostInput> {}

// ============================================================================
// Post Versions
// ============================================================================

export interface PostVersion {
  id: number;
  versionNumber: number;
  versionLabel: string | null;
  title: string;
  contentJson: LexicalEditorState;
  contentHtml: string;
  excerpt?: string;
  featuredImage?: string;
  author: Author;
  isPublished: boolean;
  isAutosave: boolean;
  createdAt: string;
  publishedAt: string | null;
  changeDescription?: string;
  termsSnapshot: Term[];
  isLatest?: boolean;
}

export interface PostVersionListItem {
  id: number;
  versionNumber: number;
  versionLabel: string | null;
  title: string;
  author: Author;
  createdAt: string;
  publishedAt: string | null;
  isPublished: boolean;
  isLatest: boolean;
  isAutosave: boolean;
  changeDescription?: string;
}

export interface CreateVersionInput {
  title: string;
  contentJson: LexicalEditorState;
  excerpt?: string;
  featuredImage?: string;
  versionLabel?: string;
  changeDescription?: string;
  isAutosave?: boolean;
}

export interface PublishVersionResponse {
  postId: number;
  publishedVersionId: number;
  publishedAt: string;
  previousPublishedVersionId: number | null;
}

export interface VersionComparison {
  version1: PostVersion;
  version2: PostVersion;
}

// ============================================================================
// Post Meta
// ============================================================================

export interface PostMeta {
  [key: string]: any;
}

export interface SetMetaInput {
  key: string;
  value: any;
}

// ============================================================================
// Taxonomies
// ============================================================================

export interface Taxonomy {
  id: number;
  name: string;
  singularLabel: string;
  pluralLabel: string;
  slug: string;
  isActive: boolean;
  hierarchical: boolean;
  showInMenu: boolean;
  showInRest: boolean;
  space: number | null;
  postTypes: {
    id: number;
    name: string;
    singularLabel: string;
  }[];
  termsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaxonomyInput {
  name: string;
  singularLabel: string;
  pluralLabel: string;
  slug: string;
  isActive?: boolean;
  hierarchical?: boolean;
  showInMenu?: boolean;
  showInRest?: boolean;
  postTypes?: number[];
}

export interface UpdateTaxonomyInput extends Partial<CreateTaxonomyInput> {}

// ============================================================================
// Terms
// ============================================================================

export interface Term {
  id: number;
  name: string;
  slug: string;
  description?: string;
  parent: number | null;
  count: number;
  taxonomy: {
    id: number;
    name: string;
  };
  meta?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTermInput {
  name: string;
  slug?: string;
  description?: string;
  parent?: number | null;
  meta?: Record<string, any>;
}

export interface UpdateTermInput extends Partial<CreateTermInput> {}

export interface TermListParams {
  parent?: number;
  search?: string;
}

// ============================================================================
// Block Templates
// ============================================================================

export interface BlockTemplate {
  id: number;
  name: string;
  description?: string;
  blockJson: string;
  category?: string;
  space: number | null;
  author: Author;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBlockTemplateInput {
  name: string;
  description?: string;
  blockJson: string;
  category?: string;
  isActive?: boolean;
}

export interface UpdateBlockTemplateInput extends Partial<CreateBlockTemplateInput> {}

export interface BlockTemplateListParams {
  category?: string;
  space?: number;
}

// ============================================================================
// Lexical Editor Types
// ============================================================================

export interface LexicalEditorState {
  root: {
    children: LexicalNode[];
    direction: 'ltr' | 'rtl' | null;
    format: string;
    indent: number;
    type: string;
    version: number;
  };
}

export interface LexicalNode {
  type: string;
  version: number;
  [key: string]: any;
}

export interface RenderRequest {
  contentJson: LexicalEditorState;
}

export interface RenderResponse {
  html: string;
}

export interface ValidateBlocksRequest {
  contentJson: LexicalEditorState;
}

export interface ValidateBlocksResponse {
  valid: boolean;
  errors: string[];
}

// ============================================================================
// Permission Types
// ============================================================================

export type UserRole = 'ROLE_ADMIN' | 'ROLE_EDITOR' | 'ROLE_AUTHOR' | 'ROLE_USER';

export interface CMSUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  spaceId?: number;
}

// ============================================================================
// UI State Types
// ============================================================================

export interface EditorState {
  currentPost: Post | null;
  isDirty: boolean;
  isAutosaving: boolean;
  lastSaved: Date | null;
  autosaveInterval: number;
}

export interface UIState {
  sidebarOpen: boolean;
  activeModal: string | null;
  breadcrumbs: Breadcrumb[];
}

export interface Breadcrumb {
  label: string;
  href?: string;
}

// ============================================================================
// Error Types
// ============================================================================

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}
