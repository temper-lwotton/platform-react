# **API Domain Specification: Articles**

*(Authoritative, conceptual, human-readable)*

## **API Domain: `Articles`**

### **Description**

The Articles domain manages longform written and video-based content for knowledge sharing and learning. It provides:

* Text articles with rich content editing
* Video articles with transcripts and captions
* Mixed content combining video and written material
* Space-scoped or platform-wide content
* Commenting and engagement features
* Reading progress tracking
* Content categorization and discovery

Articles serve as the primary educational and informational content type on the platform, enabling authors to share in-depth knowledge with community members.

---

## **Domain Responsibility**

### **This domain is responsible for:**

* Creating and managing article content
* Publishing workflow (draft, review, publish, archive)
* Video embedding and transcript management
* Reading progress and engagement tracking
* Content categorization via categories and tags
* Like and bookmark functionality
* Comment threads on articles
* Content visibility and access control
* Related content suggestions

### **Out of scope:**

* Downloadable file resources (see [Downloads](./downloads.md))
* Video-only content (see [Videos](./videos.md))
* Rich text editor implementation (frontend concern)
* Video hosting/transcoding (infrastructure concern)
* Full-text search indexing (infrastructure concern)
* User authentication (see [Auth](./auth.md))

---

## **Owned Data Models**

### **Core Entities**

#### **Article**

Complete article with all content and metadata.

```typescript
interface Article {
  id: string;
  slug: string;
  type: ArticleType;
  status: ContentStatus;

  // Space association
  spaceId?: string;                    // Null for platform-wide
  space?: SpaceReference;

  // Core content
  title: string;
  subtitle?: string;
  excerpt?: string;                    // Short summary for listings
  content: string;                     // Lexical JSON or HTML
  featuredImage?: FeaturedImage;

  // Video content (for video/mixed types)
  video?: ArticleVideo;

  // Metadata
  author: ContentAuthor;
  coAuthors?: ContentAuthor[];
  publishedAt?: string;                // ISO 8601
  updatedAt: string;                   // ISO 8601
  createdAt: string;                   // ISO 8601

  // Categorization
  categories: Category[];
  tags: Tag[];
  difficulty?: DifficultyLevel;

  // Engagement
  readingTime?: number;                // Minutes (calculated)
  duration?: number;                   // Seconds (for video)
  viewCount: number;
  likeCount: number;
  bookmarkCount: number;
  commentCount: number;

  // Access control
  visibility: ContentVisibility;
  restrictedToSpaces?: string[];

  // SEO
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;

  // Related content
  relatedArticles?: string[];
  relatedDownloads?: string[];
}

interface SpaceReference {
  id: string;
  title: string;
  slug: string;
  icon?: string;
}
```

#### **ArticleVideo**

Video content for video/mixed articles.

```typescript
interface ArticleVideo {
  id: string;
  type: VideoSourceType;
  url: string;
  embedUrl?: string;                   // For external videos
  duration: number;                    // Seconds
  thumbnail?: string;
  transcript?: string;                 // Full transcript text
  captions?: VideoCaption[];
}

interface VideoCaption {
  language: string;
  url: string;                         // VTT file URL
  isDefault: boolean;
}

type VideoSourceType = 'upload' | 'youtube' | 'vimeo' | 'embed';
```

#### **FeaturedImage**

Featured image with responsive thumbnails.

```typescript
interface FeaturedImage {
  id: string;
  url: string;
  alt?: string;
  caption?: string;
  width: number;
  height: number;
  thumbnails: {
    small: string;                     // 300px
    medium: string;                    // 600px
    large: string;                     // 1200px
  };
}
```

#### **ContentAuthor**

Author information for attribution.

```typescript
interface ContentAuthor {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  role?: string;
}
```

#### **Category**

Content categorization.

```typescript
interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
}
```

#### **Tag**

Content tagging.

```typescript
interface Tag {
  id: string;
  name: string;
  slug: string;
}
```

#### **UserInteraction**

User's interaction state with an article.

```typescript
interface ArticleUserInteraction {
  hasLiked: boolean;
  hasBookmarked: boolean;
  readProgress: number;                // Percentage (0-100)
  lastReadAt?: string;                 // ISO 8601
}
```

---

## **Enumerations**

### **ArticleType**

| Value | Description |
|-------|-------------|
| `text` | Traditional longform written article |
| `video` | Video-based article with optional transcript |
| `mixed` | Combination of video and written content |

```typescript
type ArticleType = 'text' | 'video' | 'mixed';
```

### **ContentStatus**

| Value | Description |
|-------|-------------|
| `draft` | Being authored, not visible to readers |
| `pending_review` | Submitted for editorial review |
| `published` | Live and visible to authorized users |
| `archived` | Hidden from listings, accessible via direct link |

```typescript
type ContentStatus = 'draft' | 'pending_review' | 'published' | 'archived';
```

### **DifficultyLevel**

| Value | Description |
|-------|-------------|
| `beginner` | Entry-level content |
| `intermediate` | Moderate knowledge assumed |
| `advanced` | Expert-level content |

```typescript
type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
```

### **ContentVisibility**

| Value | Description |
|-------|-------------|
| `public` | Visible to all visitors |
| `members` | Visible to authenticated users |
| `restricted` | Visible to specific space members |

```typescript
type ContentVisibility = 'public' | 'members' | 'restricted';
```

---

## **Relationships & Concepts**

### **Article Lifecycle**

```
Create Draft
    ↓
Edit Content (rich text, video, images)
    ↓
Submit for Review (optional)
    ↓
Publish → Live Content
    ↓
Update (creates new version)
    ↓
Archive (when outdated)
```

### **Space Association**

Articles can be:
- **Platform-wide** (`spaceId: null`) - Visible across platform based on visibility settings
- **Space-specific** (`spaceId: "space_123"`) - Belongs to space, visible to members

This mirrors how discussions and events work within spaces.

### **Content Types**

| Type | Primary Content | Use Case |
|------|-----------------|----------|
| `text` | Rich text body | Tutorials, guides, documentation |
| `video` | Embedded video | Video tutorials, presentations |
| `mixed` | Video + text | Comprehensive courses, walkthroughs |

### **Reading Progress**

- Progress tracked as percentage (0-100)
- Saved periodically as user scrolls
- Enables "continue reading" functionality
- Used for completion analytics

### **Commenting**

Articles support threaded comments (same as discussions):
- Top-level comments
- Reply threads
- Like/reaction support
- Author responses highlighted

---

## **Business Rules**

1. **Author Required**: All articles must have an author
2. **Title Required**: Title is mandatory (max 200 characters)
3. **Slug Unique**: Slugs must be unique across platform
4. **Video Duration**: For video/mixed types, duration calculated from video
5. **Reading Time**: Calculated from text content (~200 words/minute)
6. **Space Visibility**: Space articles inherit visibility from space settings
7. **Platform Visibility**: Platform-wide articles control their own visibility
8. **Comment Inheritance**: Comment settings follow platform/space configuration
9. **Archive Access**: Archived articles accessible via direct link only
10. **Draft Isolation**: Draft articles visible only to author/editors

---

## **Authentication & Permissions**

### **Authentication**

* **Required:** Yes for write operations; varies for read
* **Token:** JWT Bearer token in Authorization header

### **Permission Rules**

| Action | Who Can Perform |
|--------|-----------------|
| List public articles | Anyone |
| List members articles | Authenticated users |
| List space articles | Space members |
| View public article | Anyone |
| View members article | Authenticated users |
| View space article | Space members |
| Create platform article | Platform administrators, content creators |
| Create space article | Space administrators, space content creators |
| Edit own article | Article author |
| Edit any article | Platform administrators |
| Publish article | Editors, administrators |
| Archive article | Editors, administrators |
| Delete article | Platform administrators |
| Like/bookmark | Authenticated users |
| Comment | Authenticated users (if enabled) |

---

## **API Capabilities Overview**

The Articles API allows consumers to:

* **List articles** with filtering by space, type, category, author
* **Get article** full content for reading
* **Create article** in platform or space context
* **Update article** content and metadata
* **Publish article** from draft status
* **Archive article** to hide from listings
* **Like/unlike article** for engagement
* **Bookmark/unbookmark** for saving
* **Track reading progress** for resume functionality
* **List/add comments** on articles

---

## **Endpoint Groups**

| Group | Purpose | Endpoint Count |
|-------|---------|----------------|
| [Articles](../endpoints/articles/README.md) | Article CRUD operations | 12 |
| [Interactions](../endpoints/articles/README.md#interactions) | Like, bookmark, progress | 6 |
| [Comments](../endpoints/articles/README.md#comments) | Article comments | 3 |

Full endpoint details in the [Endpoint Reference](../endpoints/articles/README.md).

---

## **Domain Events & Side Effects**

### **Events Emitted**

| Event | Trigger | Payload |
|-------|---------|---------|
| `article.created` | New article created | `{ articleId, authorId, spaceId }` |
| `article.published` | Article published | `{ articleId, authorId }` |
| `article.updated` | Article content updated | `{ articleId, updatedBy }` |
| `article.archived` | Article archived | `{ articleId }` |
| `article.liked` | User liked article | `{ articleId, userId }` |
| `article.commented` | New comment added | `{ articleId, commentId, userId }` |
| `article.milestone` | View milestone reached | `{ articleId, milestone, count }` |

### **Side Effects**

| Event | Side Effect |
|-------|-------------|
| `article.published` | Index for search |
| `article.published` | Notify space members (if space article) |
| `article.liked` | Increment like count |
| `article.commented` | Increment comment count |
| `article.commented` | Notify article author |
| Article viewed | Increment view count |
| Article viewed | Update reading progress |

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
| `ARTICLE_NOT_FOUND` | 404 | Article does not exist |
| `SLUG_EXISTS` | 400 | Slug already in use |
| `TITLE_REQUIRED` | 400 | Missing article title |
| `INVALID_TYPE` | 400 | Invalid article type |
| `VIDEO_REQUIRED` | 400 | Video type requires video content |
| `NOT_AUTHOR` | 403 | Only author can perform action |
| `NOT_SPACE_MEMBER` | 403 | User not a space member |
| `ALREADY_PUBLISHED` | 400 | Article already published |
| `CANNOT_ARCHIVE_DRAFT` | 400 | Cannot archive unpublished article |

---

## **Frontend Usage Notes**

### **Primary Consumers**

| Route | Usage |
|-------|-------|
| `/learn` | Article listing page |
| `/learn/[slug]` | Article reading view |
| `/spaces/[id]/articles` | Space articles |
| `/admin/articles` | Article management |

### **Service Location**

```
src/lib/articles.ts
```

### **Key Functions**

| Function | Purpose |
|----------|---------|
| `getArticles(filters)` | List articles with filtering |
| `getSpaceArticles(spaceId, filters)` | List space articles |
| `getArticle(idOrSlug)` | Get article for reading |
| `createArticle(data)` | Create new article |
| `createSpaceArticle(spaceId, data)` | Create article in space |
| `updateArticle(id, data)` | Update article |
| `publishArticle(id)` | Publish draft article |
| `archiveArticle(id)` | Archive article |
| `likeArticle(id)` | Like article |
| `unlikeArticle(id)` | Unlike article |
| `bookmarkArticle(id)` | Bookmark article |
| `unbookmarkArticle(id)` | Remove bookmark |
| `updateProgress(id, progress)` | Save reading progress |
| `getComments(id)` | Get article comments |
| `addComment(id, content)` | Add comment |

### **Caching Recommendations**

| Data | Cache Strategy |
|------|----------------|
| Article list | Short TTL (60s), invalidate on publish |
| Article content | Medium TTL (5min), invalidate on update |
| User interaction | No cache (personalized) |
| Comments | Short TTL (30s), invalidate on new comment |

### **Null Fields**

* `spaceId` - Null for platform-wide articles
* `subtitle` - Optional
* `excerpt` - Auto-generated if not provided
* `video` - Null for text-only articles
* `publishedAt` - Null for drafts
* `difficulty` - Optional
* `seoTitle` - Falls back to title

---

## **Performance & Constraints**

### **Request Volume**

| Endpoint | Expected Volume |
|----------|-----------------|
| List articles | High (homepage, listings) |
| Get article | High (reading) |
| Update progress | Medium (while reading) |
| Like/bookmark | Medium |
| Comments | Low-Medium |

### **Pagination**

* Article list: Cursor-based
* Comments: Offset-based
* Default limit: 20 articles, 50 comments

### **Rate Limiting**

| Endpoint | Limit |
|----------|-------|
| Create article | 10/hour |
| Update progress | 60/minute |
| Like/bookmark | 100/minute |
| Add comment | 30/minute |

### **Known Trade-offs**

* Reading time is estimated from word count
* View counts may have slight delay
* Progress saves are debounced on client

---

## **Related Routes**

| Route | Relationship |
|-------|--------------|
| `/learn` | Article listing |
| `/learn/[slug]` | Article view |
| `/spaces/[id]/articles` | Space articles |
| `/bookmarks` | Saved articles |

---

## **Related Domains**

| Domain | Relationship |
|--------|--------------|
| [Spaces](./spaces.md) | Space-scoped articles |
| [Users](./users.md) | Author information |
| [Downloads](./downloads.md) | Related downloads |
| [Videos](./videos.md) | Video-only content |
| [Comments](./comments.md) | Article comments |
| [Media](./media.md) | Images and video storage |

---

## **Non-Goals / Explicit Exclusions**

* **Real-time collaboration** - Not a collaborative editor
* **Version history UI** - Backend tracks, no UI exposure
* **Scheduled publishing** - Future enhancement
* **A/B testing content** - Out of scope
* **Content translation** - Future enhancement
* **Audio articles** - See Videos domain for multimedia

---

## **Stability & Change Policy**

* **Stability:** Stable
* **Breaking changes:** 30-day deprecation notice
* **Versioning:** Currently v1 (implicit)

### **Planned Enhancements**

* Scheduled publishing
* Content series/collections
* Reading lists
* Content recommendations
* Multi-language support
* Audio narration

---

## **Open Questions / Notes**

* Consider adding co-author editing permissions
* May need content series for course-like progressions
* Evaluate need for content versioning UI
* Consider reading streak/gamification features

