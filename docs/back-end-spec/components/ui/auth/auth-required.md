# **Component Specification: AuthRequired**

## **1. Component Name**

**`AuthRequired`**

## **2. Description**

An authentication wrapper component that gates access to protected content. Checks if the user is logged in and either renders the protected children or displays a login form.

* Protects routes/content that require authentication
* Provides a seamless login experience without page navigation
* Listens for logout events to handle session expiry

## **3. Location**

```
src/components/ui/AuthRequired/AuthRequired.tsx
```

## **4. Component Type**

* Wrapper

## **5. Props Interface**

```ts
interface AuthRequiredProps {
  children: React.ReactNode;
  message?: string;
}
```

## **6. Props**

| Prop | Type | Required | Default | Description |
| ---- | ---- | -------- | ------- | ----------- |
| `children` | `React.ReactNode` | Yes | - | Protected content to render when authenticated |
| `message` | `string` | No | `'Please log in to access this page'` | Custom message shown above login form |

## **7. Data Requirements**

### **External Data Sources**

* **Utility**: `getCurrentUserId()` from `@/lib/auth` - returns user ID string or null

```ts
// From @/lib/auth
function getCurrentUserId(): string | null;
```

### **Window Events**

* `auth:logout` - Custom event dispatched when session expires (e.g., 401 response)

## **8. Internal State**

| State Variable | Type | Purpose |
| -------------- | ---- | ------- |
| `isAuthenticated` | `boolean \| null` | Authentication status: `null` = loading, `true` = authenticated, `false` = not authenticated |

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
| ----------------- | ----------- | ----- |
| `isAuthenticated === null` | Loading state | Shows "Loading..." text centered |
| `isAuthenticated === false` | Login form with message | Container with title, message prop, and LoginForm |
| `isAuthenticated === true` | Children | Renders protected content directly |
| `auth:logout` event received | Transitions to login form | Sets `isAuthenticated` to false |
| Login success callback | Transitions to children | Sets `isAuthenticated` to true |

## **10. Dependencies**

### **Child Components**

* `LoginForm` - Rendered when user is not authenticated

### **Utilities / Hooks**

* `getCurrentUserId` - Synchronous auth check from `@/lib/auth`
* `useState` - Authentication state management
* `useEffect` - Mount-time auth check and event listener
* `useCallback` - Memoized auth check function

## **11. Events & Callbacks**

| Event / Callback | Trigger | Description |
| ---------------- | ------- | ----------- |
| `checkAuth` | Component mount | Calls `getCurrentUserId()` and sets auth state |
| `handleLoginSuccess` | LoginForm success | Sets `isAuthenticated` to true, renders children |
| `handleLogout` | `auth:logout` window event | Sets `isAuthenticated` to false, shows login form |

## **12. Styling**

* **Styling approach**: CSS Modules with SCSS
* **File(s)**:
  * `AuthRequired.module.scss`

### **Visual States**

* **Loading**: Centered container with secondary text colour
* **Unauthenticated**: Centered card (max 400px) with border, shadow, rounded corners
* **Authenticated**: No wrapper styling (children rendered directly)

### **Key Style Classes**

| Class | Purpose |
| ----- | ------- |
| `.authRequired` | Full-width centered flex container (min-height 60vh) |
| `.loading` | Centered loading state container |
| `.container` | Card wrapper for login form (400px max-width) |
| `.message` | Text block above login form |
| `.title` | "Authentication Required" heading |
| `.text` | Custom message paragraph |

## **13. Accessibility Requirements**

* **Semantic structure**: Uses `<h2>` for title, `<p>` for message
* **Focus management**: Focus should move to login form when unauthenticated state renders
* **Screen reader**: Loading state announces via text content

### **Improvements Needed**

* Add `aria-live="polite"` to loading container for state change announcements
* Consider `role="alert"` for authentication required message
* Loading state could use a proper spinner with `aria-busy`

## **14. Error Handling**

| Condition | Behaviour |
| --------- | --------- |
| `getCurrentUserId()` returns null | Shows login form (expected behaviour) |
| `getCurrentUserId()` throws | Not handled - would crash component |

**Not handled by this component:**
* Login form errors (delegated to `LoginForm`)
* Network failures during auth check (auth check is synchronous/local)

## **15. Performance & Lifecycle Notes**

* **Mount**: Runs `checkAuth()` once, sets up `auth:logout` listener
* **Unmount**: Cleans up event listener (prevents memory leak)
* **Re-renders**: Only when `isAuthenticated` state changes
* **No network calls**: Auth check is synchronous (reads from local storage/cookie)

## **16. Usage Examples**

```tsx
import { AuthRequired } from '@/components/ui/AuthRequired';

// Wrap protected pages
<AuthRequired>
  <ProtectedDashboard />
</AuthRequired>

// With custom message
<AuthRequired message="Sign in to view your profile">
  <UserProfile />
</AuthRequired>

// In a layout
export default function ProtectedLayout({ children }) {
  return (
    <AuthRequired message="Please sign in to continue">
      {children}
    </AuthRequired>
  );
}
```

## **17. Features Summary**

* Checks authentication status on mount
* Shows loading state while checking
* Displays customizable message with login form when unauthenticated
* Renders children when authenticated
* Listens for `auth:logout` events to handle session expiry
* Cleans up event listeners on unmount

## **18. Testing Considerations**

### **Unit Tests**

* Renders loading state initially when auth status unknown
* Renders children when `getCurrentUserId()` returns a value
* Renders login form when `getCurrentUserId()` returns null
* Custom message prop is displayed correctly
* Calls `onSuccess` and re-renders children after login

### **Mocking Required**

* `getCurrentUserId` - mock to return string or null
* `LoginForm` - mock or shallow render
* `window.addEventListener` / `window.dispatchEvent` - for logout event tests

### **Edge Cases**

* Rapid auth state changes
* Component unmount during loading state
* Multiple AuthRequired wrappers nested (should work but unusual)

## **19. Out of Scope / Non-Goals**

* **Route-level redirects** - does not redirect to login page, shows inline form
* **Remember location** - does not track original URL for post-login redirect
* **Token refresh** - handled elsewhere in auth layer
* **Registration** - only handles login, not signup

## **20. Related Components & System Context**

### **Child Components**

* `LoginForm`

### **System Integration**

* Listens for `auth:logout` event (dispatched by API interceptor on 401)
* Uses `getCurrentUserId()` from `@/lib/auth`

### **Typical Usage Locations**

* Protected route layouts
* Admin sections
* User-specific pages (profile, settings, dashboard)

## **21. Open Questions / Notes**

* Consider adding a `fallback` prop for custom loading UI
* Could add `onAuthRequired` callback for analytics/tracking
* May want to support redirect-based auth flow as alternative

## **22. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
| -------- | -------- | ------------- | ----- |
| `Loading` | Initial auth check | Mock `getCurrentUserId` to delay | Shows loading state |
| `Authenticated` | User logged in | Mock `getCurrentUserId` → `'user-123'` | Shows children |
| `Unauthenticated` | User not logged in | Mock `getCurrentUserId` → `null` | Shows login form |
| `CustomMessage` | Custom message text | `message="Sign in to continue"` | Verify message displays |
| `LogoutEvent` | Session expiry | Dispatch `auth:logout` after render | Transitions to login |

### **Controls (Args) Required**

* `message` (string) - controllable
* `children` - use demo content (e.g., "Protected Content" card)

### **Mocking Requirements**

* `getCurrentUserId` - mock module to control auth state
* `LoginForm` - can use real component or mock
* Window events - simulate `auth:logout` dispatch

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Verify heading hierarchy in unauthenticated state
* Verify focus management when state changes

### **Interaction Tests**

* Login flow: unauthenticated → fill form → submit → verify children render
* Logout event: authenticated → dispatch `auth:logout` → verify login form appears
