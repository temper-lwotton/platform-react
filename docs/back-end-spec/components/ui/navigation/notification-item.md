# **Component Specification: NotificationItem**

## **1. Component Name**

**`NotificationItem`**

## **2. Description**

A compact notification item for the notifications dropdown.

* Shows actor avatar, notification title, text, and time
* Displays unread indicator dot
* Provides click interaction for navigation
* Used in NotificationDropdown tabs

## **3. Location**

```
src/components/ui/NotificationDropdown/NotificationItem.tsx
```

## **4. Component Type**

**UI** – Stateless presentational component for notification display.

## **5. Props Interface**

```typescript
interface NotificationItemProps {
  notification: Notification;
  title: string;
  text: string;
}
```

## **6. Props**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `notification` | `Notification` | Yes | - | Notification data object |
| `title` | `string` | Yes | - | Computed notification title |
| `text` | `string` | Yes | - | Computed notification text |

## **7. Data Requirements**

### **Notification Type**

```typescript
// From @/lib/notifications
interface Notification {
  id: number;
  type: string;
  readAt?: string | null;
  createdAt: string;
  actor?: {
    profile?: {
      fullName?: string;
      firstName?: string;
      photo?: string;
    };
    email?: string;
  };
}
```

### **Helper Functions**

* `getTimeAgo(date)` – From primitives, formats relative time

## **8. Internal State**

*None – stateless component.*

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
|-------------------|-------------|-------|
| `readAt === null` | Unread styling + dot | Blue dot indicator |
| `readAt !== null` | Read styling | No indicator |
| Actor has photo | Photo avatar | Image displayed |
| No actor photo | Initial avatar | Generated from name |
| No actor | Default avatar | "Someone" fallback |

## **10. Dependencies**

### **External Libraries**

*None – uses inline styles and primitive helpers.*

### **Helper Functions**

* `getTimeAgo` – From primitives

## **11. Events & Callbacks**

*No internal callbacks – click handled by parent.*

## **12. Styling**

* **Approach**: CSS Modules with SCSS
* **File**: `NotificationItem.module.scss`

### **CSS Classes**

* `.item` – Container
* `.item--unread` – Unread state
* `.avatar` – Actor avatar
* `.content` – Text content container
* `.title` – Notification title
* `.text` – Notification description
* `.meta` – Time and indicator
* `.time` – Relative time
* `.unreadDot` – Blue indicator dot

### **Variants**

* Unread: Background highlight + dot indicator
* Read: Normal styling

## **13. Accessibility Requirements**

* **Keyboard**: Focusable via parent
* **ARIA**: Item with proper role
* **Screen Reader**: Announce title, text, and unread status

### **Improvements Needed**

* Add `aria-label` combining all info
* Announce unread status explicitly

## **14. Error Handling**

| Error Condition | Behaviour | Fallback |
|-----------------|-----------|----------|
| Missing actor | "Someone" name | Default avatar |
| Missing photo | Initial fallback | Letter avatar |
| Invalid date | Empty time | Graceful degradation |

## **15. Performance & Lifecycle Notes**

### **Actor Name Logic**

```typescript
const getActorName = (notification: Notification): string => {
  const actor = notification.actor;
  if (!actor) return 'Someone';

  return actor.profile?.fullName
    ?? actor.profile?.firstName
    ?? actor.email
    ?? 'Someone';
};
```

### **Initial Generation**

```typescript
const getInitial = (name: string): string => {
  return name.charAt(0).toUpperCase();
};
```

## **16. Usage Examples**

### **In NotificationDropdown**

```tsx
import { NotificationItem } from './NotificationItem';

<NotificationItem
  notification={notification}
  title={getNotificationTitle(notification)}
  text={getNotificationText(notification)}
/>
```

### **With Click Handler**

```tsx
<div onClick={() => handleNotificationClick(notification)}>
  <NotificationItem
    notification={notification}
    title={title}
    text={text}
  />
</div>
```

## **17. Features Summary**

### **Avatar**

* Actor photo (if available)
* Initial fallback from name
* Default for unknown actors

### **Content**

* Notification title
* Notification text/description
* Relative time (via `getTimeAgo`)

### **Unread Indicator**

* Blue dot when `readAt` is null
* Background highlight styling
* Visual distinction from read items

## **18. Testing Considerations**

### **Unit Tests**

* Renders title and text
* Shows avatar with photo
* Shows initial when no photo
* Shows unread dot when unread
* Hides dot when read
* Displays relative time

### **Mocking**

* `getTimeAgo` function

### **Edge Cases**

* Very long title
* Very long text
* No actor data
* Just created (seconds ago)
* Old notification (months ago)

## **19. Out of Scope / Non-Goals**

* **Click handling**: Parent responsibility
* **Mark as read**: Parent handles
* **Notification actions**: Not in item
* **Rich content**: Just text display

## **20. Related Components & System Context**

### **Parent Component**

* `NotificationDropdown`

### **Used With**

* `TabbedDropdown`

### **Siblings**

* `MessageItem`
* `BookmarkItem`

## **21. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
|----------|----------|---------------|-------|
| `Unread` | New notification | readAt: null | With dot |
| `Read` | Seen notification | readAt: date | No dot |
| `WithPhoto` | Actor has photo | photo URL | Image avatar |
| `NoPhoto` | No actor photo | photo: null | Initial avatar |
| `NoActor` | Unknown actor | actor: null | "Someone" |
| `LongContent` | Long text | Long strings | Truncation |

### **Controls (Args) Required**

* `notification` (object) – Notification data
* `title` (string) – controllable
* `text` (string) – controllable

### **Mocking Requirements**

* **Helper**: Mock getTimeAgo

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Verify item accessible
* Check unread announcement
* Verify avatar alt text

### **Interaction Tests**

* Hover state
* Focus state
