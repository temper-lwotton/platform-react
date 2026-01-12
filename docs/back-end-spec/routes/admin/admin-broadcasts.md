# **Route Specification: Admin Broadcasts**

## **1. Route Path**

**`/admin/broadcasts`**

## **2. Description**

Broadcasts management dashboard for creating and managing email campaigns, push notifications, and in-app announcements.

* Campaign listing with status
* Statistics overview
* Audience targeting management
* Scheduling capabilities

## **3. Source File**

```
src/app/(protected)/admin/broadcasts/page.tsx
```

## **4. Route Responsibility**

### **This route is responsible for:**

* Listing all broadcasts/campaigns
* Displaying campaign statistics
* Providing filtering and search
* Navigating to campaign editor

### **This route does not:**

* Create new broadcasts (see /new)
* Edit broadcast content
* Manage audience segments directly

## **5. Authentication & Access Control**

* **Authentication Required:** Yes
* **Allowed Roles:** Admin users only
* **Permission Rules:** Non-admins denied access

## **6. URL Parameters & Query Params**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `status` | `string` | No | Filter by status |
| `type` | `string` | No | Filter by type (email/push/in-app) |
| `search` | `string` | No | Search query |

* **Default behaviour:** Show all broadcasts
* **Validation:** Invalid params use defaults

## **7. Layout & Structure**

### **Layout Overview**

* Full BroadcastsDashboard component rendering
* Filters, campaign grid, statistics

### **Structural Regions**

| Region | Purpose |
|--------|---------|
| Statistics | Overall campaign metrics |
| Filters | Status/type/search controls |
| Campaign Grid | List of broadcasts |
| Actions | Create new button |

## **8. Components Used**

### **Layout Components**

| Component | Import Path | Purpose |
|-----------|-------------|---------|
| `BroadcastsDashboard` | `@/components/cms/broadcasts/BroadcastsDashboard` | Broadcasts management interface |

### **UI / Feature Components**

*All handled within BroadcastsDashboard component*

## **9. Data Flow Overview**

1. Verify admin authentication
2. Fetch broadcasts with filters
3. Fetch overall statistics
4. Display campaign grid
5. User filters → refetch
6. User clicks campaign → navigate to editor

## **10. Data Fetching**

*Handled within BroadcastsDashboard component. Typically includes:*
- Broadcast listings
- Campaign statistics
- Audience segments

## **11. State Management**

### **Local State**

*Handled within BroadcastsDashboard component*

### **Derived State**

*None at page level*

### **Refs**

*None at page level*

## **12. Behaviour Matrix**

| Condition | UI Behaviour |
|-----------|--------------|
| Loading | Dashboard loading skeleton |
| Data loaded | Campaign grid with stats |
| Empty | "No broadcasts yet" message |
| Campaign sent | Shows send statistics |
| Campaign scheduled | Shows schedule info |

## **13. User Actions**

### **UI Interactions**

*Handled by BroadcastsDashboard component:*
- View broadcast list
- Filter by status/type
- View campaign statistics
- Edit existing broadcasts
- Delete broadcasts
- Duplicate broadcasts

### **Navigation Actions**

| Action | Trigger | Destination |
|--------|---------|-------------|
| Create broadcast | Click new button | `/admin/broadcasts/new` |
| Edit broadcast | Click edit | `/admin/broadcasts/[id]` |

### **Data Mutations**

| Action | Trigger | API Call | On Success |
|--------|---------|----------|------------|
| Delete broadcast | Click delete | Delete API | Refetch list |
| Duplicate | Click duplicate | Duplicate API | Navigate to new |

## **14. Infinite Scroll / Pagination**

* **Type:** Traditional pagination
* **Page size:** 20 broadcasts per page
* **Controls:** Previous/next with page indicator

## **15. Error & Empty States**

* **Loading:** Dashboard skeleton
* **Error:** "Failed to load broadcasts"
* **Empty:** "No broadcasts yet. Create your first campaign."

## **16. Performance & Constraints**

* **Rendering strategy:** Client-side rendering (CSR)
* **Memoisation strategy:** Handled within BroadcastsDashboard
* **Parallel vs sequential fetching:** Broadcasts and stats in parallel
* **Known constraints:**
  * Statistics may have slight delay
  * Large lists paginated

## **17. Accessibility Considerations**

* **Keyboard navigation:** Tab through campaigns and controls
* **Focus management:** Handled by BroadcastsDashboard
* **Screen reader expectations:** Campaign names and status announced
* **Landmark roles:** Main dashboard area

## **18. Storybook & Testing Strategy**

### **Storybook**

* BroadcastsDashboard with various states
* Campaign cards with statistics
* Filter combinations

### **Testing**

* **Unit test focus:** Filter logic, statistics display
* **Integration test focus:** Campaign operations
* **E2E test focus:** Broadcast management flow

## **19. Non-Goals / Out of Scope**

* Campaign creation/editing
* Audience segment management
* Email template editing

## **20. Related Routes**

| Route | Relationship |
|-------|--------------|
| `/admin/broadcasts/new` | Create broadcast |
| `/admin/broadcasts/[id]` | Edit broadcast |

## **21. Open Questions / Notes**

* Consider adding A/B testing features
* May need automation/trigger campaigns
* Consider adding campaign templates

### **Broadcasts Dashboard Features**

The BroadcastsDashboard component typically provides:
- Broadcast listing with status
- Campaign statistics (sent, opened, clicked)
- Filtering by type and status
- Scheduling options
- Audience targeting
