# **API Domain Specification: Discussions**

*(Authoritative, conceptual, human-readable)*

## **API Domain: `Discussions`**

### **Description**

The Discussions domain manages community discussions (posts) within spaces. Discussions are the primary content type for member engagement, supporting rich text content, comments, likes, and follows. It provides:

* Discussion CRUD operations
* Nested comment threads
* Like and follow functionality
* Space-scoped content organization

Discussions are always associated with a space and authored by a user.

---

## **Domain Responsibility**

### **This domain is responsible for:**

* Creating, reading, updating, and deleting discussions
* Managing discussion comments (nested/threaded)
* Tracking discussion likes and followers
* Providing discussion feeds (all, by space)
* Managing discussion metadata (tags, pinning)

### **Out of scope:**

* Space management (see [Spaces](./spaces.md))
* User profiles (see [Users](./users.md))
* AI-powered excerpt/engagement analysis (handled by separate API routes)
* Notifications triggered by discussions (see [Notifications](./notifications.md))

---

## **Owned Data Models**

### **Core Entities**

#### **Discussion**

```typescript
interface Discussion {
  id: string;
  createdAt: string;           // ISO 8601
  updatedAt?: string;          // ISO 8601
  title: string;
  excerpt?: string;            // Short summary
  htmlContent?: string;        // Rich text content
  jsonContent?: object;        // Lexical JSON representation
  tags?: DiscussionTag[];
  author?: DiscussionAuthor;
  space?: DiscussionSpace;
  likedBy?: DiscussionUser[];  // Users who liked
  followedBy?: DiscussionUser[]; // Users following
  likesCount?: number;
  commentsCount?: number;
  followersCount?: number;
  isPinned?: boolean;          // Pinned in space
  isLiked?: boolean;           // Current user has liked
  isFollowing?: boolean;       // Current user is following
}

interface DiscussionAuthor {
  id: string;
  fullName?: string;
  profile?: {
    fullName?: string;
    firstName?: string;
    lastName?: string;
    photo?: string;
  };
}

interface DiscussionSpace {
  id: string;
  title: string;
}

interface DiscussionTag {
  id: number;
  name: string;
}

interface DiscussionUser {
  id: number;
  name: string;
  photo?: string;
}
```

#### **Comment**

```typescript
interface Comment {
  id: string;
  createdAt: string;           // ISO 8601
  content: string;             // Plain text or HTML
  level?: number;              // Nesting level (0 = top-level)
  author?: CommentAuthor;
  __children?: Comment[];      // API returns nested comments
  replies?: Comment[];         // Mapped from __children
}

interface CommentAuthor {
  id: string;
  profile?: {
    fullName?: string;
    firstName?: string;
    lastName?: string;
    photo?: string;
  };
}
```

---

## **Enumerations**

### **CommentLevel**

Comment nesting depth indicator:

| Value | Description |
|-------|-------------|
| `0` | Top-level comment |
| `1+` | Reply to parent comment |

### **EngagementAction**

| Value | Description |
|-------|-------------|
| `like` | User liked the discussion |
| `follow` | User following for notifications |
| `comment` | User commented on discussion |

---

## **Relationships & Concepts**

### **Discussion Ownership**

* Every discussion belongs to exactly one **space**
* Every discussion has exactly one **author**
* Discussions can have multiple **tags** for categorization

### **Engagement Features**

| Feature | Direction | Effect |
|---------|-----------|--------|
| **Like** | User → Discussion | Increments likesCount, adds to likedBy |
| **Follow** | User → Discussion | User receives notifications on updates |
| **Comment** | User → Discussion | Nested threaded replies |

### **Comment Threading**

Comments support nested replies:
* Top-level comments have `level: 0`
* Replies reference `parent` comment ID
* API returns nested structure in `__children`
* Frontend maps to `replies` for consistency

### **User Context Fields**

When fetching discussions, these fields are computed for the authenticated user:
* `isLiked` - Has current user liked this discussion?
* `isFollowing` - Is current user following this discussion?

---

## **Business Rules**

1. **Space Required**: Every discussion must belong to exactly one space
2. **Author Required**: Every discussion must have exactly one author
3. **Space Membership**: Only space members can create discussions in that space
4. **Author Edit/Delete**: Only the author or space admin can edit or delete a discussion
5. **Comment Author Delete**: Only comment author or space admin can delete comments
6. **Single Like**: Users can only like a discussion once
7. **Single Follow**: Users can only follow a discussion once
8. **Comment Threading**: Replies reference parent comment ID for nesting
9. **User Context Fields**: `isLiked` and `isFollowing` computed per authenticated user

---

## **Authentication & Permissions**

### **Authentication**

* **Required:** Yes (all endpoints)
* **Token:** JWT Bearer token in Authorization header

### **Permission Rules**

| Action | Who Can Perform |
|--------|-----------------|
| List discussions | Any authenticated user (respects space access) |
| View discussion | Any authenticated user (respects space access) |
| Create discussion | Space members |
| Update discussion | Author or space admin |
| Delete discussion | Author or space admin |
| Like/unlike | Any authenticated user |
| Follow/unfollow | Any authenticated user |
| Create comment | Any authenticated user |
| Delete comment | Comment author or space admin |

---

## **API Capabilities Overview**

The Discussions API allows consumers to:

* **List discussions** globally or by space
* **Create discussions** with rich text content
* **Update and delete** discussions (with permissions)
* **Like and unlike** discussions
* **Follow and unfollow** for notifications
* **Read and create comments** with threading support
* **View likers** for social proof

---

## **Endpoint Groups**

| Group | Purpose | Endpoint Count |
|-------|---------|----------------|
| [Discussions CRUD](../endpoints/discussions/README.md) | Core discussion operations | 5 |
| [Engagement](../endpoints/discussions/README.md#engagement) | Likes, follows | 5 |
| [Comments](../endpoints/discussions/README.md#comments) | Comment management | 2 |

Full endpoint details in the [Endpoint Reference](../endpoints/discussions/README.md).

---

## **Domain Events & Side Effects**

### **Events Emitted**

| Event | Trigger | Payload |
|-------|---------|---------|
| `discussion.created` | New discussion | `{ discussionId, spaceId, authorId }` |
| `discussion.updated` | Discussion edited | `{ discussionId }` |
| `discussion.deleted` | Discussion removed | `{ discussionId }` |
| `discussion.liked` | User likes | `{ discussionId, userId }` |
| `discussion.unliked` | User unlikes | `{ discussionId, userId }` |
| `discussion.followed` | User follows | `{ discussionId, userId }` |
| `discussion.unfollowed` | User unfollows | `{ discussionId, userId }` |
| `comment.created` | New comment | `{ commentId, discussionId, authorId }` |

### **Side Effects**

| Event | Side Effect |
|-------|-------------|
| `discussion.created` | Notification to space followers |
| `discussion.liked` | Notification to author |
| `comment.created` | Notification to discussion author and followers |
| `comment.created` (reply) | Notification to parent comment author |

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
| `DISCUSSION_NOT_FOUND` | 404 | Discussion ID does not exist |
| `COMMENT_NOT_FOUND` | 404 | Comment ID does not exist |
| `NOT_AUTHOR` | 403 | User is not the author (for edit/delete) |
| `NOT_SPACE_MEMBER` | 403 | User is not a member of the space |
| `ALREADY_LIKED` | 409 | User has already liked this discussion |
| `NOT_LIKED` | 400 | Cannot unlike - user hasn't liked |
| `ALREADY_FOLLOWING` | 409 | User is already following |
| `NOT_FOLLOWING` | 400 | Cannot unfollow - user isn't following |

---

## **Frontend Usage Notes**

### **Primary Consumers**

| Route | Usage |
|-------|-------|
| `/feed` | Discussion feed |
| `/spaces/[id]/discussions` | Space discussions list |
| `/spaces/[id]/discussions/[discussionId]` | Discussion detail |
| `/posts/new` | Create discussion |

### **Service File**

```
src/lib/discussions.ts
```

### **Key Functions**

| Function | Purpose |
|----------|---------|
| `getDiscussions(params)` | List all discussions |
| `getSpaceDiscussions(spaceId)` | List space discussions |
| `getDiscussion(id)` | Get single discussion |
| `createDiscussion(data)` | Create discussion |
| `updateDiscussion(id, data)` | Update discussion |
| `deleteDiscussion(id)` | Delete discussion |
| `likeDiscussion(id)` | Like (user from JWT) |
| `unlikeDiscussion(id)` | Unlike |
| `followDiscussion(id)` | Follow |
| `unfollowDiscussion(id)` | Unfollow |
| `getDiscussionComments(id)` | Get comments |
| `createComment(discussionId, data)` | Create comment |

### **Comment Transformation**

API returns nested comments in `__children`, transform to `replies`:

```typescript
function transformComments(comments: Comment[]): Comment[] {
  return comments.map(comment => ({
    ...comment,
    replies: comment.__children
      ? transformComments(comment.__children)
      : []
  }));
}
```

### **Caching Recommendations**

| Data | Cache Strategy |
|------|----------------|
| Discussion list | Short TTL (30s), invalidate on create |
| Discussion detail | Short TTL (1min), invalidate on update |
| Comments | Short TTL (30s), invalidate on new comment |
| Likes list | No cache (changes frequently) |

---

## **Performance & Constraints**

### **Request Volume**

| Endpoint | Expected Volume |
|----------|-----------------|
| List discussions | High (feed, space views) |
| Get discussion | High (detail views) |
| Like/unlike | Medium |
| Comments | Medium |

### **Pagination**

* List endpoints use `offset` + `limit`
* Default limit: 20
* Comments not paginated (nested structure)

### **Known Constraints**

* Comments returned in full (no pagination)
* Large discussions may have many comments
* No real-time updates (requires polling)

---

## **Related Routes**

| Route | Relationship |
|-------|--------------|
| `/feed` | Discussion feed |
| `/spaces/[id]/discussions` | Space discussions |
| `/spaces/[id]/discussions/[discussionId]` | Discussion detail |
| `/posts/new` | Create discussion |

---

## **Related Domains**

| Domain | Relationship |
|--------|--------------|
| [Spaces](./spaces.md) | Discussion container |
| [Users](./users.md) | Authors and commenters |
| [Notifications](./notifications.md) | Discussion notifications |

---

## **Non-Goals / Explicit Exclusions**

* **AI analysis** - Handled by separate `/api/discussions/*` routes
* **Moderation** - Future enhancement
* **Reactions** (beyond likes) - Not supported
* **Discussion drafts** - Not implemented

---

## **Stability & Change Policy**

* **Stability:** Stable
* **Breaking changes:** 30-day deprecation notice
* **Versioning:** Currently v1 (implicit)

### **Planned Enhancements**

* Comment pagination
* Discussion drafts
* Rich reactions (beyond like)
* Moderation tools
* Real-time updates (WebSocket)

---

## **Open Questions / Notes**

* Consider adding comment pagination for large threads
* May need rate limiting on likes/comments
* Consider adding edit history for discussions
* Real-time comment updates would improve UX
