# **Component Specification: TabbedDropdown**

## **1. Component Name**

**`TabbedDropdown`**

## **2. Description**

A specialized dropdown combining Radix UI Popover and Tabs primitives.

* Provides a tabbed interface within a dropdown panel
* Commonly used for notifications, messages, and bookmarks
* Includes badge count, header actions, and footer link
* Full content type filtering via tabs

## **3. Location**

```
src/components/ui/primitives/TabbedDropdown/TabbedDropdown.tsx
```

## **4. Component Type**

**Feature** – Manages tab state and provides controlled dropdown behavior.

## **5. Props Interface**

```typescript
interface TabbedDropdownTab<T = any> {
  id: string;
  label: string;
  count?: number;
  items: T[];
}

interface TabbedDropdownProps<T = any> {
  // Trigger
  icon: IconName;
  badgeCount?: number;
  ariaLabel: string;

  // Header
  title: string;
  headerAction?: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
  };

  // Tabs
  tabs: TabbedDropdownTab<T>[];
  defaultTab?: string;

  // Content
  renderItem: (item: T) => ReactNode;
  isLoading?: boolean;
  emptyMessage?: string;

  // Footer
  viewAllLink: string;
  viewAllLabel?: string;

  // Behavior
  onItemClick?: (item: T) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}
```

## **6. Props**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `icon` | `IconName` | Yes | - | Trigger button icon |
| `badgeCount` | `number` | No | `0` | Badge count (9+ shows "9+") |
| `ariaLabel` | `string` | Yes | - | Accessibility label |
| `title` | `string` | Yes | - | Header title |
| `headerAction` | `object` | No | - | Header action button |
| `tabs` | `TabbedDropdownTab[]` | Yes | - | Tab definitions with items |
| `defaultTab` | `string` | No | first tab | Initially active tab |
| `renderItem` | `(item: T) => ReactNode` | Yes | - | Item renderer function |
| `isLoading` | `boolean` | No | `false` | Loading state |
| `emptyMessage` | `string` | No | `'No items'` | Empty state message |
| `viewAllLink` | `string` | Yes | - | Footer "View all" link |
| `viewAllLabel` | `string` | No | `'View all'` | Footer link text |
| `onItemClick` | `(item: T) => void` | No | - | Item click handler |
| `isOpen` | `boolean` | Yes | - | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | Yes | - | Open state handler |

## **7. Data Requirements**

### **TabbedDropdownTab Type**

```typescript
interface TabbedDropdownTab<T> {
  id: string;       // Unique tab identifier
  label: string;    // Tab button text
  count?: number;   // Optional badge count
  items: T[];       // Items for this tab
}
```

### **Example Data**

```typescript
const notificationTabs: TabbedDropdownTab<Notification>[] = [
  { id: 'all', label: 'All', count: 12, items: allNotifications },
  { id: 'unread', label: 'Unread', count: 3, items: unreadNotifications },
  { id: 'mentions', label: 'Mentions', items: mentionNotifications },
];
```

## **8. Internal State**

*Tab management handled by Radix Tabs internally.*

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
|-------------------|-------------|-------|
| `isOpen === false` | Icon with badge | Trigger only |
| `isOpen === true` | Full panel | Tabbed content |
| `badgeCount > 0` | Badge shown | Count visible |
| `badgeCount > 9` | "9+" badge | Truncated |
| Single tab | No tab UI | Just content |
| Multiple tabs | Tab navigation | Switchable |
| `isLoading === true` | Loading state | Spinner |
| Empty items | Empty message | Fallback |

## **10. Dependencies**

### **Child Components**

* `Icon` – Trigger and badge icons

### **External Libraries**

* `@radix-ui/react-popover`
* `@radix-ui/react-tabs`
* `next/link`

## **11. Events & Callbacks**

| Event / Callback | Trigger | Description |
|------------------|---------|-------------|
| `onOpenChange` | Open/close events | Dropdown state handler |
| `onItemClick` | Item clicked | Item interaction |
| `headerAction.onClick` | Header action clicked | Header action |

## **12. Styling**

* **Approach**: CSS Modules with SCSS
* **File**: `TabbedDropdown.module.scss`

### **CSS Classes**

* `.button` – Trigger button
* `.icon` – Trigger icon
* `.badge` – Count badge
* `.dropdownMenu` – Panel container
* `.dropdownHeader` – Header section
* `.dropdownTitle` – Title text
* `.headerAction` – Header action button
* `.tabs` – Tabs container
* `.tabsList` – Tab buttons container
* `.tabTrigger` – Tab button
* `.tabBadge` – Tab count badge
* `.tabContent` – Tab content panel
* `.list` – Items list
* `.loading` – Loading state
* `.empty` – Empty state
* `.dropdownFooter` – Footer section
* `.viewAll` – View all link

## **13. Accessibility Requirements**

* **Keyboard**: Tab navigation, Enter/Space
* **ARIA**: Proper tabs and popover semantics
* **Focus**: Focus trapped in dropdown
* **Screen Reader**: Announces tabs and items

### **Improvements Needed**

* Add `aria-live` for count updates

## **14. Error Handling**

| Error Condition | Behaviour | Fallback |
|-----------------|-----------|----------|
| Empty tabs | Nothing rendered | Graceful |
| renderItem throws | Error boundary | Component error |

## **15. Performance & Lifecycle Notes**

### **Behavior Notes**

* Single tab: tabs UI hidden, just shows content
* Multiple tabs: shows tab navigation
* Item click closes dropdown automatically
* Badge shows "9+" for counts > 9
* Footer link also closes dropdown

## **16. Usage Examples**

### **Notifications Dropdown**

```tsx
import { TabbedDropdown } from '@/components/ui/primitives/TabbedDropdown';

const [notificationsOpen, setNotificationsOpen] = useState(false);

<TabbedDropdown
  icon="bell"
  badgeCount={unreadCount}
  ariaLabel="Notifications"
  title="Notifications"
  headerAction={{
    label: 'Mark all read',
    onClick: handleMarkAllRead,
    disabled: unreadCount === 0,
  }}
  tabs={[
    { id: 'all', label: 'All', items: notifications },
    { id: 'unread', label: 'Unread', count: unreadCount, items: unread },
  ]}
  renderItem={(notification) => (
    <NotificationItem notification={notification} />
  )}
  viewAllLink="/notifications"
  viewAllLabel="View all notifications"
  onItemClick={handleNotificationClick}
  isOpen={notificationsOpen}
  onOpenChange={setNotificationsOpen}
/>
```

### **Messages Dropdown**

```tsx
<TabbedDropdown
  icon="chat"
  badgeCount={unreadMessages}
  ariaLabel="Messages"
  title="Messages"
  tabs={[
    { id: 'inbox', label: 'Inbox', count: unreadMessages, items: inbox },
    { id: 'sent', label: 'Sent', items: sent },
  ]}
  renderItem={(message) => <MessageItem message={message} />}
  viewAllLink="/messages"
  isOpen={messagesOpen}
  onOpenChange={setMessagesOpen}
/>
```

### **Bookmarks Dropdown**

```tsx
<TabbedDropdown
  icon="bookmark"
  ariaLabel="Bookmarks"
  title="Bookmarks"
  tabs={[
    { id: 'posts', label: 'Posts', items: bookmarkedPosts },
    { id: 'events', label: 'Events', items: bookmarkedEvents },
  ]}
  renderItem={(item) => <BookmarkItem item={item} />}
  viewAllLink="/bookmarks"
  isOpen={bookmarksOpen}
  onOpenChange={setBookmarksOpen}
  emptyMessage="No bookmarks yet"
/>
```

## **17. Features Summary**

### **Trigger**

* Icon button
* Badge count (truncates at 9+)
* Accessibility label

### **Header**

* Title text
* Optional action button
* Action can be disabled

### **Tabs**

* Multiple tabs with labels
* Per-tab count badges
* Single tab hides UI

### **Content**

* Custom item rendering
* Loading state
* Empty state with message

### **Footer**

* "View all" link
* Customizable label

## **18. Testing Considerations**

### **Unit Tests**

* Opens on trigger click
* Badge shows correct count
* Tabs switch content
* Items render correctly
* Header action fires
* Footer link works
* Empty state shows

### **Mocking**

* No external dependencies to mock

### **Edge Cases**

* Zero items
* Many items (scroll)
* Single tab
* Very long item content
* Rapid tab switching

## **19. Out of Scope / Non-Goals**

* **Search**: Not included
* **Infinite scroll**: Not built-in
* **Drag reorder**: Not supported
* **Nested tabs**: Not supported

## **20. Related Components & System Context**

### **Used By**

* `NotificationDropdown`
* `MessagesDropdown`
* `BookmarksDropdown`

### **Built On**

* `Popover`
* `Icon`

## **21. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
|----------|----------|---------------|-------|
| `Notifications` | Notifications use | Bell icon | Full example |
| `Messages` | Messages use | Chat icon | Full example |
| `Bookmarks` | Bookmarks use | Bookmark icon | Full example |
| `SingleTab` | One tab | Single tab | No tab UI |
| `Loading` | Loading state | isLoading: true | Spinner |
| `Empty` | No items | Empty array | Message shown |
| `WithBadge` | Badge count | badgeCount: 5 | Badge visible |

### **Controls (Args) Required**

* `icon` (select) – Trigger icon
* `badgeCount` (number) – Badge count
* `title` (text) – Header title
* `emptyMessage` (text) – Empty message
* `isLoading` (boolean) – Loading state
* `isOpen` (boolean) – Open state

### **Mocking Requirements**

* Mock item data

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Verify tab navigation
* Check focus management
* Verify item accessible

### **Interaction Tests**

* Open dropdown
* Switch tabs
* Click item
* Click header action
* Click footer link
