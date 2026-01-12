# **Route Specification: Events**

## **1. Route Path**

**`/events`**

## **2. Description**

Global events listing page showing all events across all accessible spaces.

* Features multiple view modes (list, month calendar, week calendar)
* Tab filtering for upcoming/past events (list view)
* Persists view preference in localStorage
* Shows event counts and navigation to details

## **3. Source File**

```
src/app/(protected)/events/page.tsx
```

## **4. Route Responsibility**

### **This route is responsible for:**

* Listing all events across accessible spaces
* Providing multiple view modes (list, calendar, week)
* Filtering events by upcoming/past status
* Navigating to individual event detail pages
* Persisting view preference

### **This route does not:**

* Create events (see `/events/new`)
* Edit or delete events
* Manage event RSVPs
* Handle space-specific event filtering

## **5. Authentication & Access Control**

* **Authentication Required:** Yes
* **Allowed Roles:** Any authenticated user
* **Permission Rules:** Shows events from all spaces user has access to

## **6. URL Parameters & Query Params**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `view` | `string` | No | View mode (list/calendar/week) |

* **Default behaviour:** Use stored preference or list view
* **Validation:** Invalid view defaults to list

## **7. Layout & Structure**

### **Layout Overview**

* Single column layout
* Header with view toggles, then content area

### **Structural Regions**

| Region | Purpose |
|--------|---------|
| Header | Title, subtitle, view toggle, event count |
| Tabs | Upcoming / Past toggle (list view only) |
| Content Area | Grid, month calendar, or week calendar based on view |

## **8. Components Used**

### **Layout Components**

*None - simple page structure*

### **UI / Feature Components**

| Component | Import Path | Purpose |
|-----------|-------------|---------|
| `EventCard` | `@/components/ui/EventCard` | Display event in list view |
| `EventCalendar` | `@/components/ui/EventCalendar` | Month calendar view |
| `EventWeekCalendar` | `@/components/ui/EventWeekCalendar` | Week calendar view |
| `Icon` | `@/components/ui/Icon` | View toggle icons |

## **9. Data Flow Overview**

1. Load view preference from localStorage
2. Fetch all events with filter parameters
3. Initialize active tab state (upcoming/past)
4. Filter events client-side based on tab
5. Render view based on selected mode
6. User changes view/tab → update state → re-render

## **10. Data Fetching**

### **Standard Queries**

| Query Key | Function | Data Type | Enable Conditions |
|-----------|----------|-----------|-------------------|
| `['events', filterParams]` | `getEvents(filterParams)` | `Event[]` | Always enabled |

## **11. State Management**

### **Local State**

| State Variable | Type | Purpose |
|----------------|------|---------|
| `filterParams` | `EventsQueryParams` | Filter and sort parameters |
| `activeTab` | `'upcoming' \| 'past'` | Tab selection (list view) |
| `view` | `'list' \| 'calendar' \| 'week'` | Current view mode |

### **Persisted State (localStorage)**

| Key | Value | Purpose |
|-----|-------|---------|
| `events-view` | `'list' \| 'calendar' \| 'week'` | Remember view preference |

### **Derived State**

| Variable | Dependencies | Purpose |
|----------|--------------|---------|
| `filteredEvents` | `events, activeTab` | Events filtered by date |

### **Refs**

*None*

## **12. Behaviour Matrix**

| Condition | UI Behaviour |
|-----------|--------------|
| Loading | "Loading events..." message |
| Error | "Error loading events. Please try again." |
| List view (upcoming tab) | EventCard grid of future events |
| List view (past tab) | EventCard grid of past events |
| Calendar view | EventCalendar month grid |
| Week view | EventWeekCalendar week grid |
| Empty (upcoming) | "Check back later for new events" |
| Empty (past) | "No past events to display" |

## **13. User Actions**

### **UI Interactions**

| Action | Trigger | Result |
|--------|---------|--------|
| Switch to list view | Click list icon | Update `view`, persist |
| Switch to calendar view | Click calendar icon | Update `view`, persist |
| Switch to week view | Click week icon | Update `view`, persist |
| Switch to upcoming tab | Click Upcoming tab | Update `activeTab` |
| Switch to past tab | Click Past tab | Update `activeTab` |

### **Navigation Actions**

| Action | Trigger | Destination |
|--------|---------|-------------|
| View event | Click EventCard | `/events/[id]` |
| View event from calendar | Click calendar item | `/events/[id]` |
| Create event | Click create button | `/events/new` |

## **14. Infinite Scroll / Pagination**

*Not applicable - all events loaded at once.*

## **15. Error & Empty States**

* **Loading:** "Loading events..." message
* **Error:** "Error loading events. Please try again."
* **Empty (upcoming):** "Check back later for new events"
* **Empty (past):** "No past events to display"

## **16. Performance & Constraints**

* **Rendering strategy:** Client-side rendering (CSR)
* **Memoisation strategy:** Filter on tab change
* **Parallel vs sequential fetching:** Single events query
* **Known constraints:**
  * All events loaded at once (no pagination)
  * Client-side date filtering
  * Calendar components may be heavy for many events

## **17. Accessibility Considerations**

* **Keyboard navigation:** Tab through view toggles and event cards
* **Focus management:** Focus visible on view buttons and cards
* **Screen reader expectations:** View mode announced, tab state announced
* **Landmark roles:** Main content area, tab list for filtering

## **18. Storybook & Testing Strategy**

### **Storybook**

* `EventCard` component variants
* `EventCalendar` component
* `EventWeekCalendar` component
* View toggle button states

### **Testing**

* **Unit test focus:** Date filtering logic, view persistence
* **Integration test focus:** View switching, tab switching
* **E2E test focus:** Event discovery and navigation

## **19. Non-Goals / Out of Scope**

* Event creation (handled by `/events/new`)
* Event editing
* RSVP management
* Space-specific filtering
* Real-time updates

## **20. Related Routes**

| Route | Relationship |
|-------|--------------|
| `/events/new` | Create new event |
| `/events/[id]` | Event detail |
| `/calendar` | Personal calendar view |

## **21. Open Questions / Notes**

* Consider adding pagination for large event sets
* May need server-side filtering for performance
* Consider adding event search functionality

### **View Modes**

#### **List View**
- Shows EventCard grid
- Tabs for upcoming/past filtering
- Event count displayed
- Client-side filtering by eventEnd date

#### **Calendar View (Month)**
- Full month grid via EventCalendar component
- No tab filtering (shows all events)
- Click event to view details

#### **Week View**
- Week grid via EventWeekCalendar component
- No tab filtering (shows all events)
- Detailed time slots

### **Tab/Sort Behavior**

| Tab | Sort Order | Filter Condition |
|-----|------------|------------------|
| Upcoming | `asc` | `eventEnd >= now` |
| Past | `desc` | `eventEnd < now` |
