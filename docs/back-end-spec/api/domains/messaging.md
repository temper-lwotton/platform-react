# **API Domain Specification: Messaging**

*(Authoritative, conceptual, human-readable)*

## **API Domain: `Messaging`**

### **Description**

The Messaging domain manages direct messaging between users on the platform. It provides:

* One-to-one and group conversations
* Real-time message delivery
* File attachments support
* Typing indicators
* Read receipts and unread counts
* Message deletion

Messaging enables private communication between connected users outside of public discussions.

---

## **Domain Responsibility**

### **This domain is responsible for:**

* Creating and managing conversations
* Sending and receiving messages
* Handling file attachments
* Tracking read/unread status
* Providing typing indicators
* Managing message deletion

### **Out of scope:**

* User connections and relationships (see [Users](./users.md))
* Notification delivery (see [Notifications](./notifications.md))
* Space chat/channels (future enhancement)
* Video/voice calling
* Message encryption (infrastructure concern)

---

## **Owned Data Models**

### **Core Entities**

#### **ConversationHead**

Summary view of a conversation for listing.

```typescript
interface ConversationHead {
  id: string;
  lastMessage: string;             // Preview text
  lastMessageAt: string;           // ISO 8601
  unread: number;                  // Unread count for current user
  updatedAt: string;               // ISO 8601
  participants: ConversationParticipant[];
}

interface ConversationParticipant {
  id: string;
  email?: string;
  profile: {
    firstName?: string;
    lastName?: string;
    fullName?: string;
    photo?: string;
  };
}
```

#### **Conversation**

Full conversation with messages.

```typescript
interface Conversation {
  id: string;
  createdAt: string;               // ISO 8601
  updatedAt: string;               // ISO 8601
  participants: ConversationParticipant[];
  messages: Message[];
  metadata?: {
    isGroup: boolean;
    groupName?: string;
    groupPhoto?: string;
  };
}
```

#### **Message**

```typescript
interface Message {
  id: string;
  conversationId: string;
  type: MessageType;
  sender: MessageSender;
  content: string;
  attachments?: MessageAttachment[];
  createdAt: string;               // ISO 8601
  updatedAt: string;               // ISO 8601
  readBy?: string[];               // User IDs who have read
  deletedAt?: string;              // Soft delete timestamp
}

interface MessageSender {
  id: string;
  profile: {
    fullName?: string;
    firstName?: string;
    lastName?: string;
    photo?: string;
  };
}

interface MessageAttachment {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  size: number;                    // Bytes
  sizeFormatted: string;           // e.g., "2.4 MB"
  thumbnailUrl?: string;           // For images
}
```

#### **TypingIndicator**

```typescript
interface TypingIndicator {
  conversationId: string;
  typingUsers: TypingUser[];
}

interface TypingUser {
  id: string;
  fullName: string;
  timestamp: number;               // Unix timestamp
}
```

---

## **Enumerations**

### **MessageType**

| Value | Description |
|-------|-------------|
| `user` | Regular user message |
| `system` | System-generated message |

```typescript
type MessageType = 'user' | 'system';
```

### **ConversationType**

| Value | Description |
|-------|-------------|
| `direct` | One-to-one conversation |
| `group` | Multi-user conversation |

```typescript
type ConversationType = 'direct' | 'group';
```

---

## **Relationships & Concepts**

### **Conversation Lifecycle**

```
Start Conversation
    ↓
Send First Message → Conversation Created
    ↓
Exchange Messages ← → Real-time Updates
    ↓
Mark as Read (on view)
    ↓
Delete Messages (optional)
```

### **Participant Model**

* Direct conversations have exactly 2 participants
* Group conversations have 3+ participants
* Participants cannot be removed from direct conversations
* Group participants can be added/removed by any member

### **Message Delivery**

Messages are delivered through:
1. **REST API** - For sending and fetching
2. **WebSocket** - For real-time delivery
3. **Push notifications** - For offline users (via Notifications domain)

### **Read Receipts**

* Conversation marked as read when user fetches the thread
* `readBy` array tracks which participants have seen each message
* Unread count computed per-user based on last read timestamp

### **Typing Indicators**

* Users send typing signals via dedicated endpoint
* Indicators expire after 3 seconds without refresh
* Other participants poll or receive via WebSocket

### **Attachments**

* Files uploaded as part of message creation
* Supported via multipart/form-data
* Thumbnails generated for image attachments
* File size limits apply (configurable)

---

## **Business Rules**

1. **Connection Required**: Users can only message their connections (bi-directional relationship)
2. **Participant Limit**: Group conversations limited to 50 participants
3. **Message Length**: Messages limited to 10,000 characters
4. **Attachment Limit**: Maximum 10 attachments per message
5. **File Size Limit**: Individual files limited to 25MB
6. **Soft Delete**: Deleted messages remain in database, hidden from UI
7. **Sender Delete Only**: Only message sender can delete their messages
8. **Read on Fetch**: Fetching a conversation marks it as read for that user
9. **Typing Expiry**: Typing indicators expire after 3 seconds

---

## **Authentication & Permissions**

### **Authentication**

* **Required:** Yes (all endpoints)
* **Token:** JWT Bearer token in Authorization header

### **Permission Rules**

| Action | Who Can Perform |
|--------|-----------------|
| List conversations | Conversation participants |
| View conversation | Conversation participants |
| Start conversation | Users with mutual connection |
| Send message | Conversation participants |
| Delete message | Message sender only |
| Get typing users | Conversation participants |
| Send typing indicator | Conversation participants |

---

## **API Capabilities Overview**

The Messaging API allows consumers to:

* **List conversations** with preview and unread counts
* **View conversation** thread with full messages
* **Start new conversation** with one or more recipients
* **Send messages** with optional attachments
* **Delete messages** (sender only)
* **Get typing indicators** for a conversation
* **Send typing indicator** to notify others

---

## **Endpoint Groups**

| Group | Purpose | Endpoint Count |
|-------|---------|----------------|
| [Conversations](../endpoints/messaging/README.md) | Conversation management | 3 |
| [Messages](../endpoints/messaging/README.md#messages) | Message operations | 2 |
| [Typing](../endpoints/messaging/README.md#typing) | Typing indicators | 2 |

Full endpoint details in the [Endpoint Reference](../endpoints/messaging/README.md).

---

## **Domain Events & Side Effects**

### **Events Emitted**

| Event | Trigger | Payload |
|-------|---------|---------|
| `conversation.created` | New conversation | `{ conversationId, participantIds }` |
| `message.sent` | New message | `{ messageId, conversationId, senderId }` |
| `message.deleted` | Message deleted | `{ messageId, conversationId }` |
| `conversation.read` | User reads conversation | `{ conversationId, userId }` |
| `user.typing` | User is typing | `{ conversationId, userId }` |

### **Side Effects**

| Event | Side Effect |
|-------|-------------|
| `message.sent` | Push notification to offline participants |
| `message.sent` | WebSocket broadcast to online participants |
| `message.sent` | Update conversation `lastMessage` and `updatedAt` |
| `conversation.read` | Reset unread count for user |

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
| `CONVERSATION_NOT_FOUND` | 404 | Conversation does not exist |
| `MESSAGE_NOT_FOUND` | 404 | Message does not exist |
| `NOT_PARTICIPANT` | 403 | User is not a conversation participant |
| `NOT_CONNECTED` | 403 | Cannot message user without connection |
| `NOT_MESSAGE_SENDER` | 403 | Only sender can delete message |
| `MESSAGE_TOO_LONG` | 400 | Message exceeds 10,000 characters |
| `TOO_MANY_ATTACHMENTS` | 400 | Exceeds 10 attachment limit |
| `FILE_TOO_LARGE` | 400 | File exceeds 25MB limit |
| `TOO_MANY_PARTICIPANTS` | 400 | Exceeds 50 participant limit |

---

## **Frontend Usage Notes**

### **Primary Consumers**

| Route | Usage |
|-------|-------|
| `/messages` | Conversation list |
| `/messages/[conversationId]` | Conversation thread |
| Message composer | New conversation |

### **Service Location**

```
src/lib/messaging.ts
```

### **Key Functions**

| Function | Purpose |
|----------|---------|
| `getConversations(userId)` | List user's conversations |
| `getConversation(userId, conversationId)` | Get conversation thread |
| `startConversation(data)` | Create new conversation |
| `sendMessage(conversationId, data)` | Send a message |
| `deleteMessage(conversationId, messageId)` | Delete a message |
| `getTypingUsers(conversationId)` | Get typing indicators |
| `sendTypingIndicator(conversationId)` | Signal user is typing |

### **Real-Time Integration**

```javascript
// WebSocket subscription for messages
ws.send(JSON.stringify({
  type: 'subscribe',
  channel: `conversations:${userId}`
}));

// Receive new messages
{
  "type": "new_message",
  "data": {
    "conversationId": "conv_123",
    "message": { ... }
  }
}

// Receive typing indicators
{
  "type": "typing",
  "data": {
    "conversationId": "conv_123",
    "user": { "id": "12", "fullName": "Sarah Chen" }
  }
}
```

### **Caching Recommendations**

| Data | Cache Strategy |
|------|----------------|
| Conversation list | Short TTL (30s), invalidate on new message |
| Conversation thread | No cache (real-time) |
| Typing indicators | No cache (ephemeral) |

### **Null Fields**

* `attachments` - Empty array if no attachments
* `profile.photo` - Null if no avatar
* `metadata.groupName` - Null for direct conversations
* `deletedAt` - Null if not deleted

---

## **Performance & Constraints**

### **Request Volume**

| Endpoint | Expected Volume |
|----------|-----------------|
| List conversations | High (inbox views) |
| Get conversation | High (thread views) |
| Send message | Medium |
| Typing indicator | Very High (while typing) |

### **Pagination**

* Conversation list: Cursor-based
* Messages: Offset-based, newest first
* Default limit: 20 messages

### **Rate Limiting**

| Endpoint | Limit |
|----------|-------|
| Send message | 60/minute |
| Typing indicator | 10/second |

### **Known Trade-offs**

* No message editing (delete and resend)
* Typing indicators require polling without WebSocket
* Large attachment uploads may timeout

---

## **Related Routes**

| Route | Relationship |
|-------|--------------|
| `/messages` | Conversation list |
| `/messages/[id]` | Thread view |
| `/users/[id]` | Start conversation link |

---

## **Related Domains**

| Domain | Relationship |
|--------|--------------|
| [Users](./users.md) | Connection requirement, participant info |
| [Notifications](./notifications.md) | New message notifications |
| [Media](./media.md) | Attachment storage |
| [Navigation](./navigation.md) | Unread badge count |

---

## **Non-Goals / Explicit Exclusions**

* **Message editing** - Not supported; delete and resend
* **Message reactions** - Future enhancement
* **Voice/video calls** - Out of scope
* **End-to-end encryption** - Infrastructure concern
* **Message search** - Future enhancement
* **Space channels** - Separate feature

---

## **Stability & Change Policy**

* **Stability:** Stable
* **Breaking changes:** 30-day deprecation notice
* **Versioning:** Currently v1 (implicit)

### **Planned Enhancements**

* Message editing within time window
* Message reactions
* Message search
* Read receipts UI
* Message forwarding
* Space-based channels

---

## **Open Questions / Notes**

* Consider adding message editing with edit history
* May need message search for power users
* Consider adding "mute conversation" feature
* Archive conversation functionality TBD
