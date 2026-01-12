# **Component Specification: BookmarkItem**

## **1. Component Name**

**`BookmarkItem`**

## **2. Description**

A compact bookmark item for the bookmarks dropdown.

* Shows bookmark icon, title, excerpt, space name, and time
* Provides remove button for deletion
* Used in BookmarksDropdown tabs
* Supports all content types

## **3. Location**

```
src/components/ui/BookmarksDropdown/BookmarkItem.tsx
```

## **4. Component Type**

**UI** – Stateless presentational component for bookmark display.

## **5. Props Interface**

```typescript
interface BookmarkItemProps {
  bookmark: BookmarkedItem;
  onRemove?: (bookmark: BookmarkedItem) => void;
}
```

## **6. Props**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `bookmark` | `BookmarkedItem` | Yes | - | Bookmark data object |
| `onRemove` | `(bookmark) => void` | No | - | Remove bookmark callback |

## **7. Data Requirements**

### **BookmarkedItem Type**

```typescript
// From BookmarksDropdown
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

### **Helper Functions**

* `getTimeAgo(date)` – From primitives, formats relative time

## **8. Internal State**

*None – stateless component.*

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
|-------------------|-------------|-------|
| Has excerpt | Truncated excerpt | Max 60 chars |
| No excerpt | No excerpt shown | Title only |
| Has spaceName | Space name with icon | Folder icon |
| No spaceName | No space info | Skip display |
| Has onRemove | Remove button visible | X icon |
| No onRemove | No remove button | Read-only |

## **10. Dependencies**

### **Child Components**

* `Icon` – Bookmark and folder icons

### **Helper Functions**

* `getTimeAgo` – From primitives

## **11. Events & Callbacks**

| Event / Callback | Trigger | Description |
|------------------|---------|-------------|
| `onRemove` | Click remove button | Remove bookmark, stops propagation |

## **12. Styling**

* **Approach**: CSS Modules with SCSS
* **File**: `BookmarkItem.module.scss`

### **CSS Classes**

* `.item` – Container
* `.icon` – Bookmark icon
* `.content` – Text content container
* `.title` – Bookmark title
* `.excerpt` – Truncated excerpt
* `.meta` – Space and time info
* `.spaceName` – Space name with icon
* `.time` – Relative time
* `.removeButton` – Remove action button

### **Layout**

* Icon (left)
* Content (center, fills space)
* Remove button (right, optional)

## **13. Accessibility Requirements**

* **Keyboard**: Focusable, remove button focusable
* **ARIA**: Item with proper role, remove with label
* **Screen Reader**: Announce title, space, and time

### **Improvements Needed**

* Add `aria-label` to remove button
* Announce content type
* Add focus styling

## **14. Error Handling**

| Error Condition | Behaviour | Fallback |
|-----------------|-----------|----------|
| Missing title | Empty string | Graceful degradation |
| Invalid date | Empty time | Skip time display |
| Remove fails | Parent handles | Callback returns |

## **15. Performance & Lifecycle Notes**

### **Excerpt Truncation**

```typescript
const truncateExcerpt = (text: string, maxLength = 60): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};
```

### **Remove Handler**

```typescript
const handleRemoveClick = (e: React.MouseEvent) => {
  e.stopPropagation(); // Prevent navigation
  onRemove?.(bookmark);
};
```

## **16. Usage Examples**

### **In BookmarksDropdown**

```tsx
import { BookmarkItem } from './BookmarkItem';

<BookmarkItem
  bookmark={bookmark}
  onRemove={(b) => handleRemoveBookmark(b)}
/>
```

### **Read-Only**

```tsx
<BookmarkItem bookmark={bookmark} />
```

## **17. Features Summary**

### **Icon**

* Filled bookmark icon
* Visual indicator

### **Content**

* Bookmark title
* Excerpt (truncated to 60 chars)
* Space name with folder icon (if available)
* Relative time

### **Remove Action**

* X icon button
* Stops event propagation
* Optional based on prop

## **18. Testing Considerations**

### **Unit Tests**

* Renders title
* Shows truncated excerpt
* Displays space name with icon
* Shows relative time
* Remove button calls callback
* Remove stops propagation

### **Mocking**

* `getTimeAgo` function

### **Edge Cases**

* Very long title
* Exactly 60 char excerpt
* Over 60 char excerpt
* No excerpt
* No space name
* No onRemove callback

## **19. Out of Scope / Non-Goals**

* **Navigation**: Parent handles click
* **Confirmation dialog**: Not in item
* **Edit bookmark**: Not supported
* **Drag reorder**: Not here

## **20. Related Components & System Context**

### **Parent Component**

* `BookmarksDropdown`

### **Child Components**

* `Icon`

### **Used With**

* `TabbedDropdown`

### **Siblings**

* `NotificationItem`
* `MessageItem`

## **21. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
|----------|----------|---------------|-------|
| `Default` | Full bookmark | All fields | Complete |
| `NoExcerpt` | Missing excerpt | excerpt: undefined | Title only |
| `NoSpace` | No space info | spaceName: undefined | No space |
| `LongExcerpt` | Long text | 100+ chars | Truncated |
| `WithRemove` | Remove enabled | onRemove provided | Button shown |
| `ReadOnly` | No remove | onRemove: undefined | No button |

### **Controls (Args) Required**

* `bookmark` (object) – Bookmark data
* `onRemove` (function) – controllable

### **Mocking Requirements**

* **Helper**: Mock getTimeAgo

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Verify item accessible
* Check remove button accessible
* Verify content announced

### **Interaction Tests**

* Hover state
* Click remove
* Focus states
