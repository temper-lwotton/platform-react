# **Route Specification: Admin Pages Edit**

## **1. Route Path**

**`/admin/pages/[id]/edit`**

## **2. Description**

Page editing interface for modifying existing CMS pages using the rich text PostEditor component with pre-populated content.

* Pre-populated content
* Revision history access
* Compare with published
* Update publishing options

## **3. Source File**

```
src/app/(protected)/admin/pages/[id]/edit/page.tsx
```

## **4. Route Responsibility**

### **This route is responsible for:**

* Loading existing page data
* Rendering editor with content
* Supporting page updates
* Handling publish/schedule changes

### **This route does not:**

* Create new pages
* Manage page listing
* Handle media library

## **5. Authentication & Access Control**

* **Authentication Required:** Yes
* **Allowed Roles:** Admin users only
* **Permission Rules:** Non-admins denied access

## **6. URL Parameters & Query Params**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `id` | `string` | Yes | The page ID to edit (parsed as integer) |

* **Default behaviour:** N/A - id is required
* **Validation:** Invalid id shows error

## **7. Layout & Structure**

### **Layout Overview**

* PostEditor component with postId prop for edit mode
* Shared admin layout wrapper

### **Structural Regions**

| Region | Purpose |
|--------|---------|
| Title Input | Page title (pre-filled) |
| Content Editor | Rich text body (pre-filled) |
| Settings Sidebar | Metadata and options |
| Publish Panel | Update/publish actions |

## **8. Components Used**

### **Layout Components**

| Component | Import Path | Purpose |
|-----------|-------------|---------|
| `PostEditor` | `@/components/cms/posts/PostEditor` | Rich text editor for page editing |

### **React Hooks**

| Hook | Purpose |
|------|---------|
| `use` | Unwrap params Promise (React 19) |

## **9. Data Flow Overview**

1. Verify admin authentication
2. Parse page ID from URL
3. PostEditor fetches existing content
4. Display editor with pre-filled content
5. User edits → auto-save → explicit save

## **10. Data Fetching**

*Handled within PostEditor component when `postId` prop is provided:*
- Fetches existing page content
- Loads current metadata (title, excerpt, slug)
- Retrieves featured image
- Gets current status and publish date

## **11. State Management**

### **Local State**

*Handled within PostEditor component*

### **Derived State**

*None at page level*

### **Refs**

*None at page level*

## **12. Behaviour Matrix**

| Condition | UI Behaviour |
|-----------|--------------|
| Loading | Editor loading skeleton |
| Content loaded | Editor with pre-filled content |
| Invalid ID | Error message |
| Not found | "Page not found" message |
| Unsaved changes | "Unsaved changes" indicator |
| Saving | Save button loading |

## **13. User Actions**

### **UI Interactions**

*Handled by PostEditor component:*
- Modify page title
- Edit page content
- Update featured image
- Adjust SEO settings
- Change publish status
- Update/reschedule publish date
- Save changes
- Revert to previous version
- Preview changes

### **Navigation Actions**

| Action | Trigger | Destination |
|--------|---------|-------------|
| Cancel/Back | Click cancel | `/admin/pages` |
| Save & Continue | After save | Stay on edit page |
| Save & Exit | After save | `/admin/pages` |

### **Data Mutations**

| Action | Trigger | API Call | On Success |
|--------|---------|----------|------------|
| Save changes | Save button | Update API | Show saved |
| Publish | Publish button | Publish API | Update status |
| Unpublish | Unpublish button | Unpublish API | Update status |
| Schedule | Schedule button | Schedule API | Show scheduled |

## **14. Infinite Scroll / Pagination**

*Not applicable.*

## **15. Error & Empty States**

* **Loading:** Editor skeleton
* **Invalid ID:** "Invalid Page ID"
* **Not found:** "Page not found"
* **Save error:** "Failed to save changes"
* **Unsaved changes:** Warning on navigation

## **16. Performance & Constraints**

* **Rendering strategy:** Client-side rendering (CSR)
* **Memoisation strategy:** Handled within PostEditor
* **Parallel vs sequential fetching:** Single page fetch
* **Known constraints:**
  * Large content may slow auto-save
  * Concurrent editing not supported

## **17. Accessibility Considerations**

* **Keyboard navigation:** Tab through editor and controls
* **Focus management:** Focus in title on load
* **Screen reader expectations:** Editor actions announced
* **Landmark roles:** Editor region

## **18. Storybook & Testing Strategy**

### **Storybook**

* PostEditor with pre-filled content
* Various status states
* Save flow

### **Testing**

* **Unit test focus:** ID parsing
* **Integration test focus:** Load and save flows
* **E2E test focus:** Complete page editing

## **19. Non-Goals / Out of Scope**

* Creating new pages
* Page listing
* Media library management

## **20. Related Routes**

| Route | Relationship |
|-------|--------------|
| `/admin/pages` | Pages listing |
| `/admin/pages/new` | Create new page |

## **21. Open Questions / Notes**

* Consider adding revision comparison
* May need autosave improvements
* Consider adding collaborative editing

### **Form Fields**

| Field | Type | Description |
|-------|------|-------------|
| Title | Text input | Page title (pre-filled) |
| Content | Rich text editor | Main page body (pre-filled) |
| Featured Image | Media picker | Header image |
| Excerpt | Textarea | Short description |
| Slug | Text input | URL path segment |
| Status | Select | Draft/Published/Scheduled |
| Publish Date | Date picker | Scheduled publish time |

### **PostEditor Features (Edit Mode)**

The PostEditor component provides:
- Pre-populated rich text content
- All creation features plus:
  - Update existing content
  - Change publication status
  - Revision history access
  - Compare with published version
