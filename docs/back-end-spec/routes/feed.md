# **Route Specification: Feed**

## **1. Route Path**

**`/feed`**

## **2. Description**

The main activity feed showing discussions, events, and updates from spaces the user has access to.

* Aggregates content from all user's spaces
* Implements infinite scroll for seamless browsing
* Provides comprehensive filtering and sorting options
* Displays status update composer and suggested content

## **3. Source File**

```
src/app/(protected)/feed/page.tsx
```

## **4. Route Responsibility**

### **This route is responsible for:**

* Aggregating content (discussions, events, updates) from user's spaces
* Filtering and sorting combined feed items
* Implementing infinite scroll pagination
* Displaying sidebar widgets (events, tasks)
* Providing status update composition

### **This route does not:**

* Create or edit content (delegated to components/modals)
* Manage space membership
* Handle notification delivery
* Display content from spaces user cannot access

## **5. Authentication & Access Control**

* **Authentication Required:** Yes
* **Allowed Roles:** Any authenticated user
* **Permission Rules:** Only shows content from spaces user is a member or admin of

## **6. URL Parameters & Query Params**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `type` | `string` | No | Filter by content type (discussions/events/updates) |
| `space` | `string` | No | Filter by specific space ID |

* **Default behaviour:** Show all content types from all accessible spaces
* **Validation:** Invalid params ignored, defaults applied

## **7. Layout & Structure**

### **Layout Overview**

* Two-column layout
* Main content with feed items
* Right sidebar with widgets

### **Structural Regions**

| Region | Purpose |
|--------|---------|
| Header | Page title, status widget |
| Suggested Carousel | Recommended content |
| Filter Controls | Type, space, time, sort filters |
| Feed Items | Infinite scrolling content list |
| Right Sidebar | Upcoming events, urgent tasks |

## **8. Components Used**

### **Layout Components**

| Component | Import Path | Purpose |
|-----------|-------------|---------|
| `feed-page-container` | CSS class | Main layout container |
| `feed-page-main` | CSS class | Primary content area |
| `feed-page-sidebar` | CSS class | Right sidebar |

### **UI / Feature Components**

| Component | Import Path | Purpose |
|-----------|-------------|---------|
| `EventCard` | `@/components/ui/EventCard` | Display event items |
| `DiscussionCard` | `@/components/ui/DiscussionCard` | Display discussion items |
| `UpdateCard` | `@/components/ui/UpdateCard` | Display update items |
| `UpcomingEventsSidebar` | `@/components/ui/UpcomingEventsSidebar` | Sidebar events widget |
| `UrgentTasksSidebar` | `@/components/ui/UrgentTasksSidebar` | Sidebar tasks widget |
| `StatusUpdateWidget` | `@/components/ui/StatusUpdateWidget` | Status composer |
| `SuggestedCarousel` | `@/components/ui/SuggestedCarousel` | Recommended content |
| `Icon` | `@/components/ui/Icon` | Various icons |

## **9. Data Flow Overview**

1. Resolve authenticated user and their space memberships
2. Calculate accessible space IDs from user data
3. Fetch initial pages of discussions, events, and updates in parallel
4. Combine and filter items based on user selections
5. Sort combined items by selected criteria
6. Render feed items with infinite scroll trigger
7. Load more content when scroll trigger intersects viewport

## **10. Data Fetching**

### **Standard Queries**

| Query Key | Function | Data Type | Enable Conditions |
|-----------|----------|-----------|-------------------|
| `['current-user']` | `fetchCurrentUser` | `User` | `isClient && !!currentUserId` |
| `['sidebar-events']` | `getEvents({ sort: 'asc' })` | `Event[]` | `accessibleSpaceIds.size > 0` |
| `['feed-user-spaces', userSpaceIds]` | `Promise.all(getSpace)` | `Space[]` | `userSpaceIds.length > 0` |

### **Infinite / Paginated Queries**

| Query Key | Function | Data Type | Page Size |
|-----------|----------|-----------|-----------|
| `['feed-discussions']` | `getDiscussions` | `Discussion[]` | 10 |
| `['feed-events']` | `getEvents({ sort: 'desc' })` | `Event[]` | 10 |
| `['feed-updates']` | `getUpdates` | `Update[]` | 10 |

## **11. State Management**

### **Local State**

| State Variable | Type | Purpose |
|----------------|------|---------|
| `currentUserId` | `string \| null` | Current authenticated user ID |
| `isClient` | `boolean` | Hydration check for client-side rendering |
| `selectedSpaces` | `Set<number>` | Space IDs selected in filter |
| `contentType` | `'all' \| 'discussions' \| 'events' \| 'updates'` | Content type filter |
| `timePeriod` | `'all' \| 'today' \| 'week' \| 'month'` | Time period filter |
| `sortBy` | `'newest' \| 'oldest' \| 'active'` | Sort order |

### **Derived State**

| Variable | Dependencies | Purpose |
|----------|--------------|---------|
| `accessibleSpaceIds` | `userData` | Set of space IDs user can access |
| `feedItems` | `discussions, events, updates, filters` | Filtered and sorted feed items |

### **Refs**

| Ref | Purpose |
|-----|---------|
| `loadMoreRef` | Intersection observer trigger for infinite scroll |

## **12. Behaviour Matrix**

| Condition | UI Behaviour |
|-----------|--------------|
| Loading initial data | "Loading your feed..." message |
| User has no spaces | Prompt to join or create a space |
| No matching content | "No activity matches your filters" |
| Data loaded | Feed items rendered |
| Fetching more pages | Loading spinner at bottom |
| End of pagination | "You've reached the end of your feed" |
| Error state | Error message with retry option |

## **13. User Actions**

### **UI Interactions**

| Action | Trigger | Result |
|--------|---------|--------|
| Filter by space | Toggle space checkbox | Update `selectedSpaces` |
| Clear space filters | Click "Clear filters" | Reset `selectedSpaces` |
| Filter by content type | Click type button | Update `contentType` |
| Filter by time period | Click time button | Update `timePeriod` |
| Change sort order | Select from dropdown | Update `sortBy` |
| Load more content | Scroll to trigger | Fetch next page |

### **Navigation Actions**

| Action | Trigger | Destination |
|--------|---------|-------------|
| View discussion | Click DiscussionCard | `/spaces/[spaceId]/discussions/[id]` |
| View event | Click EventCard | `/events/[id]` |
| View update | Click UpdateCard | `/updates/[id]` |

## **14. Infinite Scroll / Pagination**

* **Trigger mechanism:** IntersectionObserver on `loadMoreRef` element
* **Fetch behaviour:** Triggers `fetchNextPage` for all three content types simultaneously
* **Loading indicators:** Spinner shown while fetching
* **End-of-content behaviour:** "You've reached the end of your feed" message
* **Failure behaviour:** Error toast, retry available on scroll

## **15. Error & Empty States**

* **Loading:** "Loading your feed..." with spinner
* **No spaces:** "Join or create a space to see activity here"
* **Empty feed:** "No activity yet. Check back soon or start a discussion!"
* **Filtered empty:** "No activity matches your filters"
* **End of feed:** "You've reached the end of your feed"
* **Error:** "Failed to load feed. Please try again."

## **16. Performance & Constraints**

* **Rendering strategy:** Client-side rendering (CSR) with hydration
* **Memoisation strategy:** `useMemo` for `accessibleSpaceIds` and `feedItems`
* **Parallel vs sequential fetching:** Parallel fetching of discussions, events, updates
* **Known constraints:**
  * Large number of spaces may slow filtering
  * Three parallel infinite queries can be heavy

## **17. Accessibility Considerations**

* **Keyboard navigation:** Tab through filter controls, Enter to activate
* **Focus management:** Focus moves to new content after load more
* **Screen reader expectations:** Announce when new content loads
* **Landmark roles:** Main content area, complementary sidebar

## **18. Storybook & Testing Strategy**

### **Storybook**

* Individual card components (EventCard, DiscussionCard, UpdateCard)
* Sidebar widgets
* Filter controls
* Full page composition not expected in Storybook

### **Testing**

* **Unit test focus:** Filter logic, sort logic, item combination
* **Integration test focus:** Infinite scroll behaviour, filter interactions
* **E2E test focus:** Full feed loading, filtering, navigation to items

## **19. Non-Goals / Out of Scope**

* Real-time updates (polling/WebSocket)
* Content creation (handled by StatusUpdateWidget)
* Notification management
* Space discovery/joining
* Content moderation

## **20. Related Routes**

| Route | Relationship |
|-------|--------------|
| `/spaces` | Browse and join spaces |
| `/spaces/[id]/discussions/[id]` | Discussion detail |
| `/events` | Full events listing |
| `/events/[id]` | Event detail |
| `/updates/[id]` | Update detail |
| `/calendar` | Calendar view |
| `/tasks` | Tasks page |

## **21. Open Questions / Notes**

* Consider adding real-time updates for new content
* May need virtual scrolling for very large feeds
* Status update widget currently using mock data
