# **Route Specification: Notifications**

## **1. Route Path**

**`/notifications`**

## **2. Description**

Notification center for viewing and managing user notifications.

* Displays notifications with unread/all tabs
* Supports marking individual or all notifications as read
* Provides navigation to related content
* Shows relative timestamps and read status

## **3. Source File**

```
src/app/(protected)/notifications/page.tsx
```

## **4. Route Responsibility**

### **This route is responsible for:**

* Rendering the notification list
* Filtering notifications by read status (tabs)
* Marking individual notifications as read
* Marking all notifications as read
* Navigating to notification-related content
* Displaying notification metadata and timestamps

### **This route does not:**

* Create notifications (system-generated)
* Configure notification preferences (see `/preferences`)
* Send notifications
* Delete notifications

## **5. Authentication & Access Control**

* **Authentication Required:** Yes
* **Allowed Roles:** Any authenticated user
* **Permission Rules:** Users see only their own notifications

## **6. URL Parameters & Query Params**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `tab` | `string` | No | Active tab (unread/all) |

* **Default behaviour:** Show unread notifications
* **Validation:** Invalid tab defaults to 'unread'

## **7. Layout & Structure**

### **Layout Overview**

* Single column layout
* Header with mark all read button, tabs, then notification list

### **Structural Regions**

| Region | Purpose |
|--------|---------|
| Header | Title and "Mark all as read" button |
| Tabs | Unread / All toggle |
| Content Area | List of notification cards |

## **8. Components Used**

### **Layout Components**

*None - simple page structure*

### **UI / Feature Components**

| Component | Import Path | Purpose |
|-----------|-------------|---------|
| `useRouter` | `next/navigation` | Programmatic navigation |

### **Notification Helpers**

| Function | Import Path | Purpose |
|----------|-------------|---------|
| `getNotifications` | `@/lib/notifications` | Fetch user notifications |
| `markAsRead` | `@/lib/notifications` | Mark single notification read |
| `markAllAsRead` | `@/lib/notifications` | Mark all notifications read |
| `getNotificationTitle` | `@/lib/notifications` | Generate notification title |
| `getNotificationText` | `@/lib/notifications` | Generate notification body |
| `getNotificationLink` | `@/lib/notifications` | Generate navigation link |

## **9. Data Flow Overview**

1. Resolve authenticated user ID
2. Fetch notifications for user
3. Filter by active tab (unread/all)
4. Calculate unread count for tab badge
5. Render notification cards
6. User marks notification as read → mutation → invalidate queries
7. User clicks notification → mark as read → navigate to content

## **10. Data Fetching**

### **Standard Queries**

| Query Key | Function | Data Type | Enable Conditions |
|-----------|----------|-----------|-------------------|
| `['notifications', currentUserId]` | `getNotifications(userId)` | `Notification[]` | `!!currentUserId` |

### **Mutations**

| Mutation | Function | On Success |
|----------|----------|------------|
| `markReadMutation` | `markAsRead(notificationId)` | Invalidate notifications and count queries |
| `markAllReadMutation` | `markAllAsRead(userId)` | Invalidate notifications and count queries |

## **11. State Management**

### **Local State**

| State Variable | Type | Purpose |
|----------------|------|---------|
| `currentUserId` | `string \| null` | Current authenticated user ID |
| `activeTab` | `'unread' \| 'all'` | Current tab selection |

### **Derived State**

| Variable | Dependencies | Purpose |
|----------|--------------|---------|
| `filteredNotifications` | `notifications, activeTab` | Notifications filtered by active tab |
| `unreadCount` | `notifications` | Count of unread notifications |

### **Refs**

*None*

## **12. Behaviour Matrix**

| Condition | UI Behaviour |
|-----------|--------------|
| Loading initial data | "Loading notifications..." message |
| Not authenticated | "Please log in to view notifications" |
| Data loaded (unread tab) | Unread notifications displayed |
| Data loaded (all tab) | All notifications displayed |
| No unread notifications | "No unread notifications" empty state |
| No notifications at all | "No notifications" empty state |
| Mark as read success | Notification updates, queries invalidated |
| Mark all read success | All notifications update, queries invalidated |

## **13. User Actions**

### **UI Interactions**

| Action | Trigger | Result |
|--------|---------|--------|
| Switch to unread tab | Click "Unread" tab | Update `activeTab`, show unread only |
| Switch to all tab | Click "All" tab | Update `activeTab`, show all |
| Mark as read (button) | Click checkmark button | `markAsRead(id)`, invalidate queries |
| Mark all as read | Click header button | `markAllAsRead(userId)`, invalidate queries |

### **Navigation Actions**

| Action | Trigger | Destination |
|--------|---------|-------------|
| View related content | Click notification card | Dynamic based on notification type |

### **Data Mutations**

| Action | Trigger | API Call | On Success |
|--------|---------|----------|------------|
| Mark as read | Click notification | `markAsRead(id)` | Invalidate queries, navigate |
| Mark as read | Click checkmark | `markAsRead(id)` | Invalidate queries |
| Mark all read | Click header button | `markAllAsRead(userId)` | Invalidate queries |

## **14. Infinite Scroll / Pagination**

*Not applicable - all notifications loaded at once.*

## **15. Error & Empty States**

* **Loading:** "Loading notifications..." message
* **Not authenticated:** "Please log in to view notifications"
* **Empty (unread tab):** "No unread notifications"
* **Empty (all tab):** "No notifications"
* **Error:** Standard React Query error handling

## **16. Performance & Constraints**

* **Rendering strategy:** Client-side rendering (CSR)
* **Memoisation strategy:** Filter on tab change
* **Parallel vs sequential fetching:** Single query
* **Known constraints:**
  * All notifications loaded (no pagination)
  * No real-time updates

## **17. Accessibility Considerations**

* **Keyboard navigation:** Tab through notifications, Enter to activate
* **Focus management:** Focus on notification after mark as read
* **Screen reader expectations:** Unread status announced, notification content read
* **Landmark roles:** Main content area, list semantics

## **18. Storybook & Testing Strategy**

### **Storybook**

* Notification card component with read/unread states
* Different notification types
* Empty state display

### **Testing**

* **Unit test focus:** Filter logic, time formatting
* **Integration test focus:** Mark as read flow, tab switching
* **E2E test focus:** Full notification management journey

## **19. Non-Goals / Out of Scope**

* Notification creation
* Push notification handling
* Notification preferences (handled by `/preferences`)
* Notification deletion
* Real-time updates

## **20. Related Routes**

| Route | Relationship |
|-------|--------------|
| `/preferences` | Notification settings |
| Dynamic | Based on notification type (discussions, events, etc.) |

## **21. Open Questions / Notes**

* Consider adding pagination for users with many notifications
* May need real-time updates via WebSocket
* Consider notification grouping by type or time
* Delete functionality may be needed

### **Notification Display**

Each notification card shows:
- **Avatar**: User photo or initial placeholder
- **Title**: Generated notification title
- **Text**: Generated notification body
- **Time**: Relative time (e.g., "2h ago", "just now")
- **Read indicator**: Visual distinction for unread items

### **Time Formatting**

```typescript
// Returns relative time strings:
// < 60 seconds: "just now"
// < 1 hour: "Xm ago"
// < 1 day: "Xh ago"
// < 1 week: "Xd ago"
// Older: Formatted date
```

### **Query Invalidation**

When marking notifications as read, invalidates:
- `['notifications', currentUserId]` - Refresh list
- `['notifications-count', currentUserId]` - Update badge counts
