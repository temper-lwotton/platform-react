# **Component Specification: TopContributors**

## **1. Component Name**

**`TopContributors`**

## **2. Description**

A sidebar panel displaying the top contributors based on discussion count.

* Shows ranked list with position badges
* Displays avatars, names, and contribution counts
* Links to user profiles
* Calculates rankings from discussion data

## **3. Location**

```
src/components/ui/TopContributors/TopContributors.tsx
```

## **4. Component Type**

**UI** – Stateless component with derived state (contributor ranking computed from props).

## **5. Props Interface**

```typescript
interface TopContributorsProps {
  discussions: Discussion[];
}
```

## **6. Props**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `discussions` | `Discussion[]` | Yes | - | Discussions to calculate contributors from |

## **7. Data Requirements**

### **Discussion Type**

```typescript
// From @/lib/discussions
interface Discussion {
  id: string;
  author: {
    id: string;
    profile?: {
      fullName?: string;
      firstName?: string;
      lastName?: string;
      photo?: string;
    };
  };
  // ... other fields
}
```

### **Derived Contributor Type**

```typescript
interface Contributor {
  id: string;
  name: string;
  photo?: string;
  discussionCount: number;
}
```

## **8. Internal State**

*None – contributors calculated from props via useMemo.*

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
|-------------------|-------------|-------|
| `discussions.length === 0` | Empty state | "No contributors yet" |
| Has discussions | Ranked list | Top 10 contributors |
| Rank #1 | Gold badge | #1 indicator |
| Rank #2 | Silver badge | #2 indicator |
| Rank #3 | Bronze badge | #3 indicator |
| Rank > 3 | Number badge | #4, #5, etc. |
| Single discussion | "1 discussion" | Singular |
| Multiple discussions | "X discussions" | Plural |

## **10. Dependencies**

### **Child Components**

* `Avatar` – User avatar with fallback
* `Badge` – Rank indicator

### **External Libraries**

* `next/link` – Profile links

## **11. Events & Callbacks**

*No external callbacks – navigation handled by Next.js Link.*

## **12. Styling**

* **Approach**: CSS Modules with SCSS
* **File**: `TopContributors.module.scss`

### **CSS Classes**

* `.panel` – Main container
* `.title` – "Top Contributors" heading
* `.contributorList` – Container for items
* `.contributorItem` – Individual contributor row
* `.rank` – Rank badge
* `.rank--gold` – #1 styling
* `.rank--silver` – #2 styling
* `.rank--bronze` – #3 styling
* `.avatar` – Avatar container
* `.contributorInfo` – Name and count
* `.count` – Discussion count

### **Layout**

* Title header
* Ranked vertical list
* Rank badge + avatar + info per item

## **13. Accessibility Requirements**

* **Keyboard**: All profile links focusable via Tab
* **ARIA**: List with proper structure
* **Screen Reader**: Announce rank, name, and count

### **Improvements Needed**

* Add `aria-label` for rank badges
* Add list role with ordered semantics

## **14. Error Handling**

| Error Condition | Behaviour | Fallback |
|-----------------|-----------|----------|
| Empty discussions | Empty state | "No contributors yet" |
| Missing author name | Email fallback | Use ID as key |
| Missing profile | Default avatar | Initials fallback |

## **15. Performance & Lifecycle Notes**

### **Contributor Calculation**

```typescript
// Build contributor map from discussions
const contributorMap = new Map<string, Contributor>();

discussions.forEach(discussion => {
  const authorId = discussion.author.id;
  const authorName = discussion.author.profile?.fullName ||
    `${discussion.author.profile?.firstName || ''} ${discussion.author.profile?.lastName || ''}`.trim();

  if (contributorMap.has(authorId)) {
    contributorMap.get(authorId)!.discussionCount++;
  } else {
    contributorMap.set(authorId, {
      id: authorId,
      name: authorName,
      photo: discussion.author.profile?.photo,
      discussionCount: 1,
    });
  }
});

// Sort and take top 10
const topContributors = Array.from(contributorMap.values())
  .sort((a, b) => b.discussionCount - a.discussionCount)
  .slice(0, 10);
```

### **Helper Functions**

```typescript
const getInitials = (name: string) => {
  return name
    .split(' ')
    .filter(Boolean)
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};
```

### **Memoization**

* `topContributors` memoized with `useMemo` for performance

## **16. Usage Examples**

### **In Space Sidebar**

```tsx
import { TopContributors } from '@/components/ui/TopContributors';

<TopContributors discussions={spaceDiscussions} />
```

### **With Query Data**

```tsx
const { data: discussions } = useQuery({
  queryKey: ['discussions', spaceId],
  queryFn: () => getDiscussions(spaceId),
});

<TopContributors discussions={discussions || []} />
```

## **17. Features Summary**

### **Title**

* "Top Contributors" heading

### **Ranking Display**

| Rank | Badge Style | Notes |
|------|-------------|-------|
| #1 | Gold | Top contributor |
| #2 | Silver | Second place |
| #3 | Bronze | Third place |
| #4-10 | Numbered | Standard ranking |

### **Contributor Display**

| Element | Content |
|---------|---------|
| Badge | Rank number with styling |
| Avatar | Photo or initials |
| Name | Contributor name |
| Count | "X discussion(s)" |

### **Interactions**

* Click contributor → navigate to `/users/[id]`

## **18. Testing Considerations**

### **Unit Tests**

* Renders empty state correctly
* Calculates rankings correctly
* Limits to top 10
* Handles ties (same count)
* Displays correct badges
* Links to correct profiles

### **Mocking**

* Discussion arrays with various authors
* Authors with incomplete profiles

### **Edge Cases**

* All same author (one contributor)
* Exactly 10 contributors
* More than 10 contributors
* Single discussion

## **19. Out of Scope / Non-Goals**

* **Time-based filtering**: Not supported
* **Multiple ranking criteria**: Count only
* **Follow actions**: Not inline
* **Pagination**: Fixed top 10

## **20. Related Components & System Context**

### **Siblings**

* `NewestMembers`
* `UnansweredDiscussions`

### **Child Components**

* `Avatar`
* `Badge`

### **Used By**

* Space discussions sidebar
* Community dashboards

## **21. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
|----------|----------|---------------|-------|
| `Default` | Multiple contributors | 10+ discussions | Full ranking |
| `Empty` | No discussions | [] | Empty message |
| `SingleContributor` | One author | Multiple by same | Shows #1 only |
| `TopThree` | Three contributors | 3 unique authors | Gold, silver, bronze |

### **Controls (Args) Required**

* `discussions` (object[]) – discussion data

### **Mocking Requirements**

* **Discussion data**: Various author combinations

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Verify ranked list accessible
* Check badge semantics
* Verify link accessibility

### **Interaction Tests**

* Click contributor link
* Verify ranking order
