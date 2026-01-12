# **Component Specification: MentionDropdown**

## **1. Component Name**

**`MentionDropdown`**

## **2. Description**

A positioned dropdown for selecting users when typing @mentions in text inputs.

* Shows user avatars, names, and emails
* Supports keyboard navigation with arrow keys
* Positions relative to textarea caret
* Auto-scrolls selected item into view
* Used by MentionTextarea and similar components

## **3. Location**

```
src/components/ui/MentionDropdown/MentionDropdown.tsx
```

## **4. Component Type**

**UI** – Stateless presentational component controlled via props.

## **5. Props Interface**

```typescript
interface MentionDropdownProps {
  users: MentionUser[];
  selectedIndex: number;
  position: { top: number; left: number };
  onSelect: (user: MentionUser) => void;
  textareaRef: HTMLTextAreaElement | null;
}
```

## **6. Props**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `users` | `MentionUser[]` | Yes | - | Filtered users to display |
| `selectedIndex` | `number` | Yes | - | Currently highlighted user index |
| `position` | `{ top, left }` | Yes | - | Caret position in textarea |
| `onSelect` | `(user) => void` | Yes | - | Selection callback |
| `textareaRef` | `HTMLTextAreaElement \| null` | Yes | - | Reference to textarea for positioning |

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

*None – controlled by parent via props.*

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
|-------------------|-------------|-------|
| `users.length === 0` | Empty dropdown or hidden | No matches |
| `users.length > 0` | User list with items | Normal state |
| Item at `selectedIndex` | Highlighted styling | Active selection |
| User has `avatar` | Avatar image shown | Photo available |
| User has no `avatar` | Initials fallback | Generated from name |
| User has `email` | Email displayed | Secondary info |

## **10. Dependencies**

### **Radix UI**

* `@radix-ui/react-avatar` – Avatar display with fallback

## **11. Events & Callbacks**

| Event / Callback | Trigger | Description |
|------------------|---------|-------------|
| `onSelect` | Click user item | Selects user for mention |

## **12. Styling**

* **Approach**: CSS Modules with SCSS
* **File**: `MentionDropdown.module.scss`
* **Position**: Fixed, calculated from textarea position + caret offset

### **CSS Classes**

* `.dropdown` – Main container
* `.content` – Scrollable list area
* `.item` – Individual user row
* `.item--selected` – Highlighted state
* `.avatar` – User avatar
* `.avatarFallback` – Initials fallback
* `.info` – Name/email container
* `.name` – User name
* `.email` – User email
* `.hint` – Keyboard hint bar

## **13. Accessibility Requirements**

* **ARIA**: Should have `role="listbox"` with `role="option"` items
* **Keyboard**: Parent handles arrow keys, Enter, Escape
* **Selection**: `aria-selected` on current item
* **Screen Reader**: Announce user names

### **Improvements Needed**

* Add `role="listbox"` to dropdown
* Add `role="option"` to items
* Add `aria-selected` to selected item
* Add `aria-activedescendant` pointing to selected

## **14. Error Handling**

| Error Condition | Behaviour | Fallback |
|-----------------|-----------|----------|
| Empty users array | Dropdown hidden or empty | Graceful handling |
| Missing textareaRef | Position defaults to 0,0 | Safe fallback |
| Invalid selectedIndex | No item highlighted | No selection shown |

## **15. Performance & Lifecycle Notes**

### **Position Calculation**

```typescript
const getAbsolutePosition = () => {
  if (!textareaRef) return { top: 0, left: 0 };
  const textareaRect = textareaRef.getBoundingClientRect();
  return {
    top: textareaRect.top + position.top + 24, // 24px below caret
    left: textareaRect.left + position.left,
  };
};
```

* Recalculates on position prop change
* Uses fixed positioning for viewport-relative placement

### **Helper Functions**

```typescript
const getUserInitials = (user: MentionUser): string => {
  const names = user.name.split(' ');
  if (names.length >= 2) {
    return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
  }
  return user.name.charAt(0).toUpperCase();
};
```

## **16. Usage Examples**

### **Basic Usage**

```tsx
import { MentionDropdown } from '@/components/ui/MentionDropdown';

{mentionState.isOpen && (
  <MentionDropdown
    users={mentionState.filteredUsers}
    selectedIndex={mentionState.selectedIndex}
    position={mentionState.position}
    onSelect={handleSelectUser}
    textareaRef={textareaRef}
  />
)}
```

### **With useMentions Hook**

```tsx
const { mentionState, handleSelectUser } = useMentions(users, textareaRef);

{mentionState.isOpen && (
  <MentionDropdown
    users={mentionState.filteredUsers}
    selectedIndex={mentionState.selectedIndex}
    position={mentionState.position}
    onSelect={handleSelectUser}
    textareaRef={textareaRef.current}
  />
)}
```

## **17. Features Summary**

### **User List**

* Avatar (photo or initials fallback)
* Name display
* Email display (if available)

### **Selection**

* Visual highlight on selected item
* Click to select
* Auto-scroll to keep selected in view

### **Hint Bar**

* "↑↓ to navigate • ↵ to select • esc to dismiss"

## **18. Testing Considerations**

### **Unit Tests**

* Renders user list correctly
* Highlights selected index
* Calls onSelect on click
* Shows initials when no avatar
* Displays email when present
* Auto-scrolls to selected item

### **Mocking**

* MentionUser objects with various data
* TextAreaElement ref

### **Edge Cases**

* Empty users array
* Single user
* Many users (scroll)
* Very long names
* Missing email
* selectedIndex out of bounds

## **19. Out of Scope / Non-Goals**

* **Keyboard handling**: Parent component handles keys
* **Filtering logic**: Handled by useMentions hook
* **Open/close state**: Controlled by parent
* **Position tracking**: Caret position from parent

## **20. Related Components & System Context**

### **Used By**

* `MentionTextarea` – Plain text with mentions
* Lexical `MentionsPlugin` – Rich text mentions

### **Related Hook**

* `useMentions` – Provides state and handlers

### **Related**

* `MentionHoverCard` – Display on hover

## **21. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
|----------|----------|---------------|-------|
| `Default` | Multiple users | 5+ users | Base state |
| `SingleUser` | One user | 1 user | Minimal |
| `ManyUsers` | Scrollable | 20+ users | Scroll behaviour |
| `WithEmail` | Email shown | Users with email | Full info |
| `NoPhotos` | Initials only | No avatars | Fallback display |
| `Selected` | Item highlighted | `selectedIndex: 2` | Selection state |
| `Empty` | No users | Empty array | Empty state |

### **Controls (Args) Required**

* `users` (array) – controllable
* `selectedIndex` (number) – controllable
* `position` (object) – controllable

### **Mocking Requirements**

* **User data**: Realistic MentionUser objects
* **Textarea ref**: Mock element for positioning

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Verify listbox role
* Check option announcements
* Verify selection states

### **Interaction Tests**

* Click user item
* Verify selection callback
* Scroll to selected item
