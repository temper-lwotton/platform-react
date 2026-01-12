# **API Domain Specification: Updates**

*(Authoritative, conceptual, human-readable)*

## **API Domain: `Updates`**

### **Description**

The Updates domain manages status updates - short-form content that users share to communicate their current work, achievements, or requests for collaboration. It provides:

* Twitter-like status updates (280 character limit)
* Media attachments (images, videos, links)
* Quick templates for common update types
* Space and project context association
* Visibility controls for content sharing
* Feed generation and filtering

Updates are the primary way users share real-time activity and progress with their network.

---

## **Domain Responsibility**

### **This domain is responsible for:**

* Creating, reading, updating, and deleting status updates
* Managing media attachments (images, videos, link previews)
* Associating updates with spaces and projects
* Managing update visibility and sharing settings
* Providing update feeds with filtering options
* Tracking engagement (likes, comments count)

### **Out of scope:**

* Comment content management (see [Discussions](./discussions.md) for comment patterns)
* Media file uploads (see [Media](./media.md))
* User profiles (see [Users](./users.md))
* Notification delivery (see [Notifications](./notifications.md))

---

## **Owned Data Models**

### **Core Entities**

#### **StatusUpdate**

```typescript
interface StatusUpdate {
  id: string;
  userId: string;

  // Content
  text: string;                   // Max 280 characters
  emoji?: string;                 // Single emoji icon
  template?: UpdateTemplate;      // Quick template used

  // Media attachments
  media?: MediaAttachment[];      // Max 4 items

  // Context
  space: {
    id: string;
    title: string;
  };
  project?: {
    id: string;
    name: string;
  };
  tags?: Array<{ id: number; name: string }>;
  link?: string;                  // External link

  // Author info
  author: {
    id: string;
    fullName: string;
    jobTitle?: string;
    photo?: string;
  };

  // Metadata
  type: 'status-update';
  createdAt: string;              // ISO 8601
  updatedAt: string;              // ISO 8601
  expiresAt?: string;             // Auto-archive after 7 days

  // Engagement
  likesCount: number;
  commentsCount: number;

  // Privacy
  visibility: UpdateVisibility;
  sharedWithSpaces?: string[];    // For 'selected-spaces'
}
```

#### **MediaAttachment**

```typescript
interface MediaAttachment {
  id: string;
  type: 'image' | 'video' | 'link';
  url: string;
  thumbnail?: string;
  caption?: string;
  // For link previews
  title?: string;
  description?: string;
  favicon?: string;
}
```

#### **UserStatus**

```typescript
interface UserStatus {
  statusUpdateId?: string;        // References latest StatusUpdate
  text: string;
  emoji?: string;
  updatedAt: string;
  visibility: 'public' | 'spaces' | 'private';
}
```

**Notes:**
* `UserStatus` is the user's current displayed status (derived from latest update)
* Updates auto-expire after 7 days but remain in history
* Media attachments support images, videos, and rich link previews

#### **QuickTemplate**

```typescript
interface QuickTemplate {
  id: string;
  emoji: string;
  label: string;
  placeholder: string;
}
```

---

## **Enumerations**

### **UpdateTemplate**

| Value | Emoji | Label | Use Case |
|-------|-------|-------|----------|
| `research` | `🔬` | Research & Analysis | Sharing research progress |
| `building` | `🚀` | Building/Launching | Announcing new work |
| `analyzing` | `📊` | Data Analysis | Data-related updates |
| `collaborating` | `🤝` | Seeking Collaboration | Requesting help |
| `presenting` | `💡` | Presenting/Sharing | Sharing presentations |
| `writing` | `📝` | Writing/Documentation | Documentation work |
| `custom` | - | Custom | No template |

```typescript
type UpdateTemplate =
  | 'research'
  | 'building'
  | 'analyzing'
  | 'collaborating'
  | 'presenting'
  | 'writing'
  | 'custom';
```

### **UpdateVisibility**

| Value | Description |
|-------|-------------|
| `all-spaces` | Visible to all space members |
| `selected-spaces` | Visible only to specified spaces |
| `profile-only` | Visible only on user's profile |

```typescript
type UpdateVisibility = 'all-spaces' | 'selected-spaces' | 'profile-only';
```

### **MediaType**

| Value | Description |
|-------|-------------|
| `image` | Image attachment |
| `video` | Video attachment |
| `link` | Link with preview |

```typescript
type MediaType = 'image' | 'video' | 'link';
```

---

## **Relationships & Concepts**

### **Space Association**

Every status update is associated with exactly one primary space. This determines:
* Who can see the update (space members)
* Where it appears in space feeds
* Context for the work being shared

### **User Status**

A user's "current status" is derived from their most recent status update:
* Displayed on profile and in user cards
* Auto-updates when new status update is created
* Clears when status update is deleted

### **Update Lifecycle**

```
Created
    ↓
Active (visible in feeds)
    ↓
Expired (after 7 days, still in history)
    ↓
Deleted (if user removes)
```

### **Media Attachments**

Updates can include up to 4 media attachments:
* **Images**: Uploaded photos/graphics
* **Videos**: Embedded video content
* **Links**: Rich previews with title, description, favicon

---

## **Business Rules**

1. **Character Limit**: Text content limited to 280 characters
2. **Media Limit**: Maximum 4 media attachments per update
3. **Space Required**: Every update must be associated with a space
4. **Author Only**: Only the author can edit or delete their update
5. **Expiration**: Updates auto-expire after 7 days (remain in history, excluded from active feeds)
6. **Single Status**: Creating a new update replaces user's current status
7. **Visibility Enforcement**: Updates respect visibility settings for who can view

---

## **Authentication & Permissions**

### **Authentication**

* **Required:** Yes (all endpoints)
* **Token:** JWT Bearer token in Authorization header

### **Permission Rules**

| Action | Who Can Perform |
|--------|-----------------|
| List updates | Any authenticated user (filtered by visibility) |
| View update | Users with visibility access |
| Create update | Space members |
| Update/Edit | Author only |
| Delete | Author only |
| Like/Comment | Users with visibility access |

---

## **API Capabilities Overview**

The Updates API allows consumers to:

* **Create status updates** with text, emoji, media, and context
* **List updates** in a feed with filtering by space, user, or tags
* **Get single update** by ID for deep linking
* **Delete updates** (author only)
* **Filter by visibility** based on user's space memberships

---

## **Endpoint Groups**

| Group | Purpose | Endpoint Count |
|-------|---------|----------------|
| [Updates](../endpoints/updates/README.md) | Core update operations | 4 |

Full endpoint details in the [Endpoint Reference](../endpoints/updates/README.md).

---

## **Domain Events & Side Effects**

### **Events Emitted**

| Event | Trigger | Payload |
|-------|---------|---------|
| `update.created` | New update posted | `{ updateId, userId, spaceId }` |
| `update.deleted` | Update removed | `{ updateId, userId }` |

### **Side Effects**

| Event | Side Effect |
|-------|-------------|
| `update.created` | User status updated |
| `update.created` | Appears in space feed |
| `update.created` | May notify space members |
| `update.deleted` | User status cleared (if current) |
| `update.deleted` | Removed from all feeds |
| `update.deleted` | Associated media may be cleaned up |

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
| `UPDATE_NOT_FOUND` | 404 | Update ID does not exist |
| `TEXT_TOO_LONG` | 400 | Exceeds 280 character limit |
| `NOT_AUTHOR` | 403 | Not the update author |
| `NOT_SPACE_MEMBER` | 403 | Not a member of the space |
| `TOO_MANY_MEDIA` | 400 | More than 4 media attachments |
| `SPACE_NOT_FOUND` | 404 | Space does not exist |

---

## **Frontend Usage Notes**

### **Primary Consumers**

| Route | Usage |
|-------|-------|
| `/feed` | Main update feed |
| `/spaces/[id]` | Space-specific updates |
| `/users/[id]` | User's update history |
| Update composer | Create new updates |

### **Service Location**

```
src/lib/status-updates.ts
```

### **Key Functions**

| Function | Purpose |
|----------|---------|
| `getCurrentUserStatus()` | Get user's current status |
| `getStatusUpdatesBySpace(spaceId)` | Get space's updates |
| `formatTimeAgo(dateString)` | Format relative time |

### **Constants**

| Constant | Purpose |
|----------|---------|
| `QUICK_TEMPLATES` | Available template options |
| `COMMON_EMOJIS` | Suggested emoji picker options |

### **Pagination**

* Cursor-based using `before` parameter
* Pass last update's `createdAt` for next page
* Default limit: 20

### **Null Fields**

* `emoji` - null if no emoji selected
* `template` - null for custom updates
* `project` - null if not project-associated
* `expiresAt` - null if no expiration
* `media` - null or empty array if no attachments

### **Caching Recommendations**

| Data | Cache Strategy |
|------|----------------|
| Feed | Short TTL (30s), invalidate on create |
| Single update | Medium TTL (5min), invalidate on delete |
| User status | Short TTL (1min), invalidate on create |

---

## **Performance & Constraints**

### **Request Volume**

| Endpoint | Expected Volume |
|----------|-----------------|
| List updates | High (feed browsing) |
| Get update | Medium (deep links) |
| Create update | Medium |
| Delete update | Low |

### **Pagination Limits**

* Default page size: 20
* Maximum page size: 50

### **Rate Limiting**

Standard rate limits apply (see [API Conventions](../_index.md#rate-limiting)).

### **Known Trade-offs**

* No edit capability (delete and recreate)
* Media uploads handled separately
* Link preview generation may have latency

---

## **Related Routes**

| Route | Relationship |
|-------|--------------|
| `/feed` | Main update feed |
| `/spaces/[id]` | Space updates tab |
| `/users/[id]` | User profile updates |

---

## **Related Domains**

| Domain | Relationship |
|--------|--------------|
| [Users](./users.md) | Author information, user status |
| [Spaces](./spaces.md) | Space context for updates |
| [Media](./media.md) | Media attachment uploads |
| [Notifications](./notifications.md) | Update notifications |

---

## **Non-Goals / Explicit Exclusions**

* **Rich text editing** - Plain text with emoji only
* **Update editing** - Delete and recreate only
* **Threaded replies** - Use discussions for conversations
* **Scheduling** - Updates are immediate only
* **Analytics** - Basic counts only, no detailed analytics

---

## **Stability & Change Policy**

* **Stability:** Stable
* **Breaking changes:** 30-day deprecation notice
* **Versioning:** Currently v1 (implicit)

### **Planned Enhancements**

* Update editing
* Scheduled updates
* Polls/reactions
* Update pinning
* Rich text support

---

## **Open Questions / Notes**

* Consider adding update editing within a time window
* May need bookmarking/saving updates
* Consider update threading for follow-up context
* Analytics dashboard for update engagement TBD
