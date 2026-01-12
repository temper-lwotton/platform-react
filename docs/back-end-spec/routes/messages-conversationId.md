# **Route Specification: Conversation Detail**

## **1. Route Path**

**`/messages/[conversationId]`**

## **2. Description**

Conversation detail page showing message thread with real-time features.

* Displays message thread with typing indicators
* Supports message sending with attachments
* Enables message deletion
* Features polling for updates

## **3. Source File**

```
src/app/(protected)/messages/[conversationId]/page.tsx
```

## **4. Route Responsibility**

### **This route is responsible for:**

* Displaying conversation message thread
* Handling message sending with attachments
* Supporting message deletion
* Showing typing indicators
* Polling for new messages

### **This route does not:**

* List all conversations (handled by layout)
* Create new conversations
* Manage conversation settings
* Handle read receipts

## **5. Authentication & Access Control**

* **Authentication Required:** Yes
* **Allowed Roles:** Conversation participant
* **Permission Rules:** Must be a participant in the conversation

## **6. URL Parameters & Query Params**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `conversationId` | `string` | Yes | The unique identifier of the conversation |

* **Default behaviour:** N/A - conversationId is required
* **Validation:** Invalid id shows error state

## **7. Layout & Structure**

### **Layout Overview**

* Full height conversation view
* Part of messages layout with sidebar

### **Structural Regions**

| Region | Purpose |
|--------|---------|
| Message Thread | Scrollable list of messages with typing indicator |
| Message Input | Fixed at bottom with attachment support |

## **8. Components Used**

### **Layout Components**

*Uses shared messages layout*

### **UI / Feature Components**

| Component | Import Path | Purpose |
|-----------|-------------|---------|
| `MessageThread` | `@/components/ui/MessageThread` | Display messages and typing indicator |
| `MessageInput` | `@/components/ui/MessageInput` | Compose and send messages |

## **9. Data Flow Overview**

1. Fetch conversation data with message history
2. Poll for typing users every 2 seconds
3. Poll for conversation updates every 10 seconds
4. Render message thread and input
5. User sends message → mutation → invalidate queries
6. User deletes message → confirm → mutation → invalidate

## **10. Data Fetching**

### **Standard Queries**

| Query Key | Function | Data Type | Polling |
|-----------|----------|-----------|---------|
| `['conversation', currentUserId, conversationId]` | `getConversation(userId, convId)` | `Conversation` | 10 seconds |
| `['typingUsers', conversationId, currentUserId]` | `getTypingUsers(convId, userId)` | `TypingUser[]` | 2 seconds |

### **Mutations**

| Mutation | Function | On Success |
|----------|----------|------------|
| `sendMutation` | `replyToConversation(id, { content, sender }, attachments)` | Invalidate conversation |
| `deleteMutation` | `deleteMessage(userId, convId, messageId)` | Invalidate conversation |

## **11. State Management**

### **Local State**

*No local state - all data from queries.*

### **Derived State**

| Variable | Dependencies | Purpose |
|----------|--------------|---------|
| `typingUsers` | `typingUsersData` | Array of names currently typing |

### **Refs**

*None*

## **12. Behaviour Matrix**

| Condition | UI Behaviour |
|-----------|--------------|
| Not authenticated | "Please log in to view messages" |
| Loading | "Loading conversation..." |
| Error / Not found | "Error loading conversation" |
| Conversation loaded | Message thread displayed |
| Message sending | Input disabled briefly |
| Message deleting | Confirmation dialog shown |
| Users typing | Typing indicator displayed |

## **13. User Actions**

### **UI Interactions**

| Action | Trigger | Result |
|--------|---------|--------|
| Send message | Submit input | Create message via API |
| Delete message | Click delete button | Confirm dialog → delete via API |
| Attach files | Add files to input | Files sent with message |
| View attachments | Click attachment | View/download file |

### **Navigation Actions**

*None - conversation is primary view*

### **Data Mutations**

| Action | Trigger | API Call | On Success |
|--------|---------|----------|------------|
| Send message | Submit input | `replyToConversation` | Invalidate conversation |
| Delete message | Confirm delete | `deleteMessage` | Invalidate conversation |

## **14. Infinite Scroll / Pagination**

*Not currently implemented - all messages loaded at once.*

## **15. Error & Empty States**

* **Not authenticated:** "Please log in to view messages"
* **Loading:** "Loading conversation..."
* **Error / Not found:** "Error loading conversation"
* **No messages:** Empty thread (first message pending)

## **16. Performance & Constraints**

* **Rendering strategy:** Client-side rendering (CSR)
* **Memoisation strategy:** None currently
* **Parallel vs sequential fetching:** Conversation and typing queries in parallel
* **Known constraints:**
  * Polling-based updates (not real-time WebSocket)
  * All messages loaded at once
  * Native confirm() for deletion

## **17. Accessibility Considerations**

* **Keyboard navigation:** Tab through messages and input
* **Focus management:** Focus on input after send
* **Screen reader expectations:** Messages announced, typing indicator accessible
* **Landmark roles:** Main conversation area

## **18. Storybook & Testing Strategy**

### **Storybook**

* `MessageThread` component states
* `MessageInput` component states
* Typing indicator display

### **Testing**

* **Unit test focus:** Message rendering, typing indicator
* **Integration test focus:** Send/delete flows
* **E2E test focus:** Full conversation experience

## **19. Non-Goals / Out of Scope**

* Real-time WebSocket updates
* Read receipts
* Message editing
* Rich text formatting
* Reaction emojis

## **20. Related Routes**

| Route | Relationship |
|-------|--------------|
| `/messages` | Messages listing |
| `/messages/new` | Start new conversation |

## **21. Open Questions / Notes**

* Consider WebSocket for real-time updates
* May need message pagination for long conversations
* Consider adding read receipts
* Message editing could improve UX

### **Real-time Features**

#### **Message Polling**
- Conversation refetches every 10 seconds
- New messages appear automatically

#### **Typing Indicators**
- Polls for typing users every 2 seconds
- Shows "X is typing..." indicator
- Multiple users supported

### **MessageThread Props**

```typescript
{
  messages: Message[];
  participants: User[];
  currentUserId: string;
  onDeleteMessage: (messageId: string) => void;
  typingUsers: string[];
}
```

### **MessageInput Props**

```typescript
{
  onSend: (content: string, attachments?: File[]) => void;
  disabled: boolean;
  placeholder: string;
  conversationId: string;
  currentUserId: string;
}
```
