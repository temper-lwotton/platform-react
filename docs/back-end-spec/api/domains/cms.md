# **API Domain Specification: CMS**

*(Authoritative, conceptual, human-readable)*

## **API Domain: `CMS`**

### **Description**

The CMS (Content Management System) domain provides a WordPress-inspired content management API for the platform. It provides:

* Flexible content types (posts, pages, resources, FAQs)
* Full version control with autosave and publishing workflow
* Hierarchical taxonomies and terms for organization
* Block-based content editing via Lexical JSON
* Space-scoped content with role-based access

All content supports draft/publish workflow with complete revision history.

---

## **Domain Responsibility**

### **This domain is responsible for:**

* Creating, reading, updating, and deleting posts
* Managing post types and their configurations
* Version control (create, compare, restore, publish)
* Autosave functionality for draft protection
* Taxonomy and term management
* Block template management
* Content publishing workflow

### **Out of scope:**

* Media file storage (see [Media](./media.md))
* User authentication (see [Authentication](./authentication.md))
* Space management (see [Spaces](./spaces.md))
* Comment/discussion threads (see [Discussions](./discussions.md))

---

## **Owned Data Models**

### **Core Entities**

#### **Post**

```typescript
interface Post {
  id: number;
  title: string;
  slug: string;
  postType: {
    id: number;
    name: string;
    singularLabel: string;
  };
  author: PostAuthor;
  space: number | null;
  parent: number | null;              // For hierarchical content
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

interface PostAuthor {
  id: number;
  name: string;
  avatar?: string;
}

interface PostVersionSummary {
  id: number;
  versionNumber: number;
  createdAt: string;
}
```

#### **PostVersion**

```typescript
interface PostVersion {
  id: number;
  versionNumber: number;
  versionLabel: string | null;
  title: string;
  contentJson: LexicalEditorState;    // Lexical editor JSON
  contentHtml: string;                // Rendered HTML
  excerpt?: string;
  featuredImage?: string;
  author: PostAuthor;
  isPublished: boolean;
  isAutosave: boolean;
  createdAt: string;
  publishedAt: string | null;
  changeDescription?: string;
  termsSnapshot: Term[];
  isLatest?: boolean;
}
```

#### **PostType**

```typescript
interface PostType {
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
```

#### **Taxonomy**

```typescript
interface Taxonomy {
  id: number;
  name: string;
  singularLabel: string;
  pluralLabel: string;
  slug: string;
  isActive: boolean;
  hierarchical: boolean;              // true = categories, false = tags
  showInMenu: boolean;
  showInRest: boolean;
  space: number | null;
  postTypes: { id: number; name: string }[];
  termsCount: number;
  createdAt: string;
  updatedAt: string;
}
```

#### **Term**

```typescript
interface Term {
  id: number;
  name: string;
  slug: string;
  description?: string;
  parent: number | null;              // For hierarchical taxonomies
  count: number;                      // Posts using this term
  taxonomy: { id: number; name: string };
  meta?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}
```

---

## **Enumerations**

### **PostTypeSupport**

| Value | Description |
|-------|-------------|
| `title` | Post title field |
| `editor` | Rich content editor |
| `author` | Author attribution |
| `thumbnail` | Featured image |
| `excerpt` | Summary/excerpt field |
| `revisions` | Version history |
| `custom-fields` | Custom metadata |
| `comments` | Comment support |
| `page-attributes` | Menu order, parent |

```typescript
type PostTypeSupport =
  | 'title' | 'editor' | 'author' | 'thumbnail'
  | 'excerpt' | 'revisions' | 'custom-fields'
  | 'comments' | 'trackbacks' | 'page-attributes';
```

---

## **Relationships & Concepts**

### **Version Control**

Every post has a complete version history:
* **Versions**: Each save creates a new version
* **Autosave**: Automatic saves create temporary versions (replaced on next save)
* **Publishing**: Only versions can be published, not posts directly
* **Restore**: Any version can be restored as the current version
* **Compare**: Versions can be compared side-by-side

### **Publishing Workflow**

```
Draft (no published version)
    ↓
Published (version marked as published)
    ↓
Updated (has unpublished changes)
    ↓
Archived (soft-deleted)
```

### **Hierarchical Content**

Posts can have parent-child relationships:
* Parent must be same post type
* Enables nested page structures
* Menu order controls sibling ordering

### **Taxonomies vs Terms**

* **Taxonomy**: A classification system (e.g., "Category", "Tag")
* **Term**: A value within a taxonomy (e.g., "News", "Tutorial")
* **Hierarchical**: Categories have parent-child; Tags are flat

---

## **Business Rules**

1. **Slugs**: Auto-generated from title if not provided, must be unique per post type
2. **Publishing**: Only versions can be published, not posts directly
3. **Autosave**: Automatic saves don't create "real" versions, replaced on next save
4. **Deletion**: Posts are soft-deleted (archived), can be permanently deleted
5. **Hierarchical Content**: Posts with `parent` must have same post type
6. **Permissions**: Based on user role (Admin, Editor, Author, User)
7. **Terms Snapshot**: Published version captures terms at publish time

---

## **Authentication & Permissions**

### **Authentication**

* **Required:** Yes (all endpoints except public published content)
* **Token:** JWT Bearer token in Authorization header

### **Permission Rules**

| Action | Who Can Perform |
|--------|-----------------|
| View published | Any user (public) |
| View drafts | Author, Editor, Admin |
| Create post | Author, Editor, Admin |
| Edit own posts | Author (own), Editor, Admin |
| Edit all posts | Editor, Admin |
| Delete posts | Author (own), Admin |
| Publish posts | Editor, Admin |
| Manage post types | Admin only |
| Manage taxonomies | Admin only |

---

## **API Capabilities Overview**

The CMS API allows consumers to:

* **CRUD posts** with full content and metadata
* **Manage versions** (create, compare, restore, publish)
* **Autosave** drafts for protection
* **Duplicate posts** for content reuse
* **Configure post types** for different content needs
* **Manage taxonomies and terms** for organization
* **Assign terms** to posts for categorization

---

## **Endpoint Groups**

| Group | Purpose | Endpoint Count |
|-------|---------|----------------|
| [Posts](../endpoints/cms/posts/README.md) | Post CRUD operations | 7 |
| [Versions](../endpoints/cms/versions/README.md) | Version management | 9 |
| [Post Types](../endpoints/cms/post-types/README.md) | Type configuration | 5 |
| [Taxonomies](../endpoints/cms/taxonomies/README.md) | Taxonomy management | 5 |
| [Terms](../endpoints/cms/terms/README.md) | Term management | 6 |

Full endpoint details in respective Endpoint References.

---

## **Domain Events & Side Effects**

### **Events Emitted**

| Event | Trigger | Payload |
|-------|---------|---------|
| `post.created` | New post | `{ postId, authorId, postType }` |
| `post.updated` | Post edited | `{ postId, versionId }` |
| `post.published` | Version published | `{ postId, versionId }` |
| `post.unpublished` | Post unpublished | `{ postId }` |
| `post.archived` | Post archived | `{ postId }` |
| `post.deleted` | Permanently deleted | `{ postId }` |

### **Side Effects**

| Event | Side Effect |
|-------|-------------|
| `post.published` | May notify space members |
| `post.published` | Updates search index |
| `post.archived` | Removes from public views |

---

## **Error Model**

Standard error envelope (see [API Conventions](../_index.md#error-codes)):

```typescript
{
  success: false,
  error: {
    code: string,
    message: string,
    errors?: { [field: string]: string[] }
  }
}
```

### **Domain-Specific Error Codes**

| Code | HTTP | Description |
|------|------|-------------|
| `POST_NOT_FOUND` | 404 | Post ID does not exist |
| `VERSION_NOT_FOUND` | 404 | Version ID does not exist |
| `SLUG_EXISTS` | 409 | Slug already in use |
| `CANNOT_PUBLISH` | 403 | Insufficient permissions |
| `INVALID_PARENT` | 400 | Parent must be same post type |
| `TAXONOMY_NOT_FOUND` | 404 | Taxonomy does not exist |
| `TERM_NOT_FOUND` | 404 | Term does not exist |

---

## **Frontend Usage Notes**

### **Primary Consumers**

| Route | Usage |
|-------|-------|
| `/admin/posts` | Post listing and management |
| `/admin/posts/[id]/edit` | Post editor |
| `/admin/post-types` | Post type configuration |
| `/admin/taxonomies` | Taxonomy management |
| `/[slug]` | Public post display |

### **Service Location**

```
src/services/cms/api/posts.ts
src/services/cms/api/versions.ts
src/services/cms/api/postTypes.ts
src/services/cms/api/taxonomies.ts
src/services/cms/api/terms.ts
```

### **Key Functions**

| Function | Purpose |
|----------|---------|
| `postsAPI.list(params)` | List posts with filters |
| `postsAPI.create(data)` | Create new post |
| `versionsAPI.create(postId, data)` | Create version |
| `versionsAPI.publish(postId, versionId)` | Publish version |
| `versionsAPI.autosave(postId, data)` | Autosave draft |

### **Pagination**

* Uses `page` + `limit` parameters
* Default limit: 20

### **Null Fields**

* `publishedVersion` - null if never published
* `latestVersion` - null if only autosaves
* `parent` - null if top-level content
* `featuredImage` - null if not set
* `archivedAt` - null if not archived

### **Caching Recommendations**

| Data | Cache Strategy |
|------|----------------|
| Post list | Short TTL (1min), invalidate on create |
| Post detail | Medium TTL (5min), invalidate on update |
| Published content | Long TTL (1hr), invalidate on publish |
| Post types | Long TTL (1hr), rarely changes |

---

## **Performance & Constraints**

### **Request Volume**

| Endpoint | Expected Volume |
|----------|-----------------|
| List posts | High (admin dashboards) |
| Get post | High (editing, viewing) |
| Autosave | Very High (every 30s while editing) |
| Publish | Low |

### **Pagination Limits**

* Default page size: 20
* Maximum page size: 100

### **Rate Limiting**

Standard rate limits apply. Autosave has relaxed limits.

### **Known Trade-offs**

* Version history grows unbounded (consider pruning old versions)
* Autosave creates many versions (only latest kept)
* Large Lexical JSON payloads may impact performance

---

## **Related Routes**

| Route | Relationship |
|-------|--------------|
| `/admin/posts` | Post management |
| `/admin/posts/[id]/edit` | Post editor |
| `/[slug]` | Public post view |
| `/category/[term]` | Term archive |

---

## **Related Domains**

| Domain | Relationship |
|--------|--------------|
| [Media](./media.md) | Featured images, inline media |
| [Users](./users.md) | Author attribution |
| [Spaces](./spaces.md) | Content scoping |
| [Settings](./settings.md) | CMS configuration |

---

## **Non-Goals / Explicit Exclusions**

* **Real-time collaboration** - Single-author editing only
* **Content preview** - Editor handles preview locally
* **SEO tools** - Basic slug control only
* **Workflow approvals** - No multi-step approval process
* **Content scheduling** - Publish immediately only

---

## **Stability & Change Policy**

* **Stability:** Stable
* **Breaking changes:** 30-day deprecation notice
* **Versioning:** Currently v1 (implicit)

### **Planned Enhancements**

* Scheduled publishing
* Multi-author collaboration
* Content locking
* Revision pruning
* Block templates library

---

## **Open Questions / Notes**

* Consider adding scheduled publishing
* May need content locking for concurrent editing
* Version pruning policy TBD
* Block template library management needs design
