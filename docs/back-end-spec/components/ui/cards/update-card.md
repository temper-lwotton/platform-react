# **Component Specification: UpdateCard**

## **1. Component Name**

**`UpdateCard`**

## **2. Description**

A card component for displaying organisational updates/announcements. Shows priority level, category, expiration warnings, author info, and engagement stats. Supports pinned updates and various priority levels.

* Displays updates with priority and category indicators
* Shows expiration warnings for time-sensitive content
* Provides visual hierarchy through priority colour coding

## **3. Location**

```
src/components/ui/UpdateCard/UpdateCard.tsx
```

## **4. Component Type**

* UI

## **5. Props Interface**

```ts
interface UpdateCardProps {
  update: Update;
}
```

## **6. Props**

| Prop | Type | Required | Default | Description |
| ---- | ---- | -------- | ------- | ----------- |
| `update` | `Update` | Yes | - | Update data object |

## **7. Data Requirements**

### **External Data Sources**

* **Props**: `update` object

```ts
// From @/lib/updates
interface Update {
  id: number | string;
  title: string;
  excerpt?: string;
  htmlContent: string;
  priority: 'urgent' | 'high' | 'normal' | 'low';
  category: 'news' | 'milestone' | 'policy' | 'announcement';
  isPinned: boolean;
  expiresAt?: string;
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  author: {
    fullName: string;
    profile?: {
      photo?: string;
    };
  };
  space: {
    title: string;
  };
}
```

### **Derived Values**

| Value | Derivation |
| ----- | ---------- |
| `formattedDate` | Relative time from `createdAt` |
| `priorityVariant` | Badge variant from priority (danger/warning/primary/default) |
| `categoryIcon` | Icon name from category (bell/star/fileText/rocket) |
| `excerpt` | From `excerpt` prop or extracted from `htmlContent` (max 200 chars) |
| `isNearExpiry` | True if `expiresAt` is within 7 days |
| `expiryText` | "today", "tomorrow", or "in X days" |

## **8. Internal State**

None - stateless component.

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
| ----------------- | ----------- | ----- |
| `priority === 'urgent'` | Danger (red) badge | |
| `priority === 'high'` | Warning (orange) badge | |
| `priority === 'normal'` | Primary (blue) badge | |
| `priority === 'low'` | Default (grey) badge | |
| `category === 'news'` | Bell icon | |
| `category === 'milestone'` | Star icon | |
| `category === 'policy'` | fileText icon | |
| `category === 'announcement'` | Rocket icon | |
| `update.isPinned === true` | "Pinned" badge with pin icon | Warning variant |
| `isNearExpiry === true` | Expiry warning notice | Clock icon + text |
| `update.excerpt` exists | Use provided excerpt | |
| `update.excerpt` missing | Extract from `htmlContent` | Max 200 chars, stripped HTML |

## **10. Dependencies**

### **Child Components**

* `Avatar` - Author avatar (from primitives)
* `Badge` - Priority, category, pinned status (from primitives)
* `Icon` - Category icons, engagement icons, clock

### **External Libraries**

* `next/link` - Card navigation

## **11. Events & Callbacks**

None - card is a link component, navigation handled by Next.js Link.

## **12. Styling**

* **Styling approach**: CSS Modules with SCSS
* **File(s)**:
  * `UpdateCard.module.scss`

### **Visual States**

* **Default**: Card with badges and content
* **Pinned**: Additional pinned badge
* **Near expiry**: Warning notice visible
* **Hover**: Card hover effect

### **Key Style Classes**

| Class | Purpose |
| ----- | ------- |
| `.link` | Card link wrapper |
| `.card` | Article container |
| `.badges` | Priority, category, pinned badges row |
| `.expiryNotice` | Expiration warning |
| `.header` | Title section |
| `.title` | Update title (h3) |
| `.excerpt` | Preview text |
| `.meta` | Author info section |
| `.authorInfo` | Name and details |
| `.author` | Author name text |
| `.metaDetails` | Space and date |
| `.space` | Space name |
| `.separator` | Bullet separator |
| `.date` | Relative date |
| `.footer` | Engagement stats |
| `.stat` | Like/comment count |

## **13. Accessibility Requirements**

* **Card is link**: Entire card navigates to update page
* **Avatar alt text**: Uses author's full name
* **Badges**: Visual indicators with text labels

### **Improvements Needed**

* Priority badge could use `aria-label` for screen readers
* Expiry notice could use `role="alert"`

## **14. Error Handling**

| Condition | Behaviour |
| --------- | --------- |
| Missing `excerpt` | Extracts from `htmlContent` |
| Missing `author.profile.photo` | Shows initial fallback |
| Missing `expiresAt` | Expiry notice not shown |
| `htmlContent` is empty | Empty excerpt |

**Not handled by this component:**
* Invalid dates
* Missing required fields

## **15. Performance & Lifecycle Notes**

* **Stateless**: No internal state, pure render
* **No side effects**: No data fetching or subscriptions
* **HTML stripping**: Done on each render (could memoize)

## **16. Usage Examples**

```tsx
import { UpdateCard } from '@/components/ui/UpdateCard';

// Single card
<UpdateCard update={update} />

// In a list
{updates.map((update) => (
  <UpdateCard key={update.id} update={update} />
))}
```

## **17. Features Summary**

* Priority badge with colour coding:
  * Urgent (danger/red)
  * High (warning/orange)
  * Normal (primary/blue)
  * Low (default/grey)
* Category badge with icon:
  * News (bell)
  * Milestone (star)
  * Policy (fileText)
  * Announcement (rocket)
* Pinned indicator badge
* Expiry warning for items expiring within 7 days
* Title and excerpt (auto-generated from HTML if not provided)
* Author info with avatar
* Space name
* Relative date formatting
* Like and comment counts
* Full card is clickable link to `/updates/{id}`

## **18. Testing Considerations**

### **Unit Tests**

* Renders correct priority badge variant
* Shows correct category icon
* Displays pinned badge when `isPinned`
* Shows expiry warning when within 7 days
* Extracts excerpt from HTML content
* Formats date correctly
* Links to correct update URL

### **Mocking Required**

* None - pure prop-driven component

### **Edge Cases**

* Very long title/excerpt
* No expiry date
* Expired content (past expiry)
* All priority levels
* All category types

## **19. Out of Scope / Non-Goals**

* **Update editing** - handled elsewhere
* **Like/comment actions** - display only
* **Archiving** - handled elsewhere
* **Rich content preview** - only shows text excerpt

## **20. Related Components & System Context**

### **Sibling Components**

* `DiscussionCard` - similar pattern
* `EventCard` - similar pattern
* `SpaceCard` - similar pattern

### **Child Components**

* `Avatar` (primitives)
* `Badge` (primitives)
* `Icon`

### **Typical Usage Locations**

* Updates listing page
* Home feed
* Dashboard
* Space updates section

## **21. Open Questions / Notes**

* Consider showing full HTML content preview with sanitization
* May want to add "expired" state styling
* Could add read/unread indicator

## **22. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
| -------- | -------- | ------------- | ----- |
| `Default` | Normal priority | Standard update | Default state |
| `Urgent` | Urgent priority | `priority: 'urgent'` | Red badge |
| `High` | High priority | `priority: 'high'` | Orange badge |
| `Low` | Low priority | `priority: 'low'` | Grey badge |
| `Pinned` | Pinned update | `isPinned: true` | Pinned badge |
| `Expiring` | Near expiry | `expiresAt` within 7 days | Expiry warning |
| `NewsCategory` | News category | `category: 'news'` | Bell icon |
| `MilestoneCategory` | Milestone | `category: 'milestone'` | Star icon |

### **Controls (Args) Required**

* `update.priority` - select
* `update.category` - select
* `update.isPinned` - boolean
* `update.expiresAt` - date input

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Verify badge meanings are clear
* Verify link accessibility

### **Interaction Tests**

* Click card → verify navigation to update page
