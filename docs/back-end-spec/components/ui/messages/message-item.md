# **Component Specification: MessageItem**

## **1. Component Name**

**`MessageItem`**

## **2. Description**

A compact conversation preview item for the messages dropdown.

* Shows participant avatar with fallback
* Displays last message preview
* Shows relative time
* Indicates unread status with badge
* Used within MessagesDropdown

## **3. Location**

```
src/components/ui/MessagesDropdown/MessageItem.tsx
```

## **4. Component Type**

**UI** – Stateless presentational component.

## **5. Props Interface**

```typescript
interface MessageItemProps {
  conversation: ConversationHead;
  displayName: string;
  currentUserId: string | null;
}
```

## **6. Props**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `conversation` | `ConversationHead` | Yes | - | Conversation data |
| `displayName` | `string` | Yes | - | Computed display name |
| `currentUserId` | `string \| null` | Yes | - | Current user for filtering |

## **7. Data Requirements**

### **ConversationHead Type**

```typescript
// From @/lib/conversations
interface ConversationHead {
  id: string;
  unread: number;
  lastMessage?: string;
  updatedAt: string;
  participants?: Array<{
    id: string;
    profile?: {
      fullName?: string;
      photo?: string;
    };
  }>;
}
```

### **Helper Functions**

* `getTimeAgo(date)` – From primitives

## **8. Internal State**

*None – stateless component.*

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
|-------------------|-------------|-------|
| Default | Avatar, name, message, time | Normal state |
| `unread > 0` | Unread badge shown | Count displayed |
| `unread > 0` | Unread styling applied | Bold text |
| `lastMessage` exists | Message preview shown | Truncated |
| No `lastMessage` | Empty preview | Placeholder |
| Participant has photo | Photo avatar | Image shown |
| No photo | Initials avatar | Generated fallback |

## **10. Dependencies**

### **Primitives**

* `getTimeAgo` – Relative time formatting

## **11. Events & Callbacks**

*None – display only. Parent handles navigation.*

## **12. Styling**

* **Approach**: CSS Modules with SCSS
* **File**: `MessageItem.module.scss`

### **CSS Classes**

* `.item` – Main container
* `.item--unread` – Unread state modifier
* `.avatar` – User avatar
* `.content` – Text content area
* `.name` – Display name
* `.preview` – Last message text
* `.meta` – Time and badge area
* `.time` – Relative time
* `.badge` – Unread count

### **Visual States**

* **Default**: Normal text weight
* **Unread**: Bold text, badge visible

## **13. Accessibility Requirements**

* **Keyboard**: Focusable via parent link
* **ARIA**: Part of list, should have proper list semantics
* **Screen Reader**: Announce name, message, unread status

### **Improvements Needed**

* Add `aria-label` with full context
* Announce unread count

## **14. Error Handling**

| Error Condition | Behaviour | Fallback |
|-----------------|-----------|----------|
| Missing lastMessage | Empty preview | No crash |
| Missing participant | Fallback name | "Unknown" |
| Missing photo | Initials shown | Avatar fallback |
| Invalid date | Default format | Graceful handling |

## **15. Performance & Lifecycle Notes**

* Stateless component with minimal re-renders
* Time formatting runs on each render
* Consider memoization for large lists

## **16. Usage Examples**

### **Basic Usage**

```tsx
import { MessageItem } from './MessageItem';

<MessageItem
  conversation={conversation}
  displayName={getDisplayName(conversation)}
  currentUserId={userId}
/>
```

### **In List**

```tsx
{conversations.map((conv) => (
  <MessageItem
    key={conv.id}
    conversation={conv}
    displayName={getDisplayName(conv, currentUserId)}
    currentUserId={currentUserId}
  />
))}
```

## **17. Features Summary**

### **Avatar**

* Participant photo or initials fallback

### **Content**

* Display name
* Last message preview (truncated)

### **Metadata**

* Relative time (via `getTimeAgo`)
* Unread badge with count

### **Visual States**

* Unread styling (bold)

## **18. Testing Considerations**

### **Unit Tests**

* Renders display name
* Renders last message preview
* Shows unread badge when count > 0
* Hides badge when count is 0
* Shows initials when no photo
* Formats time correctly

### **Mocking**

* ConversationHead objects

### **Edge Cases**

* Very long display name
* Very long last message
* Zero unread
* High unread count
* Missing participant data

## **19. Out of Scope / Non-Goals**

* **Click handling**: Parent manages navigation
* **Selection state**: Managed externally
* **Message actions**: Display only
* **Full conversation data**: Just preview

## **20. Related Components & System Context**

### **Parent Component**

* `MessagesDropdown`

### **Used With**

* `TabbedDropdown`

### **Related**

* `ConversationList` – Full sidebar version

## **21. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
|----------|----------|---------------|-------|
| `Default` | Normal conversation | Read, has message | Base state |
| `Unread` | Unread messages | `unread: 3` | Badge shown |
| `NoMessage` | No last message | Empty lastMessage | Empty preview |
| `LongName` | Long display name | Many characters | Truncation |
| `LongMessage` | Long preview | Long lastMessage | Truncation |
| `NoPhoto` | Initials avatar | No photo URL | Fallback shown |

### **Controls (Args) Required**

* `conversation` (object) – controllable
* `displayName` (string) – controllable

### **Mocking Requirements**

* **Conversation data**: Various states

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Verify list item semantics
* Check unread announcement

### **Interaction Tests**

* Hover states
* Focus states (via parent)
