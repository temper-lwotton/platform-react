# **Component Specification: UnansweredDiscussions**

## **1. Component Name**

**`UnansweredDiscussions`**

## **2. Description**

A sidebar panel showing discussions with no replies.

* Encourages engagement by highlighting unanswered topics
* Displays title, excerpt, and time posted
* Shows "No replies yet" badge
* Links directly to discussions

## **3. Location**

```
src/components/ui/UnansweredDiscussions/UnansweredDiscussions.tsx
```

## **4. Component Type**

**UI** – Stateless component with derived state (filtering computed from props).

## **5. Props Interface**

```typescript
interface UnansweredDiscussionsProps {
  discussions: Discussion[];
  spaceId: string;
}
```

## **6. Props**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `discussions` | `Discussion[]` | Yes | - | All discussions to filter |
| `spaceId` | `string` | Yes | - | Space ID for building links |

## **7. Data Requirements**

### **Discussion Type**

```typescript
// From @/lib/discussions
interface Discussion {
  id: string;
  title: string;
  excerpt?: string;
  createdAt: string; // ISO date
  commentsCount?: number;
}
```

## **8. Internal State**

*None – filtered list computed from props.*

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
|-------------------|-------------|-------|
| All discussions have replies | Positive empty state | Celebration message |
| Some unanswered | Discussion list | Up to 5 items |
| Discussion has excerpt | Excerpt shown | Truncated preview |
| No excerpt | Title only | Clean display |
| Posted just now | "just now" | < 60 seconds |
| Posted minutes ago | "Xm ago" | < 60 minutes |
| Posted hours ago | "Xh ago" | < 24 hours |
| Posted days ago | "Xd ago" | < 7 days |
| Posted >= 7 days | Full date | Formatted date |

## **10. Dependencies**

### **Child Components**

* `Badge` – "No replies yet" indicator

### **External Libraries**

* `next/link` – Discussion links

## **11. Events & Callbacks**

*No external callbacks – navigation handled by Next.js Link.*

## **12. Styling**

* **Approach**: CSS Modules with SCSS
* **File**: `UnansweredDiscussions.module.scss`

### **CSS Classes**

* `.panel` – Main container
* `.title` – "Unanswered Talks" heading
* `.description` – Encouragement text
* `.discussionList` – Container for items
* `.discussionItem` – Individual discussion
* `.discussionTitle` – Discussion title link
* `.excerpt` – Discussion excerpt
* `.meta` – Time and badge container
* `.timeAgo` – Relative time
* `.emptyMessage` – All answered message
* `.emptyHint` – Celebration hint

### **Layout**

* Title and description header
* Vertical list of discussions
* Badge per item

## **13. Accessibility Requirements**

* **Keyboard**: All discussion links focusable via Tab
* **ARIA**: List items properly structured
* **Screen Reader**: Announce discussion titles and status

### **Improvements Needed**

* Add `aria-label` for unanswered badge
* Add empty state announcement

## **14. Error Handling**

| Error Condition | Behaviour | Fallback |
|-----------------|-----------|----------|
| Empty discussions | Positive message | Celebration state |
| Invalid date | Skip time formatting | Show raw date |
| Missing title | Skip item | Don't render |

## **15. Performance & Lifecycle Notes**

### **Filtering Logic**

```typescript
// Filter discussions with no comments, take first 5
const unanswered = discussions
  .filter(discussion => (discussion.commentsCount || 0) === 0)
  .slice(0, 5);
```

### **Time Formatting**

```typescript
const getTimeAgo = (dateString: string): string => {
  const now = Date.now();
  const date = new Date(dateString).getTime();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return new Date(dateString).toLocaleDateString();
};
```

### **Memoization**

* `unanswered` list memoized with `useMemo`

## **16. Usage Examples**

### **In Space Sidebar**

```tsx
import { UnansweredDiscussions } from '@/components/ui/UnansweredDiscussions';

<UnansweredDiscussions
  discussions={allDiscussions}
  spaceId={currentSpaceId}
/>
```

### **With Query Data**

```tsx
const { data: discussions } = useQuery({
  queryKey: ['discussions', spaceId],
  queryFn: () => getDiscussions(spaceId),
});

<UnansweredDiscussions
  discussions={discussions || []}
  spaceId={spaceId}
/>
```

## **17. Features Summary**

### **Header**

* "Unanswered Talks" title
* "Be the first to join the conversation" description

### **Discussion Display**

| Element | Content |
|---------|---------|
| Title | Discussion title (linked) |
| Excerpt | Optional preview text |
| Time | Relative time posted |
| Badge | "No replies yet" |

### **Empty State**

```tsx
<div className={styles.content}>
  <p className={styles.emptyMessage}>
    All discussions have responses!
  </p>
  <p className={styles.emptyHint}>
    Great job keeping the conversation going!
  </p>
</div>
```

### **Interactions**

* Click discussion → navigate to `/spaces/[spaceId]/discussions/[id]`

## **18. Testing Considerations**

### **Unit Tests**

* Filters correctly by comment count
* Limits to 5 items
* Shows empty state when all answered
* Time formatting works correctly
* Links built with correct spaceId

### **Mocking**

* Discussion arrays with various comment counts
* Date calculations

### **Edge Cases**

* All discussions have replies
* Exactly 5 unanswered
* More than 5 unanswered
* Very old discussions
* Future dates

## **19. Out of Scope / Non-Goals**

* **Reply directly**: Not inline
* **Sorting options**: Chronological only
* **Category filtering**: Not supported
* **Pagination**: Fixed limit of 5

## **20. Related Components & System Context**

### **Siblings**

* `TopContributors`
* `NewestMembers`

### **Child Components**

* `Badge`

### **Used By**

* Space discussions sidebar
* Community engagement widgets

## **21. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
|----------|----------|---------------|-------|
| `Default` | Some unanswered | 3 unanswered | Normal state |
| `AllAnswered` | None unanswered | 0 unanswered | Celebration |
| `MaxItems` | Five unanswered | 5 items | Full list |
| `WithExcerpts` | Has excerpts | With excerpt text | Preview shown |
| `NoExcerpts` | No excerpts | Title only | Clean display |

### **Controls (Args) Required**

* `discussions` (object[]) – discussion data
* `spaceId` (string) – space identifier

### **Mocking Requirements**

* **Discussion data**: Various comment counts and dates

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Verify list accessible
* Check badge semantics
* Verify empty state announced

### **Interaction Tests**

* Click discussion link
* Verify correct URL
