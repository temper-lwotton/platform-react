# **Component Specification: UserCard**

## **1. Component Name**

**`UserCard`**

## **2. Description**

A comprehensive user profile card with cover image, user details, connection management, and interest tags. Supports sending/removing connections with optimistic updates and proper error handling.

* Displays user profile in a visually rich card format
* Manages connection state with optimistic updates
* Shows professional details and interests

## **3. Location**

```
src/components/ui/UserCard/UserCard.tsx
```

## **4. Component Type**

* Feature

## **5. Props Interface**

```ts
interface UserCardProps {
  user: User;
  onConnectionChange?: () => void;
}
```

## **6. Props**

| Prop | Type | Required | Default | Description |
| ---- | ---- | -------- | ------- | ----------- |
| `user` | `User` | Yes | - | User data object |
| `onConnectionChange` | `() => void` | No | - | Callback after connection change |

## **7. Data Requirements**

### **External Data Sources**

* **Props**: `user` object
* **Function**: `getCurrentUserId()` from `@/lib/auth`
* **API Functions**: `sendConnectionRequest()`, `removeConnection()` from `@/lib/users`

```ts
// From @/lib/users
interface User {
  id: number | string;
  createdAt: string;
  connectionStatus?: 'none' | 'pending' | 'connected';
  adminSpaces: Space[];
  memberSpaces: Space[];
  profile: {
    fullName?: string;
    firstName?: string;
    lastName?: string;
    photo?: string;
    jobTitle?: string;
    companyName?: string;
    transportModesOfInterest?: string | string[];
  };
}
```

### **Derived Values**

| Value | Derivation |
| ----- | ---------- |
| `displayName` | `fullName` or `firstName + lastName` or 'Unknown User' |
| `initials` | First letter of each word in display name (max 2) |
| `spaceCount` | Sum of `adminSpaces.length` and `memberSpaces.length` |
| `isNewUser` | `createdAt` within last 7 days |
| `transportModes` | Parsed from string or array format |

## **8. Internal State**

| State Variable | Type | Purpose |
| -------------- | ---- | ------- |
| `status` | `'none' \| 'pending' \| 'connected'` | Current connection status |
| `isConnecting` | `boolean` | API call in progress |
| `error` | `string \| null` | Error message for display |

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
| ----------------- | ----------- | ----- |
| `user.profile.photo` exists | Cover image | |
| `user.profile.photo` missing | Placeholder with initials | |
| `isNewUser === true` | "New" badge with sparkles | Success variant |
| `profile.jobTitle` exists | Job title with briefcase icon | |
| `profile.companyName` exists | Company with building icon | |
| `transportModes.length > 0` | Interest tags (max 4) | +N overflow |
| `transportModes.length > 4` | Overflow count badge | |
| `status === 'none'` | "Connect" button | userPlus icon |
| `status === 'pending'` | "Pending" button (disabled) | clock icon |
| `status === 'connected'` | "Connected" button | check icon |
| `isConnecting === true` | Loading spinner + "Connecting..." | Button disabled |
| `error` is set | Error message below button | Auto-clears after 3s |
| `spaceCount > 0` | Space count in footer | |

## **10. Dependencies**

### **Child Components**

* `Avatar` - User avatar (from primitives)
* `Badge` - "New" badge (from primitives)
* `Icon` - Various icons

### **Utilities / Hooks**

* `useToast` - Toast notifications
* `getCurrentUserId` - Current user check
* `sendConnectionRequest` - API function
* `removeConnection` - API function

### **External Libraries**

* `next/link` - Navigation

## **11. Events & Callbacks**

| Event / Callback | Trigger | Description |
| ---------------- | ------- | ----------- |
| `handleConnect` | Click connect button | Manages connection flow with optimistic update |
| `onConnectionChange` | After successful connection change | External callback prop |

### **Connection Flow**

1. Click "Connect" → Optimistic update to "Pending"
2. API call succeeds → Keep "Pending", show success toast
3. API call fails → Rollback to "None", show error, set error state

## **12. Styling**

* **Styling approach**: CSS Modules with SCSS
* **File(s)**:
  * `UserCard.module.scss`

### **Visual States**

* **Default**: Card with cover and content
* **New user**: "New" badge visible
* **Connecting**: Button shows spinner
* **Error**: Error message below button
* **Status-based**: Button style varies by connection status

### **Key Style Classes**

| Class | Purpose |
| ----- | ------- |
| `.card` | Base article container |
| `.coverLink` | Clickable cover image wrapper |
| `.cover` | 4:3 aspect ratio cover container |
| `.coverImage` | User photo as cover |
| `.coverPlaceholder` | Fallback with initials |
| `.coverInitials` | Large initial letters |
| `.content` | Text content area |
| `.nameSection` | Name and new badge |
| `.nameLink` | Link to user profile |
| `.name` | Display name (h3) |
| `.jobTitle` | Job title with icon |
| `.company` | Company with icon |
| `.tags` | Interest tags container |
| `.tag` | Individual interest tag |
| `.tagMore` | Overflow count tag |
| `.connectBtn` | Connection button |
| `.connectBtn--none` | Default connect style |
| `.connectBtn--pending` | Pending style |
| `.connectBtn--connected` | Connected style |
| `.connectBtn--loading` | Loading style |
| `.connectBtn--error` | Error style |
| `.btnSpinner` | Loading spinner |
| `.error` | Error message |
| `.footer` | Space count |
| `.meta` | Footer metadata |

## **13. Accessibility Requirements**

* **Name link**: Links to user profile
* **Cover link**: Links to user profile
* **Button**: Has disabled state when pending or loading
* **Button title**: Shows error message as tooltip when in error state

### **Improvements Needed**

* Button should have `aria-label` describing action
* Error message should have `role="alert"`
* Loading state should be announced

## **14. Error Handling**

| Condition | Behaviour |
| --------- | --------- |
| API failure | Rollback state, set error, show toast |
| No `currentUserId` | Button does nothing |
| Missing profile fields | Falls back to "Unknown User" |
| Missing photo | Shows initials placeholder |
| Error state | Auto-clears after 3 seconds |

**Optimistic Update Pattern:**
1. Update UI immediately
2. Make API call
3. On success: keep new state, show toast
4. On failure: rollback to previous state, show error

## **15. Performance & Lifecycle Notes**

* **State management**: Connection status with optimistic updates
* **Error auto-clear**: 3-second timeout
* **API calls**: Async with loading state
* **Re-renders**: On status, isConnecting, or error changes

## **16. Usage Examples**

```tsx
import { UserCard } from '@/components/ui/UserCard';

// Basic usage
<UserCard user={user} />

// With connection callback
<UserCard
  user={user}
  onConnectionChange={() => refetchConnections()}
/>

// In a grid
<div className={styles.userGrid}>
  {users.map((user) => (
    <UserCard key={user.id} user={user} />
  ))}
</div>
```

## **17. Features Summary**

* 4:3 aspect ratio cover image/placeholder
* Display name with link to profile
* "New" badge for users joined within 7 days
* Job title with briefcase icon
* Company name with building icon
* Interest tags (up to 4 + overflow count)
* Connection button with states:
  * Connect (default)
  * Pending (disabled)
  * Connected (can disconnect)
  * Loading spinner
* Error display with auto-clear
* Space count in footer
* Optimistic updates with rollback on error

## **18. Testing Considerations**

### **Unit Tests**

* Renders display name correctly (with fallbacks)
* Shows "New" badge for recent users
* Shows job title and company when provided
* Limits interest tags to 4 with overflow
* Connection button shows correct state
* Optimistic update on connect click
* Rollback on API failure
* Success toast on connection
* Error message displayed and auto-clears

### **Mocking Required**

* `getCurrentUserId` - mock to return user ID
* `sendConnectionRequest` - mock success/failure
* `removeConnection` - mock success/failure
* `useToast` - mock toast methods

### **Edge Cases**

* User is current user (shouldn't show connect)
* Very long name/job title
* No spaces
* Many transport modes
* Rapid connect/disconnect clicks

## **19. Out of Scope / Non-Goals**

* **Profile editing** - handled on profile page
* **Direct messaging** - not implemented
* **View profile inline** - links to separate page
* **Connection requests received** - handled elsewhere

## **20. Related Components & System Context**

### **Sibling Components**

* `SpaceCard` - similar pattern
* `DiscussionCard` - similar pattern
* `EventCard` - similar pattern

### **Child Components**

* `Avatar` (primitives)
* `Badge` (primitives)
* `Icon`

### **Typical Usage Locations**

* User directory
* Member lists
* Search results
* Connection suggestions

## **21. Open Questions / Notes**

* Consider showing mutual connections count
* May want to add "Message" action
* Could show activity/last seen indicator

## **22. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
| -------- | -------- | ------------- | ----- |
| `Default` | Not connected | `connectionStatus: 'none'` | Connect button |
| `Pending` | Connection pending | `connectionStatus: 'pending'` | Disabled button |
| `Connected` | Already connected | `connectionStatus: 'connected'` | Connected button |
| `NewUser` | Recently joined | `createdAt` within 7 days | "New" badge |
| `WithPhoto` | Has profile photo | Photo provided | Cover image |
| `NoPhoto` | No profile photo | Photo undefined | Initials placeholder |
| `Loading` | Connection in progress | Set `isConnecting` true | Spinner |
| `Error` | Connection failed | Set `error` state | Error message |
| `ManyInterests` | Many transport modes | 5+ modes | Overflow tag |

### **Controls (Args) Required**

* `user.connectionStatus` - select
* `user.createdAt` - date input
* `user.profile.jobTitle` - text input
* `user.profile.companyName` - text input

### **Mocking Requirements**

* `getCurrentUserId` - mock to return ID
* `sendConnectionRequest` - configurable success/failure
* `removeConnection` - configurable success/failure
* `useToast` - action logging

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Verify button states are accessible
* Verify error is announced

### **Interaction Tests**

* Click connect → verify optimistic update → verify API call
* API failure → verify rollback + error message
* Click connected → verify disconnect flow
* Click name/cover → verify navigation
