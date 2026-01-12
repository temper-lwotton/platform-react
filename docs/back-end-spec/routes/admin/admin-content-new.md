# **Route Specification: Admin Content New**

## **1. Route Path**

**`/admin/content/new`**

## **2. Description**

Content creation page with a full-featured composer for creating new posts, pages, or other content types.

* Rich text editor
* Media insertion
* Taxonomy assignment
* Publishing options

## **3. Source File**

```
src/app/(protected)/admin/content/new/page.tsx
```

## **4. Route Responsibility**

### **This route is responsible for:**

* Rendering content composer
* Supporting content creation
* Handling publish/schedule/draft actions

### **This route does not:**

* Edit existing content
* Manage media library
* Handle bulk operations

## **5. Authentication & Access Control**

* **Authentication Required:** Yes
* **Allowed Roles:** Admin users only
* **Permission Rules:** Non-admins denied access

## **6. URL Parameters & Query Params**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `type` | `string` | No | Pre-select content type |
| `date` | `string` | No | Pre-fill scheduled date |

* **Default behaviour:** Default content type selected
* **Validation:** Invalid type defaults to post

## **7. Layout & Structure**

### **Layout Overview**

* Full ContentComposer component rendering
* Editor, sidebar, publish controls

### **Structural Regions**

| Region | Purpose |
|--------|---------|
| Editor | Rich text content area |
| Sidebar | Settings and metadata |
| Publish Panel | Save/publish actions |

## **8. Components Used**

### **Layout Components**

| Component | Import Path | Purpose |
|-----------|-------------|---------|
| `ContentComposer` | `@/components/cms/content/ContentComposer` | Full-featured content editor |

### **UI / Feature Components**

*All handled within ContentComposer component*

## **9. Data Flow Overview**

1. Verify admin authentication
2. Initialize empty content state
3. User writes content in editor
4. User configures settings in sidebar
5. User saves → draft saved
6. User publishes → content published → redirect

## **10. Data Fetching**

*Handled within ContentComposer component. Typically includes:*
- Available taxonomies
- Media library access
- Template options

## **11. State Management**

### **Local State**

*Handled within ContentComposer component*

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
| Published | Redirect to content list |

## **13. User Actions**

### **UI Interactions**

*Handled by ContentComposer component:*
- Write/edit content
- Insert media
- Assign taxonomies
- Set featured image
- Configure SEO
- Save draft
- Publish
- Schedule publication
- Preview

### **Navigation Actions**

| Action | Trigger | Destination |
|--------|---------|-------------|
| Cancel | Click cancel | `/admin/content` |
| View published | After publish | `/admin/content` or content URL |

### **Data Mutations**

| Action | Trigger | API Call | On Success |
|--------|---------|----------|------------|
| Save draft | Auto-save or button | Create/update API | Show saved |
| Publish | Publish button | Publish API | Redirect |
| Schedule | Schedule button | Schedule API | Show scheduled |

## **14. Infinite Scroll / Pagination**

*Not applicable.*

## **15. Error & Empty States**

* **Save error:** "Failed to save draft"
* **Publish error:** "Failed to publish content"
* **Validation error:** Field-level messages

## **16. Performance & Constraints**

* **Rendering strategy:** Client-side rendering (CSR)
* **Memoisation strategy:** Handled within ContentComposer
* **Parallel vs sequential fetching:** Taxonomies in parallel
* **Known constraints:**
  * Large content may slow auto-save
  * Media uploads have size limits

## **17. Accessibility Considerations**

* **Keyboard navigation:** Tab through editor and controls
* **Focus management:** Focus in editor on load
* **Screen reader expectations:** Editor actions announced
* **Landmark roles:** Editor region, controls

## **18. Storybook & Testing Strategy**

### **Storybook**

* ContentComposer empty state
* Various content types
* Publish flow states

### **Testing**

* **Unit test focus:** Editor functionality
* **Integration test focus:** Save and publish flows
* **E2E test focus:** Complete content creation journey

## **19. Non-Goals / Out of Scope**

* Editing existing content
* Media library management
* Template editing

## **20. Related Routes**

| Route | Relationship |
|-------|--------------|
| `/admin/content` | Content dashboard |

## **21. Open Questions / Notes**

* Consider adding revision history
* May need collaborative editing
* Consider adding content templates

### **Content Composer Features**

The ContentComposer component typically provides:
- Rich text editor
- Media insertion
- Taxonomy assignment (categories, tags)
- Featured image selection
- SEO settings
- Publishing options (immediate, scheduled)
- Draft saving
- Preview functionality
