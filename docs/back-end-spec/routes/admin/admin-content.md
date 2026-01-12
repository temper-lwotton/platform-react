# **Route Specification: Admin Content**

## **1. Route Path**

**`/admin/content`**

## **2. Description**

Content management dashboard providing an overview of all content with filtering, search, and bulk actions.

* Posts, pages, and media management
* Status filtering and search
* Bulk operations
* Content statistics

## **3. Source File**

```
src/app/(protected)/admin/content/page.tsx
```

## **4. Route Responsibility**

### **This route is responsible for:**

* Displaying content listings
* Providing search and filter functionality
* Supporting bulk operations
* Navigating to content editor

### **This route does not:**

* Edit individual content items
* Manage media library (separate route)
* Handle publishing directly (delegated to editor)

## **5. Authentication & Access Control**

* **Authentication Required:** Yes
* **Allowed Roles:** Admin users only
* **Permission Rules:** Non-admins denied access

## **6. URL Parameters & Query Params**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `type` | `string` | No | Filter by content type |
| `status` | `string` | No | Filter by status |
| `search` | `string` | No | Search query |
| `page` | `number` | No | Page number |

* **Default behaviour:** Show all content
* **Validation:** Invalid params use defaults

## **7. Layout & Structure**

### **Layout Overview**

* Full ContentDashboard component rendering
* Filters, content grid, bulk actions

### **Structural Regions**

| Region | Purpose |
|--------|---------|
| Filters | Type/status/search controls |
| Content Grid | List of content items |
| Bulk Actions | Selected items actions |
| Statistics | Content counts by status |

## **8. Components Used**

### **Layout Components**

| Component | Import Path | Purpose |
|-----------|-------------|---------|
| `ContentDashboard` | `@/components/cms/content/ContentDashboard` | Complete content management interface |

### **UI / Feature Components**

*All handled within ContentDashboard component*

## **9. Data Flow Overview**

1. Verify admin authentication
2. Fetch content with current filters
3. Display content grid with metadata
4. User filters/searches → refetch
5. User selects items → enable bulk actions
6. User clicks item → navigate to editor

## **10. Data Fetching**

*Handled within ContentDashboard component. Typically includes:*
- Content listings
- Content statistics
- Filtering options

## **11. State Management**

### **Local State**

*Handled within ContentDashboard component*

### **Derived State**

*None at page level*

### **Refs**

*None at page level*

## **12. Behaviour Matrix**

| Condition | UI Behaviour |
|-----------|--------------|
| Loading | Content grid loading skeleton |
| Data loaded | Content grid with items |
| Empty | "No content found" message |
| Items selected | Bulk action bar appears |
| Bulk action success | Success message, refetch |

## **13. User Actions**

### **UI Interactions**

*Handled by ContentDashboard component:*
- Search content
- Filter by type/status
- View/edit content items
- Bulk operations
- Create new content

### **Navigation Actions**

| Action | Trigger | Destination |
|--------|---------|-------------|
| View calendar | Click calendar button | `/admin/content/calendar` |
| Create content | Click new button | `/admin/content/new` |
| Edit content | Click item | `/admin/content/[id]` |

### **Data Mutations**

| Action | Trigger | API Call | On Success |
|--------|---------|----------|------------|
| Bulk publish | Bulk action | Publish API | Refetch, show success |
| Bulk delete | Bulk action | Delete API | Refetch, show success |
| Bulk archive | Bulk action | Archive API | Refetch, show success |

## **14. Infinite Scroll / Pagination**

* **Type:** Traditional pagination
* **Page size:** Configurable (default 20)
* **Controls:** Page numbers with previous/next

## **15. Error & Empty States**

* **Loading:** Grid loading skeleton
* **Error:** "Failed to load content"
* **Empty (with filters):** "No content matches your filters"
* **Empty (no filters):** "No content yet. Create your first piece of content."

## **16. Performance & Constraints**

* **Rendering strategy:** Client-side rendering (CSR)
* **Memoisation strategy:** Handled within ContentDashboard
* **Parallel vs sequential fetching:** Content and stats in parallel
* **Known constraints:**
  * Large content libraries may be slow
  * Search is server-side

## **17. Accessibility Considerations**

* **Keyboard navigation:** Tab through grid items and controls
* **Focus management:** Handled by ContentDashboard
* **Screen reader expectations:** Content titles and status announced
* **Landmark roles:** Main content area, filters

## **18. Storybook & Testing Strategy**

### **Storybook**

* ContentDashboard with various states
* Filter combinations
* Bulk action states

### **Testing**

* **Unit test focus:** Filter logic, selection state
* **Integration test focus:** Bulk operations
* **E2E test focus:** Content management flow

## **19. Non-Goals / Out of Scope**

* Content editing (see editor routes)
* Media management
* Template management

## **20. Related Routes**

| Route | Relationship |
|-------|--------------|
| `/admin/content/calendar` | Content calendar |
| `/admin/content/new` | Create content |

## **21. Open Questions / Notes**

* Consider adding content versioning
* May need content import/export
* Consider adding quick edit inline

### **Content Dashboard Features**

The ContentDashboard component typically provides:
- Content listing with filters
- Search functionality
- Status filters (published, draft, scheduled)
- Bulk actions (publish, delete, archive)
- Content statistics
- Quick actions for each item
