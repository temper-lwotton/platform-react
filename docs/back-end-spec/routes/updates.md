# **Route Specification: Updates**

## **1. Route Path**

**`/updates`**

## **2. Description**

Updates and announcements listing page for organizational communications.

* Displays updates filtered by priority and category
* Shows important news, milestones, policy changes
* Supports filtering by priority level and category type

## **3. Source File**

```
src/app/(protected)/updates/page.tsx
```

## **4. Route Responsibility**

### **This route is responsible for:**

* Listing all organizational updates
* Filtering updates by priority (urgent/high/normal/low)
* Filtering updates by category (news/milestone/policy/announcement)
* Navigating to individual update detail pages
* Providing navigation to create new updates

### **This route does not:**

* Create updates (see `/updates/new`)
* Edit or delete updates
* Manage update notifications
* Handle update expiration

## **5. Authentication & Access Control**

* **Authentication Required:** Yes
* **Allowed Roles:** Any authenticated user
* **Permission Rules:** Shows all updates from accessible spaces

## **6. URL Parameters & Query Params**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `priority` | `string` | No | Filter by priority level |
| `category` | `string` | No | Filter by category |

* **Default behaviour:** Show all priorities and categories
* **Validation:** Invalid params ignored

## **7. Layout & Structure**

### **Layout Overview**

* Single column layout with container
* Header with filters, then content grid

### **Structural Regions**

| Region | Purpose |
|--------|---------|
| Header | Title, subtitle, "Create Update" button |
| Filters | Priority and category filter buttons |
| Content Grid | Grid of UpdateCard components |

## **8. Components Used**

### **Layout Components**

*None - simple container layout*

### **UI / Feature Components**

| Component | Import Path | Purpose |
|-----------|-------------|---------|
| `UpdateCard` | `@/components/ui/UpdateCard` | Display individual update |
| `Icon` | `@/components/ui/Icon` | Category icons, button icons |
| `Link` | `next/link` | Navigation to create page |

## **9. Data Flow Overview**

1. Resolve authenticated user
2. Fetch all updates
3. Apply priority and category filters
4. Render filter controls and update grid
5. User clicks filter → update state → re-render
6. User clicks update → navigate to detail

## **10. Data Fetching**

### **Standard Queries**

| Query Key | Function | Data Type | Enable Conditions |
|-----------|----------|-----------|-------------------|
| `['current-user']` | `fetchCurrentUser` | `User` | `isClient && !!currentUserId` |
| `['all-updates']` | `getUpdates` | `Update[]` | `isClient && !!currentUserId` |

## **11. State Management**

### **Local State**

| State Variable | Type | Purpose |
|----------------|------|---------|
| `currentUserId` | `string \| null` | Current user ID |
| `isClient` | `boolean` | Hydration check |
| `priorityFilter` | `'all' \| 'low' \| 'normal' \| 'high' \| 'urgent'` | Priority filter |
| `categoryFilter` | `'all' \| 'news' \| 'milestone' \| 'policy' \| 'announcement' \| 'other'` | Category filter |

### **Derived State**

| Variable | Dependencies | Purpose |
|----------|--------------|---------|
| `filteredUpdates` | `updates, priorityFilter, categoryFilter` | Updates matching active filters |

### **Refs**

*None*

## **12. Behaviour Matrix**

| Condition | UI Behaviour |
|-----------|--------------|
| Not authenticated | Returns null |
| Loading | "Loading updates..." |
| Data loaded | UpdateCard grid displayed |
| Empty (with filters) | "Try adjusting your filters to see more updates" |
| Empty (no filters) | "Updates and announcements will appear here" |
| Filter applied | Grid updates to show matching items |

## **13. User Actions**

### **UI Interactions**

| Action | Trigger | Result |
|--------|---------|--------|
| Filter by priority | Click priority button | Update `priorityFilter` |
| Filter by category | Click category button | Update `categoryFilter` |
| Clear filters | Click "All" buttons | Reset filters |

### **Navigation Actions**

| Action | Trigger | Destination |
|--------|---------|-------------|
| Create update | Click "Create Update" | `/updates/new` |
| View update | Click UpdateCard | `/updates/[id]` |

## **14. Infinite Scroll / Pagination**

*Not applicable - all updates loaded at once.*

## **15. Error & Empty States**

* **Not authenticated:** Returns null
* **Loading:** "Loading updates..."
* **Empty (with filters):** "Try adjusting your filters to see more updates"
* **Empty (no filters):** "Updates and announcements will appear here"

## **16. Performance & Constraints**

* **Rendering strategy:** Client-side rendering (CSR)
* **Memoisation strategy:** Filter on state change
* **Parallel vs sequential fetching:** User then updates
* **Known constraints:**
  * All updates loaded at once
  * Client-side filtering only

## **17. Accessibility Considerations**

* **Keyboard navigation:** Tab through filters and cards
* **Focus management:** Focus visible on filter buttons
* **Screen reader expectations:** Filter state announced, card content accessible
* **Landmark roles:** Main content area

## **18. Storybook & Testing Strategy**

### **Storybook**

* `UpdateCard` component variants
* Filter button states
* Empty states

### **Testing**

* **Unit test focus:** Filter logic
* **Integration test focus:** Filter interactions
* **E2E test focus:** Update discovery flow

## **19. Non-Goals / Out of Scope**

* Update creation (see `/updates/new`)
* Update editing
* Update deletion
* Expiration handling

## **20. Related Routes**

| Route | Relationship |
|-------|--------------|
| `/updates/new` | Create new update |
| `/updates/[id]` | Update detail |

## **21. Open Questions / Notes**

* Consider adding pagination
* May need server-side filtering
* Consider adding search functionality

### **Filter Options**

#### **Priority Filters**

| Filter | Description |
|--------|-------------|
| All | Show all priorities |
| Urgent | Urgent priority only |
| High | High priority only |
| Normal | Normal priority only |
| Low | Low priority only |

#### **Category Filters**

| Filter | Icon | Description |
|--------|------|-------------|
| All | - | Show all categories |
| Announcements | `bell` | General announcements |
| News | `feed` | News updates |
| Milestones | `star` | Achievement milestones |
| Policy | `fileText` | Policy changes |
