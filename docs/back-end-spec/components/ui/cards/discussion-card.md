# **Component Specification: DiscussionCard**

## **1. Component Name**

**`DiscussionCard`**

## **2. Description**

A card component for displaying discussion posts within spaces. Shows author information, discussion title and excerpt, engagement stats (likes, comments), and provides admin moderation controls and broadcast actions.

* Displays discussion content in a scannable card format
* Provides quick access to engagement metrics and actions
* Enables admin users to broadcast discussions or moderate content

## **3. Location**

```
src/components/ui/DiscussionCard/DiscussionCard.tsx
```

## **4. Component Type**

* UI

## **5. Props Interface**

```ts
interface DiscussionCardProps {
  discussion: Discussion;
  spaceId: string;
}
```

## **6. Props**

| Prop | Type | Required | Default | Description |
| ---- | ---- | -------- | ------- | ----------- |
| `discussion` | `Discussion` | Yes | - | Discussion data object containing title, author, stats, etc. |
| `spaceId` | `string` | Yes | - | Parent space ID used for constructing navigation links |

## **7. Data Requirements**

### **External Data Sources**

* **Props**: `discussion`, `spaceId`
* **Hook**: `useIsAdmin()` - determines if admin menu is rendered

```ts
// From @/lib/discussions
interface Discussion {
  id: number | string;
  title: string;
  excerpt?: string;
  createdAt: string;
  likesCount?: number;
  commentsCount?: number;
  author?: {
    profile?: {
      fullName?: string;
      firstName?: string;
      lastName?: string;
      photo?: string;
    };
  };
  space?: {
    title?: string;
  };
}
```

### **Derived Values**

| Value | Derivation |
| ----- | ---------- |
| `authorName` | `fullName` or `firstName + lastName` or `'Unknown'` |
| `initials` | First letter of each word in `authorName`, max 2 chars |
| `formattedDate` | `createdAt` formatted as "MMM D, YYYY" |
| `spaceName` | `discussion.space.title` if object |

## **8. Internal State**

| State Variable | Type | Purpose |
| -------------- | ---- | ------- |
| `isBookmarked` | `boolean` | Track bookmark toggle state (local only) |
| `isAdminMenuOpen` | `boolean` | Controls admin dropdown visibility |

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
| ----------------- | ----------- | ----- |
| `spaceName` exists | Space link badge above header | Links to `/spaces/{spaceId}` |
| `spaceName` missing | No space badge | Header starts directly |
| `discussion.excerpt` exists | Excerpt paragraph (max 150 chars) | Truncated with ellipsis |
| `discussion.excerpt` missing | No excerpt paragraph | Title links directly to footer |
| `isAdmin === true` | Admin dropdown menu button visible | Shows broadcast + moderation options |
| `isAdmin === false` | No admin dropdown | Only bookmark button in actions |
| `isBookmarked === true` | Bookmark icon (filled state implied) | Shows "Remove bookmark" aria-label |
| `isBookmarked === false` | Bookmark icon (unfilled state) | Shows "Add bookmark" aria-label |
| `isAdminMenuOpen === true` | Dropdown menu portal rendered | Contains broadcast and moderation items |

## **10. Dependencies**

### **Child Components**

* `Avatar` - Author profile image with fallback initials
* `Icon` - Various icons (folder, heart, comment, bookmark, moreVertical, send)
* `InlineModerationControls` - Admin moderation actions within dropdown

### **Utilities / Hooks**

* `useToast` - Toast notifications for user feedback
* `useIsAdmin` - Permission check for admin UI
* `useRouter` - Navigation to broadcast creation
* `generateDiscussionBroadcast` - Creates broadcast template from discussion

### **External Libraries**

* `@radix-ui/react-dropdown-menu` - Accessible dropdown for admin menu
* `next/link` - Client-side navigation
* `next/navigation` - Programmatic navigation

## **11. Events & Callbacks**

| Event / Callback | Trigger | Description |
| ---------------- | ------- | ----------- |
| `handleBookmark` | Click on bookmark button | Toggles `isBookmarked`, shows toast with appropriate message |
| `handleBroadcast` | Select "Broadcast This" menu item | Generates template, stores in localStorage, navigates to `/admin/broadcasts/new?source=discussion` |
| Moderation `onAction` | Any moderation action in dropdown | Shows toast with action name, closes admin menu |

## **12. Styling**

* **Styling approach**: CSS Modules with SCSS
* **File(s)**:
  * `DiscussionCard.module.scss`

### **Visual States**

* **Default**: Standard card appearance with subtle border
* **Hover (card)**: Elevated shadow via `card-hover` mixin
* **Hover (title link)**: Title text colour changes to primary
* **Hover (buttons)**: Background highlight, icon scale on bookmark
* **Focus (admin menu items)**: Background highlight for keyboard navigation

### **Key Style Classes**

| Class | Purpose |
| ----- | ------- |
| `.card` | Base card container with padding and hover effect |
| `.space` | Optional space badge section with bottom border |
| `.header` | Avatar and meta info layout |
| `.footer` | Stats and actions row |
| `.adminMenu` | Dropdown portal styling (280px min-width, shadow) |

## **13. Accessibility Requirements**

* **Bookmark button**: Has `aria-label` that changes based on state ("Add bookmark" / "Remove bookmark")
* **Admin menu button**: Has `title="Admin options"` for tooltip
* **Keyboard navigation**: Radix dropdown provides full keyboard support (Enter/Space to open, Arrow keys to navigate, Escape to close)
* **Focus management**: Radix handles focus trapping in open dropdown
* **Screen reader**: Menu items are announced with labels; stats use semantic `<span>` elements

### **Improvements Needed**

* Consider adding `aria-live` region for toast announcements
* Stats icons could benefit from `aria-hidden` with visible text alternatives

## **14. Error Handling**

| Condition | Behaviour |
| --------- | --------- |
| Missing author data | Falls back to "Unknown" for name, generates "UN" initials |
| Missing `likesCount` / `commentsCount` | Defaults to `0` via nullish coalescing |
| Missing excerpt | Excerpt paragraph not rendered |
| Missing space title | Space badge section not rendered |

**Not handled by this component:**
* Network errors for bookmark persistence (bookmark is local state only)
* Navigation failures
* localStorage unavailable (broadcast template storage)

## **15. Performance & Lifecycle Notes**

* **No side effects on mount** - component is purely presentational until user interaction
* **localStorage write** on broadcast action (synchronous, minimal impact)
* **Re-renders**: Only on state changes (`isBookmarked`, `isAdminMenuOpen`)
* **No cleanup required** - no subscriptions or listeners registered

## **16. Usage Examples**

```tsx
import { DiscussionCard } from '@/components/ui/DiscussionCard';

// Single card
<DiscussionCard
  discussion={discussion}
  spaceId="123"
/>

// In a list
{discussions.map((discussion) => (
  <DiscussionCard
    key={discussion.id}
    discussion={discussion}
    spaceId={spaceId}
  />
))}
```

## **17. Features Summary**

* Links to discussion detail page via title
* Author avatar with fallback initials
* Formatted date display (MMM D, YYYY)
* Excerpt preview with 150 character limit
* Like and comment count display
* Bookmark toggle with toast feedback
* Admin-only dropdown menu with:
  * Broadcast discussion as email campaign
  * Inline moderation controls
* Optional space badge linking to parent space

## **18. Testing Considerations**

### **Unit Tests**

* Author name fallback logic (fullName → firstName+lastName → Unknown)
* Excerpt truncation at 150 characters
* Date formatting output
* Bookmark toggle state changes

### **Mocking Required**

* `useIsAdmin` - test both admin and non-admin states
* `useToast` - verify toast messages
* `useRouter` - verify navigation calls
* `localStorage` - verify broadcast template storage

### **Edge Cases**

* Discussion with no author object
* Discussion with no excerpt
* Discussion with no space object
* Very long title (CSS handling)
* Zero likes/comments display

## **19. Out of Scope / Non-Goals**

* **Bookmark persistence** - currently local state only, not synced to backend
* **Optimistic updates** - no server state management
* **Edit functionality** - handled by dedicated edit pages
* **Comment preview** - only shows count, not content
* **Rich text excerpt** - plain text only, no HTML/markdown rendering

## **20. Related Components & System Context**

### **Sibling Components**

* `EventCard` - similar card pattern for events
* `UpdateCard` - similar card pattern for status updates
* `SpaceCard` - card for space listings

### **Child Components**

* `Avatar`
* `Icon`
* `InlineModerationControls`

### **Typical Usage Locations**

* Discussion listing pages
* Space detail pages (discussions tab)
* Home feed
* Search results

## **21. Open Questions / Notes**

* Bookmark functionality is UI-only - needs backend integration
* Consider whether `spaceName` display should be configurable via prop
* Broadcast template storage in localStorage could be improved with context/state management

## **22. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
| -------- | -------- | ------------- | ----- |
| `Default` | Standard discussion card | Full discussion object | Shows all elements |
| `WithoutExcerpt` | No excerpt text | `excerpt: undefined` | Verify layout without preview |
| `WithoutSpace` | No space badge | `space: undefined` | Verify header layout |
| `LongTitle` | Title truncation | 200+ char title | Verify CSS handling |
| `AdminView` | Admin user view | Mock `useIsAdmin` → true | Verify dropdown appears |
| `Bookmarked` | Bookmarked state | Set `isBookmarked` true | Verify icon/aria state |
| `ZeroEngagement` | No likes or comments | `likesCount: 0, commentsCount: 0` | Verify "0" display |
| `MinimalAuthor` | Fallback author name | `author: {}` | Shows "Unknown" |

### **Controls (Args) Required**

* `discussion.title` (string) - controllable
* `discussion.excerpt` (string) - controllable
* `discussion.likesCount` (number) - controllable
* `discussion.commentsCount` (number) - controllable
* `spaceId` (string) - controllable

### **Mocking Requirements**

* `useIsAdmin` - mock to return `true` or `false`
* `useToast` - mock `showToast` function with action logging
* `useRouter` - mock `push` function with action logging
* `localStorage` - mock or stub for broadcast tests

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Verify no critical violations in Default + AdminView states
* Keyboard navigation test on admin dropdown

### **Interaction Tests**

* Bookmark toggle: click → verify aria-label change → verify toast action
* Admin menu open: click trigger → verify menu renders → keyboard navigate
* Broadcast action: select item → verify localStorage write → verify navigation
