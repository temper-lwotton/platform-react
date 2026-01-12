# **Route Specification: My Content**

## **1. Route Path**

**`/my-content`**

## **2. Description**

Personal content management page for viewing and managing user-created content.

* Displays user's discussions and events in table format
* Supports filtering by content type and status
* Provides navigation to content detail pages
* Shows publication status for each item

## **3. Source File**

```
src/app/(protected)/my-content/page.tsx
```

## **4. Route Responsibility**

### **This route is responsible for:**

* Displaying all content created by the current user
* Filtering content by type (discussions/events)
* Filtering content by status (published/draft)
* Rendering tabular view with metadata
* Providing navigation to content detail pages

### **This route does not:**

* Create new content
* Edit existing content
* Delete content
* Manage content from other users
* Handle content publication workflow

## **5. Authentication & Access Control**

* **Authentication Required:** Yes
* **Allowed Roles:** Any authenticated user
* **Permission Rules:** Users see only content they have authored

## **6. URL Parameters & Query Params**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `type` | `string` | No | Filter by content type (discussions/events) |
| `status` | `string` | No | Filter by status (published/draft) |

* **Default behaviour:** Show all content types and statuses
* **Validation:** Invalid params ignored

## **7. Layout & Structure**

### **Layout Overview**

* Single column layout
* Header with filters, table below

### **Structural Regions**

| Region | Purpose |
|--------|---------|
| Header | Title and subtitle |
| Filters | Type filter, status filter |
| Content Table | Tabular display of user's content |

## **8. Components Used**

### **Layout Components**

*None - simple page structure*

### **UI / Feature Components**

| Component | Import Path | Purpose |
|-----------|-------------|---------|
| `Icon` | `@/components/ui/Icon` | Type icons, stat icons, empty state |
| `Link` | `next/link` | Navigation to content and spaces |

### **Types**

| Type | Description |
|------|-------------|
| `ContentItem` | Combined Discussion or Event with contentType and status |

## **9. Data Flow Overview**

1. Resolve authenticated user ID
2. Fetch user's discussions and events in parallel
3. Combine into unified ContentItem array
4. Apply type and status filters
5. Render table with filtered content
6. User interaction updates filters or navigates

## **10. Data Fetching**

### **Standard Queries**

| Query Key | Function | Data Type | Enable Conditions |
|-----------|----------|-----------|-------------------|
| `['my-discussions']` | `getDiscussions()` | `Discussion[]` | `isClient && !!currentUserId` |
| `['my-events']` | `getEvents()` | `Event[]` | `isClient && !!currentUserId` |

## **11. State Management**

### **Local State**

| State Variable | Type | Purpose |
|----------------|------|---------|
| `currentUserId` | `string \| null` | Current authenticated user ID |
| `isClient` | `boolean` | Hydration check for client-side rendering |
| `filter` | `'all' \| 'discussions' \| 'events'` | Content type filter |
| `statusFilter` | `'all' \| 'published' \| 'draft'` | Publication status filter |

### **Derived State**

| Variable | Dependencies | Purpose |
|----------|--------------|---------|
| `contentItems` | `discussions, events` | Combined content with type annotations |
| `filteredContent` | `contentItems, filter, statusFilter` | Content matching active filters |

### **Refs**

*None*

### **Content Item Type**

```typescript
type ContentItem = (Discussion | Event) & {
  contentType: 'discussion' | 'event';
  status: 'published' | 'draft';
};
```

## **12. Behaviour Matrix**

| Condition | UI Behaviour |
|-----------|--------------|
| Loading initial data | "Loading your content..." message |
| Not authenticated | Returns null (no render) |
| Data loaded | Table rendered with content |
| No content | Empty state with icon and message |
| Type filter applied | Table shows only matching type |
| Status filter applied | Table shows only matching status |

## **13. User Actions**

### **UI Interactions**

| Action | Trigger | Result |
|--------|---------|--------|
| Filter by type | Click type button (All/Discussions/Events) | Update `filter` state |
| Filter by status | Click status button (All/Published/Draft) | Update `statusFilter` state |

### **Navigation Actions**

| Action | Trigger | Destination |
|--------|---------|-------------|
| View discussion | Click title link | `/spaces/[spaceId]/discussions/[id]` |
| View event | Click title link | `/events/[id]` |
| View space | Click space link | `/spaces/[spaceId]` |
| View action | Click "View" button | Content detail page |

## **14. Infinite Scroll / Pagination**

*Not applicable - all user content loaded at once.*

## **15. Error & Empty States**

* **Loading:** "Loading your content..." message
* **Not authenticated:** Returns null (no render)
* **Empty state:**
  * Icon (fileText)
  * "No content yet" title
  * "Start creating discussions or events to see them here" message
* **Error:** Standard error handling via React Query

## **16. Performance & Constraints**

* **Rendering strategy:** Client-side rendering (CSR) with hydration
* **Memoisation strategy:** Filter calculations on each render
* **Parallel vs sequential fetching:** Discussions and events fetched in parallel
* **Known constraints:**
  * Fetches all user content (no pagination)
  * Filter state not persisted in URL

## **17. Accessibility Considerations**

* **Keyboard navigation:** Tab through filters and table rows
* **Focus management:** Focus visible on interactive elements
* **Screen reader expectations:** Table structure with headers, filter state announced
* **Landmark roles:** Main content area, table with proper semantics

## **18. Storybook & Testing Strategy**

### **Storybook**

* Table row component with different content types
* Empty state display
* Filter button states

### **Testing**

* **Unit test focus:** Filter logic, content type combination
* **Integration test focus:** Filter interactions, navigation
* **E2E test focus:** Full content management flow

## **19. Non-Goals / Out of Scope**

* Content creation
* Content editing
* Content deletion
* Bulk actions
* Content reordering
* Export functionality

## **20. Related Routes**

| Route | Relationship |
|-------|--------------|
| `/spaces/[id]/discussions/[discussionId]` | View discussion detail |
| `/events/[id]` | View event detail |
| `/spaces/[id]` | Parent space page |

## **21. Open Questions / Notes**

* Consider adding pagination for users with many items
* May need bulk selection and actions
* Consider adding content search
* Draft editing flow needs definition

### **Table Columns**

| Column | Description |
|--------|-------------|
| Type | Badge showing "Discussion" or "Event" |
| Title | Clickable link to content |
| Space | Link to parent space |
| Created | Formatted creation date |
| Status | Badge showing publication status |
| Stats | Likes/comments for discussions, date for events |
| Actions | View button |
