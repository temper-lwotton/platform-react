# **Route Specification: Admin Pages**

## **1. Route Path**

**`/admin/pages`**

## **2. Description**

Admin pages listing view showing all CMS pages with management capabilities using the reusable PostsList component.

* Paginated page listing
* Status filtering and search
* Bulk actions
* Quick edit capabilities

## **3. Source File**

```
src/app/(protected)/admin/pages/page.tsx
```

## **4. Route Responsibility**

### **This route is responsible for:**

* Listing all CMS pages
* Providing search and filter functionality
* Supporting bulk operations
* Navigating to page editor

### **This route does not:**

* Edit page content (see /new and /[id]/edit)
* Manage other content types
* Handle media

## **5. Authentication & Access Control**

* **Authentication Required:** Yes
* **Allowed Roles:** Admin users only
* **Permission Rules:** Non-admins denied access

## **6. URL Parameters & Query Params**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `status` | `string` | No | Filter by status |
| `search` | `string` | No | Search query |
| `page` | `number` | No | Page number |

* **Default behaviour:** Show all pages
* **Validation:** Invalid params use defaults

## **7. Layout & Structure**

### **Layout Overview**

* Full PostsList component rendering
* Shared admin layout wrapper

### **Structural Regions**

| Region | Purpose |
|--------|---------|
| Header | Title and create button |
| Filters | Status/search controls |
| Page List | Table of pages |
| Bulk Actions | Selected items actions |

## **8. Components Used**

### **Layout Components**

| Component | Import Path | Purpose |
|-----------|-------------|---------|
| `PostsList` | `@/components/cms/posts/PostsList` | Reusable posts/pages listing interface |

### **UI / Feature Components**

*All handled within PostsList component*

## **9. Data Flow Overview**

1. Verify admin authentication
2. Fetch pages with filters
3. Display page list with metadata
4. User filters → refetch
5. User clicks page → navigate to editor

## **10. Data Fetching**

*Handled within PostsList component. Typically includes:*
- Pages list with metadata
- Status information (published, draft, scheduled)
- Author details
- Pagination data

## **11. State Management**

### **Local State**

*Handled within PostsList component*

### **Derived State**

*None at page level*

### **Refs**

*None at page level*

## **12. Behaviour Matrix**

| Condition | UI Behaviour |
|-----------|--------------|
| Loading | List loading skeleton |
| Data loaded | Page list with actions |
| Empty | "No pages yet" message |
| Items selected | Bulk action bar appears |

## **13. User Actions**

### **UI Interactions**

*Handled by PostsList component:*
- View all pages
- Filter by status
- Search pages
- Create new page
- Edit existing page
- Delete page
- Bulk operations

### **Navigation Actions**

| Action | Trigger | Destination |
|--------|---------|-------------|
| Create new page | Click "New" button | `/admin/pages/new` |
| Edit page | Click edit action | `/admin/pages/[id]/edit` |

### **Data Mutations**

| Action | Trigger | API Call | On Success |
|--------|---------|----------|------------|
| Delete page | Delete button | Delete API | Refetch |
| Bulk publish | Bulk action | Publish API | Refetch |
| Bulk delete | Bulk action | Delete API | Refetch |

## **14. Infinite Scroll / Pagination**

* **Type:** Traditional pagination
* **Page size:** 20 pages per page
* **Controls:** Page numbers with previous/next

## **15. Error & Empty States**

* **Loading:** List skeleton
* **Error:** "Failed to load pages"
* **Empty:** "No pages yet. Create your first page."

## **16. Performance & Constraints**

* **Rendering strategy:** Client-side rendering (CSR)
* **Memoisation strategy:** Handled within PostsList
* **Parallel vs sequential fetching:** Single pages query
* **Known constraints:**
  * Large page lists paginated
  * Search is server-side

## **17. Accessibility Considerations**

* **Keyboard navigation:** Tab through rows and controls
* **Focus management:** Handled by PostsList
* **Screen reader expectations:** Page titles and status announced
* **Landmark roles:** Main list area

## **18. Storybook & Testing Strategy**

### **Storybook**

* PostsList with various states
* Filter combinations
* Bulk action states

### **Testing**

* **Unit test focus:** Filter logic
* **Integration test focus:** Bulk operations
* **E2E test focus:** Page management flow

## **19. Non-Goals / Out of Scope**

* Page content editing
* Media management
* Template editing

## **20. Related Routes**

| Route | Relationship |
|-------|--------------|
| `/admin/pages/new` | Create new page |
| `/admin/pages/[id]/edit` | Edit page |
| `/admin/content` | Content overview |

## **21. Open Questions / Notes**

* Consider adding page templates
* May need page hierarchy/parent-child
* Consider adding page revisions

### **PostsList Features (for Pages)**

The PostsList component provides:
- Paginated list of pages
- Status filters (all, published, draft)
- Search functionality
- Bulk actions
- Quick edit capabilities
- Sorting options
