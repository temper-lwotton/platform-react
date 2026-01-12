# **Component Specification: SpaceCard**

## **1. Component Name**

**`SpaceCard`**

## **2. Description**

A card component for displaying space/community information. Shows the space title, description, visibility badge, and member avatars with count. Entire card is clickable and links to the space detail page.

* Displays space metadata in a compact card format
* Shows public/private visibility status
* Displays member avatars with count

## **3. Location**

```
src/components/ui/SpaceCard/SpaceCard.tsx
```

## **4. Component Type**

* UI

## **5. Props Interface**

```ts
interface SpaceCardProps {
  space: Space;
}
```

## **6. Props**

| Prop | Type | Required | Default | Description |
| ---- | ---- | -------- | ------- | ----------- |
| `space` | `Space` | Yes | - | Space data object |

## **7. Data Requirements**

### **External Data Sources**

* **Props**: `space` object

```ts
// From @/lib/spaces
interface Space {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  isPublic: boolean;
  admins: SpaceUser[];
  members: SpaceUser[];
}

interface SpaceUser {
  id: string;
  email?: string;
  profile?: {
    fullName?: string;
    firstName?: string;
    lastName?: string;
    photo?: string;
  };
}
```

### **Derived Values**

| Value | Derivation |
| ----- | ---------- |
| `allMembers` | Deduplicated union of `admins` and `members` by ID |
| `memberCount` | Length of `allMembers` |
| `displayMembers` | First 5 members for avatar display |

## **8. Internal State**

None - stateless component.

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
| ----------------- | ----------- | ----- |
| `space.subtitle` exists | Subtitle below title | |
| `space.description` exists | Description paragraph | |
| `space.isPublic === true` | "Public" badge (outline) | |
| `space.isPublic === false` | "Private" badge (default) | |
| `displayMembers.length > 0` | Member avatar stack (max 5) | |
| `memberCount > 5` | Shows count without +N (just total) | |

## **10. Dependencies**

### **Child Components**

* `Avatar` - Space icon and member avatars (from primitives)
* `Badge` - Public/Private visibility (from primitives)

### **External Libraries**

* `next/link` - Card navigation

## **11. Events & Callbacks**

None - card is a link component, navigation handled by Next.js Link.

## **12. Styling**

* **Styling approach**: CSS Modules with SCSS
* **File(s)**:
  * `SpaceCard.module.scss`

### **Visual States**

* **Default**: Card with avatar, title, footer
* **Hover**: Card hover effect

### **Key Style Classes**

| Class | Purpose |
| ----- | ------- |
| `.card` | Base card container (link wrapper) |
| `.content` | Inner article wrapper |
| `.header` | Avatar and title group |
| `.icon` | Space avatar |
| `.titleGroup` | Title and subtitle |
| `.title` | Space title (h3) |
| `.subtitle` | Optional subtitle |
| `.description` | Space description text |
| `.footer` | Badge and members section |
| `.membersSection` | Avatars and count |
| `.avatars` | Member avatar stack |
| `.memberAvatar` | Individual member avatar |
| `.membersCount` | Member count text |

## **13. Accessibility Requirements**

* **Card is link**: Entire card navigates to space page
* **Visibility badge**: Has `role="status"` and `aria-label` describing visibility
* **Member avatars**: Container has `aria-label` with member count
* **Avatar alt text**: Uses full name, email, or "Member" fallback

### **Improvements Needed**

* Card link could have `aria-label` describing space name

## **14. Error Handling**

| Condition | Behaviour |
| --------- | --------- |
| Missing subtitle | Subtitle not rendered |
| Missing description | Description not rendered |
| Duplicate members in admins/members | Deduplicated by ID |
| Missing member profile | Uses email or "?" for initials |
| Missing member photo | Shows initials fallback |

**Not handled by this component:**
* Invalid space data structure

## **15. Performance & Lifecycle Notes**

* **Stateless**: No internal state, pure render
* **Deduplication**: Members deduplicated on each render (could memoize)
* **No side effects**: No data fetching or subscriptions

## **16. Usage Examples**

```tsx
import { SpaceCard } from '@/components/ui/SpaceCard';

// Single card
<SpaceCard space={space} />

// In a grid
<div className={styles.grid}>
  {spaces.map((space) => (
    <SpaceCard key={space.id} space={space} />
  ))}
</div>
```

## **17. Features Summary**

* Space avatar with first letter fallback
* Title and optional subtitle
* Description text
* Public/Private badge with proper ARIA label
* Member avatars (up to 5)
* Member count display
* Clickable card linking to `/spaces/{id}`
* Deduplicates members from admins + members lists

## **18. Testing Considerations**

### **Unit Tests**

* Renders title and subtitle
* Shows description when provided
* Displays correct visibility badge
* Deduplicates members correctly
* Shows max 5 member avatars
* Displays correct member count
* Links to correct space URL

### **Mocking Required**

* None - pure prop-driven component

### **Edge Cases**

* Very long title/description
* Many duplicate members
* No members
* Missing profile data

## **19. Out of Scope / Non-Goals**

* **Join/leave functionality** - handled on space page
* **Space editing** - handled elsewhere
* **Content preview** - not shown on card
* **Notification badges** - not implemented

## **20. Related Components & System Context**

### **Sibling Components**

* `DiscussionCard` - similar pattern
* `EventCard` - similar pattern
* `UserCard` - similar pattern

### **Child Components**

* `Avatar` (primitives)
* `Badge` (primitives)

### **Typical Usage Locations**

* Spaces listing page
* Home page
* User profile (spaces section)
* Search results

## **21. Open Questions / Notes**

* Consider showing recent activity indicator
* May want to add member join request count for admins

## **22. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
| -------- | -------- | ------------- | ----- |
| `Default` | Public space | Full space data | Default state |
| `Private` | Private space | `isPublic: false` | Private badge |
| `WithSubtitle` | Has subtitle | Subtitle provided | Shows subtitle |
| `NoDescription` | No description | `description: undefined` | Minimal card |
| `ManyMembers` | Many members | 10+ members | Max 5 avatars |
| `NoMembers` | No members | Empty arrays | No avatars |

### **Controls (Args) Required**

* `space.isPublic` - boolean toggle
* `space.title` - text input
* `space.description` - text input

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Verify badge ARIA labels
* Verify avatar alt text

### **Interaction Tests**

* Click card → verify navigation to space page
