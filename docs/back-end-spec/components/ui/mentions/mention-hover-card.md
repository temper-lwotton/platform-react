# **Component Specification: MentionHoverCard**

## **1. Component Name**

**`MentionHoverCard`**

## **2. Description**

A hover card that appears when hovering over @mention links in content.

* Shows user avatar, name, and email
* Provides link to user profile
* Uses hover delay to prevent accidental triggers
* Positioned above trigger with arrow indicator
* Used by RichContentWithMentions component

## **3. Location**

```
src/components/ui/MentionHoverCard/MentionHoverCard.tsx
```

## **4. Component Type**

**UI** – Wrapper component using Radix hover card primitives.

## **5. Props Interface**

```typescript
interface MentionHoverCardProps {
  user: MentionUser;
  children: React.ReactNode;
}
```

## **6. Props**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `user` | `MentionUser` | Yes | - | User data to display |
| `children` | `React.ReactNode` | Yes | - | Trigger element (mention link) |

## **7. Data Requirements**

### **MentionUser Type**

```typescript
// From @/hooks/useMentions
interface MentionUser {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
}
```

## **8. Internal State**

*None – hover state managed by Radix HoverCard.*

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
|-------------------|-------------|-------|
| Not hovering | Only trigger children | Card hidden |
| Hovering (after delay) | Card with user info | 200ms open delay |
| Mouse leaves | Card closes | 100ms close delay |
| User has `avatar` | Avatar image shown | Photo available |
| User has no `avatar` | Initials fallback | Generated from name |
| User has `email` | Email displayed | Secondary info |

## **10. Dependencies**

### **Radix UI**

* `@radix-ui/react-hover-card` – Hover card primitive
* `@radix-ui/react-avatar` – Avatar display

### **Next.js**

* `next/link` – Profile link navigation

## **11. Events & Callbacks**

*No custom callbacks – uses Radix internal hover management.*

## **12. Styling**

* **Approach**: CSS Modules with SCSS
* **File**: `MentionHoverCard.module.scss`
* **Position**: Above trigger with arrow

### **CSS Classes**

* `.content` – Card container
* `.avatar` – User avatar
* `.avatarFallback` – Initials display
* `.info` – User details section
* `.name` – User name
* `.email` – User email
* `.profileLink` – View profile action
* `.arrow` – Pointing indicator

### **Animation**

* Open/close transitions
* Configurable delays

## **13. Accessibility Requirements**

* **Keyboard**: Card accessible via keyboard focus
* **Focus**: Should be focusable for keyboard users
* **Screen Reader**: User info announced when card opens

### **Improvements Needed**

* Add keyboard trigger support (focus delay)
* Add `aria-label` for profile link
* Consider announcing card appearance

## **14. Error Handling**

| Error Condition | Behaviour | Fallback |
|-----------------|-----------|----------|
| Missing user data | Minimal card or hidden | Graceful handling |
| Avatar load error | Initials fallback shown | Automatic via Radix |
| Missing email | Email line hidden | Conditional render |

## **15. Performance & Lifecycle Notes**

### **Configuration**

```typescript
<HoverCard.Root openDelay={200} closeDelay={100}>
  <HoverCard.Trigger asChild>{children}</HoverCard.Trigger>
  <HoverCard.Portal>
    <HoverCard.Content sideOffset={5} side="top">
      {/* Card content */}
      <HoverCard.Arrow />
    </HoverCard.Content>
  </HoverCard.Portal>
</HoverCard.Root>
```

* **Open Delay**: 200ms prevents accidental triggers
* **Close Delay**: 100ms allows moving to card
* **Portal**: Renders in document body for z-index

### **Helper Functions**

```typescript
const getUserInitials = (name: string): string => {
  const names = name.split(' ');
  if (names.length >= 2) {
    return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
  }
  return name.charAt(0).toUpperCase();
};
```

## **16. Usage Examples**

### **Basic Usage**

```tsx
import { MentionHoverCard } from '@/components/ui/MentionHoverCard';

<MentionHoverCard user={mentionedUser}>
  <a href={`/users/${mentionedUser.id}`} className="mention-link">
    @{mentionedUser.name}
  </a>
</MentionHoverCard>
```

### **With Span Trigger**

```tsx
<MentionHoverCard user={user}>
  <span className="mention-link">@{user.name}</span>
</MentionHoverCard>
```

## **17. Features Summary**

### **Trigger Behaviour**

* Opens on hover with 200ms delay
* Closes with 100ms delay
* Arrow points to trigger element

### **Card Content**

* User avatar (photo or initials)
* User name
* User email (if available)
* "View Profile →" link

## **18. Testing Considerations**

### **Unit Tests**

* Renders children as trigger
* Shows card on hover
* Displays user information
* Shows initials when no avatar
* Profile link navigates correctly
* Respects open/close delays

### **Mocking**

* MentionUser objects
* Radix HoverCard behavior
* Next.js Link

### **Edge Cases**

* Very long names
* Missing email
* Missing avatar
* Rapid hover/unhover
* Hover moving to card content

## **19. Out of Scope / Non-Goals**

* **Edit user**: Display only
* **Actions**: No follow/message buttons
* **Extended info**: No bio, role, etc.
* **Custom triggers**: Wraps children as-is

## **20. Related Components & System Context**

### **Used By**

* `RichContentWithMentions` – Wraps mention links

### **Related**

* `MentionDropdown` – Selection dropdown
* `MentionTextarea` – Input with mentions
* `UserCard` – Full user card display

## **21. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
|----------|----------|---------------|-------|
| `Default` | Basic hover card | User with all data | Base state |
| `NoAvatar` | Initials shown | No avatar URL | Fallback display |
| `NoEmail` | Name only | No email | Minimal info |
| `LongName` | Text wrapping | Very long name | Layout test |
| `Open` | Card visible | Force open state | For visual testing |

### **Controls (Args) Required**

* `user` (object) – controllable

### **Mocking Requirements**

* **User data**: Realistic MentionUser objects
* **Avatar images**: Sample URLs

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Verify keyboard accessibility
* Check focus management
* Verify profile link accessible

### **Interaction Tests**

* Hover to open
* Move to card content
* Click profile link
* Hover away to close
