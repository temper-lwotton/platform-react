# **Route Specification: Admin Pages New**

## **1. Route Path**

**`/admin/pages/new`**

## **2. Description**

Page creation interface for creating new CMS pages using the rich text PostEditor component.

* Rich text editing
* Featured image selection
* SEO settings
* Publishing options

## **3. Source File**

```
src/app/(protected)/admin/pages/new/page.tsx
```

## **4. Route Responsibility**

### **This route is responsible for:**

* Rendering page editor in create mode
* Supporting page creation
* Handling publish/schedule/draft actions

### **This route does not:**

* Edit existing pages
* Manage page listing
* Handle media library

## **5. Authentication & Access Control**

* **Authentication Required:** Yes
* **Allowed Roles:** Admin users only
* **Permission Rules:** Non-admins denied access

## **6. URL Parameters & Query Params**

*None*

## **7. Layout & Structure**

### **Layout Overview**

* Full PostEditor component in create mode
* Shared admin layout wrapper

### **Structural Regions**

| Region | Purpose |
|--------|---------|
| Title Input | Page title |
| Content Editor | Rich text body |
| Settings Sidebar | Metadata and options |
| Publish Panel | Save/publish actions |

## **8. Components Used**

### **Layout Components**

| Component | Import Path | Purpose |
|-----------|-------------|---------|
| `PostEditor` | `@/components/cms/posts/PostEditor` | Rich text editor for page creation |

### **UI / Feature Components**

*All handled within PostEditor component*

## **9. Data Flow Overview**

1. Verify admin authentication
2. Initialize empty page state
3. User writes content in editor
4. User configures settings
5. User saves → persist → redirect or stay

## **10. Data Fetching**

*None - new page creation mode. PostEditor initializes with empty content.*

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
| Page loaded | Empty editor ready |
| Content typed | Auto-save indicator |
| Draft saved | "Draft saved" confirmation |
| Publishing | Publish button loading |
| Published | Redirect or show success |

## **13. User Actions**

### **UI Interactions**

*Handled by PostEditor component:*
- Enter page title
- Write page content with rich formatting
- Add media/images
- Configure SEO metadata
- Set featured image
- Save as draft
- Publish immediately
- Schedule for future publication
- Preview page

### **Navigation Actions**

| Action | Trigger | Destination |
|--------|---------|-------------|
| Cancel/Back | Click cancel | `/admin/pages` |
| Save & View | After save | `/admin/pages` or preview |

### **Data Mutations**

| Action | Trigger | API Call | On Success |
|--------|---------|----------|------------|
| Save draft | Save button | Create API | Show saved |
| Publish | Publish button | Publish API | Redirect |
| Schedule | Schedule button | Schedule API | Show scheduled |

## **14. Infinite Scroll / Pagination**

*Not applicable.*

## **15. Error & Empty States**

* **Save error:** "Failed to save page"
* **Publish error:** "Failed to publish page"
* **Validation error:** Field-level messages

## **16. Performance & Constraints**

* **Rendering strategy:** Client-side rendering (CSR)
* **Memoisation strategy:** Handled within PostEditor
* **Parallel vs sequential fetching:** None needed
* **Known constraints:**
  * Large content may slow auto-save
  * Media uploads have size limits

## **17. Accessibility Considerations**

* **Keyboard navigation:** Tab through editor and controls
* **Focus management:** Focus in title on load
* **Screen reader expectations:** Editor actions announced
* **Landmark roles:** Editor region

## **18. Storybook & Testing Strategy**

### **Storybook**

* PostEditor empty state
* Various editing states
* Publish flow

### **Testing**

* **Unit test focus:** Editor functionality
* **Integration test focus:** Save and publish flows
* **E2E test focus:** Complete page creation

## **19. Non-Goals / Out of Scope**

* Editing existing pages
* Page listing
* Media library management

## **20. Related Routes**

| Route | Relationship |
|-------|--------------|
| `/admin/pages` | Pages listing |
| `/admin/pages/[id]/edit` | Edit page |

## **21. Open Questions / Notes**

* Consider adding page templates
* May need revision preview
* Consider adding collaborative editing

### **Form Fields**

| Field | Type | Description |
|-------|------|-------------|
| Title | Text input | Page title |
| Content | Rich text editor | Main page body |
| Featured Image | Media picker | Header image |
| Excerpt | Textarea | Short description |
| Slug | Text input | URL path segment |
| Status | Select | Draft/Published/Scheduled |
| Publish Date | Date picker | Scheduled publish time |

### **PostEditor Features**

The PostEditor component provides:
- Rich text editing (Lexical editor)
- Title input
- Content body editor
- Featured image selection
- SEO settings
- Publishing options (draft, publish, schedule)
- Category/tag assignment
- Excerpt editing
- URL slug configuration
