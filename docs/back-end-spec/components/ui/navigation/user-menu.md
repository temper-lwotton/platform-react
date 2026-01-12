# **Component Specification: UserMenu**

## **1. Component Name**

**`UserMenu`**

## **2. Description**

A dropdown menu for authenticated users showing user info and account options.

* Displays user avatar as trigger
* Shows user info in header
* Provides theme switcher (light/dark/system)
* Links to profile, content, preferences, and admin
* Includes logout action

## **3. Location**

```
src/components/ui/UserMenu/UserMenu.tsx
```

## **4. Component Type**

**Feature** – Manages user state, theme context, and logout flow.

## **5. Props Interface**

```typescript
// No props - uses internal state and context
```

## **6. Props**

*No props – component uses internal hooks and context.*

## **7. Data Requirements**

### **User Data Type**

```typescript
// From getCurrentUser()
interface User {
  id: string;
  email: string;
  fullName: string;
}
```

### **Theme Context**

```typescript
// From useTheme()
{
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}
```

## **8. Internal State**

| State Variable | Type | Initial | Purpose |
|----------------|------|---------|---------|
| `user` | `User \| null` | `null` | Current user data |
| `isClient` | `boolean` | `false` | Client-side hydration check |

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
|-------------------|-------------|-------|
| Not authenticated | Nothing (`null`) | No render |
| Authenticated | Avatar trigger + dropdown | Normal state |
| Dropdown open | Full menu visible | User info + options |
| User has photo | Photo avatar | Image shown |
| No photo | Initials avatar | Generated fallback |
| Theme selected | Radio checked | Current theme |

## **10. Dependencies**

### **Child Components**

* `Avatar` – User avatar display
* `Popover` – Dropdown container
* `Icon` – Menu item icons

### **External Libraries**

* `next/link`
* `next/navigation` (`useRouter`)
* `@radix-ui/react-radio-group`

### **Hooks**

* `useRouter` – Navigation after logout
* `useTheme` – Theme state from context

### **API Functions**

* `getCurrentUser` – Get logged-in user info
* `logout` – Clear auth state

## **11. Events & Callbacks**

| Event / Callback | Trigger | Description |
|------------------|---------|-------------|
| `handleLogout` | Click logout button | Clear auth, dispatch event, redirect |
| `setTheme` | Change theme radio | Update theme context |

## **12. Styling**

* **Approach**: CSS Modules with SCSS
* **File**: `UserMenu.module.scss`

### **CSS Classes**

* `.trigger` – Avatar button
* `.dropdown` – Menu container
* `.header` – User info section
* `.avatar` – Large avatar in header
* `.userInfo` – Name and email
* `.themeSection` – Theme switcher
* `.themeOption` – Radio option
* `.menuItem` – Menu link
* `.logout` – Logout button

### **Layout**

* Avatar trigger
* Header with user info
* Theme switcher section
* Menu links
* Logout button

## **13. Accessibility Requirements**

* **Keyboard**: All options keyboard navigable
* **ARIA**: Radio group properly labeled
* **Focus**: Focus trapped in dropdown
* **Screen Reader**: Announce menu options

### **Improvements Needed**

* Add `aria-label` to trigger
* Announce theme change
* Add keyboard shortcut for logout

## **14. Error Handling**

| Error Condition | Behaviour | Fallback |
|-----------------|-----------|----------|
| No user data | Null render | Check auth |
| Logout fails | Error toast | Stay in menu |
| Avatar load error | Initials fallback | Automatic |

## **15. Performance & Lifecycle Notes**

### **Helper Functions**

```typescript
const getInitials = (): string => {
  // Generate initials from name or email
};
```

### **Logout Flow**

1. Call `logout()` to clear auth state
2. Dispatch `auth:logout` custom event
3. Redirect to `/login` page

## **16. Usage Examples**

### **In Navigation**

```tsx
import { UserMenu } from '@/components/ui/UserMenu';

<nav>
  <UserMenu />
</nav>
```

## **17. Features Summary**

### **Avatar Trigger**

* Photo or initials fallback

### **User Info Header**

* Larger avatar
* Full name or email
* Email address

### **Theme Switcher**

| Option | Icon |
|--------|------|
| Light | sun |
| Dark | moon |
| System | monitor |

### **Menu Links**

| Item | Path | Icon |
|------|------|------|
| My Profile | `/users/[id]` | user |
| My Content | `/my-content` | fileText |
| Preferences | `/preferences` | settings |
| Admin Area | `/admin` | lock |

### **Logout Action**

* Styled differently (destructive)
* Clears auth and redirects

## **18. Testing Considerations**

### **Unit Tests**

* Renders null when not authenticated
* Shows avatar trigger
* Opens dropdown on click
* Displays user info
* Theme switcher changes theme
* Menu links navigate correctly
* Logout clears auth and redirects

### **Mocking**

* `getCurrentUser` function
* `logout` function
* `useTheme` context
* `useRouter` hook

### **Edge Cases**

* Long name
* Long email
* No photo
* Logout during navigation

## **19. Out of Scope / Non-Goals**

* **Notifications settings**: In preferences page
* **Quick settings**: Not inline
* **Account deletion**: Not here
* **Multi-account**: Single account only

## **20. Related Components & System Context**

### **Parent Component**

* `Navigation`

### **Child Components**

* `Avatar`
* `Popover`
* `Icon`

### **Context**

* `ThemeContext`

## **21. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
|----------|----------|---------------|-------|
| `Default` | Authenticated user | User data | Base state |
| `Open` | Dropdown visible | Open state | Full menu |
| `NoPhoto` | Initials avatar | No photo URL | Fallback |
| `LightTheme` | Light selected | theme: 'light' | Radio checked |
| `DarkTheme` | Dark selected | theme: 'dark' | Radio checked |
| `SystemTheme` | System selected | theme: 'system' | Radio checked |

### **Controls (Args) Required**

*None – internal state*

### **Mocking Requirements**

* **User data**: Mock getCurrentUser
* **Theme context**: Mock useTheme
* **Router**: Mock useRouter

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Verify dropdown accessible
* Check radio group keyboard nav
* Verify focus management

### **Interaction Tests**

* Click avatar to open
* Change theme
* Click menu item
* Click logout
