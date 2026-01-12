# **Route Specification: Learn**

## **1. Route Path**

**`/learn`**

## **2. Description**

Learning center featuring articles, videos, and educational resources.

* Displays filterable learning content grid
* Supports search across all materials
* Filters by content type (articles/videos) and category
* Shows content statistics

## **3. Source File**

```
src/app/(protected)/learn/page.tsx
```

## **4. Route Responsibility**

### **This route is responsible for:**

* Rendering the learning content grid
* Filtering content by type (article/video)
* Filtering content by category
* Providing search functionality across title, excerpt, and tags
* Displaying content statistics (article/video counts)

### **This route does not:**

* Create or edit learning content
* Manage content categories
* Handle content playback or reading view
* Track user progress or completion

## **5. Authentication & Access Control**

* **Authentication Required:** Yes
* **Allowed Roles:** Any authenticated user
* **Permission Rules:** All authenticated users see all learning content

## **6. URL Parameters & Query Params**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `type` | `string` | No | Filter by content type (article/video) |
| `category` | `string` | No | Filter by category |

* **Default behaviour:** Show all content types and categories
* **Validation:** Invalid params ignored, defaults applied

## **7. Layout & Structure**

### **Layout Overview**

* Single column layout with SCSS module styling
* Header with statistics, filters, then content grid

### **Structural Regions**

| Region | Purpose |
|--------|---------|
| Header | Title, subtitle, content statistics |
| Filters | Search bar, type filter buttons, category filter buttons |
| Content Grid | LearningCard components in grid layout |

## **8. Components Used**

### **Layout Components**

*None - simple page structure with SCSS modules*

### **UI / Feature Components**

| Component | Import Path | Purpose |
|-----------|-------------|---------|
| `Icon` | `@/components/ui/Icon` | Filter icons, stat icons, search icon |
| `LearningCard` | `@/components/ui/LearningCard/LearningCard` | Display individual learning content |

### **Types**

| Type | Description |
|------|-------------|
| `ContentType` | `'all' \| 'article' \| 'video'` |
| `Category` | `'all' \| 'innovation' \| 'technology' \| 'business' \| 'design' \| 'leadership'` |
| `LearningContent` | Content item structure |

## **9. Data Flow Overview**

1. Page renders with mock learning content
2. Initialize filter states (type, category, search)
3. Calculate filtered content based on all active filters
4. Calculate content statistics (article/video counts)
5. Render filter controls and content grid
6. User interaction updates filters, triggering re-render

## **10. Data Fetching**

### **Static Data (Current)**

| Source | Purpose |
|--------|---------|
| `LEARNING_CONTENT` | Array of mock learning content items |

### **Standard Queries (Future)**

| Query Key | Function | Data Type | Enable Conditions |
|-----------|----------|-----------|-------------------|
| `['learning-content']` | `getLearningContent` | `LearningContent[]` | Future implementation |

## **11. State Management**

### **Local State**

| State Variable | Type | Purpose |
|----------------|------|---------|
| `typeFilter` | `ContentType` | Filter by 'all' \| 'article' \| 'video' |
| `categoryFilter` | `Category` | Filter by category |
| `searchQuery` | `string` | Search input value |

### **Derived State**

| Variable | Dependencies | Purpose |
|----------|--------------|---------|
| `filteredContent` | `content, typeFilter, categoryFilter, searchQuery` | Content matching all filters |
| `articleCount` | `content` | Total number of articles |
| `videoCount` | `content` | Total number of videos |

### **Refs**

*None*

### **Content Structure**

```typescript
interface LearningContent {
  id: string;
  type: 'article' | 'video';
  title: string;
  excerpt: string;
  imageUrl: string;
  category: string;
  duration?: string;     // For videos (e.g., "24:30")
  readTime?: string;     // For articles (e.g., "8 min read")
  author: {
    name: string;
    avatar?: string;
  };
  publishedAt: string;
  tags: string[];
}
```

## **12. Behaviour Matrix**

| Condition | UI Behaviour |
|-----------|--------------|
| Initial load | All content displayed with mock data |
| Type filter applied | Grid shows only matching type |
| Category filter applied | Grid shows only matching category |
| Search query entered | Grid shows items matching title, excerpt, or tags |
| Multiple filters active | Filters combine with AND logic |
| No matching content | Empty state with icon and message |

## **13. User Actions**

### **UI Interactions**

| Action | Trigger | Result |
|--------|---------|--------|
| Search content | Type in search bar | Filter by title, excerpt, or tags |
| Filter by type | Click type button (All/Articles/Videos) | Update `typeFilter` |
| Filter by category | Click category button | Update `categoryFilter` |
| Clear search | Clear search input | Remove search filter |

### **Navigation Actions**

| Action | Trigger | Destination |
|--------|---------|-------------|
| View content | Click LearningCard | Content detail page |

## **14. Infinite Scroll / Pagination**

*Not applicable - all content loaded at once (currently mock data).*

## **15. Error & Empty States**

* **Loading:** No loading state (uses mock data currently)
* **Empty (filtered):** "No content found" with icon
  * "Try adjusting your filters or search query" message
* **Error:** No error handling currently implemented

## **16. Performance & Constraints**

* **Rendering strategy:** Client-side rendering (CSR)
* **Memoisation strategy:** Filter calculations on each render
* **Parallel vs sequential fetching:** N/A (mock data)
* **Known constraints:**
  * Currently uses mock data
  * No API integration yet
  * Search is client-side only

## **17. Accessibility Considerations**

* **Keyboard navigation:** Tab through filters and cards, Enter to activate
* **Focus management:** Focus visible on active filter button
* **Screen reader expectations:** Filter state announced, card content accessible
* **Landmark roles:** Main content area

## **18. Storybook & Testing Strategy**

### **Storybook**

* `LearningCard` component with article and video variants
* Filter button states (active/inactive)
* Empty state display

### **Testing**

* **Unit test focus:** Filter logic, search matching
* **Integration test focus:** Filter combinations, search interaction
* **E2E test focus:** Content discovery flow, navigation to content

## **19. Non-Goals / Out of Scope**

* Content creation or editing
* Video playback handling
* Progress tracking or bookmarks
* Content recommendations
* Category management
* Server-side search

## **20. Related Routes**

| Route | Relationship |
|-------|--------------|
| `/feed` | Main activity feed |

## **21. Open Questions / Notes**

* Need to replace mock data with real API integration
* Consider adding pagination for large content sets
* May need server-side search for performance
* Consider adding content recommendations
