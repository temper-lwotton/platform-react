# **Component Specification: NewestMembers**

## **1. Component Name**

**`NewestMembers`**

## **2. Description**

A sidebar widget displaying the most recently joined members.

* Shows avatar with photo or initials fallback
* Displays name, job title, and join date
* Links to user profiles
* Shows relative time since joining

## **3. Location**

```
src/components/ui/NewestMembers/NewestMembers.tsx
```

## **4. Component Type**

**UI** – Stateless presentational component receiving user data via props.

## **5. Props Interface**

```typescript
interface NewestMembersProps {
  users: User[];
  isLoading?: boolean;
}
```

## **6. Props**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `users` | `User[]` | Yes | - | Array of recently joined users |
| `isLoading` | `boolean` | No | `false` | Show loading state |

## **7. Data Requirements**

### **User Type**

```typescript
// From @/lib/users
interface User {
  id: string;
  email: string;
  createdAt: string; // ISO date
  profile: {
    firstName?: string;
    lastName?: string;
    fullName?: string;
    photo?: string;
    jobTitle?: string;
  };
}
```

## **8. Internal State**

*None – stateless component.*

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
|-------------------|-------------|-------|
| `isLoading === true` | Loading message | "Loading members..." |
| `users.length === 0` | Empty state | "No new members yet" |
| `users.length > 0` | Member list | Vertical list |
| User has photo | Photo avatar | Image displayed |
| User no photo | Initials avatar | Generated fallback |
| Joined today | "Joined today" | Day 0 |
| Joined yesterday | "Joined yesterday" | Day 1 |
| Joined < 7 days | "Joined X days ago" | Days 2-6 |
| Joined >= 7 days | "Joined [date]" | Formatted date |

## **10. Dependencies**

### **Child Components**

* `Avatar` – User avatar with fallback

### **External Libraries**

* `next/link` – Profile links

## **11. Events & Callbacks**

*No external callbacks – navigation handled by Next.js Link.*

## **12. Styling**

* **Approach**: CSS Modules with SCSS
* **File**: `NewestMembers.module.scss`

### **CSS Classes**

* `.panel` – Main container
* `.title` – "Newest Members" heading
* `.memberList` – Container for member items
* `.memberItem` – Individual member row
* `.avatar` – Avatar container
* `.memberInfo` – Name and job title
* `.memberName` – User's name
* `.jobTitle` – User's job title
* `.joinDate` – Relative join date

### **Layout**

* Title header
* Vertical list of member items
* Avatar + info per item

## **13. Accessibility Requirements**

* **Keyboard**: All profile links focusable via Tab
* **ARIA**: List items properly structured
* **Screen Reader**: Announce member names and info

### **Improvements Needed**

* Add `aria-label` for member list region
* Add role for list structure

## **14. Error Handling**

| Error Condition | Behaviour | Fallback |
|-----------------|-----------|----------|
| Empty users array | Empty state | "No new members yet" |
| Missing user name | Email fallback | Use email as name |
| Invalid date | Skip formatting | Show raw date |
| Avatar load error | Initials fallback | Automatic |

## **15. Performance & Lifecycle Notes**

### **Helper Functions**

```typescript
const getInitials = (name: string): string => {
  return name
    .split(' ')
    .filter(Boolean)
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};
```

### **Join Date Calculation**

```typescript
const joinDate = new Date(user.createdAt);
const daysAgo = Math.floor(
  (Date.now() - joinDate.getTime()) / (1000 * 60 * 60 * 24)
);

// Display logic
daysAgo === 0 ? 'Joined today' :
daysAgo === 1 ? 'Joined yesterday' :
daysAgo < 7 ? `Joined ${daysAgo} days ago` :
`Joined ${joinDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
```

## **16. Usage Examples**

### **In Sidebar**

```tsx
import { NewestMembers } from '@/components/ui/NewestMembers';

<NewestMembers
  users={newestUsers}
  isLoading={isLoadingUsers}
/>
```

### **With Query**

```tsx
const { data: users, isLoading } = useQuery({
  queryKey: ['newest-members'],
  queryFn: () => getNewestMembers({ limit: 5 }),
});

<NewestMembers users={users || []} isLoading={isLoading} />
```

## **17. Features Summary**

### **Title**

* "Newest Members" heading

### **Member Display**

| Element | Content |
|---------|---------|
| Avatar | Photo or initials |
| Name | Full name or email |
| Job title | Optional display |
| Join date | Relative time |

### **Interactions**

* Click member → navigate to `/users/[id]`

## **18. Testing Considerations**

### **Unit Tests**

* Renders loading state
* Renders empty state
* Renders member list
* Shows correct avatars
* Join date formatting
* Links to correct profiles

### **Mocking**

* User data with various profiles
* Date calculations

### **Edge Cases**

* Very long names
* Missing profile fields
* Future join dates
* Many members (scroll)

## **19. Out of Scope / Non-Goals**

* **Filtering by date range**: Not supported
* **Sorting options**: Not here
* **Follow actions**: Not inline
* **Pagination**: Fixed limit

## **20. Related Components & System Context**

### **Siblings**

* `TopContributors`
* `UnansweredDiscussions`

### **Child Components**

* `Avatar`

### **Used By**

* `HomeSidebar`
* Space sidebar layouts

## **21. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
|----------|----------|---------------|-------|
| `Default` | With users | 5 members | Normal state |
| `Loading` | Loading state | isLoading: true | Loading message |
| `Empty` | No members | [] | Empty message |
| `SingleMember` | One member | 1 member | Minimal list |
| `NoPhotos` | Initials only | No photos | Fallback avatars |

### **Controls (Args) Required**

* `users` (object[]) – member data
* `isLoading` (boolean) – loading state

### **Mocking Requirements**

* **User data**: Various profile completeness levels

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Verify list accessible
* Check link accessibility
* Verify avatar fallbacks

### **Interaction Tests**

* Click member link
* Verify profile navigation
