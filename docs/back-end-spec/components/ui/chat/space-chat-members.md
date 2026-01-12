# **Component Specification: SpaceChatMembers**

## **1. Component Name**

**`SpaceChatMembers`**

## **2. Description**

A sidebar component that displays space members grouped by role and online status.

* Shows all space members with their avatars, names, and online/offline indicators
* Groups members into sections: Online Admins, Online Members, Offline Admins, Offline Members
* Provides quick navigation to user profiles
* Used alongside space chat to show who's available

## **3. Location**

```
src/components/ui/SpaceChatMembers/SpaceChatMembers.tsx
```

## **4. Component Type**

**UI** – Presentational component with no internal state (online status computed from external mock).

## **5. Props Interface**

```typescript
interface SpaceChatMembersProps {
  admins: SpaceUser[];
  members: SpaceUser[];
}
```

## **6. Props**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `admins` | `SpaceUser[]` | Yes | - | Array of space administrators |
| `members` | `SpaceUser[]` | Yes | - | Array of regular members |

## **7. Data Requirements**

### **External Data Sources**

* `SpaceUser` objects from space data (via props)
* Online status from `isOnline()` mock function (would be WebSocket in production)

### **SpaceUser Type**

```typescript
// From @/lib/spaces
interface SpaceUser {
  id: string;
  email: string;
  profile?: {
    fullName?: string;
    firstName?: string;
    lastName?: string;
    photo?: string;
  };
}
```

### **Online Status Function**

```typescript
// Mock function - would use WebSocket/presence service in production
function isOnline(userId: string): boolean {
  const onlineUsers = ['5', '12', '8'];
  return onlineUsers.includes(userId);
}
```

## **8. Internal State**

| State Variable | Type | Purpose |
|----------------|------|---------|
| - | - | No internal state – stateless component |

*Online status is derived from the `isOnline()` function, not stored in state.*

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
|-------------------|-------------|-------|
| Both arrays empty | Header with "0 Members (0 Online)" | No member sections |
| Only admins provided | Admin sections only | Online/Offline admins |
| Only members provided | Member sections only | Online/Offline members |
| Mixed admins and members | All four sections | Grouped by role then status |
| User has photo | Photo avatar displayed | Circular image |
| User has no photo | Initials avatar displayed | Generated from name |
| User is online | Green status indicator | `.statusOnline` class |
| User is offline | Grey status indicator | `.statusOffline` class |
| User is admin | "Admin" badge next to name | In MemberItem |

## **10. Dependencies**

### **Child Components**

* `Icon` – Users icon in header

### **Internal Sub-Components**

* `MemberItem` – Renders individual member with avatar, status, and name

### **Next.js**

* `next/link` – Profile navigation links

## **11. Events & Callbacks**

| Event / Callback | Trigger | Description |
|------------------|---------|-------------|
| Link navigation | Click member item | Navigates to `/users/{id}` profile page |

*No custom callbacks – uses standard Next.js Link navigation.*

## **12. Styling**

* **Approach**: CSS Modules with SCSS
* **File**: `SpaceChatMembers.module.scss`

### **Visual States**

* **Header**: Total count and online count display
* **Section Headers**: "Online Admins", "Online Members", etc.
* **Member Item Default**: Avatar, status dot, name
* **Member Item Hover**: Visual feedback for clickable area
* **Status Online**: Green indicator dot
* **Status Offline**: Grey indicator dot
* **Admin Badge**: Styled badge text

## **13. Accessibility Requirements**

* **Keyboard**: All member items focusable via Tab (Link components)
* **Focus**: Visible focus indicator on member items
* **Screen Reader**: Member names and roles announced; online status should be announced
* **Semantic**: Uses proper heading hierarchy for sections

### **Improvements Needed**

* Add `aria-label` to status indicators (e.g., "Online" / "Offline")
* Consider `role="list"` and `role="listitem"` for member sections
* Add skip link to bypass long member lists
* Announce section counts to screen readers

## **14. Error Handling**

| Error Condition | Behaviour | Fallback |
|-----------------|-----------|----------|
| Empty arrays | Shows "0 Members (0 Online)" | No sections rendered |
| Missing user profile | Falls back to email or "Unknown User" | Initials from fallback name |
| Missing user photo | Generates initials avatar | First letters of name |
| Invalid user ID | Link still renders | May 404 on click |

## **15. Performance & Lifecycle Notes**

* **Re-renders**: Component re-renders when `admins` or `members` arrays change
* **Online Status**: Currently computed on render via mock; real implementation would use presence subscription
* **Large Lists**: No virtualization; may need optimization for spaces with 100+ members

## **16. Usage Examples**

### **Basic Usage**

```tsx
import { SpaceChatMembers } from '@/components/ui/SpaceChatMembers';

<SpaceChatMembers
  admins={space.admins}
  members={space.members}
/>
```

### **In Space Chat Sidebar**

```tsx
<aside className={styles.sidebar}>
  <SpaceChatMembers
    admins={space.admins}
    members={space.members}
  />
</aside>
```

## **17. Features Summary**

* Header with total member count and online count
* Members grouped by role (Admin/Member) and status (Online/Offline)
* Avatar display with photo or initials fallback
* Online/offline status indicator dots
* Admin badge for administrator accounts
* Click-through to user profile pages

## **18. Testing Considerations**

### **Unit Tests**

* Renders correct member count in header
* Groups members by online/offline status correctly
* Displays admin badge for admin users only
* Shows initials when photo is missing
* Links navigate to correct profile URLs

### **Mocking**

* `isOnline()` function to control which users appear online
* `SpaceUser` objects with various profile completeness

### **Edge Cases**

* All members online
* All members offline
* No admins (only regular members)
* No regular members (only admins)
* Empty space (no members at all)
* User with no profile data

## **19. Out of Scope / Non-Goals**

* **Real-time presence**: Currently uses mock; WebSocket integration separate
* **Direct messaging**: No click-to-message functionality
* **User search/filter**: No filtering within the member list
* **Role management**: No admin/member promotion from this component
* **Member removal**: No remove/kick functionality

## **20. Related Components & System Context**

### **Related Components**

* `SpaceChatInput` – Companion input component for space chat
* `ConversationList` – Similar member/contact display pattern
* `NewestMembers` – Alternative member display for space pages

### **Internal Sub-Component**

* `MemberItem` – Defined within component file

### **Parent Pages**

* Space chat page

### **Typical Usage Location**

* Right sidebar in space chat interface

## **21. Open Questions / Notes**

* Need to integrate real WebSocket presence service for online status
* Consider adding "last seen" timestamp for offline users
* Large spaces may need member search/filter
* Could add "message" quick action on hover

## **22. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
|----------|----------|---------------|-------|
| `Default` | Mix of online/offline admins and members | Realistic data | Base state |
| `AllOnline` | All members online | All users in mock online list | Shows online sections only |
| `AllOffline` | All members offline | No users in mock online list | Shows offline sections only |
| `OnlyAdmins` | Space with admins only | `members: []` | Admin sections only |
| `OnlyMembers` | Space with regular members only | `admins: []` | Member sections only |
| `EmptySpace` | No members | Both arrays empty | Shows empty state |
| `LargeSpace` | Many members | 50+ users | Test scrolling/performance |
| `MissingPhotos` | Users without profile photos | `profile.photo: undefined` | Shows initials avatars |

### **Controls (Args) Required**

* `admins` (SpaceUser[]) – array control with sample data
* `members` (SpaceUser[]) – array control with sample data

### **Mocking Requirements**

* **Online status**: Override `isOnline()` function per story
* **User data**: Provide realistic SpaceUser objects with varying profile completeness

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Verify all member items are keyboard accessible
* Check status indicator has accessible name
* Verify section headings are proper heading level

### **Interaction Tests**

* Click member item navigates to profile (mock router)
* Tab through all member items in order
* Verify focus is visible on all interactive elements
