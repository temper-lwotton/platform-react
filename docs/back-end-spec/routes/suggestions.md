# **Route Specification: Suggestions**

## **1. Route Path**

**`/suggestions`**

## **2. Description**

Personalized suggestions page showing recommended content tailored to user interests.

* Displays recommendations for people, spaces, events, discussions, resources, and showcases
* Supports filtering by suggestion type
* Shows AI-generated explanation for each recommendation
* Provides navigation to suggested content

## **3. Source File**

```
src/app/(protected)/suggestions/page.tsx
```

## **4. Route Responsibility**

### **This route is responsible for:**

* Rendering personalized suggestion cards
* Filtering suggestions by type
* Displaying AI-generated recommendation reasons
* Providing navigation to suggested content
* Showing type-specific metadata for each suggestion

### **This route does not:**

* Generate suggestions (backend/AI responsibility)
* Train recommendation models
* Track suggestion engagement
* Manage user interests or preferences

## **5. Authentication & Access Control**

* **Authentication Required:** Yes
* **Allowed Roles:** Any authenticated user
* **Permission Rules:** Users see suggestions personalized to their activity and interests

## **6. URL Parameters & Query Params**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `type` | `string` | No | Filter by suggestion type |

* **Default behaviour:** Show all suggestion types
* **Validation:** Invalid type ignored, shows all

## **7. Layout & Structure**

### **Layout Overview**

* Single column layout with main container
* Header with icon and title, filters, then suggestion grid

### **Structural Regions**

| Region | Purpose |
|--------|---------|
| Header | Sparkles icon, title, and subtitle |
| Filters | Type filter buttons |
| Content Grid | Suggestion cards in grid layout |
| Empty State | When no suggestions match filter |

## **8. Components Used**

### **Layout Components**

*None - simple page structure*

### **UI / Feature Components**

| Component | Import Path | Purpose |
|-----------|-------------|---------|
| `Icon` | `@/components/ui/Icon` | Type icons, sparkles, metadata icons |
| `Link` | `next/link` | Navigation to suggested content |

### **Types**

| Type | Description |
|------|-------------|
| `SuggestionType` | `'user' \| 'space' \| 'event' \| 'discussion' \| 'resource' \| 'showcase'` |
| `Suggestion` | Suggestion item structure |

## **9. Data Flow Overview**

1. Page renders with mock suggestion data
2. Initialize filter state (all types by default)
3. Filter suggestions based on active type filter
4. Render filter buttons and suggestion grid
5. User clicks filter → update filter state → re-render
6. User clicks suggestion → navigate to content

## **10. Data Fetching**

### **Static Data (Current)**

| Source | Purpose |
|--------|---------|
| `MOCK_SUGGESTIONS` | Array of 15 mock suggestion items |

### **Standard Queries (Future)**

| Query Key | Function | Data Type | Enable Conditions |
|-----------|----------|-----------|-------------------|
| `['suggestions']` | `getSuggestions` | `Suggestion[]` | Future implementation |

## **11. State Management**

### **Local State**

| State Variable | Type | Purpose |
|----------------|------|---------|
| `filterType` | `SuggestionType \| 'all'` | Current type filter |

### **Derived State**

| Variable | Dependencies | Purpose |
|----------|--------------|---------|
| `filteredSuggestions` | `suggestions, filterType` | Suggestions matching active filter |

### **Refs**

*None*

### **Suggestion Data Structure**

```typescript
interface Suggestion {
  id: string;
  type: SuggestionType;
  title: string;
  description: string;
  reason: string;        // Why this is suggested (AI-generated)
  image?: string;        // Optional image URL
  url: string;           // Navigation destination
  metadata?: {
    memberCount?: number;  // For spaces
    date?: string;         // For events
    author?: string;       // For discussions/showcases
    replies?: number;      // For discussions
  };
}
```

## **12. Behaviour Matrix**

| Condition | UI Behaviour |
|-----------|--------------|
| Initial load | All suggestions displayed with mock data |
| Type filter applied | Grid shows only matching type |
| No matching suggestions | Empty state with sparkles icon |
| Suggestion clicked | Navigate to suggested content |

## **13. User Actions**

### **UI Interactions**

| Action | Trigger | Result |
|--------|---------|--------|
| Filter by type | Click filter button | Update `filterType`, grid filters |
| Clear filter | Click "All" button | Reset to show all types |

### **Navigation Actions**

| Action | Trigger | Destination |
|--------|---------|-------------|
| View user | Click user suggestion | `/users/[id]` |
| View space | Click space suggestion | `/spaces/[id]` |
| View event | Click event suggestion | `/events/[id]` |
| View discussion | Click discussion suggestion | `/spaces/[spaceId]/discussions/[id]` |
| View resource | Click resource suggestion | Resource URL |
| View showcase | Click showcase suggestion | Showcase URL |

## **14. Infinite Scroll / Pagination**

*Not applicable - all suggestions loaded at once (currently mock data).*

## **15. Error & Empty States**

* **Loading:** No loading state (uses mock data currently)
* **Empty (filtered):**
  * Sparkles icon (48px)
  * "No suggestions available" title
  * "Check back later for personalized recommendations" message
* **Error:** No error handling currently implemented

## **16. Performance & Constraints**

* **Rendering strategy:** Client-side rendering (CSR)
* **Memoisation strategy:** Filter on type change
* **Parallel vs sequential fetching:** N/A (mock data)
* **Known constraints:**
  * Currently uses mock data
  * No real recommendation engine
  * No engagement tracking

## **17. Accessibility Considerations**

* **Keyboard navigation:** Tab through filters and cards, Enter to activate
* **Focus management:** Focus visible on active filter and cards
* **Screen reader expectations:** Suggestion type and reason announced
* **Landmark roles:** Main content area

## **18. Storybook & Testing Strategy**

### **Storybook**

* Suggestion card component for each type
* Filter button states (active/inactive)
* Empty state display

### **Testing**

* **Unit test focus:** Filter logic, helper functions
* **Integration test focus:** Filter interactions, navigation
* **E2E test focus:** Suggestion discovery and navigation flow

## **19. Non-Goals / Out of Scope**

* Suggestion generation (AI/backend)
* Recommendation model training
* Engagement tracking
* Feedback on suggestions (helpful/not helpful)
* Suggestion dismissal
* Interest/preference management

## **20. Related Routes**

| Route | Relationship |
|-------|--------------|
| `/users/[id]` | User suggestions link here |
| `/spaces/[id]` | Space suggestions link here |
| `/events/[id]` | Event suggestions link here |
| `/spaces/[id]/discussions/[discussionId]` | Discussion suggestions link here |

## **21. Open Questions / Notes**

* Need to implement real recommendation engine integration
* Consider adding feedback mechanism for suggestions
* May need suggestion dismissal feature
* Consider tracking engagement for model improvement

### **Filter Options**

| Filter | Icon | Label |
|--------|------|-------|
| `all` | - | All |
| `user` | `user` | People |
| `space` | `users` | Spaces |
| `event` | `calendar` | Events |
| `discussion` | `chat` | Discussions |
| `resource` | `book` | Resources |
| `showcase` | `star` | Showcases |

### **Type-Specific Displays**

#### **User Suggestions**
- Shows avatar (image or initial placeholder)
- Links to user profile

#### **Space Suggestions**
- Shows member count
- Links to space page

#### **Event Suggestions**
- Shows event date
- Links to event page

#### **Discussion Suggestions**
- Shows author and reply count
- Links to discussion

#### **Resource Suggestions**
- Shows resource icon
- Links to resource page

#### **Showcase Suggestions**
- Shows author/team
- Links to showcase page

### **Helper Functions**

| Function | Purpose |
|----------|---------|
| `getTypeIcon(type)` | Returns icon name for suggestion type |
| `getTypeLabel(type)` | Returns display label for suggestion type |
