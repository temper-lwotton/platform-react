# **Component Specification: Navigation**

## **1. Component Name**

**`Navigation`**

## **2. Description**

The main top navigation bar for the application.

* Displays logo with link to home
* Shows primary navigation links with dropdown support
* Renders authenticated user toolbar
* Handles auth-aware link visibility
* Used in root layout for all pages

## **3. Location**

```
src/components/ui/Navigation/Navigation.tsx
```

## **4. Component Type**

**Feature** – Manages auth state and renders conditional navigation elements.

## **5. Props Interface**

```typescript
// No props - uses internal hooks for auth state
```

## **6. Props**

*No props – component uses hooks internally.*

## **7. Data Requirements**

### **NavItem Type**

```typescript
interface NavItem {
  href?: string;
  label: string;
  requiresAuth?: boolean;
  hideWhenAuth?: boolean;
  children?: {
    href: string;
    label: string;
    icon?: IconName;
  }[];
}
```

### **Navigation Items Configuration**

```typescript
const navItems: NavItem[] = [
  { href: '/feed', label: 'Home', requiresAuth: true },
  { href: '/users', label: 'People', requiresAuth: true },
  { href: '/events', label: 'Events', requiresAuth: true },
  { href: '/learn', label: 'Learn', requiresAuth: true },
  {
    label: 'Contribute',
    requiresAuth: true,
    children: [
      { href: '/test', label: 'Navigation item', icon: 'star' },
      // ... more items
    ]
  },
  { href: '/login', label: 'Login', hideWhenAuth: true },
];
```

## **8. Internal State**

*None – relies on `useAuth` hook for authentication state.*

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
|-------------------|-------------|-------|
| Not authenticated | Login link visible | Auth links hidden |
| Authenticated | User toolbar visible | Login hidden |
| Current path matches | Active styling | Link highlighted |
| NavItem has children | Dropdown menu | Popover rendered |
| `isClient === false` | Skeleton or partial | SSR protection |

## **10. Dependencies**

### **Child Components**

* `Icon` – Navigation icons
* `GlobalPostButton` – Create new post action
* `NotificationDropdown` – Notifications panel
* `MessagesDropdown` – Messages panel
* `BookmarksDropdown` – Bookmarks panel
* `UserMenu` – User account dropdown

### **External Libraries**

* `next/link`
* `next/navigation` (`usePathname`)
* `@radix-ui/react-popover`

### **Hooks**

* `useAuth` – Get `isAuthenticated` and `isClient` state
* `usePathname` – Get current route for active states

## **11. Events & Callbacks**

*No external callbacks – navigation handled by Next.js Link.*

## **12. Styling**

* **Approach**: CSS Modules with SCSS
* **File**: `Navigation.module.scss`

### **CSS Classes**

* `.nav` – Main nav container
* `.logo` – Logo link
* `.links` – Primary links container
* `.link` – Navigation link
* `.link--active` – Active state
* `.dropdown` – Dropdown trigger
* `.dropdownContent` – Dropdown menu
* `.toolbar` – User action buttons
* `.toolbarItem` – Individual action

### **Layout**

* Horizontal bar
* Logo (left)
* Primary links (center)
* User toolbar (right)

## **13. Accessibility Requirements**

* **Keyboard**: All links and dropdowns keyboard accessible
* **ARIA**: Dropdown menus with proper roles
* **Focus**: Clear focus indicators
* **Screen Reader**: Announce dropdown open/close

### **Improvements Needed**

* Add `aria-expanded` to dropdown triggers
* Add `aria-haspopup="menu"` to dropdown triggers
* Improve focus management in dropdowns

## **14. Error Handling**

| Error Condition | Behaviour | Fallback |
|-----------------|-----------|----------|
| Auth check fails | Default to unauthenticated | Show login link |
| Client hydration issue | SSR-safe render | Check isClient |

## **15. Performance & Lifecycle Notes**

### **Navigation Flow**

1. Filter nav items based on auth state
2. Render regular links with active highlighting
3. Render dropdown items with Popover component
4. Show user toolbar only when authenticated

### **Hydration**

* Uses `isClient` from `useAuth` to prevent SSR mismatch
* Toolbar components render null during SSR

## **16. Usage Examples**

### **In Root Layout**

```tsx
import { Navigation } from '@/components/ui/Navigation';

<header>
  <Navigation />
</header>
```

## **17. Features Summary**

### **Logo**

* Links to home (`/`)

### **Primary Navigation Links**

* Home → `/feed`
* People → `/users`
* Events → `/events`
* Learn → `/learn`
* Contribute (dropdown with children)

### **Dropdown Navigation**

* Icon support per item
* Popover-based menu

### **Auth-Aware Rendering**

* Hide authenticated-only links when logged out
* Hide login link when authenticated

### **Authenticated User Toolbar**

* Messages dropdown
* Bookmarks dropdown
* Notifications dropdown
* Global post button
* User menu

## **18. Testing Considerations**

### **Unit Tests**

* Renders logo with link
* Shows auth links when authenticated
* Hides auth links when not authenticated
* Shows login when not authenticated
* Active state applied to current route
* Dropdown opens on click

### **Mocking**

* `useAuth` hook
* `usePathname` hook

### **Edge Cases**

* Not authenticated
* Deep nested route matching
* Dropdown keyboard navigation
* Rapid auth state changes

## **19. Out of Scope / Non-Goals**

* **Search**: No global search in nav
* **Mobile menu**: Not responsive hamburger
* **Breadcrumbs**: Not included
* **Skip link**: Not built-in

## **20. Related Components & System Context**

### **Siblings**

* `HomeSidebar`
* `SpaceSidebar`

### **Child Components**

* `Icon`
* `GlobalPostButton`
* `NotificationDropdown`
* `MessagesDropdown`
* `BookmarksDropdown`
* `UserMenu`

### **Used By**

* Root layout

## **21. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
|----------|----------|---------------|-------|
| `Authenticated` | Logged in | Auth true | Full toolbar |
| `Unauthenticated` | Not logged in | Auth false | Login shown |
| `ActiveState` | Current route | Path matches | Highlight |
| `DropdownOpen` | Menu open | Contribute clicked | Popover visible |

### **Controls (Args) Required**

*None – internal state*

### **Mocking Requirements**

* **useAuth**: Mock auth state
* **usePathname**: Mock current path

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Verify navigation landmark
* Check dropdown accessibility
* Verify focus management

### **Interaction Tests**

* Click navigation links
* Open dropdown menu
* Navigate dropdown with keyboard
* Open user toolbar items
