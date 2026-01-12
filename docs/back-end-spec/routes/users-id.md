# **Route Specification: User Profile**

## **1. Route Path**

**`/users/[id]`**

## **2. Description**

User profile detail page showing comprehensive member information.

* Displays bio, interests, and contact information
* Shows connections, spaces, and content tabs
* Features activity statistics
* Supports connection management

## **3. Source File**

```
src/app/(protected)/users/[id]/page.tsx
```

## **4. Route Responsibility**

### **This route is responsible for:**

* Displaying complete user profile information
* Showing tabbed content (connections/spaces/content)
* Rendering activity statistics
* Handling connection requests (connect/disconnect)
* Providing navigation to edit profile (own profile)

### **This route does not:**

* Edit user profiles (see `/users/[id]/edit`)
* Manage user permissions
* Handle account settings
* Process messages (navigates to messages)

## **5. Authentication & Access Control**

* **Authentication Required:** Yes
* **Allowed Roles:** Any authenticated user
* **Permission Rules:** All authenticated users can view profiles

## **6. URL Parameters & Query Params**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `id` | `string` | Yes | The unique identifier of the user |

* **Default behaviour:** N/A - id is required
* **Validation:** Invalid id shows error state

## **7. Layout & Structure**

### **Layout Overview**

* Two-column layout
* Left sidebar with avatar and actions, main content area

### **Structural Regions**

| Region | Purpose |
|--------|---------|
| Left Sidebar | Avatar, name, job/company, action buttons, contact info |
| Interests | Tag cloud of interests |
| About | User bio text |
| Tabbed Content | Connections, Spaces, Content tabs |
| Stats | Activity and meta statistics |

## **8. Components Used**

### **Layout Components**

*None - custom two-column layout*

### **UI / Feature Components**

| Component | Import Path | Purpose |
|-----------|-------------|---------|
| `Icon` | `@/components/ui/Icon` | Various icons throughout |
| `Link` | `next/link` | Navigation links |

## **9. Data Flow Overview**

1. Extract user ID from URL parameters
2. Fetch user data, stats, and connections in parallel
3. Determine if viewing own profile
4. Render profile sections with appropriate actions
5. User interacts with connections → mutation → refetch
6. User switches tabs → update tab state

## **10. Data Fetching**

### **Standard Queries**

| Query Key | Function | Data Type | Enable Conditions |
|-----------|----------|-----------|-------------------|
| `['user', id]` | `getUser(id)` | `User` | `!!id` |
| `['user-stats', id]` | `getUserStats(id)` | `UserStats` | `!!id` |
| `['user-connections', id]` | `getConnections(id)` | `User[]` | `!!id` |

## **11. State Management**

### **Local State**

| State Variable | Type | Purpose |
|----------------|------|---------|
| `activeTab` | `'connections' \| 'spaces' \| 'content'` | Current tab selection |

### **Derived State**

| Variable | Dependencies | Purpose |
|----------|--------------|---------|
| `isOwnProfile` | `currentUserId, id` | Check if viewing own profile |

### **Refs**

*None*

## **12. Behaviour Matrix**

| Condition | UI Behaviour |
|-----------|--------------|
| Loading | "Loading user..." |
| Error / Not found | Error message with back link |
| Own profile | "Edit Profile" button shown |
| Other profile (connected) | "Message" and "Disconnect" buttons |
| Other profile (pending) | Disabled "Request Pending" button |
| Other profile (not connected) | "Connect" button |
| Tab switch | Tab content changes |

## **13. User Actions**

### **UI Interactions**

| Action | Trigger | Result |
|--------|---------|--------|
| Switch tabs | Click tab button | Update `activeTab` |
| Connect | Click "Connect" button | Send connection request |
| Disconnect | Click "Connected" button | Remove connection |

### **Navigation Actions**

| Action | Trigger | Destination |
|--------|---------|-------------|
| Back to users | Click back link | `/users` |
| Edit profile | Click "Edit Profile" | `/users/[id]/edit` |
| View connection | Click connection card | `/users/[connectionId]` |
| View space | Click space card | `/spaces/[spaceId]` |
| Message user | Click "Message" button | `/messages/new?recipientId=[id]` |

### **Data Mutations**

| Action | Trigger | API Call | On Success |
|--------|---------|----------|------------|
| Connect | Click button | `sendConnectionRequest` | Refetch user data |
| Disconnect | Click button | `removeConnection` | Refetch user data |

## **14. Infinite Scroll / Pagination**

*Not applicable.*

## **15. Error & Empty States**

* **Loading:** "Loading user..."
* **Error / Not found:** Error message with back link
* **No connections:** "No connections yet"
* **No spaces:** "Not a member of any spaces"
* **No content:** "No content published yet"

## **16. Performance & Constraints**

* **Rendering strategy:** Client-side rendering (CSR)
* **Memoisation strategy:** None currently
* **Parallel vs sequential fetching:** User, stats, connections in parallel
* **Known constraints:**
  * All connections loaded at once
  * Content tab is placeholder only

## **17. Accessibility Considerations**

* **Keyboard navigation:** Tab through sections and buttons
* **Focus management:** Focus visible on interactive elements
* **Screen reader expectations:** User info and stats announced
* **Landmark roles:** Main content area, navigation for tabs

## **18. Storybook & Testing Strategy**

### **Storybook**

* Profile sidebar variants
* Tab content sections
* Stats display

### **Testing**

* **Unit test focus:** Connection status logic, tab switching
* **Integration test focus:** Connection management flow
* **E2E test focus:** Full profile viewing and interaction

## **19. Non-Goals / Out of Scope**

* Profile editing (see `/users/[id]/edit`)
* Account settings
* Permission management
* Direct messaging (navigates to messages)

## **20. Related Routes**

| Route | Relationship |
|-------|--------------|
| `/users` | Users directory |
| `/users/[id]/edit` | Edit own profile |
| `/spaces/[id]` | Space detail |
| `/messages/new` | Start conversation |

## **21. Open Questions / Notes**

* Content tab needs implementation
* Consider adding profile sharing
* May need activity feed section

### **Profile Sections**

#### **Sidebar Card**
- Large avatar (or initials placeholder)
- Display name
- Job title
- Company name with briefcase icon
- Action buttons (context-dependent)
- Contact information (email, phone, LinkedIn)

#### **Interests**
Tag cloud of user interests.

#### **About**
User bio text.

#### **Tabbed Content**

**Connections Tab**: Grid of connection cards
**Spaces Tab**: Administrator and Member groups
**Content Tab**: Placeholder for published content

#### **Activity & Stats**

8 stat cards:
- Discussions Started
- Replies Made
- Events Created
- Resources Shared
- Showcases Published
- Updates Posted
- Likes Received
- Likes Given

Meta stats:
- Member since date
- Last active relative time
- Most active space (with link)

### **Connection Status Handling**

| Status | Actions Available |
|--------|-------------------|
| Connected | Message, Disconnect |
| Pending | Disabled "Request Pending" button |
| Not connected | Connect button |
