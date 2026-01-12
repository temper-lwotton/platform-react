# **API Domain Specification: Media**

*(Authoritative, conceptual, human-readable)*

## **API Domain: `Media`**

### **Description**

The Media domain manages the platform's media library, providing image upload, storage, AI-powered analysis, and metadata management. It provides:

* Image upload with automatic thumbnail generation
* AI-powered content analysis and alt text suggestions
* Metadata management (titles, descriptions, tags)
* Content moderation via AI flagging
* SEO-optimized filename generation
* Space-scoped media organization

All uploaded images are automatically analyzed for content, accessibility, and moderation.

---

## **Domain Responsibility**

### **This domain is responsible for:**

* Uploading, storing, and serving media files
* Generating thumbnails and optimized versions
* Running AI analysis on uploaded images
* Managing media metadata (title, description, alt text, tags)
* Providing search and filtering across media library
* Handling archival and deletion of media
* Generating alt text suggestions for accessibility

### **Out of scope:**

* Video transcoding (future enhancement)
* Document processing (PDFs, etc.)
* CDN configuration (infrastructure concern)
* Media embedding in posts (see [CMS](./cms.md))

---

## **Owned Data Models**

### **Core Entities**

#### **MediaItem**

```typescript
interface MediaItem {
  id: number;
  filename: string;
  seoFilename?: string;
  url: string;
  thumbnailUrl: string | null;
  size: number;                    // bytes
  width: number | null;
  height: number | null;
  type: string;                    // MIME type
  orientation: 'portrait' | 'landscape' | 'square' | null;
  altText: string | null;
  title: string | null;
  description: string | null;
  userTags: string[];
  aiAnalysis: AIAnalysis | null;
  uploadedAt: string;              // ISO 8601
  uploadedBy: MediaUser;
  space: MediaSpace | null;
}

interface MediaUser {
  id: number;
  name: string;
  email: string;
}

interface MediaSpace {
  id: number;
  name: string;
}
```

#### **AIAnalysis**

```typescript
interface AIAnalysis {
  tags: AITag[];
  suggestedAltTexts: string[];
  dominantColors: string[];        // Hex color codes
  peopleCount: number;
  faces?: Face[];
  moderationFlags: ModerationFlags;
}

interface AITag {
  id: string;
  label: string;
  confidence: number;              // 0-1
  category: 'object' | 'person' | 'emotion' | 'scene' | 'color' | 'text';
}

interface Face {
  x: number;
  y: number;
  width: number;
  height: number;
  emotion?: string;
}

interface ModerationFlags {
  isAdult: boolean;
  isViolent: boolean;
  confidence: number;              // 0-1
}
```

#### **MediaUploadOptions**

```typescript
interface MediaUploadOptions {
  spaceId?: number;
  title?: string;
  description?: string;
  altText?: string;
  userTags?: string[];
  autoRename?: boolean;            // AI-generated SEO filename (default: true)
  customFilename?: string;         // Overrides autoRename
}
```

---

## **Enumerations**

### **Orientation**

| Value | Description |
|-------|-------------|
| `portrait` | Height > Width |
| `landscape` | Width > Height |
| `square` | Width = Height |

### **AITagCategory**

| Value | Description |
|-------|-------------|
| `object` | Physical objects detected |
| `person` | People detected |
| `emotion` | Emotional content |
| `scene` | Scene/setting type |
| `color` | Dominant colors |
| `text` | Text detected in image |

---

## **Relationships & Concepts**

### **AI Analysis Pipeline**

Every uploaded image automatically undergoes:
1. **Object/Scene Detection**: Identifies objects, people, scenes, and text
2. **Alt Text Generation**: Multiple accessibility-focused descriptions
3. **Color Analysis**: Extracts dominant colors
4. **Face Detection**: Counts faces with emotion detection
5. **Content Moderation**: Flags adult or violent content

### **SEO Filenames**

Images can be automatically renamed with SEO-optimized filenames:
* Based on AI-detected content
* Or user-provided custom filename
* Preserves original file extension

### **Space Association**

Media can be optionally associated with a space:
* Enables space-scoped media libraries
* Affects visibility and permissions
* Unassociated media is user-private

---

## **Business Rules**

1. **Upload Limits**: Maximum file size of 10MB per image
2. **Supported Formats**: JPEG, PNG, GIF, WebP
3. **AI Analysis**: Runs automatically on upload; can be re-triggered manually
4. **Ownership**: Only the uploader or space admin can modify/delete
5. **Archiving**: Soft-delete that hides items without permanent removal
6. **Moderation**: Flagged content may be automatically hidden
7. **Thumbnails**: Auto-generated for all uploaded images

---

## **Authentication & Permissions**

### **Authentication**

* **Required:** Yes (all endpoints)
* **Token:** JWT Bearer token in Authorization header

### **Permission Rules**

| Action | Who Can Perform |
|--------|-----------------|
| Upload media | Any authenticated user |
| List media | Any authenticated user (filtered by access) |
| View media | Users with space access or owner |
| Update metadata | Uploader or space admin |
| Delete media | Uploader or space admin |
| Re-analyze | Uploader or space admin |

---

## **API Capabilities Overview**

The Media API allows consumers to:

* **Upload images** with automatic AI analysis
* **List and search** media with filtering
* **Get media details** including AI analysis
* **Update metadata** (title, description, alt text, tags)
* **Archive and unarchive** media items
* **Delete media** permanently
* **Re-run AI analysis** on existing images
* **Generate alt text** for any image URL

---

## **Endpoint Groups**

| Group | Purpose | Endpoint Count |
|-------|---------|----------------|
| [Media](../endpoints/media/README.md) | Core media operations | 9 |

Full endpoint details in the [Endpoint Reference](../endpoints/media/README.md).

---

## **Domain Events & Side Effects**

### **Events Emitted**

| Event | Trigger | Payload |
|-------|---------|---------|
| `media.uploaded` | New upload complete | `{ mediaId, userId, spaceId }` |
| `media.analyzed` | AI analysis complete | `{ mediaId, tags, moderation }` |
| `media.deleted` | Media removed | `{ mediaId }` |
| `media.flagged` | Moderation flag raised | `{ mediaId, flagType }` |

### **Side Effects**

| Event | Side Effect |
|-------|-------------|
| `media.uploaded` | Thumbnail generated |
| `media.uploaded` | AI analysis queued |
| `media.flagged` | May hide from public view |
| `media.deleted` | Files removed from storage |

---

## **Error Model**

Standard error envelope (see [API Conventions](../_index.md#error-codes)):

```typescript
{
  success: false,
  error: {
    code: string,
    message: string
  }
}
```

### **Domain-Specific Error Codes**

| Code | HTTP | Description |
|------|------|-------------|
| `MEDIA_NOT_FOUND` | 404 | Media ID does not exist |
| `FILE_TOO_LARGE` | 400 | Exceeds 10MB limit |
| `UNSUPPORTED_FORMAT` | 400 | File type not supported |
| `NOT_OWNER` | 403 | Not the uploader or admin |
| `ANALYSIS_FAILED` | 500 | AI analysis error |

---

## **Frontend Usage Notes**

### **Primary Consumers**

| Route | Usage |
|-------|-------|
| `/media` | Media library browser |
| Post editor | Image insertion |
| Profile settings | Avatar upload |
| Space settings | Cover image upload |

### **Service Location**

```
src/lib/media-api.ts
```

### **Key Functions**

| Function | Purpose |
|----------|---------|
| `uploadMedia(file, options)` | Upload with options |
| `getMediaList(params)` | List with filters |
| `getMediaItem(id)` | Get single item |
| `updateMediaItem(id, data)` | Update metadata |
| `deleteMediaItem(id)` | Delete permanently |
| `reanalyzeImage(id)` | Re-run AI analysis |
| `generateAltText(options)` | Generate alt text |
| `archiveMediaItem(id)` | Soft delete |
| `unarchiveMediaItem(id)` | Restore |

### **Pagination**

* Uses `page` + `limit` parameters
* Default limit: 20

### **Null Fields**

* `thumbnailUrl` - null if generation failed
* `width`/`height` - null if not determined
* `orientation` - null if dimensions unknown
* `aiAnalysis` - null if analysis pending/failed
* `space` - null if not space-associated

### **Caching Recommendations**

| Data | Cache Strategy |
|------|----------------|
| Media list | Short TTL (1min), invalidate on upload |
| Media detail | Medium TTL (5min), invalidate on update |
| AI analysis | Long TTL (1hr), stable after generation |

---

## **Performance & Constraints**

### **Request Volume**

| Endpoint | Expected Volume |
|----------|-----------------|
| Upload | Medium |
| List | High (media picker) |
| Get | Medium |
| Delete | Low |

### **File Limits**

* Maximum file size: 10MB
* Supported formats: JPEG, PNG, GIF, WebP

### **Rate Limiting**

Standard rate limits apply (see [API Conventions](../_index.md#rate-limiting)).

### **Known Trade-offs**

* AI analysis is async; may not be immediately available
* Large images may take time to process
* Thumbnail generation happens synchronously on upload

---

## **Related Routes**

| Route | Relationship |
|-------|--------------|
| `/media` | Media library |
| `/admin/media` | Admin media management |
| Post editor | Inline image picker |

---

## **Related Domains**

| Domain | Relationship |
|--------|--------------|
| [CMS](./cms.md) | Posts use media for featured images |
| [Users](./users.md) | Profile photos |
| [Spaces](./spaces.md) | Space cover images |
| [Updates](./updates.md) | Status update attachments |

---

## **Non-Goals / Explicit Exclusions**

* **Video transcoding** - Not supported currently
* **Document processing** - PDFs, Office docs not processed
* **CDN management** - Infrastructure concern
* **Bulk operations** - Single file operations only
* **Version history** - No versioning for media files

---

## **Stability & Change Policy**

* **Stability:** Stable
* **Breaking changes:** 30-day deprecation notice
* **Versioning:** Currently v1 (implicit)

### **Planned Enhancements**

* Video upload and transcoding
* Bulk upload
* Image editing (crop, resize)
* Collections/albums
* External URL imports

---

## **Open Questions / Notes**

* Consider adding video support
* May need bulk upload for efficiency
* Image editing capabilities TBD
* Storage quota management not yet implemented
