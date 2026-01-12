# **Route Specification: Space Detail**

## **1. Route Path**

**`/spaces/[id]`**

## **2. Description**

Space overview page displaying main information about a collaborative workspace.

* Shows space title, description, and visibility
* Displays member statistics
* Lists upcoming events (max 3)
* Serves as landing page when navigating to a space

## **3. Source File**

```
src/app/(protected)/spaces/[id]/page.tsx
```

## **4. Route Responsibility**

### **This route is responsible for:**

* Displaying space overview information
* Showing member and admin counts
* Rendering upcoming events preview
* Providing navigation to full events list

### **This route does not:**

* Edit space settings
* Manage space membership
* Display discussions (see `/spaces/[id]/discussions`)
* Display all events (see `/spaces/[id]/events`)

## **5. Authentication & Access Control**

* **Authentication Required:** Yes
* **Allowed Roles:** Space member or admin
* **Permission Rules:** Must have access to the space (member, admin, or public space)

## **6. URL Parameters & Query Params**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `id` | `string` | Yes | The unique identifier of the space |

* **Default behaviour:** N/A - id is required
* **Validation:** Invalid id returns null (not found)

## **7. Layout & Structure**

### **Layout Overview**

* Single column layout
* Header with space info, followed by content sections

### **Structural Regions**

| Region | Purpose |
|--------|---------|
| Header | Space icon, title, subtitle, visibility badge, member count |
| About Section | Space description (if available) |
| Members Section | Admin and member counts |
| Events Section | Up to 3 upcoming events with "View all" link |

## **8. Components Used**

### **Layout Components**

*None - uses space-specific layout*

### **UI / Feature Components**

| Component | Import Path | Purpose |
|-----------|-------------|---------|
| `EventCard` | `@/components/ui/EventCard` | Display upcoming events |
| `Link` | `next/link` | Navigation to events page |

## **9. Data Flow Overview**

1. Extract space ID from URL parameters
2. Fetch space data and space events in parallel
3. Calculate member count from space data
4. Filter upcoming events (max 3)
5. Render space overview sections
6. User clicks event or "View all" → navigate

## **10. Data Fetching**

### **Standard Queries**

| Query Key | Function | Data Type | Enable Conditions |
|-----------|----------|-----------|-------------------|
| `['space', id]` | `getSpace(id)` | `Space` | `!!id` |
| `['space-events', id]` | `getEvents({ space: parseInt(id), sort: 'asc' })` | `Event[]` | `!!id` |

### **Derived Data**

| Variable | Source | Description |
|----------|--------|-------------|
| `memberCount` | `space.members.length + space.admins.length` | Total member count |
| `upcomingEvents` | `events` filtered by future end date | Max 3 upcoming events |

## **11. State Management**

### **Local State**

*No local state - all data from queries.*

### **Derived State**

| Variable | Dependencies | Purpose |
|----------|--------------|---------|
| `memberCount` | `space` | Total members including admins |
| `upcomingEvents` | `events` | Filtered future events (max 3) |

### **Refs**

*None*

## **12. Behaviour Matrix**

| Condition | UI Behaviour |
|-----------|--------------|
| Loading | Loading indicator or skeleton |
| Space not found | Returns null (no render) |
| Space loaded | Overview sections displayed |
| No description | About section hidden |
| No upcoming events | Events section shows empty state |
| Has upcoming events | Up to 3 EventCards displayed |

## **13. User Actions**

### **UI Interactions**

*No direct UI interactions on this page*

### **Navigation Actions**

| Action | Trigger | Destination |
|--------|---------|-------------|
| View all events | Click "View all events →" | `/spaces/[id]/events` |
| View event | Click EventCard | `/events/[eventId]` |
| View discussions | Click discussions nav | `/spaces/[id]/discussions` |
| View chat | Click chat nav | `/spaces/[id]/chat` |

## **14. Infinite Scroll / Pagination**

*Not applicable - limited content display.*

## **15. Error & Empty States**

* **Loading:** Loading state while fetching
* **Not found:** Returns null (no space data)
* **No description:** About section hidden
* **No events:** Empty state or section hidden

## **16. Performance & Constraints**

* **Rendering strategy:** Client-side rendering (CSR)
* **Memoisation strategy:** Derived data calculated on fetch
* **Parallel vs sequential fetching:** Space and events fetched in parallel
* **Known constraints:**
  * Events limited to 3 for performance
  * Member count is calculated, not cached

## **17. Accessibility Considerations**

* **Keyboard navigation:** Tab through sections and links
* **Focus management:** Focus visible on interactive elements
* **Screen reader expectations:** Space info announced, event cards accessible
* **Landmark roles:** Main content area, sections with headings

## **18. Storybook & Testing Strategy**

### **Storybook**

* Space header component
* Members section component
* Events preview section

### **Testing**

* **Unit test focus:** Member count calculation, event filtering
* **Integration test focus:** Data fetching, navigation
* **E2E test focus:** Space overview experience

## **19. Non-Goals / Out of Scope**

* Space editing
* Membership management
* Full events display
* Discussions display
* Chat functionality

## **20. Related Routes**

| Route | Relationship |
|-------|--------------|
| `/spaces` | Spaces listing |
| `/spaces/[id]/discussions` | Space discussions |
| `/spaces/[id]/events` | Full space events list |
| `/spaces/[id]/chat` | Space chat |
| `/events/[id]` | Event detail |

## **21. Open Questions / Notes**

* Consider adding recent discussions preview
* May need space settings shortcut for admins
* Consider activity feed preview

### **Displayed Information**

* Space title and subtitle
* Visibility badge (Public/Private)
* Total member count
* Description (About section)
* Admin count with label
* Member count with label
* Up to 3 upcoming events
