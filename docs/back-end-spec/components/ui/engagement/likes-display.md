# **Component Specification: LikesDisplay**

## **1. Component Name**

**`LikesDisplay`**

## **2. Description**

A component for displaying and managing likes on content with interactive features.

* Shows a like button with filled/unfilled heart state
* Displays like count with tooltip showing liker names
* Opens modal to view all likers with avatars
* Used on discussions, posts, and other likeable content

## **3. Location**

```
src/components/ui/LikesDisplay/LikesDisplay.tsx
```

## **4. Component Type**

**Feature** – Manages modal state and provides like interaction.

## **5. Props Interface**

```typescript
interface LikesDisplayProps {
  likesCount: number;
  isLiked: boolean;
  likedBy: DiscussionUser[];
  onLikeToggle: () => void;
}
```

## **6. Props**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `likesCount` | `number` | Yes | - | Total number of likes |
| `isLiked` | `boolean` | Yes | - | Whether current user has liked |
| `likedBy` | `DiscussionUser[]` | Yes | - | Array of users who liked |
| `onLikeToggle` | `() => void` | Yes | - | Callback to toggle like state |

## **7. Data Requirements**

### **External Data Sources**

* Like data passed via props from parent component

### **DiscussionUser Type**

```typescript
// From @/lib/discussions
interface DiscussionUser {
  id: string;
  name?: string;
  photo?: string;
}
```

## **8. Internal State**

| State Variable | Type | Purpose |
|----------------|------|---------|
| `isModalOpen` | `boolean` | Controls likers modal visibility |

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
|-------------------|-------------|-------|
| `isLiked === false` | Unfilled heart button | Default state |
| `isLiked === true` | Filled/coloured heart button | `.liked` class applied |
| `likesCount === 0` | Static "0 likes" text | No tooltip or modal |
| `likesCount > 0` | Clickable count with tooltip | Opens modal on click |
| 1 liker | Tooltip: "John Doe" | Single name |
| 2 likers | Tooltip: "John and Jane" | Both names |
| 3+ likers | Tooltip: "John and 2 others" | First name + count |
| Modal open | List of likers with avatars | Full liker list |

## **10. Dependencies**

### **Child Components**

* `Icon` – Heart icon
* `Avatar` – Liker avatars in modal
* `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle` – Likers modal

### **Radix UI**

* `@radix-ui/react-tooltip` – Tooltip on count hover

### **React**

* `useState` – Modal visibility state

## **11. Events & Callbacks**

| Event / Callback | Trigger | Description |
|------------------|---------|-------------|
| `onLikeToggle` | Click like button | Toggles like state (parent handles) |
| `setIsModalOpen(true)` | Click count button | Opens likers modal |
| `setIsModalOpen(false)` | Close modal | Closes likers modal |

## **12. Styling**

* **Approach**: CSS Modules with SCSS
* **File**: `LikesDisplay.module.scss`

### **Visual States**

* **Like Button Default**: Unfilled heart
* **Like Button Liked**: Filled/coloured heart (`.liked` class)
* **Count Button**: Text button for count display
* **Tooltip**: Styled tooltip with arrow
* **Modal**: Scrollable list of likers

## **13. Accessibility Requirements**

* **Keyboard**: Like button and count button focusable
* **ARIA**: `aria-label` on like button ("Like" / "Unlike")
* **Focus**: Modal manages focus when opened
* **Screen Reader**: Count announced with tooltip content

### **Improvements Needed**

* Add `aria-pressed` to like button for toggle state
* Announce like count changes to screen readers
* Ensure tooltip content is accessible

## **14. Error Handling**

| Error Condition | Behaviour | Fallback |
|-----------------|-----------|----------|
| Empty `likedBy` array | Tooltip returns empty string | Modal shows "No likes yet" |
| Missing liker name | Falls back to "Unknown" | `getLikerName` helper |
| Missing liker photo | Avatar shows initials | Initials from name |

## **15. Performance & Lifecycle Notes**

* **Tooltip Delay**: 300ms delay before showing tooltip
* **Modal Lazy**: Dialog content only mounts when open
* **Re-renders**: Minimal re-renders via controlled props

## **16. Usage Examples**

### **Basic Usage**

```tsx
import { LikesDisplay } from '@/components/ui/LikesDisplay';

<LikesDisplay
  likesCount={42}
  isLiked={true}
  likedBy={likers}
  onLikeToggle={() => handleLikeToggle(postId)}
/>
```

### **In Discussion Footer**

```tsx
<footer className={styles.discussionFooter}>
  <LikesDisplay
    likesCount={discussion.likesCount}
    isLiked={discussion.isLikedByUser}
    likedBy={discussion.likedBy}
    onLikeToggle={() => toggleLike(discussion.id)}
  />
  <CommentsCount count={discussion.commentsCount} />
</footer>
```

## **17. Features Summary**

* Like button with heart icon
* Filled/coloured state when liked
* Likes count display
* Tooltip showing first liker(s) preview
* Modal for viewing all likers
* Liker avatars with initials fallback
* Accessible button labels

## **18. Testing Considerations**

### **Unit Tests**

* Like button triggers `onLikeToggle`
* Liked state applies correct class
* Count displays correctly (singular/plural)
* Tooltip text generates correctly for 1, 2, 3+ likers
* Modal opens on count click
* Modal displays all likers

### **Mocking**

* `onLikeToggle` callback
* Radix Tooltip (portal)
* Dialog component

### **Edge Cases**

* Zero likes
* Single like
* Exactly two likes
* Many likes (100+)
* Missing liker names
* Missing liker photos

## **19. Out of Scope / Non-Goals**

* **Like Animation**: No heart burst animation
* **Optimistic Updates**: Parent handles optimistic UI
* **Like Undo**: No undo functionality
* **Pagination**: Modal shows all likers (no pagination)
* **User Profiles**: No click-through to liker profiles

## **20. Related Components & System Context**

### **Related Components**

* `SuggestedCarousel` – Sibling engagement component
* `Avatar` – Used for liker display
* `Dialog` – Used for likers modal
* `Icon` – Used for heart icon

### **Used By**

* Discussion detail page
* Post detail page
* Comment sections

### **Typical Usage Location**

* Content footers alongside comments/shares

## **21. Open Questions / Notes**

* Consider adding like animation
* May want pagination for content with many likes
* Could add click-through to liker profiles
* Consider optimistic update pattern documentation

## **22. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
|----------|----------|---------------|-------|
| `Default` | Standard with multiple likes | `likesCount: 5, isLiked: false` | Base state |
| `Liked` | User has liked | `isLiked: true` | Filled heart |
| `ZeroLikes` | No likes yet | `likesCount: 0, likedBy: []` | Static text |
| `SingleLike` | One liker | `likesCount: 1` | "1 like" singular |
| `TwoLikers` | Two likers | `likesCount: 2` | Tooltip with both names |
| `ManyLikes` | Many likers | `likesCount: 50` | "and X others" tooltip |
| `ModalOpen` | Likers modal visible | Force modal open | Full list view |

### **Controls (Args) Required**

* `likesCount` (number) – controllable
* `isLiked` (boolean) – controllable
* `likedBy` (DiscussionUser[]) – array control

### **Mocking Requirements**

* **onLikeToggle**: Action logger
* **User data**: Realistic DiscussionUser objects
* **Portal container**: For tooltip and dialog

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Verify like button has accessible name
* Check tooltip is keyboard accessible
* Verify modal focus management

### **Interaction Tests**

* Click like button triggers callback
* Hover count shows tooltip
* Click count opens modal
* Close modal returns focus
