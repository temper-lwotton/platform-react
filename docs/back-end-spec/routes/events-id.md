# **Route Specification: Event Detail**

## **1. Route Path**

**`/events/[id]`**

## **2. Description**

Event detail page displaying comprehensive information about a single event.

* Shows event date/time, location, and host
* Displays event photo and status badge
* Renders full description content
* Provides navigation to parent space

## **3. Source File**

```
src/app/(protected)/events/[id]/page.tsx
```

## **4. Route Responsibility**

### **This route is responsible for:**

* Displaying complete event information
* Rendering event status (upcoming/ongoing/past)
* Showing host information
* Displaying event photo and description
* Providing navigation to parent space

### **This route does not:**

* Edit the event
* Delete the event
* Handle RSVPs or attendance
* Manage event comments

## **5. Authentication & Access Control**

* **Authentication Required:** Yes
* **Allowed Roles:** Any authenticated user
* **Permission Rules:** May need access to the event's space

## **6. URL Parameters & Query Params**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `id` | `string` | Yes | The unique identifier of the event |

* **Default behaviour:** N/A - id is required
* **Validation:** Invalid id shows error state

## **7. Layout & Structure**

### **Layout Overview**

* Single column article layout
* Back link, photo, details, description

### **Structural Regions**

| Region | Purpose |
|--------|---------|
| Back Link | Return to events listing |
| Photo | Event image with status overlay |
| Header | Space name, status badge, title, tags |
| Details Card | Date/time, location, link |
| Host Card | Host avatar and name |
| Description | Full event description |

## **8. Components Used**

### **Layout Components**

*None - article layout*

### **UI / Feature Components**

| Component | Import Path | Purpose |
|-----------|-------------|---------|
| `Icon` | `@/components/ui/Icon` | Calendar, location, link icons |
| `Link` | `next/link` | Navigation links |

### **Helper Functions**

| Function | Purpose |
|----------|---------|
| `formatEventDateRange` | Format start/end into readable date range |
| `isUpcoming` | Check if event hasn't started |
| `isOngoing` | Check if event is currently happening |

## **9. Data Flow Overview**

1. Extract event ID from URL parameters
2. Fetch event data
3. Calculate event status (upcoming/ongoing/past)
4. Format date range for display
5. Render event details and description
6. User clicks back or space → navigate

## **10. Data Fetching**

### **Standard Queries**

| Query Key | Function | Data Type | Enable Conditions |
|-----------|----------|-----------|-------------------|
| `['event', eventId]` | `getEvent(eventId)` | `Event` | `!!eventId` |

## **11. State Management**

### **Local State**

*No local state - all data from query.*

### **Derived State**

| Variable | Dependencies | Purpose |
|----------|--------------|---------|
| `status` | `event.eventStart, event.eventEnd` | Event status (ongoing/upcoming/past) |
| `formattedDateRange` | `event.eventStart, event.eventEnd` | Human-readable date range |

### **Refs**

*None*

## **12. Behaviour Matrix**

| Condition | UI Behaviour |
|-----------|--------------|
| Loading | "Loading event..." message |
| Error / Not found | Error message with back link |
| Event loaded (ongoing) | "Happening now" badge, "Live Now" overlay |
| Event loaded (upcoming) | "Upcoming" badge |
| Event loaded (past) | "Past Event" badge |
| Has photo | Full-width image displayed |
| No photo | No image section |
| Online event | "Online Event" for location |
| Physical event | Location address displayed |

## **13. User Actions**

### **UI Interactions**

*No direct UI interactions - read-only page*

### **Navigation Actions**

| Action | Trigger | Destination |
|--------|---------|-------------|
| Back to events | Click back link | `/events` |
| View space | Click space name | `/spaces/[spaceId]` |
| Visit event link | Click external link | External URL |

## **14. Infinite Scroll / Pagination**

*Not applicable.*

## **15. Error & Empty States**

* **Loading:** "Loading event..." message
* **Error / Not found:** Error message with back link

## **16. Performance & Constraints**

* **Rendering strategy:** Client-side rendering (CSR)
* **Memoisation strategy:** Status calculated on load
* **Parallel vs sequential fetching:** Single event query
* **Known constraints:**
  * HTML content rendered with dangerouslySetInnerHTML
  * Photo may take time to load

## **17. Accessibility Considerations**

* **Keyboard navigation:** Tab through links
* **Focus management:** Focus visible on links
* **Screen reader expectations:** Event details announced, status badge accessible
* **Landmark roles:** Article with proper structure

## **18. Storybook & Testing Strategy**

### **Storybook**

* Event detail layout for different statuses
* Photo and no-photo variants
* Online and physical event variants

### **Testing**

* **Unit test focus:** Status calculation, date formatting
* **Integration test focus:** Navigation flows
* **E2E test focus:** Event viewing experience

## **19. Non-Goals / Out of Scope**

* Event editing
* Event deletion
* RSVP functionality
* Comments
* Sharing functionality

## **20. Related Routes**

| Route | Relationship |
|-------|--------------|
| `/events` | Events listing |
| `/spaces/[id]` | Parent space |

## **21. Open Questions / Notes**

* Consider adding RSVP functionality
* May need event sharing feature
* Consider adding comments section
* Calendar integration (add to calendar)

### **Event Header**

* Space name with link
* Status badge (Happening now / Upcoming / Past Event)
* Event title
* Tags (if any)

### **Event Photo**

* Full-width image (if provided)
* "Live Now" badge overlay when ongoing

### **Details Card**

| Detail | Icon | Description |
|--------|------|-------------|
| Date & Time | `calendar` | Formatted date range |
| Location | `mapMarker` | Address or "Online Event" |
| Event Link | `link` | External link (if provided) |

### **Host Card**

* Host avatar or initials
* Host name
* Host username (if available)

### **Event Status Logic**

```typescript
const status = isOngoing(event.eventStart, event.eventEnd)
  ? 'ongoing'
  : isUpcoming(event.eventStart)
  ? 'upcoming'
  : 'past';
```
