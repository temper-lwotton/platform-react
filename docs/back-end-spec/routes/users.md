# **Route Specification: Users**

## **1. Route Path**

**`/users`**

## **2. Description**

Community members directory page with search and filtering.

* Displays all users in searchable grid
* Features sidebar with statistics and newest members
* Supports filtering by company type and transport mode
* Shows connection status for each user

## **3. Source File**

```
src/app/(protected)/users/page.tsx
```

## **4. Route Responsibility**

### **This route is responsible for:**

* Listing all community members
* Providing search functionality
* Filtering by company type and transport mode
* Displaying user statistics
* Showing newest members
* Navigating to individual user profiles

### **This route does not:**

* Create user accounts
* Edit user profiles
* Manage user permissions
* Handle user authentication

## **5. Authentication & Access Control**

* **Authentication Required:** Yes
* **Allowed Roles:** Any authenticated user
* **Permission Rules:** All authenticated users can view the directory

## **6. URL Parameters & Query Params**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `search` | `string` | No | Search term for filtering users |
| `companyType` | `string` | No | Filter by company type |
| `transportMode` | `string` | No | Filter by transport mode |

* **Default behaviour:** Show all users
* **Validation:** Invalid params ignored

## **7. Layout & Structure**

### **Layout Overview**

* Two-column layout
* Main content with sidebar

### **Structural Regions**

| Region | Purpose |
|--------|---------|
| Header | Title, subtitle |
| Filter Bar | Search and filter controls |
| Main Content | User grid with UserCard components |
| Right Sidebar | User stats and newest members |

## **8. Components Used**

### **Layout Components**

*None - custom two-column layout*

### **UI / Feature Components**

| Component | Import Path | Purpose |
|-----------|-------------|---------|
| `UserCard` | `@/components/ui/UserCard` | Display individual user |
| `UsersFilter` | `@/components/ui/UsersFilter` | Search and filter controls |
| `NewestMembers` | `@/components/ui/NewestMembers` | Sidebar: Recent joins |
| `UserStats` | `@/components/ui/UserStats` | Sidebar: Community stats |

## **9. Data Flow Overview**

1. Fetch all users for statistics calculation
2. Fetch filtered users for display
3. Fetch newest members for sidebar
4. Enrich users with connection status
5. Calculate statistics and unique filter values
6. User applies filter → update state → refetch
7. User clicks user → navigate to profile

## **10. Data Fetching**

### **Standard Queries**

| Query Key | Function | Data Type | Enable Conditions |
|-----------|----------|-----------|-------------------|
| `['users', 'all']` | `getUsers()` | `User[]` | For stats calculation |
| `['users', filterParams, currentUserId]` | `getUsers(filterParams)` + enrich | `User[]` | For display |
| `['users', 'newest', currentUserId]` | `getUsers({ sort: 'newest', limit: 5 })` | `User[]` | Newest members |

### **Data Enrichment**

Users are enriched with connection status via `enrichUsersWithConnectionStatus`.

## **11. State Management**

### **Local State**

| State Variable | Type | Purpose |
|----------------|------|---------|
| `filterParams` | `UsersQueryParams` | Current filter settings |

### **Derived State**

| Variable | Dependencies | Purpose |
|----------|--------------|---------|
| `stats` | `allUsers` | Calculate total, new this week, active spaces |
| `companyTypes` | `allUsers` | Extract unique company types for filter |
| `transportModes` | `allUsers` | Extract unique transport modes for filter |

### **Refs**

*None*

## **12. Behaviour Matrix**

| Condition | UI Behaviour |
|-----------|--------------|
| Loading | "Loading members..." |
| Error | "Error loading users. Please try again." |
| Data loaded | User grid with sidebar |
| Empty (with filters) | "Try adjusting your search or filter criteria" |
| Empty (no filters) | "Be the first to join the community" |
| Filter applied | Grid updates to show matching users |

## **13. User Actions**

### **UI Interactions**

| Action | Trigger | Result |
|--------|---------|--------|
| Search users | Enter text in search | Update `filterParams.search` |
| Filter by company type | Select from dropdown | Update `filterParams.companyType` |
| Filter by transport mode | Select from dropdown | Update `filterParams.transportMode` |
| Clear filters | Clear filter inputs | Reset `filterParams` |

### **Navigation Actions**

| Action | Trigger | Destination |
|--------|---------|-------------|
| View user | Click UserCard | `/users/[id]` |

## **14. Infinite Scroll / Pagination**

*Not applicable - all users loaded at once.*

## **15. Error & Empty States**

* **Loading:** "Loading members..."
* **Error:** "Error loading users. Please try again."
* **Empty (with filters):** "Try adjusting your search or filter criteria"
* **Empty (no filters):** "Be the first to join the community"

## **16. Performance & Constraints**

* **Rendering strategy:** Client-side rendering (CSR)
* **Memoisation strategy:** useMemo for stats, companyTypes, transportModes
* **Parallel vs sequential fetching:** Multiple user queries in parallel
* **Known constraints:**
  * All users loaded for stats
  * Connection status requires enrichment
  * Filters dynamically extracted from user data

## **17. Accessibility Considerations**

* **Keyboard navigation:** Tab through filters and cards
* **Focus management:** Focus visible on interactive elements
* **Screen reader expectations:** User names and info announced
* **Landmark roles:** Main content area, complementary sidebar

## **18. Storybook & Testing Strategy**

### **Storybook**

* `UserCard` component variants
* `UsersFilter` component
* `UserStats` component
* `NewestMembers` component

### **Testing**

* **Unit test focus:** Stats calculation, filter logic
* **Integration test focus:** Filter interactions, connection status
* **E2E test focus:** User discovery flow

## **19. Non-Goals / Out of Scope**

* User creation
* User editing
* User deletion
* Permission management

## **20. Related Routes**

| Route | Relationship |
|-------|--------------|
| `/users/[id]` | User profile |

## **21. Open Questions / Notes**

* Consider adding pagination for large communities
* May need server-side search
* Consider adding user recommendations

### **Statistics Calculation**

```typescript
{
  totalUsers: allUsers.length,
  newThisWeek: users created in last 7 days,
  activeSpaces: unique space count across all users
}
```

### **Filter Options**

Dynamically extracted from user data:
- **Company Types**: All unique company types
- **Transport Modes**: All unique transport modes of interest

### **Connection Status Refresh**

`handleConnectionChange` callback refreshes user queries when connection status changes.
