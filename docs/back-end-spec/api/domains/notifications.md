# **API Domain Specification: Notifications**

*(Authoritative, conceptual, human-readable)*

## **API Domain: `Notifications`**

### **Description**

The Notifications domain manages user notifications for platform activity including replies, likes, mentions, and invitations. It provides:

* Real-time and persistent notification delivery
* Read/unread status tracking
* Notification preference management
* Actor-recipient relationship tracking

Notifications are triggered by events across other domains (discussions, spaces, connections) and delivered based on user preferences.

---

## **Domain Responsibility**

### **This domain is responsible for:**

* Creating and storing notifications triggered by platform events
* Tracking read/unread status for each notification
* Managing notification preferences per user
* Providing notification feeds and unread counts
* Supporting bulk operations (mark all as read)

### **Out of scope:**

* Push notification delivery infrastructure (see external services)
* Email delivery (see [Broadcasts](./broadcasts.md))
* Event generation (handled by source domains)
* Real-time WebSocket connections (infrastructure concern)

---

## **Owned Data Models**

### **Core Entities**

#### **Notification**

```typescript
interface Notification {
  id: number;
  type: NotificationType;
  payload: NotificationPayload;
  createdAt: string;              // ISO 8601
  readAt: string | null;          // null = unread
  recipient: NotificationUser;
  actor: NotificationUser;
}

interface NotificationPayload {
  comment_id?: number;
  discussion_id?: number;
  space_id?: number;
  message?: string;
}

interface NotificationUser {
  id: number;
  name: string;
  email: string;
  photo: string | null;
}
```

**Notes:**
* `readAt` being null indicates an unread notification
* `actor` is the user who triggered the notification
* `recipient` is the user receiving the notification
* `payload` contains context-specific references for deep linking

#### **NotificationPreferences**

```typescript
interface NotificationPreferences {
  emailNotifications: boolean;    // Master email toggle
  pushNotifications: boolean;     // Master push toggle
  commentReplies: boolean;        // Notify on replies to comments
  mentions: boolean;              // Notify on @mentions
  discussionLikes: boolean;       // Notify when discussions are liked
}
```

---

## **Enumerations**

### **NotificationType**

| Value | Description | Trigger |
|-------|-------------|---------|
| `comment_reply` | Someone replied to user's comment | Comment created on user's comment |
| `discussion_like` | Someone liked user's discussion | Like added to discussion |
| `new_discussion` | New discussion in followed space | Discussion created in space |
| `mention` | User was mentioned (@username) | @mention in comment/discussion |
| `space_invite` | User invited to join a space | Space invitation sent |

```typescript
type NotificationType =
  | 'comment_reply'
  | 'discussion_like'
  | 'new_discussion'
  | 'mention'
  | 'space_invite';
```

---

## **Relationships & Concepts**

### **Actor-Recipient Model**

Every notification has two users involved:
* **Recipient**: The user receiving and viewing the notification
* **Actor**: The user whose action triggered the notification

This model enables rich notification text like "Sarah replied to your comment".

### **Self-Notification Prevention**

Users never receive notifications for their own actions. If a user likes their own discussion or replies to their own comment, no notification is created.

### **Read Status Lifecycle**

```
Created (readAt: null)
    ↓
Viewed/Marked Read (readAt: timestamp)
```

Once read, notifications cannot be marked unread. The `readAt` timestamp is permanent.

### **Payload References**

The payload contains IDs that enable deep linking:
* `discussion_id` + `comment_id` → Link to specific comment
* `discussion_id` only → Link to discussion
* `space_id` only → Link to space

---

## **Business Rules**

1. **Self-Notification**: Users don't receive notifications for their own actions
2. **Preference Respect**: Notifications respect user preference settings before creation
3. **Delivery Channels**: May trigger email/push based on user preferences
4. **Retention**: Notifications may be purged after 90 days
5. **Unique Delivery**: Same notification is not sent twice for the same action

---

## **Authentication & Permissions**

### **Authentication**

* **Required:** Yes (all endpoints)
* **Token:** JWT Bearer token in Authorization header

### **Permission Rules**

| Action | Who Can Perform |
|--------|-----------------|
| List notifications | Recipient only (own notifications) |
| Get unread count | Recipient only |
| Mark as read | Recipient only |
| Mark all as read | Recipient only |
| Get preferences | User themselves |
| Update preferences | User themselves |

---

## **API Capabilities Overview**

The Notifications API allows consumers to:

* **List notifications** for the authenticated user
* **Get unread count** for badge display
* **Mark individual notifications** as read
* **Mark all notifications** as read at once
* **Retrieve and update** notification preferences

---

## **Endpoint Groups**

| Group | Purpose | Endpoint Count |
|-------|---------|----------------|
| [Notifications](../endpoints/notifications/README.md) | Core notification operations | 4 |
| [Preferences](../endpoints/notifications/README.md#preferences) | User settings | 1 |

Full endpoint details in the [Endpoint Reference](../endpoints/notifications/README.md).

---

## **Domain Events & Side Effects**

### **Events Consumed**

| Event | Source Domain | Creates Notification |
|-------|---------------|---------------------|
| `comment.created` | Discussions | `comment_reply` or `mention` |
| `discussion.liked` | Discussions | `discussion_like` |
| `discussion.created` | Discussions | `new_discussion` |
| `space.invitation_sent` | Spaces | `space_invite` |

### **Events Emitted**

| Event | Trigger | Payload |
|-------|---------|---------|
| `notification.created` | New notification | `{ notificationId, recipientId, type }` |
| `notification.read` | Marked as read | `{ notificationId }` |

### **Side Effects**

| Event | Side Effect |
|-------|-------------|
| `notification.created` | Push notification sent (if enabled) |
| `notification.created` | Email queued (if enabled and batching allows) |

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
| `NOTIFICATION_NOT_FOUND` | 404 | Notification ID does not exist |
| `NOT_RECIPIENT` | 403 | User is not the notification recipient |
| `ALREADY_READ` | 400 | Notification already marked as read |

---

## **Frontend Usage Notes**

### **Primary Consumers**

| Route | Usage |
|-------|-------|
| `/notifications` | Notification center |
| Header bell icon | Unread count badge |
| `/settings/notifications` | Preferences management |

### **Service Location**

```
src/lib/notifications.ts
```

### **Key Functions**

| Function | Purpose |
|----------|---------|
| `getNotifications(userId)` | Get all notifications |
| `getUnreadCount(userId)` | Get unread count for badge |
| `markAsRead(notificationId)` | Mark single as read |
| `markAllAsRead(userId)` | Mark all as read |
| `getNotificationTitle(notification)` | Get display title |
| `getNotificationText(notification)` | Get body text |
| `getNotificationLink(notification)` | Get deep link URL |

### **Pagination**

* Currently returns all notifications (no pagination)
* Consider implementing cursor-based pagination for large volumes

### **Null Fields**

* `readAt` is null for unread notifications
* `actor.photo` may be null (use placeholder avatar)
* Payload fields are optional based on notification type

### **Caching Recommendations**

| Data | Cache Strategy |
|------|----------------|
| Notification list | No cache (real-time updates) |
| Unread count | Short TTL (30s), invalidate on read |
| Preferences | Medium TTL (5min), invalidate on update |

---

## **Performance & Constraints**

### **Request Volume**

| Endpoint | Expected Volume |
|----------|-----------------|
| Get unread count | Very High (polled frequently) |
| List notifications | Medium (on page load) |
| Mark as read | Medium |

### **Pagination Limits**

* Default: All notifications returned
* Consider adding pagination for users with many notifications

### **Rate Limiting**

Standard rate limits apply (see [API Conventions](../_index.md#rate-limiting)).

### **Known Trade-offs**

* No pagination currently - may need for power users
* Real-time updates require WebSocket integration
* Email batching handled separately from this API

---

## **Related Routes**

| Route | Relationship |
|-------|--------------|
| `/notifications` | Notification center page |
| `/settings/notifications` | Preferences page |
| Various deep links | Notification click-through destinations |

---

## **Related Domains**

| Domain | Relationship |
|--------|--------------|
| [Users](./users.md) | Actor and recipient references |
| [Discussions](./discussions.md) | Source of most notification events |
| [Spaces](./spaces.md) | Space invitations, context for notifications |

---

## **Non-Goals / Explicit Exclusions**

* **Push notification infrastructure** - Handled by external service
* **Email composition/delivery** - See Broadcasts domain
* **Real-time WebSocket delivery** - Infrastructure concern
* **Notification scheduling** - Notifications are immediate
* **Rich media in notifications** - Text only with links

---

## **Stability & Change Policy**

* **Stability:** Stable
* **Breaking changes:** 30-day deprecation notice
* **Versioning:** Currently v1 (implicit)

### **Planned Enhancements**

* Pagination for notification list
* Notification grouping (e.g., "5 people liked your discussion")
* Notification snoozing
* Do Not Disturb mode
* More granular preference controls

---

## **Open Questions / Notes**

* Consider adding WebSocket channel for real-time notification delivery
* May need notification batching for high-activity users
* Email notification batching (digest) timing TBD
* Consider adding notification categories for filtering
