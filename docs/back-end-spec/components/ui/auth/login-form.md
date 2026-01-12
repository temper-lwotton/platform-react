# **Component Specification: LoginForm**

## **1. Component Name**

**`LoginForm`**

## **2. Description**

Authentication form for user login. Handles email/password input with validation, error display, and login submission.

* Collects user credentials (email and password)
* Validates input before submission
* Displays field-level and form-level errors
* Handles loading state during authentication

## **3. Location**

```
src/components/ui/LoginForm/LoginForm.tsx
```

## **4. Component Type**

* Feature

## **5. Props Interface**

```ts
interface LoginFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
}
```

## **6. Props**

| Prop | Type | Required | Default | Description |
| ---- | ---- | -------- | ------- | ----------- |
| `onSuccess` | `() => void` | No | - | Callback after successful login (if provided, takes precedence over redirect) |
| `redirectTo` | `string` | No | `'/spaces'` | URL to redirect after login when no `onSuccess` callback |

## **7. Data Requirements**

### **External Data Sources**

* **API**: `login()` from `@/lib/auth` - authenticates credentials

```ts
// From @/lib/auth
interface LoginCredentials {
  email: string;
  password: string;
}

function login(credentials: LoginCredentials): Promise<void>;
```

### **Form Validation Rules**

| Field | Rule | Error Message |
| ----- | ---- | ------------- |
| `email` | Required | "Email is required" |
| `email` | Valid email format | "Invalid email address" |
| `password` | Required | "Password is required" |
| `password` | Minimum 6 characters | "Password must be at least 6 characters" |

## **8. Internal State**

| State Variable | Type | Purpose |
| -------------- | ---- | ------- |
| `error` | `string \| null` | Form-level error message from login attempt |
| `isLoading` | `boolean` | Submission in progress, disables form |

**Note**: Field-level validation state managed by `react-hook-form`

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
| ----------------- | ----------- | ----- |
| Initial state | Empty form | Email and password fields enabled |
| Field validation error | Field error message | Red text below affected field |
| `error` is set | Error box above form | Red bordered box with error text |
| `isLoading === true` | Disabled form + loading button | All inputs disabled, button shows spinner |
| Login success + `onSuccess` prop | Calls `onSuccess()` | Does not redirect |
| Login success + no `onSuccess` | Redirects to `redirectTo` | Navigates via `router.push()` |

## **10. Dependencies**

### **Child Components**

* `Input` - Email and password fields (from primitives)
* `Button` - Submit button with loading state (from primitives)

### **Utilities / Hooks**

* `useForm` - Form state management from `react-hook-form`
* `useRouter` - Navigation after successful login
* `login` - Authentication function from `@/lib/auth`

### **External Libraries**

* `react-hook-form` - Form state and validation

## **11. Events & Callbacks**

| Event / Callback | Trigger | Description |
| ---------------- | ------- | ----------- |
| `onSubmit` | Form submission | Validates fields, calls `login()`, handles success/error |
| `register('email')` | Email input change | Updates form state, triggers validation |
| `register('password')` | Password input change | Updates form state, triggers validation |

## **12. Styling**

* **Styling approach**: CSS Modules with SCSS
* **File(s)**:
  * `LoginForm.module.scss`

### **Visual States**

* **Default**: Stacked form fields with gap spacing
* **Error (form)**: Red error box with border at top of form
* **Error (field)**: Error message below field (handled by Input component)
* **Loading**: Inputs appear disabled, button shows loading indicator

### **Key Style Classes**

| Class | Purpose |
| ----- | ------- |
| `.form` | Flex column layout with 1rem gap |
| `.errorBox` | Form-level error display (red background, border) |

## **13. Accessibility Requirements**

* **Labels**: Each input has associated `label` prop (rendered by Input component)
* **Error association**: Field errors linked via Input component's error handling
* **Disabled state**: `disabled` attribute applied during loading
* **Form semantics**: Uses native `<form>` element with `onSubmit`

### **Current Implementation**

* Input components handle `id` association
* Error messages displayed as visible text
* Button loading state provides visual feedback

### **Improvements Needed**

* Add `aria-describedby` for form-level error box
* Add `aria-invalid` to fields with errors
* Consider announcing errors to screen readers

## **14. Error Handling**

| Condition | Behaviour |
| --------- | --------- |
| Field validation fails | Shows field-level error, prevents submission |
| `login()` throws Error | Displays `error.message` in error box |
| `login()` throws non-Error | Displays "Login failed" fallback message |

**Error scenarios from API:**
* Invalid credentials → Error message from API
* Network failure → Generic error message
* Rate limiting → Error message from API

**Not handled by this component:**
* Session storage (handled by `login()` function)
* Token management (handled by auth layer)

## **15. Performance & Lifecycle Notes**

* **No side effects on mount** - form is passive until user interaction
* **Controlled inputs**: `react-hook-form` uses uncontrolled inputs with ref registration
* **Re-renders**: Minimal - only on state changes (`error`, `isLoading`) and validation
* **No cleanup required** - no subscriptions or listeners

## **16. Usage Examples**

```tsx
import { LoginForm } from '@/components/ui/LoginForm';

// Basic usage (redirects to /spaces)
<LoginForm />

// With custom redirect
<LoginForm redirectTo="/dashboard" />

// With success callback (no redirect)
<LoginForm
  onSuccess={() => {
    setIsAuthenticated(true);
  }}
/>

// Inside AuthRequired wrapper
<AuthRequired>
  <ProtectedContent />
</AuthRequired>
// AuthRequired passes onSuccess to re-render with authenticated state
```

## **17. Features Summary**

* Email validation (required, format check)
* Password validation (required, minimum 6 characters)
* Form-level error display
* Field-level error messages
* Loading state during submission
* Automatic redirect on success
* Optional success callback for inline auth flows
* Full-width responsive layout

## **18. Testing Considerations**

### **Unit Tests**

* Empty form submission shows required errors
* Invalid email format shows validation error
* Short password shows minimum length error
* Successful login calls `onSuccess` or redirects
* Failed login displays error message
* Loading state disables form during submission

### **Mocking Required**

* `login` - mock to resolve or reject
* `useRouter` - mock `push` function
* Input/Button components - can use real or mock

### **Edge Cases**

* Submit while already loading (should be prevented by disabled state)
* Very long email/password values
* Special characters in password
* Network timeout during login

## **19. Out of Scope / Non-Goals**

* **Password visibility toggle** - not implemented (could be added)
* **Remember me** - not implemented
* **Forgot password link** - not part of this form
* **Registration** - separate component
* **OAuth/SSO** - handled by different flow
* **Password strength indicator** - not implemented

## **20. Related Components & System Context**

### **Parent Components**

* `AuthRequired` - uses LoginForm for inline authentication
* Login page - standalone usage

### **Child Components**

* `Input` (primitives)
* `Button` (primitives)

### **Related Auth Components**

* Registration form (separate)
* Password reset form (separate)

### **System Integration**

* `login()` from `@/lib/auth` - handles token storage
* `useRouter` from `next/navigation` - post-login redirect

## **21. Open Questions / Notes**

* Consider adding password visibility toggle
* May want "Remember me" checkbox for persistent sessions
* Could add link to forgot password flow
* Consider adding OAuth buttons (Google, etc.)

## **22. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
| -------- | -------- | ------------- | ----- |
| `Default` | Empty form | Default props | Initial state |
| `WithError` | Form-level error | Set `error` state | Shows error box |
| `FieldErrors` | Validation errors | Trigger validation | Shows field errors |
| `Loading` | Submission in progress | Set `isLoading` true | Disabled state |
| `Filled` | Pre-filled form | Set form values | Shows completed form |

### **Controls (Args) Required**

* `redirectTo` (string) - controllable
* `onSuccess` - action logger

### **Mocking Requirements**

* `login` - mock with configurable delay and success/failure
* `useRouter` - mock with action logging for `push` calls

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Verify label association
* Verify error announcements
* Verify disabled state is communicated

### **Interaction Tests**

* Happy path: fill email → fill password → submit → verify redirect/callback
* Validation: submit empty → verify error messages appear
* Error handling: fill form → submit → mock error → verify error box appears
* Loading state: submit → verify inputs disabled during request
