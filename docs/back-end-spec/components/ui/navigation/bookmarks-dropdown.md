# **Component Specification: BookmarksDropdown**

## **1. Component Name**

**`BookmarksDropdown`**

## **2. Description**

A dropdown panel in the navigation bar for viewing bookmarked content.

* Shows tabs for different content types (Posts, Discussions, Events, Learning, Videos, Messages)
* Displays bookmark count badge on trigger
* Provides type-based navigation to bookmarked items
* Used in main Navigation component

## **3. Location**

```
src/components/ui/BookmarksDropdown/BookmarksDropdown.tsx
```

## **4. Component Type**

**Feature** – Manages bookmark state and tabbed content display.

## **5. Props Interface**

```typescript
// No props - uses internal state
```

## **6. Props**

*No props – component uses internal state.*

## **7. Data Requirements**

### **BookmarkedItem Type**

```typescript
interface BookmarkedItem {
  id: string;
  title: string;
  excerpt?: string;
  type: 'post' | 'discussion' | 'event' | 'learning' | 'video' | 'message';
  createdAt: string;
  spaceName?: string;
  spaceId?: string;
}
```

### **Data Sources**

Currently uses placeholder state. Future API integration expected.

## **8. Internal State**

| State Variable | Type | Initial | Purpose |
|----------------|------|---------|---------|
| `isOpen` | `boolean` | `false` | Dropdown visibility |
| `currentUserId` | `string \| null` | `null` | Current user ID |
| `isClient` | `boolean` | `false` | Client-side hydration check |
| `bookmarks` | `BookmarkedItem[]` | `[]` | Bookmarked items (placeholder) |

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
|-------------------|-------------|-------|
| Not authenticated | Nothing (`null`) | No render |
| `isOpen === false` | Bookmark icon with badge | Trigger only |
| `isOpen === true` | Full dropdown panel | Tabbed content |
| Bookmark count > 0 | Badge with count | Visual indicator |
| Bookmark count = 0 | No badge | Clean icon |
| Tab active | Filtered bookmarks | By content type |
| Click bookmark | Navigate to content | Type-based URL |

## **10. Dependencies**

### **Child Components**

* `TabbedDropdown` – Generic tabbed dropdown container
* `BookmarkItem` – Individual bookmark display

### **External Libraries**

* `next/navigation` (`useRouter`)

### **API Functions**

* `getCurrentUserId` – Get current user

## **11. Events & Callbacks**

| Event / Callback | Trigger | Description |
|------------------|---------|-------------|
| `handleBookmarkClick` | Click bookmark | Navigate based on content type |
| `handleRemoveBookmark` | Remove action | Remove bookmark (TODO) |

## **12. Styling**

Uses `TabbedDropdown` styling with bookmark icon trigger.

## **13. Accessibility Requirements**

* **Keyboard**: Tab navigation through bookmarks
* **ARIA**: Dropdown with proper roles
* **Screen Reader**: Announce bookmark count and content info

### **Improvements Needed**

* Add `aria-live` for count changes
* Add keyboard shortcut to open
* Announce tab changes

## **14. Error Handling**

| Error Condition | Behaviour | Fallback |
|-----------------|-----------|----------|
| Bookmarks query fails | Error state | Show error message |
| Count query fails | No badge | Graceful degradation |
| Remove fails | Error toast | Keep bookmark in list |

## **15. Performance & Lifecycle Notes**

### **Navigation Routes**

```typescript
const getBookmarkUrl = (bookmark: BookmarkedItem): string => {
  switch (bookmark.type) {
    case 'discussion':
      return `/spaces/${bookmark.spaceId}/discussions/${bookmark.id}`;
    case 'event':
      return `/events/${bookmark.id}`;
    case 'message':
      return `/messages/${bookmark.id}`;
    // ... other types
  }
};
```

### **Future API Integration**

* Query for user bookmarks
* Remove bookmark mutation
* Real-time count updates

## **16. Usage Examples**

### **In Navigation**

```tsx
import { BookmarksDropdown } from '@/components/ui/BookmarksDropdown';

<nav>
  <BookmarksDropdown />
</nav>
```

## **17. Features Summary**

### **Trigger**

* Bookmark icon
* Count badge
* Dropdown indicator

### **Tabs**

| Tab ID | Label | Content Type |
|--------|-------|--------------|
| `posts` | Posts | post |
| `discussions` | Discussions | discussion |
| `events` | Events | event |
| `learning` | Learning | learning |
| `videos` | Videos | video |
| `messages` | Messages | message |

### **Actions**

* Click bookmark → navigate to content
* Remove bookmark → remove from list
* View all link → `/bookmarks`

## **18. Testing Considerations**

### **Unit Tests**

* Shows badge when bookmarks > 0
* Opens dropdown on click
* Tabs filter content by type
* Click navigates to correct URL
* Remove callback invoked

### **Mocking**

* `getCurrentUserId` function
* Bookmark data

### **Edge Cases**

* Zero bookmarks
* Many bookmarks (scroll)
* Single type only
* All types present
* Long titles

## **19. Out of Scope / Non-Goals**

* **Add bookmark**: Done elsewhere
* **Bookmark organization**: No folders
* **Drag reorder**: Not supported
* **Search bookmarks**: Not here

## **20. Related Components & System Context**

### **Parent Component**

* `Navigation`

### **Child Components**

* `TabbedDropdown`
* `BookmarkItem`

### **Siblings**

* `NotificationDropdown`
* `MessagesDropdown`

## **21. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
|----------|----------|---------------|-------|
| `Default` | Some bookmarks | Mixed types | Badge shown |
| `Empty` | No bookmarks | Empty array | Empty state |
| `Open` | Dropdown visible | isOpen: true | Full panel |
| `PostsTab` | Posts selected | Tab: posts | Filtered |
| `SingleType` | One type only | Events only | Single tab active |

### **Controls (Args) Required**

*None – internal state*

### **Mocking Requirements**

* **State**: Mock bookmark data
* **Auth**: Mock getCurrentUserId

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Verify dropdown accessible
* Check tab navigation
* Verify bookmark item accessible

### **Interaction Tests**

* Click to open
* Switch tabs
* Click bookmark
* Click remove
