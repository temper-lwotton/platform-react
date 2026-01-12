# **Route Specification: Space Events**

## **1. Route Path**

**`/spaces/[id]/events`**

## **2. Description**

Space events listing showing upcoming and past events within a specific space.

* Displays event cards in grid layout
* Features tab navigation for upcoming/past events
* Provides navigation to create new events
* Shows event count and status

## **3. Source File**

```
src/app/(protected)/spaces/[id]/events/page.tsx
```

## **4. Route Responsibility**

### **This route is responsible for:**

* Listing all events in the space
* Filtering events by upcoming/past status
* Providing navigation to event creation
* Navigating to individual event detail pages

### **This route does not:**

* Create events (see `/spaces/[id]/events/new`)
* Edit or delete events
* Manage event RSVPs
* Display event details

## **5. Authentication & Access Control**

* **Authentication Required:** Yes
* **Allowed Roles:** Space member or admin
* **Permission Rules:** Must have access to the space

## **6. URL Parameters & Query Params**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `id` | `string` | Yes | The unique identifier of the space |

* **Default behaviour:** Show upcoming events tab
* **Validation:** Invalid id shows error state

## **7. Layout & Structure**

### **Layout Overview**

* Single column layout
* Header with tabs, then content grid

### **Structural Regions**

| Region | Purpose |
|--------|---------|
| Header | Title, subtitle, event count, "New Event" button |
| Tabs | Upcoming / Past toggle |
| Content Grid | Grid of EventCard components |

## **8. Components Used**

### **Layout Components**

*None - simple page structure*

### **UI / Feature Components**

| Component | Import Path | Purpose |
|-----------|-------------|---------|
| `EventCard` | `@/components/ui/EventCard` | Display individual event |
| `Link` | `next/link` | Navigation to new event page |

## **9. Data Flow Overview**

1. Extract space ID from URL parameters
2. Fetch events for the space with sort order based on tab
3. Filter events client-side by date (upcoming vs past)
4. Render tab controls and event grid
5. User switches tab → update state → refetch with new sort
6. User clicks event → navigate to detail

## **10. Data Fetching**

### **Standard Queries**

| Query Key | Function | Data Type | Enable Conditions |
|-----------|----------|-----------|-------------------|
| `['space-events', spaceId, activeTab]` | `getEvents({ space, sort })` | `Event[]` | `!!spaceId` |

### **Query Parameters**

```typescript
{
  space: parseInt(spaceId),
  sort: activeTab === 'upcoming' ? 'asc' : 'desc'
}
```

## **11. State Management**

### **Local State**

| State Variable | Type | Purpose |
|----------------|------|---------|
| `activeTab` | `'upcoming' \| 'past'` | Current tab selection |

### **Derived State**

| Variable | Dependencies | Purpose |
|----------|--------------|---------|
| `filteredEvents` | `events, activeTab` | Events filtered by date comparison |

### **Refs**

*None*

## **12. Behaviour Matrix**

| Condition | UI Behaviour |
|-----------|--------------|
| Loading | "Loading events..." message |
| Error | "Error loading events." message |
| Upcoming tab (with events) | Future events displayed |
| Upcoming tab (empty) | "Check back later for new events in this space" |
| Past tab (with events) | Past events displayed |
| Past tab (empty) | "No past events to display" |

## **13. User Actions**

### **UI Interactions**

| Action | Trigger | Result |
|--------|---------|--------|
| Switch to upcoming | Click Upcoming tab | Update `activeTab`, refetch |
| Switch to past | Click Past tab | Update `activeTab`, refetch |

### **Navigation Actions**

| Action | Trigger | Destination |
|--------|---------|-------------|
| New event | Click "New Event" button | `/spaces/[id]/events/new` |
| View event | Click EventCard | `/events/[eventId]` |

## **14. Infinite Scroll / Pagination**

*Not applicable - all events loaded at once.*

## **15. Error & Empty States**

* **Loading:** "Loading events..." message
* **Error:** "Error loading events." message
* **Empty (upcoming):** "Check back later for new events in this space"
* **Empty (past):** "No past events to display"

## **16. Performance & Constraints**

* **Rendering strategy:** Client-side rendering (CSR)
* **Memoisation strategy:** Filter on tab change
* **Parallel vs sequential fetching:** Single events query
* **Known constraints:**
  * All events loaded at once (no pagination)
  * Client-side date filtering

## **17. Accessibility Considerations**

* **Keyboard navigation:** Tab through tabs and event cards
* **Focus management:** Focus visible on active tab
* **Screen reader expectations:** Tab state announced, event cards accessible
* **Landmark roles:** Main content area, tab list

## **18. Storybook & Testing Strategy**

### **Storybook**

* `EventCard` component variants
* Tab component states
* Empty states for both tabs

### **Testing**

* **Unit test focus:** Date filtering logic
* **Integration test focus:** Tab switching, navigation
* **E2E test focus:** Event discovery and creation

## **19. Non-Goals / Out of Scope**

* Event creation (handled by `/spaces/[id]/events/new`)
* Event editing
* Event deletion
* RSVP management
* Calendar integration

## **20. Related Routes**

| Route | Relationship |
|-------|--------------|
| `/spaces/[id]` | Space overview |
| `/spaces/[id]/events/new` | Create new event |
| `/events/[id]` | Event detail |

## **21. Open Questions / Notes**

* Consider adding pagination for spaces with many events
* May need calendar view option
* Consider event search functionality

### **Tab Behavior**

| Tab | Sort Order | Filter |
|-----|------------|--------|
| Upcoming | `asc` | `eventEnd >= now` |
| Past | `desc` | `eventEnd < now` |
