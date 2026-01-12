# **Component Specification: MessagesDropdown**

## **1. Component Name**

**`MessagesDropdown`**

## **2. Description**

A dropdown panel in the navigation bar for viewing recent conversations.

* Shows tabs for Unread and Read messages
* Displays unread count badge on trigger
* Polls for new message count
* Used in main Navigation component

## **3. Location**

```
src/components/ui/MessagesDropdown/MessagesDropdown.tsx
```

## **4. Component Type**

**Feature** – Manages conversation queries and tabbed display.

## **5. Props Interface**

```typescript
// No props - uses internal state and queries
```

## **6. Props**

*No props – component fetches data internally.*

## **7. Data Requirements**

### **External Data Sources**

| Source | Hook/Function | Returns |
|--------|---------------|---------|
| Query | `['messages-count', userId]` via `getUnreadMessagesCount` | Unread messages count |
| Query | `['conversations', userId]` via `getConversations` | List of conversations |

### **ConversationHead Type**

```typescript
// From @/lib/conversations
interface ConversationHead {
  id: string;
  unread: number;
  lastMessage?: {
    content: string;
    createdAt: string;
  };
  participants?: Array<{
    id: string;
    email?: string;
    profile?: {
      fullName?: string;
      firstName?: string;
      lastName?: string;
    };
  }>;
}
```

## **8. Internal State**

| State Variable | Type | Initial | Purpose |
|----------------|------|---------|---------|
| `isOpen` | `boolean` | `false` | Dropdown visibility |
| `currentUserId` | `string \| null` | `null` | Current user ID |
| `isClient` | `boolean` | `false` | Client-side hydration check |

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
|-------------------|-------------|-------|
| Not authenticated | Nothing (`null`) | No render |
| `isOpen === false` | Comment icon with badge | Trigger only |
| `isOpen === true` | Full dropdown panel | Tabbed content |
| Unread count > 0 | Badge with count | Visual indicator |
| Unread count = 0 | No badge | Clean icon |
| Unread tab active | Conversations with unread | Default tab |
| Read tab active | Conversations without unread | All read |
| Click conversation | Navigate to thread | `/messages/[id]` |

## **10. Dependencies**

### **Child Components**

* `TabbedDropdown` – Generic tabbed dropdown container
* `MessageItem` – Individual message preview

### **External Libraries**

* `@tanstack/react-query`
* `next/navigation` (`useRouter`)

### **API Functions**

* `getConversations` – Fetch user conversations
* `getUnreadMessagesCount` – Get unread count
* `getCurrentUserId` – Get current user

## **11. Events & Callbacks**

| Event / Callback | Trigger | Description |
|------------------|---------|-------------|
| `handleConversationClick` | Click conversation | Navigate to `/messages/[id]` |

## **12. Styling**

Uses `TabbedDropdown` styling with comment icon trigger.

## **13. Accessibility Requirements**

* **Keyboard**: Tab navigation through conversations
* **ARIA**: Dropdown with proper roles
* **Screen Reader**: Announce unread count and conversation info

### **Improvements Needed**

* Add `aria-live` for count changes
* Add keyboard shortcut to open

## **14. Error Handling**

| Error Condition | Behaviour | Fallback |
|-----------------|-----------|----------|
| Conversations query fails | Error state | Show error message |
| Count query fails | No badge | Graceful degradation |

## **15. Performance & Lifecycle Notes**

### **Polling**

* Auto-refresh unread count every 30 seconds
* Conversations lazy-loaded when dropdown opens

### **Helper Functions**

```typescript
const getDisplayName = (conversation: ConversationHead): string => {
  // Get display name from other participants
};
```

## **16. Usage Examples**

### **In Navigation**

```tsx
import { MessagesDropdown } from '@/components/ui/MessagesDropdown';

<nav>
  <MessagesDropdown />
</nav>
```

## **17. Features Summary**

### **Trigger**

* Comment icon
* Unread badge count
* Auto-refresh count (30s polling)

### **Tabs**

| Tab ID | Label | Content |
|--------|-------|---------|
| `unread` | Unread | Conversations with unread > 0 |
| `read` | Read | Conversations with unread = 0 |

### **Conversation Display**

* Other participant's name
* Last message preview
* Relative time
* Unread indicator

### **Actions**

* Click → navigate to conversation
* View all link → `/messages`

## **18. Testing Considerations**

### **Unit Tests**

* Shows badge when unread > 0
* Opens dropdown on click
* Tabs switch content
* Click navigates to conversation
* Display name computed correctly

### **Mocking**

* `getConversations` query
* `getUnreadMessagesCount` query
* `getCurrentUserId` function

### **Edge Cases**

* Zero conversations
* Many conversations (scroll)
* All read
* All unread
* Conversation with no messages
* Group conversation names

## **19. Out of Scope / Non-Goals**

* **Compose message**: Not here
* **Delete conversation**: Not here
* **Real-time WebSocket**: Uses polling
* **Message actions**: Just navigation

## **20. Related Components & System Context**

### **Parent Component**

* `Navigation`

### **Child Components**

* `TabbedDropdown`
* `MessageItem`

### **Siblings**

* `NotificationDropdown`
* `BookmarksDropdown`

## **21. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
|----------|----------|---------------|-------|
| `Default` | Some unread | Unread conversations | Badge shown |
| `AllRead` | No unread | All read | No badge |
| `Open` | Dropdown visible | isOpen: true | Full panel |
| `ReadTab` | Read selected | Tab: read | All read shown |
| `Empty` | No conversations | Empty array | Empty state |
| `Loading` | Fetching | Loading state | Skeleton |

### **Controls (Args) Required**

*None – internal data fetching*

### **Mocking Requirements**

* **Queries**: Mock React Query responses
* **Auth**: Mock getCurrentUserId

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Verify dropdown accessible
* Check tab navigation
* Verify conversation item accessible

### **Interaction Tests**

* Click to open
* Switch tabs
* Click conversation
