# **Route Specification: Preferences**

## **1. Route Path**

**`/preferences`**

## **2. Description**

User preferences page for managing account settings.

* Organizes settings into logical sections
* Uses toggle switches for boolean preferences
* Covers notifications, privacy, content, and display settings
* Currently local state only (no persistence)

## **3. Source File**

```
src/app/(protected)/preferences/page.tsx
```

## **4. Route Responsibility**

### **This route is responsible for:**

* Rendering preference sections with toggle controls
* Managing preference state for notifications
* Managing preference state for privacy settings
* Managing preference state for content settings
* Managing preference state for display settings

### **This route does not:**

* Persist preferences to backend (not yet implemented)
* Handle account management (password, email, etc.)
* Manage billing or subscription
* Handle user profile editing

## **5. Authentication & Access Control**

* **Authentication Required:** Yes
* **Allowed Roles:** Any authenticated user
* **Permission Rules:** Users manage only their own preferences

## **6. URL Parameters & Query Params**

*None*

## **7. Layout & Structure**

### **Layout Overview**

* Single column layout with sectioned content
* Each section has header with icon and toggle items

### **Structural Regions**

| Region | Purpose |
|--------|---------|
| Header | Title and subtitle |
| Notifications Section | Email and push notification toggles |
| Privacy Section | Profile visibility toggles |
| Content Section | Content behavior toggles |
| Display Section | UI appearance toggles |
| Footer | Auto-save message |

## **8. Components Used**

### **Layout Components**

*None - simple sectioned layout*

### **UI / Feature Components**

| Component | Import Path | Purpose |
|-----------|-------------|---------|
| `Icon` | `@/components/ui/Icon` | Section header icons |

### **Radix UI Components**

| Component | Import Path | Purpose |
|-----------|-------------|---------|
| `Switch.Root` | `@radix-ui/react-switch` | Toggle switch container |
| `Switch.Thumb` | `@radix-ui/react-switch` | Toggle switch thumb |
| `Separator.Root` | `@radix-ui/react-separator` | Section dividers |

## **9. Data Flow Overview**

1. Page renders with default preference values
2. Initialize all preference state variables
3. Render four settings sections with toggles
4. User toggles a preference
5. Local state updates immediately
6. (Future) Debounced save to backend API

## **10. Data Fetching**

*None - Currently uses local state only (no persistence).*

### **Future Implementation**

| Query Key | Function | Data Type | Enable Conditions |
|-----------|----------|-----------|-------------------|
| `['user-preferences']` | `getUserPreferences` | `UserPreferences` | Future implementation |

## **11. State Management**

### **Notification Preferences**

| State Variable | Type | Default | Description |
|----------------|------|---------|-------------|
| `emailDiscussions` | `boolean` | `true` | Email for new discussions |
| `emailReplies` | `boolean` | `true` | Email for replies |
| `emailMentions` | `boolean` | `true` | Email for mentions |
| `emailDigest` | `boolean` | `false` | Weekly digest email |
| `pushNotifications` | `boolean` | `true` | Browser push notifications |

### **Privacy Settings**

| State Variable | Type | Default | Description |
|----------------|------|---------|-------------|
| `publicProfile` | `boolean` | `true` | Profile visibility |
| `showEmail` | `boolean` | `false` | Show email address |
| `showActivity` | `boolean` | `true` | Show recent activity |
| `showOnlineStatus` | `boolean` | `true` | Display online status |

### **Content Preferences**

| State Variable | Type | Default | Description |
|----------------|------|---------|-------------|
| `autoFollowDiscussions` | `boolean` | `true` | Auto-follow on comment |
| `followNotifications` | `boolean` | `true` | Notifications for followed |
| `showNSFW` | `boolean` | `false` | Show NSFW content |
| `autoPlayVideos` | `boolean` | `false` | Auto-play videos |

### **Display Settings**

| State Variable | Type | Default | Description |
|----------------|------|---------|-------------|
| `compactView` | `boolean` | `false` | Compact content view |
| `showAvatars` | `boolean` | `true` | Display user avatars |
| `showBadges` | `boolean` | `true` | Show achievement badges |
| `highlightMentions` | `boolean` | `true` | Highlight @mentions |

### **Derived State**

*None*

### **Refs**

*None*

## **12. Behaviour Matrix**

| Condition | UI Behaviour |
|-----------|--------------|
| Initial load | All toggles render with default values |
| Toggle clicked | State updates immediately, toggle animates |
| Section expanded | All toggles in section visible |
| (Future) Saving | Save indicator shown |
| (Future) Save error | Error toast displayed |

## **13. User Actions**

### **UI Interactions**

| Action | Trigger | Result |
|--------|---------|--------|
| Toggle notification setting | Click switch | Update notification preference |
| Toggle privacy setting | Click switch | Update privacy preference |
| Toggle content setting | Click switch | Update content preference |
| Toggle display setting | Click switch | Update display preference |

### **Navigation Actions**

*None - self-contained settings page*

## **14. Infinite Scroll / Pagination**

*Not applicable.*

## **15. Error & Empty States**

* **Loading:** No explicit loading state (local state only)
* **Error:** No error handling (local state only)
* **Footer note:** "Changes are saved automatically"

## **16. Performance & Constraints**

* **Rendering strategy:** Client-side rendering (CSR)
* **Memoisation strategy:** None needed for toggle state
* **Parallel vs sequential fetching:** N/A
* **Known constraints:**
  * Preferences not persisted to backend
  * State lost on page refresh
  * No sync across devices

## **17. Accessibility Considerations**

* **Keyboard navigation:** Tab through toggles, Space to activate
* **Focus management:** Focus visible on active toggle
* **Screen reader expectations:** Toggle state announced (on/off)
* **Landmark roles:** Form role, grouped settings sections

## **18. Storybook & Testing Strategy**

### **Storybook**

* Toggle switch component in both states
* Settings section with multiple toggles
* Full preferences page layout

### **Testing**

* **Unit test focus:** Toggle state changes
* **Integration test focus:** Section organization, toggle interactions
* **E2E test focus:** Preference management flow

## **19. Non-Goals / Out of Scope**

* Backend persistence
* Account management (password, email)
* Billing and subscription
* Profile editing
* Theme selection
* Language selection

## **20. Related Routes**

| Route | Relationship |
|-------|--------------|
| `/notifications` | Notification settings affect notification behavior |

## **21. Open Questions / Notes**

* Need to implement backend API persistence
* Consider adding useMutation for saving preferences
* Add loading states during save
* Add success/error toast notifications
* Consider debounced auto-save vs explicit save button

### **Settings Sections**

#### **1. Notifications**
- Email notifications for new discussions
- Email notifications for replies
- Email notifications for mentions
- Weekly digest email
- Push notifications

#### **2. Privacy**
- Public profile visibility
- Show email address
- Show activity
- Show online status

#### **3. Content**
- Auto-follow discussions on comment
- Notifications for followed discussions
- Show NSFW content
- Auto-play videos

#### **4. Display**
- Compact view
- Show avatars
- Show user badges
- Highlight mentions
