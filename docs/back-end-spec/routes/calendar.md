# **Route Specification: Calendar**

## **1. Route Path**

**`/calendar`**

## **2. Description**

A calendar view displaying events and tasks from all spaces the user has access to.

* Shows monthly grid view with event/task markers
* Lists upcoming items in sidebar
* Provides month navigation controls
* Color-codes items by type and priority

## **3. Source File**

```
src/app/(protected)/calendar/page.tsx
```

## **4. Route Responsibility**

### **This route is responsible for:**

* Rendering monthly calendar grid
* Displaying events and tasks on appropriate dates
* Providing month navigation (previous/next/today)
* Showing upcoming items in sidebar view
* Color-coding by type (event vs task) and priority

### **This route does not:**

* Create or edit events (handled by event routes)
* Create or edit tasks (handled by tasks route)
* Provide week or day views (month only currently)
* Handle recurring event logic

## **5. Authentication & Access Control**

* **Authentication Required:** Yes
* **Allowed Roles:** Any authenticated user
* **Permission Rules:** Shows events and tasks from user's accessible spaces only

## **6. URL Parameters & Query Params**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `month` | `string` | No | Month to display (YYYY-MM format) |
| `view` | `string` | No | View type (currently only 'month' supported) |

* **Default behaviour:** Current month displayed
* **Validation:** Invalid month falls back to current month

## **7. Layout & Structure**

### **Layout Overview**

* Two-column layout
* Main content with calendar grid
* Right sidebar with upcoming list

### **Structural Regions**

| Region | Purpose |
|--------|---------|
| Header | Title, navigation controls, legend |
| Calendar Grid | Monthly day cells with items |
| Right Sidebar | Upcoming events and tasks list |

## **8. Components Used**

### **Layout Components**

*None - custom layout in page*

### **UI / Feature Components**

| Component | Import Path | Purpose |
|-----------|-------------|---------|
| `Icon` | `@/components/ui/Icon` | Navigation arrows, type indicators |
| `Link` | `next/link` | Navigate to event/task details |

### **Internal Types**

| Type | Description |
|------|-------------|
| `CalendarView` | `'month' \| 'week' \| 'day'` |
| `CalendarEvent` | Unified type for events and tasks |

## **9. Data Flow Overview**

1. Resolve authenticated user
2. Fetch all events for the current user's spaces
3. Load mock task data (temporary)
4. Combine events and tasks into calendar items
5. Calculate days in current month for grid
6. Render calendar grid with items placed on dates
7. Render upcoming items in sidebar

## **10. Data Fetching**

### **Standard Queries**

| Query Key | Function | Data Type | Enable Conditions |
|-----------|----------|-----------|-------------------|
| `['current-user']` | `fetchCurrentUser` | `User` | Always enabled |
| `['all-events']` | `getEvents({ sort: 'asc' })` | `Event[]` | Always enabled |

### **Static Data**

| Source | Purpose |
|--------|---------|
| `MOCK_TASKS` | Mock task data with due dates (temporary) |

## **11. State Management**

### **Local State**

| State Variable | Type | Purpose |
|----------------|------|---------|
| `currentDate` | `Date` | Currently displayed month |
| `view` | `CalendarView` | View mode (only 'month' implemented) |

### **Derived State**

| Variable | Dependencies | Purpose |
|----------|--------------|---------|
| `calendarItems` | `events, tasks` | Combined and sorted events and tasks |
| `daysInMonth` | `currentDate` | Array of dates for current month grid |

### **Refs**

*None*

## **12. Behaviour Matrix**

| Condition | UI Behaviour |
|-----------|--------------|
| Loading initial data | Calendar grid renders empty |
| Data loaded | Items appear on calendar days |
| No events or tasks | Empty calendar grid |
| Day has > 3 items | Show "+N more" indicator |
| Today's date | Highlighted with special styling |
| Click previous month | Navigate to previous month |
| Click next month | Navigate to next month |
| Click today | Return to current month |

## **13. User Actions**

### **UI Interactions**

| Action | Trigger | Result |
|--------|---------|--------|
| Previous month | Click left arrow | Decrement `currentDate` by 1 month |
| Next month | Click right arrow | Increment `currentDate` by 1 month |
| Go to today | Click "Today" button | Set `currentDate` to current date |

### **Navigation Actions**

| Action | Trigger | Destination |
|--------|---------|-------------|
| View event details | Click calendar event item | `/events/[id]` |
| View tasks | Click task item | `/tasks` |
| View upcoming item | Click sidebar item | Event or tasks page |

## **14. Infinite Scroll / Pagination**

*Not applicable - calendar shows full month at once.*

## **15. Error & Empty States**

* **Loading:** Calendar grid always renders (data loads in background)
* **No items:** Empty calendar cells
* **Error:** Toast notification, calendar still usable

## **16. Performance & Constraints**

* **Rendering strategy:** Client-side rendering (CSR)
* **Memoisation strategy:** `useMemo` for `calendarItems` and `daysInMonth`
* **Parallel vs sequential fetching:** Single event query
* **Known constraints:**
  * Currently uses mock task data
  * Only month view implemented
  * No recurring event support

## **17. Accessibility Considerations**

* **Keyboard navigation:** Arrow keys to navigate days, Enter to select
* **Focus management:** Focus visible on selected day
* **Screen reader expectations:** Day announced with item count
* **Landmark roles:** Grid role for calendar

## **18. Storybook & Testing Strategy**

### **Storybook**

* Calendar grid component (if extracted)
* Individual calendar day cell
* Upcoming items sidebar

### **Testing**

* **Unit test focus:** Date calculations, item placement on days
* **Integration test focus:** Month navigation, item display
* **E2E test focus:** Navigation to events/tasks from calendar

## **19. Non-Goals / Out of Scope**

* Week or day views
* Drag-and-drop event creation
* Recurring event handling
* Event/task creation from calendar
* External calendar sync (Google, Outlook)
* Time zone handling

## **20. Related Routes**

| Route | Relationship |
|-------|--------------|
| `/events` | Full events listing |
| `/events/[id]` | Event detail page |
| `/tasks` | Tasks page |
| `/feed` | Alternative content view |

## **21. Open Questions / Notes**

* Need to replace mock tasks with real API data
* Week and day views planned for future
* Consider drag-and-drop for event rescheduling

### **Color Legend**

| Color | Meaning |
|-------|---------|
| `#3b82f6` (Blue) | Events |
| `#ef4444` (Red) | High priority tasks |
| `#f59e0b` (Amber) | Medium priority tasks |
| `#10b981` (Green) | Low priority tasks |
