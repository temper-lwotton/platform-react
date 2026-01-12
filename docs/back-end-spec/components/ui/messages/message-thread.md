# **Component Specification: MessageThread**

## **1. Component Name**

**`MessageThread`**

## **2. Description**

A chat message thread component displaying conversation messages with full functionality.

* Renders message bubbles with avatars and timestamps
* Groups consecutive messages from same sender
* Shows message actions (reply, edit, delete)
* Displays typing indicator
* Auto-scrolls to latest message

## **3. Location**

```
src/components/ui/MessageThread/MessageThread.tsx
```

## **4. Component Type**

**Feature** – Manages message display, grouping, and action menu state.

## **5. Props Interface**

```typescript
interface MessageThreadProps {
  messages: ConversationMessage[];
  participants: User[];
  currentUserId?: string;
  onDeleteMessage?: (messageId: string) => void;
  typingUsers?: string[];
}
```

## **6. Props**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `messages` | `ConversationMessage[]` | Yes | - | Array of messages |
| `participants` | `User[]` | Yes | - | Conversation participants |
| `currentUserId` | `string` | No | - | Current user ID |
| `onDeleteMessage` | `(messageId: string) => void` | No | - | Delete message callback |
| `typingUsers` | `string[]` | No | `[]` | Names of users currently typing |

## **7. Data Requirements**

### **ConversationMessage Type**

```typescript
// From @/lib/conversations
interface Message {
  id: string;
  content: string;
  sender: User | string;
  lastUpdated: string;
  attachments?: string[];
}
```

### **User Type**

```typescript
// From @/lib/users
interface User {
  id: string;
  profile?: {
    fullName?: string;
    firstName?: string;
    lastName?: string;
    photo?: string;
  };
}
```

## **8. Internal State**

| State Variable | Type | Initial | Purpose |
|----------------|------|---------|---------|
| `openMenuId` | `string \| null` | `null` | Currently open message action menu |

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
|-------------------|-------------|-------|
| `messages.length === 0` | Empty state | New conversation message |
| `messages.length > 0` | Message list | Scrollable area |
| Own message | Right-aligned, colored | Different styling |
| Other's message | Left-aligned, with avatar | Avatar shown |
| Consecutive same sender | Grouped, single avatar | Avatar on first only |
| First in group (others) | Sender name shown | Above message |
| Has attachments | Attachment links shown | Below content |
| `typingUsers.length > 0` | Typing indicator | At bottom |
| Action menu open | Popover with actions | Delete, etc. |

## **10. Dependencies**

### **Child Components**

* `Avatar` – User avatars
* `TypingIndicator` – Shows who is typing
* `Icon` – Action and attachment icons

### **Radix UI**

* `@radix-ui/react-popover` – Action menu

## **11. Events & Callbacks**

| Event / Callback | Trigger | Description |
|------------------|---------|-------------|
| `onDeleteMessage` | Click delete action | Fires with message ID |
| `handleOpenMenu` | Click action button | Opens popover for message |
| `handleCloseMenu` | Click outside or action | Closes popover |

## **12. Styling**

* **Approach**: CSS Modules with SCSS
* **File**: `MessageThread.module.scss`

### **CSS Classes**

* `.container` – Main wrapper
* `.header` – Thread header
* `.messages` – Scrollable message area
* `.message` – Individual message
* `.message--own` – Own message modifier
* `.message--other` – Other's message modifier
* `.avatar` – Sender avatar
* `.bubble` – Message bubble
* `.senderName` – Name above message
* `.content` – Message text
* `.attachments` – Attachment list
* `.timestamp` – Message time
* `.actions` – Action button
* `.emptyState` – No messages state

### **Layout**

* Header with display name and participant count
* Scrollable messages area
* Auto-scroll to bottom

## **13. Accessibility Requirements**

* **Keyboard**: Navigate messages with Tab
* **ARIA**: Messages should be in a list with proper roles
* **Screen Reader**: Announce sender, content, time

### **Improvements Needed**

* Add `role="log"` for message area
* Add `aria-label` for messages
* Announce new messages with `aria-live`
* Add keyboard navigation between messages

## **14. Error Handling**

| Error Condition | Behaviour | Fallback |
|-----------------|-----------|----------|
| Missing sender data | Fallback to "Unknown" | Graceful handling |
| Invalid timestamp | Show raw or fallback | No crash |
| Delete fails | Error toast | Menu closes |
| Missing attachments | Skip rendering | No crash |

## **15. Performance & Lifecycle Notes**

### **Auto-scroll**

```typescript
useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
}, [messages]);
```

* Scrolls to bottom on new messages
* Uses ref to scroll target

### **Time Formatting**

* Under 24h: "10:30 AM"
* Under 1 week: "Mon 10:30 AM"
* Older: "Jan 15 10:30 AM"

### **Message Grouping**

* Groups consecutive messages from same sender
* Avatar shown only on first message in group
* Sender name shown only for others' first message

## **16. Usage Examples**

### **Basic Usage**

```tsx
import { MessageThread } from '@/components/ui/MessageThread';

<MessageThread
  messages={messages}
  participants={participants}
  currentUserId={userId}
/>
```

### **With Delete Handler**

```tsx
<MessageThread
  messages={messages}
  participants={participants}
  currentUserId={userId}
  onDeleteMessage={handleDelete}
  typingUsers={typingUsers}
/>
```

## **17. Features Summary**

### **Header**

* Display name (other participants)
* Participant count

### **Message Bubbles**

* Own messages (right-aligned, colored)
* Other messages (left-aligned, with avatar)
* Grouped messages (avatar on first)
* Sender name (first in group)
* Message content
* Attachments with links
* Timestamp

### **Message Actions** (own messages only)

* Reply (TODO)
* Edit (TODO)
* Delete

### **Other Features**

* Typing indicator at bottom
* Auto-scroll to latest
* Empty state for new conversations

## **18. Testing Considerations**

### **Unit Tests**

* Renders messages correctly
* Groups consecutive same-sender messages
* Shows avatar only on first in group
* Own messages styled differently
* Action menu opens/closes
* Delete callback fires
* Typing indicator shows
* Auto-scrolls on new message

### **Mocking**

* Message arrays
* User/participant data
* Popover component

### **Edge Cases**

* Empty messages array
* Single message
* Many messages (scroll)
* Very long message content
* Multiple attachments
* Rapid new messages

## **19. Out of Scope / Non-Goals**

* **Real-time updates**: Parent handles WebSocket
* **Message editing**: Not yet implemented
* **Reply threading**: Not yet implemented
* **Message reactions**: Not supported
* **Read receipts**: Not displayed

## **20. Related Components & System Context**

### **Child Components**

* `Avatar`
* `TypingIndicator`
* `Icon`

### **Used With**

* `MessageInput`

### **Used By**

* Messages conversation page

## **21. Open Questions / Notes**

* Reply functionality TODO
* Edit functionality TODO
* Consider virtualization for long threads

## **22. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
|----------|----------|---------------|-------|
| `Default` | Multiple messages | Mixed senders | Base state |
| `Empty` | No messages | Empty array | Empty state |
| `OwnMessages` | Only own | All from current user | Right-aligned |
| `Grouped` | Consecutive | Same sender groups | Grouping shown |
| `WithTyping` | Users typing | `typingUsers` set | Indicator visible |
| `WithAttachments` | Has files | Messages with attachments | Links shown |
| `ActionMenuOpen` | Menu visible | `openMenuId` set | Popover shown |

### **Controls (Args) Required**

* `messages` (array) – controllable
* `typingUsers` (array) – controllable
* `currentUserId` (string) – controllable

### **Mocking Requirements**

* **Messages**: Various message configurations
* **Participants**: User objects
* **Actions**: Log onDeleteMessage

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Verify message list semantics
* Check action menu accessible
* Verify timestamps announced

### **Interaction Tests**

* Scroll through messages
* Open action menu
* Delete message
* Close menu on outside click
