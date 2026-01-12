# **Route Specification: Update Detail**

## **1. Route Path**

**`/updates/[id]`**

## **2. Description**

Update detail page displaying a single organizational update.

* Shows full content with metadata
* Displays priority and category badges
* Shows author information and expiry notice
* Supports likes functionality

## **3. Source File**

```
src/app/(protected)/updates/[id]/page.tsx
```

## **4. Route Responsibility**

### **This route is responsible for:**

* Displaying complete update content
* Showing priority and category badges
* Rendering author information
* Displaying expiry notice if applicable
* Handling like/unlike interactions

### **This route does not:**

* Edit the update
* Delete the update
* Handle comments (placeholder only)
* Manage notifications

## **5. Authentication & Access Control**

* **Authentication Required:** Yes
* **Allowed Roles:** Any authenticated user
* **Permission Rules:** Users can view updates from accessible spaces

## **6. URL Parameters & Query Params**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `id` | `string` | Yes | The unique identifier of the update |

* **Default behaviour:** N/A - id is required
* **Validation:** Invalid id shows error state

## **7. Layout & Structure**

### **Layout Overview**

* Single column article layout
* Back link, badges, article content, footer

### **Structural Regions**

| Region | Purpose |
|--------|---------|
| Back Link | Return to feed |
| Badges Section | Priority, category, pinned badges |
| Article | Header with author, content, tags |
| Footer | Likes display |
| Comments Section | Placeholder for future implementation |

## **8. Components Used**

### **Layout Components**

*None - article layout*

### **UI / Feature Components**

| Component | Import Path | Purpose |
|-----------|-------------|---------|
| `Icon` | `@/components/ui/Icon` | Category icons, back arrow, clock |
| `LikesDisplay` | `@/components/ui/LikesDisplay` | Like button and count |
| `RichContent` | `@/components/ui/RichContent` | Render HTML content |
| `Link` | `next/link` | Back navigation |

## **9. Data Flow Overview**

1. Extract update ID from URL parameters
2. Fetch update data
3. Render badges, article content, and footer
4. User clicks like → mutation → invalidate query
5. User clicks back → navigate to feed

## **10. Data Fetching**

### **Standard Queries**

| Query Key | Function | Data Type | Enable Conditions |
|-----------|----------|-----------|-------------------|
| `['update', updateId]` | `getUpdate(updateId)` | `Update` | `!!updateId` |

### **Mutations**

| Mutation | Function | On Success |
|----------|----------|------------|
| `likeMutation` | `likeUpdate` / `unlikeUpdate` | Invalidate update query |

## **11. State Management**

### **Local State**

*No local state - all data from query.*

### **Derived State**

*None*

### **Refs**

*None*

## **12. Behaviour Matrix**

| Condition | UI Behaviour |
|-----------|--------------|
| Loading | "Loading update..." |
| Error / Not found | Error message with back link |
| Update loaded | Full article displayed |
| Has expiry date | Expiry notice shown |
| Is pinned | Pinned badge displayed |
| User liked | Filled heart icon |
| User not liked | Outline heart icon |

## **13. User Actions**

### **UI Interactions**

| Action | Trigger | Result |
|--------|---------|--------|
| Like update | Click LikesDisplay | Toggle like via API |
| Unlike update | Click LikesDisplay (if liked) | Toggle unlike via API |

### **Navigation Actions**

| Action | Trigger | Destination |
|--------|---------|-------------|
| Back to feed | Click back link | `/feed` |

### **Data Mutations**

| Action | Trigger | API Call | On Success |
|--------|---------|----------|------------|
| Like/unlike | Click LikesDisplay | `likeUpdate` / `unlikeUpdate` | Refresh update |

## **14. Infinite Scroll / Pagination**

*Not applicable.*

## **15. Error & Empty States**

* **Loading:** "Loading update..."
* **Error / Not found:** Error message with back link

## **16. Performance & Constraints**

* **Rendering strategy:** Client-side rendering (CSR)
* **Memoisation strategy:** None needed
* **Parallel vs sequential fetching:** Single update query
* **Known constraints:**
  * Comments not yet implemented
  * HTML content rendered with RichContent

## **17. Accessibility Considerations**

* **Keyboard navigation:** Tab through interactive elements
* **Focus management:** Focus visible on back link and like button
* **Screen reader expectations:** Update content and badges announced
* **Landmark roles:** Article with proper structure

## **18. Storybook & Testing Strategy**

### **Storybook**

* Update article for different priorities
* Badge combinations
* Expiry notice display

### **Testing**

* **Unit test focus:** Badge rendering, like state
* **Integration test focus:** Like/unlike flow
* **E2E test focus:** Update viewing experience

## **19. Non-Goals / Out of Scope**

* Update editing
* Update deletion
* Comments functionality
* Sharing functionality

## **20. Related Routes**

| Route | Relationship |
|-------|--------------|
| `/feed` | Main feed |
| `/updates` | Updates listing |

## **21. Open Questions / Notes**

* Comments functionality planned for future
* Consider adding sharing feature
* May need edit capability for authors

### **Displayed Information**

#### **Badges Section**
- Priority badge with color (urgent/high/normal/low)
- Category badge with icon
- Pinned badge (if applicable)

#### **Header**
- Title
- Author avatar or initials
- Author name
- Space title
- Publication date

#### **Expiry Notice**
Shown if update has expiration date.

#### **Content**
HTML content rendered via RichContent component.

#### **Tags**
List of associated tags (if any).

#### **Footer**
- Likes count and like button

### **Priority Styling**

| Priority | CSS Class |
|----------|-----------|
| Urgent | `priority-urgent` |
| High | `priority-high` |
| Normal | `priority-normal` |
| Low | `priority-low` |

### **Category Icons**

| Category | Icon |
|----------|------|
| News | `bell` |
| Milestone | `star` |
| Policy | `fileText` |
| Announcement | `rocket` |
| Other | `info` |
