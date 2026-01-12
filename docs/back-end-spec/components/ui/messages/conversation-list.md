# **Component Specification: ConversationList**

## **1. Component Name**

**`ConversationList`**

## **2. Description**

A sidebar list of conversations for the messages page.

* Shows participant avatars, names, and last message preview
* Displays relative time and unread count
* Highlights active conversation based on URL
* Links to individual conversation pages
* Used as sidebar navigation for messages

## **3. Location**

```
src/components/ui/ConversationList/ConversationList.tsx
```

## **4. Component Type**

**Feature** – Renders conversation list with active state detection from URL.

## **5. Props Interface**

```typescript
interface ConversationListProps {
  conversations: ConversationHead[];
  currentUserId: string;
}
```

## **6. Props**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `conversations` | `ConversationHead[]` | Yes | - | List of conversations |
| `currentUserId` | `string` | Yes | - | Current user for filtering participants |

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
      firstName?: string;
      lastName?: string;
      photo?: string;
    };
  }>;
}
```

## **8. Internal State**

*None – uses `usePathname()` for active state detection.*

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
|-------------------|-------------|-------|
| `conversations.length === 0` | Empty state message | Helpful guidance |
| `conversations.length > 0` | Conversation list | Clickable items |
| URL matches conversation | Active styling | Highlighted |
| `unread > 0` | Unread badge shown | Count displayed |
| `unread > 0` | Unread text styling | Bold text |
| Participant has photo | Photo avatar | Image shown |
| No photo | Initials avatar | Generated fallback |

## **10. Dependencies**

### **Child Components**

* `Avatar` – Participant avatar
* `Badge` – Unread count

### **Next.js**

* `next/link` – Navigation
* `next/navigation` (`usePathname`) – Active detection

## **11. Events & Callbacks**

*None – uses Next.js Link for navigation.*

## **12. Styling**

* **Approach**: CSS Modules with SCSS
* **File**: `ConversationList.module.scss`

### **CSS Classes**

* `.container` – List wrapper
* `.emptyState` – No conversations message
* `.item` – Conversation row
* `.item--active` – Active conversation modifier
* `.item--unread` – Unread state modifier
* `.avatar` – Participant avatar
* `.content` – Text content area
* `.name` – Display name
* `.preview` – Last message preview
* `.meta` – Time and badge area
* `.time` – Relative time
* `.badge` – Unread count badge

### **Visual States**

* **Default**: Normal styling
* **Active**: Highlighted background
* **Unread**: Bold text, badge visible

## **13. Accessibility Requirements**

* **Keyboard**: All items focusable via Tab
* **ARIA**: Should have `role="list"` semantics
* **Screen Reader**: Announce name, preview, unread status

### **Improvements Needed**

* Add `aria-current="page"` for active item
* Add `aria-label` for list
* Announce unread count

## **14. Error Handling**

| Error Condition | Behaviour | Fallback |
|-----------------|-----------|----------|
| Empty conversations | Empty state shown | Helpful message |
| Missing participant data | Fallback display name | "Unknown" |
| Invalid date | Default format | Graceful handling |
| Missing lastMessage | Empty preview | No crash |

## **15. Performance & Lifecycle Notes**

### **Time Formatting**

```typescript
const formatRelativeTime = (dateString: string) => {
  // Returns: 'now', 'Xm', 'Xh', 'Xd', or 'Jan 15'
};
```

* `now` – under 1 minute
* `Xm` – minutes ago
* `Xh` – hours ago
* `Xd` – days ago
* "Jan 15" – older than 1 week

### **Active Detection**

* Uses `usePathname()` to compare with `/messages/{id}`
* Re-renders on navigation

## **16. Usage Examples**

### **Basic Usage**

```tsx
import { ConversationList } from '@/components/ui/ConversationList';

<ConversationList
  conversations={conversations}
  currentUserId={userId}
/>
```

### **In Messages Layout**

```tsx
<div className="messagesLayout">
  <aside className="sidebar">
    <ConversationList
      conversations={conversations}
      currentUserId={currentUser.id}
    />
  </aside>
  <main className="thread">
    {/* MessageThread here */}
  </main>
</div>
```

## **17. Features Summary**

### **Conversation Items**

* First other participant's avatar
* Display name (other participants)
* Last message preview (truncated)
* Relative time
* Unread badge

### **States**

* Active state based on current URL
* Unread state styling (bold)

### **Navigation**

* Links to `/messages/[id]`

### **Empty State**

* Helpful message when no conversations

## **18. Testing Considerations**

### **Unit Tests**

* Renders conversation list
* Shows empty state when no conversations
* Applies active class for current URL
* Shows unread badge when count > 0
* Shows initials when no photo
* Formats time correctly
* Links to correct URL

### **Mocking**

* ConversationHead array
* usePathname hook

### **Edge Cases**

* Empty array
* Single conversation
* Many conversations (scroll)
* Very long display names
* Very long last message
* High unread counts

## **19. Out of Scope / Non-Goals**

* **Real-time updates**: Parent handles data refresh
* **Create conversation**: Handled elsewhere
* **Delete conversation**: Not supported here
* **Search/filter**: Not built-in
* **Pagination**: Full list rendered

## **20. Related Components & System Context**

### **Child Components**

* `Avatar`
* `Badge`

### **Used With**

* `MessageThread`
* `MessageInput`

### **Used By**

* Messages page

## **21. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
|----------|----------|---------------|-------|
| `Default` | Multiple conversations | Mixed states | Base state |
| `Empty` | No conversations | Empty array | Empty state |
| `WithActive` | One active | URL matches one | Active highlight |
| `WithUnread` | Has unread | Various counts | Badges shown |
| `AllRead` | No unread | All counts 0 | No badges |
| `ManyItems` | Long list | 20+ items | Scroll behaviour |

### **Controls (Args) Required**

* `conversations` (array) – controllable
* `currentUserId` (string) – controllable

### **Mocking Requirements**

* **Conversation data**: Various states
* **usePathname**: Mock current path

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Verify list semantics
* Check active state announcement
* Verify keyboard navigation

### **Interaction Tests**

* Click conversation item
* Verify navigation
* Check active state updates
