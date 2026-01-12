# **Route Specification: Space Discussions**

## **1. Route Path**

**`/spaces/[id]/discussions`**

## **2. Description**

Space discussions listing showing all discussions within a specific space.

* Displays discussion cards with metadata
* Includes sidebar with top contributors
* Shows unanswered discussions for engagement
* Provides navigation to create new discussions

## **3. Source File**

```
src/app/(protected)/spaces/[id]/discussions/page.tsx
```

## **4. Route Responsibility**

### **This route is responsible for:**

* Listing all discussions in the space
* Rendering sidebar widgets (contributors, unanswered)
* Providing navigation to new discussion creation
* Navigating to individual discussion detail pages

### **This route does not:**

* Create discussions (navigates to creation page)
* Edit or delete discussions
* Manage discussion moderation
* Display discussion comments

## **5. Authentication & Access Control**

* **Authentication Required:** Yes
* **Allowed Roles:** Space member or admin
* **Permission Rules:** Must have access to the space

## **6. URL Parameters & Query Params**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `id` | `string` | Yes | The unique identifier of the space |

* **Default behaviour:** N/A - id is required
* **Validation:** Invalid id shows error state

## **7. Layout & Structure**

### **Layout Overview**

* Two-column layout (when discussions exist)
* Main content with sidebar

### **Structural Regions**

| Region | Purpose |
|--------|---------|
| Header | Title with "New Discussion" button |
| Main Content | List of DiscussionCard components |
| Right Sidebar | Top contributors and unanswered discussions |

## **8. Components Used**

### **Layout Components**

*None - custom two-column layout*

### **UI / Feature Components**

| Component | Import Path | Purpose |
|-----------|-------------|---------|
| `DiscussionCard` | `@/components/ui/DiscussionCard` | Display individual discussion |
| `TopContributors` | `@/components/ui/TopContributors` | Sidebar: Most active contributors |
| `UnansweredDiscussions` | `@/components/ui/UnansweredDiscussions` | Sidebar: Discussions needing replies |
| `Link` | `next/link` | Navigation to new post page |

## **9. Data Flow Overview**

1. Extract space ID from URL parameters
2. Fetch discussions for the space
3. Render discussion list and sidebar widgets
4. User clicks discussion → navigate to detail
5. User clicks "New Discussion" → navigate to creation

## **10. Data Fetching**

### **Standard Queries**

| Query Key | Function | Data Type | Enable Conditions |
|-----------|----------|-----------|-------------------|
| `['space-discussions', spaceId]` | `getSpaceDiscussions(spaceId)` | `Discussion[]` | `!!spaceId` |

## **11. State Management**

### **Local State**

*No local state - data from queries.*

### **Derived State**

*None*

### **Refs**

*None*

## **12. Behaviour Matrix**

| Condition | UI Behaviour |
|-----------|--------------|
| Loading | "Loading discussions..." message |
| Error | "Error loading discussions." message |
| Data loaded (with discussions) | Discussion list with sidebar |
| Data loaded (empty) | Empty state message, sidebar hidden |

## **13. User Actions**

### **UI Interactions**

*No direct UI interactions - navigation only*

### **Navigation Actions**

| Action | Trigger | Destination |
|--------|---------|-------------|
| New discussion | Click "New Discussion" button | `/posts/new?spaceId=[id]` |
| View discussion | Click DiscussionCard | `/spaces/[id]/discussions/[discussionId]` |

## **14. Infinite Scroll / Pagination**

*Not applicable - all discussions loaded at once.*

## **15. Error & Empty States**

* **Loading:** "Loading discussions..." message
* **Error:** "Error loading discussions." message
* **Empty:** "No discussions yet. Start the first conversation!" message
  * Note: Sidebar is hidden when no discussions exist

## **16. Performance & Constraints**

* **Rendering strategy:** Client-side rendering (CSR)
* **Memoisation strategy:** None currently
* **Parallel vs sequential fetching:** Single discussions query
* **Known constraints:**
  * All discussions loaded at once (no pagination)
  * Sidebar components may require additional queries

## **17. Accessibility Considerations**

* **Keyboard navigation:** Tab through discussions and sidebar
* **Focus management:** Focus visible on interactive elements
* **Screen reader expectations:** Discussion titles and metadata announced
* **Landmark roles:** Main content area, complementary sidebar

## **18. Storybook & Testing Strategy**

### **Storybook**

* `DiscussionCard` component variants
* `TopContributors` component
* `UnansweredDiscussions` component
* Empty state display

### **Testing**

* **Unit test focus:** Discussion list rendering
* **Integration test focus:** Navigation flows
* **E2E test focus:** Discussion discovery and creation

## **19. Non-Goals / Out of Scope**

* Discussion creation (handled by `/posts/new`)
* Discussion editing
* Discussion deletion
* Moderation controls
* Comment display

## **20. Related Routes**

| Route | Relationship |
|-------|--------------|
| `/spaces/[id]` | Space overview |
| `/spaces/[id]/discussions/[discussionId]` | Discussion detail |
| `/posts/new` | Create new discussion |

## **21. Open Questions / Notes**

* Consider adding pagination for spaces with many discussions
* May need sorting options (newest, most popular, etc.)
* Consider search within space discussions
