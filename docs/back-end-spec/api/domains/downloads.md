# **API Domain Specification: Downloads**

*(Authoritative, conceptual, human-readable)*

## **API Domain: `Downloads`**

### **Description**

The Downloads domain manages downloadable file resources for knowledge sharing and resource distribution. It provides:

* Multiple file type support (documents, spreadsheets, archives, code)
* Space-scoped or platform-wide resources
* Download tracking and analytics
* Version management with changelogs
* Secure file delivery with access control
* Engagement features (likes, bookmarks)

Downloads enable content creators to share files, templates, and resources with community members while tracking usage and maintaining version history.

---

## **Domain Responsibility**

### **This domain is responsible for:**

* Creating and managing downloadable resources
* File upload and storage management
* Secure file delivery with signed URLs
* Download tracking per user
* Version management and changelogs
* Access control based on visibility
* Engagement tracking (views, likes, bookmarks)
* Analytics on download activity

### **Out of scope:**

* Article content (see [Articles](./articles.md))
* Video content (see [Videos](./videos.md))
* File storage infrastructure (infrastructure concern)
* Virus scanning (infrastructure concern)
* CDN configuration (infrastructure concern)

---

## **Owned Data Models**

### **Core Entities**

#### **Download**

Complete downloadable resource with metadata.

```typescript
interface Download {
  id: string;
  slug: string;
  status: ContentStatus;

  // Space association
  spaceId?: string;                    // Null for platform-wide
  space?: SpaceReference;

  // Core content
  title: string;
  description: string;                 // Rich text
  shortDescription?: string;           // For listings
  featuredImage?: FeaturedImage;

  // File information
  file: DownloadFile;
  additionalFiles?: DownloadFile[];    // For multi-file downloads

  // Metadata
  author: ContentAuthor;
  publishedAt?: string;                // ISO 8601
  updatedAt: string;                   // ISO 8601
  createdAt: string;                   // ISO 8601

  // Categorization
  type: DownloadType;
  categories: Category[];
  tags: Tag[];

  // Engagement & tracking
  downloadCount: number;
  viewCount: number;
  likeCount: number;
  bookmarkCount: number;

  // Access control
  visibility: ContentVisibility;
  restrictedToSpaces?: string[];
  requiresAuth: boolean;

  // Version tracking
  version?: string;
  changelog?: VersionChange[];

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

#### **DownloadFile**

Individual file within a download resource.

```typescript
interface DownloadFile {
  id: string;
  filename: string;
  originalFilename: string;
  url: string;                         // Secure download URL
  mimeType: string;
  size: number;                        // Bytes
  sizeFormatted: string;               // e.g., "2.4 MB"
  checksum?: string;                   // MD5/SHA256
  uploadedAt: string;                  // ISO 8601
}
```

#### **VersionChange**

Version history entry.

```typescript
interface VersionChange {
  version: string;
  date: string;                        // ISO 8601
  changes: string[];                   // List of changes
  fileId?: string;                     // If file was updated
}
```

#### **DownloadRecord**

Individual download tracking record.

```typescript
interface DownloadRecord {
  id: string;
  downloadId: string;
  fileId: string;
  userId?: string;                     // Null for anonymous
  user?: {
    id: string;
    name: string;
    email: string;
  };
  downloadedAt: string;                // ISO 8601
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
}
```

#### **DownloadAnalytics**

Aggregate analytics for a download.

```typescript
interface DownloadAnalytics {
  downloadId: string;
  totalDownloads: number;
  uniqueDownloaders: number;
  downloadsByDate: {
    date: string;
    count: number;
  }[];
  downloadsByUser: {
    userId: string;
    userName: string;
    count: number;
    lastDownload: string;
  }[];
  topReferrers: {
    referrer: string;
    count: number;
  }[];
}
```

#### **UserInteraction**

User's interaction state with a download.

```typescript
interface DownloadUserInteraction {
  hasLiked: boolean;
  hasBookmarked: boolean;
  hasDownloaded: boolean;
  lastDownloadedAt?: string;
  downloadCount: number;               // User's download count
}
```

---

## **Enumerations**

### **DownloadType**

| Value | Description | Common Formats |
|-------|-------------|----------------|
| `document` | Documents and guides | PDF, DOCX, PPTX |
| `spreadsheet` | Data files and templates | XLSX, CSV |
| `archive` | Compressed packages | ZIP, RAR, TAR.GZ |
| `image` | High-res images | PNG, JPG, SVG |
| `code` | Code samples/projects | ZIP, TAR.GZ |
| `media` | Audio/video files | MP3, MP4, WAV |
| `other` | Other file types | Any |

```typescript
type DownloadType = 'document' | 'spreadsheet' | 'archive' | 'image' | 'code' | 'media' | 'other';
```

### **ContentStatus**

| Value | Description |
|-------|-------------|
| `draft` | Being prepared, not visible |
| `pending_review` | Submitted for review |
| `published` | Live and accessible |
| `archived` | Hidden from listings |

```typescript
type ContentStatus = 'draft' | 'pending_review' | 'published' | 'archived';
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

### **Download Lifecycle**

```
Upload File(s)
    ↓
Create Download Resource
    ↓
Add Metadata (title, description, categories)
    ↓
Publish → Available for Download
    ↓
Track Downloads
    ↓
Update Version (upload new file, add changelog)
    ↓
Archive (when outdated)
```

### **Space Association**

Downloads can be:
- **Platform-wide** (`spaceId: null`) - Available based on visibility settings
- **Space-specific** (`spaceId: "space_123"`) - Available to space members

### **File Delivery**

1. User requests download
2. System verifies access permissions
3. Generate signed URL with expiration
4. Record download in tracking
5. Redirect to signed URL or stream file

### **Version Management**

- Each version can have a new file
- Changelog entries describe changes
- Previous versions retained
- Download count aggregated across versions

### **Multi-File Downloads**

- Primary file + additional files
- Each file tracked separately
- Common use: main document + source code + examples

---

## **Business Rules**

1. **File Required**: Downloads must have at least one file
2. **Title Required**: Title is mandatory (max 200 characters)
3. **Slug Unique**: Slugs must be unique across platform
4. **Auth Configurable**: Individual downloads can require authentication
5. **Space Visibility**: Space downloads inherit access from space
6. **Version Format**: Version strings follow semver-like pattern
7. **File Size Limit**: Individual files limited to 100MB
8. **Download Tracking**: All downloads recorded for analytics
9. **Secure URLs**: Download URLs expire after 1 hour

---

## **Authentication & Permissions**

### **Authentication**

* **Required:** Yes for write operations; varies for read/download
* **Token:** JWT Bearer token in Authorization header

### **Permission Rules**

| Action | Who Can Perform |
|--------|-----------------|
| List public downloads | Anyone |
| List members downloads | Authenticated users |
| List space downloads | Space members |
| View download details | Based on visibility |
| Download file (public) | Anyone (if not requiresAuth) |
| Download file (members) | Authenticated users |
| Download file (space) | Space members |
| Create platform download | Administrators, content creators |
| Create space download | Space administrators, content creators |
| Edit own download | Download author |
| Edit any download | Administrators |
| Publish download | Editors, administrators |
| View analytics | Download author, administrators |
| View download records | Administrators |

---

## **API Capabilities Overview**

The Downloads API allows consumers to:

* **List downloads** with filtering by space, type, category
* **Get download** details with user interaction state
* **Download file** with access tracking
* **Create download** in platform or space context
* **Update download** metadata and files
* **Publish download** from draft status
* **Upload new version** with changelog
* **Like/bookmark download** for engagement
* **Get analytics** on download activity (admin)
* **Export records** of who downloaded (admin)

---

## **Endpoint Groups**

| Group | Purpose | Endpoint Count |
|-------|---------|----------------|
| [Downloads](../endpoints/downloads/README.md) | Download CRUD operations | 10 |
| [Files](../endpoints/downloads/README.md#files) | File download operations | 3 |
| [Interactions](../endpoints/downloads/README.md#interactions) | Like, bookmark | 4 |
| [Admin](../endpoints/downloads/README.md#admin) | Analytics and records | 3 |

Full endpoint details in the [Endpoint Reference](../endpoints/downloads/README.md).

---

## **Domain Events & Side Effects**

### **Events Emitted**

| Event | Trigger | Payload |
|-------|---------|---------|
| `download.created` | New download created | `{ downloadId, authorId, spaceId }` |
| `download.published` | Download published | `{ downloadId, authorId }` |
| `download.updated` | Download updated | `{ downloadId, version }` |
| `download.downloaded` | File downloaded | `{ downloadId, fileId, userId }` |
| `download.liked` | User liked download | `{ downloadId, userId }` |
| `download.milestone` | Download milestone reached | `{ downloadId, milestone, count }` |

### **Side Effects**

| Event | Side Effect |
|-------|-------------|
| `download.published` | Index for search |
| `download.published` | Notify space members (if space download) |
| `download.downloaded` | Increment download count |
| `download.downloaded` | Create download record |
| `download.liked` | Increment like count |
| Download viewed | Increment view count |

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
| `DOWNLOAD_NOT_FOUND` | 404 | Download does not exist |
| `FILE_NOT_FOUND` | 404 | File does not exist |
| `SLUG_EXISTS` | 400 | Slug already in use |
| `FILE_REQUIRED` | 400 | Download must have a file |
| `FILE_TOO_LARGE` | 400 | File exceeds size limit |
| `NOT_AUTHOR` | 403 | Only author can perform action |
| `NOT_SPACE_MEMBER` | 403 | User not a space member |
| `AUTH_REQUIRED` | 401 | Download requires authentication |
| `URL_EXPIRED` | 410 | Download URL has expired |

---

## **Frontend Usage Notes**

### **Primary Consumers**

| Route | Usage |
|-------|-------|
| `/resources` | Download listing page |
| `/resources/[slug]` | Download detail page |
| `/spaces/[id]/resources` | Space downloads |
| `/admin/downloads` | Download management |
| `/admin/downloads/[id]/analytics` | Download analytics |

### **Service Location**

```
src/lib/downloads.ts
```

### **Key Functions**

| Function | Purpose |
|----------|---------|
| `getDownloads(filters)` | List downloads with filtering |
| `getSpaceDownloads(spaceId, filters)` | List space downloads |
| `getDownload(idOrSlug)` | Get download details |
| `createDownload(data)` | Create new download |
| `createSpaceDownload(spaceId, data)` | Create download in space |
| `updateDownload(id, data)` | Update download |
| `publishDownload(id)` | Publish draft download |
| `uploadVersion(id, data)` | Upload new version |
| `downloadFile(id, fileId?)` | Get file download URL |
| `likeDownload(id)` | Like download |
| `bookmarkDownload(id)` | Bookmark download |
| `getAnalytics(id)` | Get download analytics |
| `getRecords(id)` | Get download records |

### **Caching Recommendations**

| Data | Cache Strategy |
|------|----------------|
| Download list | Short TTL (60s), invalidate on publish |
| Download details | Medium TTL (5min), invalidate on update |
| User interaction | No cache (personalized) |
| Analytics | Short TTL (60s) |

### **Null Fields**

* `spaceId` - Null for platform-wide downloads
* `shortDescription` - Optional, auto-generated
* `additionalFiles` - Empty array if single file
* `publishedAt` - Null for drafts
* `version` - Optional
* `changelog` - Empty if no version history

---

## **Performance & Constraints**

### **Request Volume**

| Endpoint | Expected Volume |
|----------|-----------------|
| List downloads | Medium |
| Get download | Medium |
| Download file | High |
| Analytics | Low (admin only) |

### **Pagination**

* Download list: Cursor-based
* Download records: Cursor-based
* Default limit: 20

### **Rate Limiting**

| Endpoint | Limit |
|----------|-------|
| Create download | 10/hour |
| Download file | 100/minute |
| Like/bookmark | 100/minute |

### **Known Trade-offs**

* Download URLs expire after 1 hour
* Analytics may be delayed slightly
* Large file downloads may timeout on slow connections

---

## **Related Routes**

| Route | Relationship |
|-------|--------------|
| `/resources` | Download listing |
| `/resources/[slug]` | Download detail |
| `/spaces/[id]/resources` | Space downloads |
| `/bookmarks` | Saved downloads |

---

## **Related Domains**

| Domain | Relationship |
|--------|--------------|
| [Spaces](./spaces.md) | Space-scoped downloads |
| [Users](./users.md) | Author information |
| [Articles](./articles.md) | Related articles |
| [Media](./media.md) | File storage |

---

## **Non-Goals / Explicit Exclusions**

* **Streaming downloads** - Direct file delivery only
* **Download resume** - CDN-level concern
* **File previews** - Frontend concern
* **Automatic virus scanning** - Infrastructure concern
* **Version comparison** - Future enhancement

---

## **Stability & Change Policy**

* **Stability:** Stable
* **Breaking changes:** 30-day deprecation notice
* **Versioning:** Currently v1 (implicit)

### **Planned Enhancements**

* File preview generation
* Download bundles (multiple downloads as ZIP)
* Scheduled availability windows
* Download quotas per user
* Integration with external storage (S3, etc.)

---

## **Open Questions / Notes**

* Consider adding file preview for documents
* May need download bundles for related resources
* Evaluate need for download quotas
* Consider automatic version detection

