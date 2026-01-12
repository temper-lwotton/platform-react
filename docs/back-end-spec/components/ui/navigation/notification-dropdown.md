# **Component Specification: NotificationDropdown**

## **1. Component Name**

**`NotificationDropdown`**

## **2. Description**

A dropdown panel in the navigation bar for viewing and managing notifications.

* Shows tabs for Inbox, Mentions, and Archived
* Displays unread count badge on trigger
* Provides mark-all-read functionality
* Polls for new notifications
* Used in main Navigation component

## **3. Location**

```
src/components/ui/NotificationDropdown/NotificationDropdown.tsx
```

## **4. Component Type**

**Feature** – Manages notification queries, mutations, and tabbed display.

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
| Query | `['notifications-count', userId]` via `getUnreadCount` | Unread notification count |
| Query | `['notifications', userId]` via `getNotifications` | List of notifications |
| Mutation | `markAsRead(id)` | Mark single notification as read |
| Mutation | `markAllAsRead(userId)` | Mark all notifications as read |

### **Notification Type**

```typescript
// From @/lib/notifications
interface Notification {
  id: number;
  type: 'mention' | 'reply' | 'like' | 'follow' | 'event' | 'system';
  readAt?: string | null;
  createdAt: string;
  // ... other notification properties
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
| `isOpen === false` | Bell icon with badge | Trigger only |
| `isOpen === true` | Full dropdown panel | Tabbed content |
| Unread count > 0 | Badge with count | Visual indicator |
| Unread count = 0 | No badge | Clean icon |
| Inbox tab active | Unread notifications | Default tab |
| Mentions tab active | Mention-type only | Filtered |
| Archived tab active | Read notifications | History |
| Click notification | Mark as read + navigate | Dual action |

## **10. Dependencies**

### **Child Components**

* `TabbedDropdown` – Generic tabbed dropdown container
* `NotificationItem` – Individual notification display

### **External Libraries**

* `@tanstack/react-query`
* `next/navigation` (`useRouter`)

### **API Functions**

* `getNotifications` – Fetch user notifications
* `getUnreadCount` – Get unread count
* `markAsRead` – Mark single as read
* `markAllAsRead` – Mark all as read
* `getNotificationTitle` – Get notification title
* `getNotificationText` – Get notification text
* `getNotificationLink` – Get notification link

## **11. Events & Callbacks**

| Event / Callback | Trigger | Description |
|------------------|---------|-------------|
| `handleNotificationClick` | Click notification | Mark as read, navigate to link |
| `handleMarkAllRead` | Click "Mark all read" | Mark all notifications as read |

## **12. Styling**

Uses `TabbedDropdown` styling with bell icon trigger.

## **13. Accessibility Requirements**

* **Keyboard**: Tab navigation through notifications
* **ARIA**: Dropdown with proper roles
* **Screen Reader**: Announce unread count and notification content

### **Improvements Needed**

* Add `aria-live` for count changes
* Announce when notification is marked read
* Add keyboard shortcut to open

## **14. Error Handling**

| Error Condition | Behaviour | Fallback |
|-----------------|-----------|----------|
| Notifications query fails | Error state | Show error message |
| Count query fails | No badge | Graceful degradation |
| Mark read fails | Error toast | Notification stays unread |

## **15. Performance & Lifecycle Notes**

### **Polling**

* Auto-refresh unread count every 30 seconds
* Notifications lazy-loaded when dropdown opens

### **Query Invalidation**

* Invalidate notifications on mark read
* Invalidate count on mark all read

## **16. Usage Examples**

### **In Navigation**

```tsx
import { NotificationDropdown } from '@/components/ui/NotificationDropdown';

<nav>
  <NotificationDropdown />
</nav>
```

## **17. Features Summary**

### **Trigger**

* Bell icon
* Unread badge count
* Auto-refresh count (30s polling)

### **Tabs**

| Tab ID | Label | Content |
|--------|-------|---------|
| `inbox` | Inbox | Unread notifications |
| `mentions` | Mentions | Mention-type notifications |
| `archived` | Archived | Read notifications |

### **Actions**

* "Mark all read" header action
* Click notification → mark read + navigate
* View all link → `/notifications`

## **18. Testing Considerations**

### **Unit Tests**

* Shows badge when unread > 0
* Opens dropdown on click
* Tabs switch content
* Mark all read clears notifications
* Click marks notification as read
* Navigates to notification link

### **Mocking**

* `getNotifications` query
* `getUnreadCount` query
* `markAsRead` mutation
* `markAllAsRead` mutation

### **Edge Cases**

* Zero notifications
* Many notifications (scroll)
* All read
* All unread
* Mixed types
* Rapid mark read clicks

## **19. Out of Scope / Non-Goals**

* **Notification settings**: In preferences
* **Push notifications**: Browser handling
* **Real-time WebSocket**: Uses polling
* **Notification actions**: Just navigation

## **20. Related Components & System Context**

### **Parent Component**

* `Navigation`

### **Child Components**

* `TabbedDropdown`
* `NotificationItem`

### **Siblings**

* `MessagesDropdown`
* `BookmarksDropdown`

## **21. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
|----------|----------|---------------|-------|
| `Default` | Some unread | 5 unread | Badge shown |
| `AllRead` | No unread | 0 unread | No badge |
| `Open` | Dropdown visible | isOpen: true | Full panel |
| `MentionsTab` | Mentions selected | Tab: mentions | Filtered |
| `Empty` | No notifications | Empty array | Empty state |
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
* Verify notification item accessible

### **Interaction Tests**

* Click to open
* Switch tabs
* Click notification
* Click mark all read
