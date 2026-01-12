# **Component Specification: GlobalPostButton**

## **1. Component Name**

**`GlobalPostButton`**

## **2. Description**

A dropdown menu button in the navigation bar for creating new content.

* Provides quick access to create Discussion, Event, and Update content types
* Shows icons and descriptions for each option
* Authenticated users only
* Used in main Navigation component

## **3. Location**

```
src/components/ui/GlobalPostButton/GlobalPostButton.tsx
```

## **4. Component Type**

**Feature** – Manages dropdown state and navigation to creation pages.

## **5. Props Interface**

```typescript
// No props - uses internal state and auth
```

## **6. Props**

*No props – component uses internal hooks.*

## **7. Data Requirements**

*No external data fetching – authenticated user only.*

## **8. Internal State**

| State Variable | Type | Initial | Purpose |
|----------------|------|---------|---------|
| `isOpen` | `boolean` | `false` | Dropdown visibility |
| `currentUserId` | `string \| null` | `null` | Current user ID |
| `isClient` | `boolean` | `false` | Client-side hydration check |

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
|-------------------|-------------|-------|
| Not authenticated | Nothing (`null`) | No render |
| Authenticated | "+ New" button | Normal state |
| `isOpen === false` | Button only | Trigger state |
| `isOpen === true` | Full dropdown menu | Options visible |
| Select option | Navigate to page | Close dropdown |

## **10. Dependencies**

### **Child Components**

* `Icon` – Menu item icons

### **External Libraries**

* `@radix-ui/react-dropdown-menu`
* `next/navigation` (`useRouter`)

### **API Functions**

* `getCurrentUserId` – Get current user

## **11. Events & Callbacks**

| Event / Callback | Trigger | Description |
|------------------|---------|-------------|
| `handleNavigate` | Select menu item | Close dropdown, navigate to creation page |

## **12. Styling**

* **Approach**: CSS Modules with SCSS
* **File**: `GlobalPostButton.module.scss`

### **CSS Classes**

* `.trigger` – Button trigger
* `.dropdown` – Menu container
* `.menuItem` – Menu item
* `.itemIcon` – Item icon
* `.itemContent` – Label and description
* `.itemLabel` – Item label text
* `.itemDescription` – Item description text

### **Layout**

* Button trigger with dropdown arrow
* Vertical menu list
* Icon + text for each item

## **13. Accessibility Requirements**

* **Keyboard**: Arrow keys to navigate menu
* **ARIA**: Menu with proper roles
* **Focus**: Focus on first item when opened
* **Screen Reader**: Announce menu options

### **Improvements Needed**

* Add `aria-label` to trigger button
* Announce selection

## **14. Error Handling**

| Error Condition | Behaviour | Fallback |
|-----------------|-----------|----------|
| No user data | Null render | Check auth |
| Navigation fails | Error toast | Stay on page |

## **15. Performance & Lifecycle Notes**

### **Menu Configuration**

```typescript
const menuItems = [
  {
    label: 'Discussion',
    path: '/posts/new',
    icon: 'comment',
    description: 'Start a conversation or ask a question'
  },
  {
    label: 'Event',
    path: '/events/new',
    icon: 'calendar',
    description: 'Create an event for your community'
  },
  {
    label: 'Update',
    path: '/updates/new',
    icon: 'bell',
    description: 'Share an important announcement'
  }
];
```

## **16. Usage Examples**

### **In Navigation**

```tsx
import { GlobalPostButton } from '@/components/ui/GlobalPostButton';

<nav>
  <GlobalPostButton />
</nav>
```

## **17. Features Summary**

### **Trigger Button**

* "+ New" label
* Dropdown arrow indicator
* Primary button styling

### **Menu Items**

| Label | Path | Icon | Description |
|-------|------|------|-------------|
| Discussion | `/posts/new` | comment | Start a conversation or ask a question |
| Event | `/events/new` | calendar | Create an event for your community |
| Update | `/updates/new` | bell | Share an important announcement |

### **Menu Features**

* Separated by dividers
* Icon per item
* Description per item
* Hover highlighting

## **18. Testing Considerations**

### **Unit Tests**

* Renders null when not authenticated
* Shows button trigger
* Opens dropdown on click
* Menu items navigate correctly
* Closes on selection

### **Mocking**

* `getCurrentUserId` function
* `useRouter` hook

### **Edge Cases**

* Rapid open/close
* Navigation during open
* Mobile touch interactions

## **19. Out of Scope / Non-Goals**

* **Draft saving**: Not here
* **Recent drafts**: Not shown
* **Template selection**: Not in dropdown
* **Content preview**: Just navigation

## **20. Related Components & System Context**

### **Parent Component**

* `Navigation`

### **Child Components**

* `Icon`

### **Uses**

* Radix DropdownMenu primitive

### **Navigates To**

* `PostEditor` (via /posts/new)
* `EventForm` (via /events/new)
* `UpdateEditor` (via /updates/new)

## **21. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
|----------|----------|---------------|-------|
| `Default` | Authenticated | Button visible | Closed state |
| `Open` | Menu visible | isOpen: true | Full menu |
| `Hover` | Item hovered | Item highlighted | Interaction |

### **Controls (Args) Required**

*None – internal state*

### **Mocking Requirements**

* **Auth**: Mock getCurrentUserId
* **Router**: Mock useRouter

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Verify menu accessible
* Check keyboard navigation
* Verify focus management

### **Interaction Tests**

* Click to open
* Select menu item
* Navigate via keyboard
* Press Escape to close
