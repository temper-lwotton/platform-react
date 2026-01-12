# **Component Specification: EventCard**

## **1. Component Name**

**`EventCard`**

## **2. Description**

A feature-rich card component for displaying events. Supports event images, status badges (upcoming/ongoing/past), RSVP functionality, location details, admin moderation controls, and broadcast capabilities.

* Displays event details with rich metadata
* Shows temporal status (upcoming/ongoing/past)
* Enables RSVP for upcoming and ongoing events
* Provides admin moderation and broadcast features

## **3. Location**

```
src/components/ui/EventCard/EventCard.tsx
```

## **4. Component Type**

* Feature

## **5. Props Interface**

```ts
interface EventCardProps {
  event: Event;
  showRSVP?: boolean;
}
```

## **6. Props**

| Prop | Type | Required | Default | Description |
| ---- | ---- | -------- | ------- | ----------- |
| `event` | `Event` | Yes | - | Event data object |
| `showRSVP` | `boolean` | No | `false` | Show RSVP dropdown |

## **7. Data Requirements**

### **External Data Sources**

* **Props**: `event` object
* **Hook**: `useIsAdmin()` - determines if admin menu is rendered
* **Utility**: `formatEventDateRange()` - formats date range display
* **Utilities**: `isUpcoming()`, `isOngoing()`, `isPast()` - status helpers

```ts
// From @/lib/events
interface Event {
  id: number | string;
  title: string;
  eventStart: string;
  eventEnd: string;
  photo?: string;
  location?: string;
  isOnline: boolean;
  link?: string;
  htmlContent?: string;
  tags?: Array<{ id: number; name: string }>;
  author?: {
    name?: string;
    username?: string;
    avatar?: string;
  };
  space: {
    id: string;
    name: string;
  };
}
```

### **Derived Values**

| Value | Derivation |
| ----- | ---------- |
| `dateRange` | Formatted date range from `formatEventDateRange()` |
| `status` | 'ongoing' / 'upcoming' / 'past' based on event dates |
| `authorName` | `author.name` or `author.username` or 'Unknown' |
| `authorInitials` | First letters of author name parts (max 2) |
| `textPreview` | HTML stripped, first 150 chars of content |

## **8. Internal State**

| State Variable | Type | Purpose |
| -------------- | ---- | ------- |
| `rsvpStatus` | `'going' \| 'maybe' \| 'not_going' \| null` | User's RSVP response |
| `isRSVPOpen` | `boolean` | RSVP dropdown visibility |
| `isAdminMenuOpen` | `boolean` | Admin dropdown visibility |
| `isBookmarked` | `boolean` | Bookmark toggle state |

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
| ----------------- | ----------- | ----- |
| `event.photo` exists | Event image with optional "Live Now" overlay | |
| `status === 'ongoing'` | "Live Now" badge + "Happening now" status | Danger variant |
| `status === 'upcoming'` | "Upcoming" status badge | Primary variant |
| `status === 'past'` | "Past" status badge | Default variant |
| `event.isOnline === true` | "Online Event" in location | |
| `event.isOnline === false` | Physical location or "Location TBA" | |
| `event.link` exists | External event link button | |
| `event.htmlContent` exists | Preview paragraph (150 chars) | |
| `event.tags.length > 0` | Tag badges | |
| `showRSVP && (upcoming \|\| ongoing)` | RSVP dropdown | |
| `isAdmin === true` | Admin menu with broadcast + moderation | |
| `isBookmarked === true` | Filled bookmark icon | |

## **10. Dependencies**

### **Child Components**

* `Avatar` - Host avatar (from primitives)
* `Badge` - Status, tags, live indicator (from primitives)
* `Icon` - Various icons
* `InlineModerationControls` - Admin moderation actions

### **Utilities / Hooks**

* `useIsAdmin` - Permission check
* `useToast` - Toast notifications
* `useRouter` - Navigation
* `formatEventDateRange` - Date formatting
* `isUpcoming`, `isOngoing`, `isPast` - Status helpers
* `generateEventBroadcast` - Broadcast template generation

### **External Libraries**

* `@radix-ui/react-dropdown-menu` - Dropdowns
* `next/link` - Navigation
* `next/navigation` - Router

## **11. Events & Callbacks**

| Event / Callback | Trigger | Description |
| ---------------- | ------- | ----------- |
| `handleRSVP` | Select RSVP option | Updates `rsvpStatus`, closes dropdown |
| `handleBookmark` | Click bookmark button | Toggles `isBookmarked`, shows toast |
| `handleBroadcast` | Select "Broadcast This" | Generates template, stores in localStorage, navigates to broadcast creation |

## **12. Styling**

* **Styling approach**: CSS Modules with SCSS
* **File(s)**:
  * `EventCard.module.scss`

### **Visual States**

* **Default**: Card with optional image
* **Ongoing**: "Live Now" badge overlay
* **RSVP states**: Button colour changes (going=green, maybe=yellow, not going=grey)
* **Bookmarked**: Active bookmark icon style

### **Key Style Classes**

| Class | Purpose |
| ----- | ------- |
| `.card` | Base card container (article) |
| `.imageWrapper` | Event photo container |
| `.image` | Event photo |
| `.badge` | "Live Now" overlay badge |
| `.content` | Main content area |
| `.header` | Space link and status |
| `.meta` | Space and status row |
| `.spaceLink` | Link to parent space |
| `.title` | Event title (h3) |
| `.titleLink` | Title link wrapper |
| `.details` | Date and location |
| `.detail` | Icon + text detail row |
| `.preview` | Content preview text |
| `.tags` | Tag badges container |
| `.footer` | Author and actions |
| `.author` | Avatar and host name |
| `.actions` | Bookmark, RSVP, admin buttons |
| `.rsvpButton` | RSVP dropdown trigger |
| `.adminMenu` | Admin dropdown |
| `.bookmark` | Bookmark button |

## **13. Accessibility Requirements**

* **Bookmark button**: Has `aria-label` that changes based on state
* **Admin menu button**: Has `title="Admin options"`
* **RSVP options**: Radix dropdown provides keyboard navigation
* **Event link**: Opens in new tab with `rel="noopener noreferrer"`

### **Improvements Needed**

* RSVP button could have `aria-expanded` state
* Status badge could use `role="status"`

## **14. Error Handling**

| Condition | Behaviour |
| --------- | --------- |
| Missing `author` | Falls back to "Unknown" |
| Missing `author.avatar` | Shows initials fallback |
| Missing `location` | Shows "Location TBA" |
| Missing `htmlContent` | Preview section not rendered |
| Missing `tags` | Tags section not rendered |

**Not handled by this component:**
* RSVP API integration (marked as TODO)
* Broadcast creation failures

## **15. Performance & Lifecycle Notes**

* **Side effects**: localStorage write on broadcast
* **Re-renders**: On state changes (RSVP, bookmark, menus)
* **No cleanup required** - no listeners registered

## **16. Usage Examples**

```tsx
import { EventCard } from '@/components/ui/EventCard';

// Basic usage
<EventCard event={event} />

// With RSVP
<EventCard event={event} showRSVP />

// In a list
{events.map((event) => (
  <EventCard key={event.id} event={event} showRSVP />
))}
```

## **17. Features Summary**

* Event photo with "Live Now" badge overlay
* Status badges (Upcoming/Happening now/Past)
* Date range display
* Location or "Online Event" indicator
* External event link button
* Tag display
* Host information with avatar
* RSVP dropdown (Going/Maybe/Not Going)
* Bookmark functionality with toast
* Admin features:
  * Broadcast event as email
  * Moderation controls

## **18. Testing Considerations**

### **Unit Tests**

* Renders correct status based on dates
* Shows "Live Now" for ongoing events
* Displays location or "Online Event"
* RSVP button changes text based on selection
* Bookmark toggle updates state and shows toast
* Admin menu only visible when `isAdmin` is true
* Broadcast stores template in localStorage

### **Mocking Required**

* `useIsAdmin` - mock to return true/false
* `useToast` - mock `showToast`
* `useRouter` - mock `push`
* `formatEventDateRange` - mock or use real
* `localStorage` - mock for broadcast tests

### **Edge Cases**

* Event spanning multiple days
* Event in past (no RSVP)
* Very long title/content
* No image

## **19. Out of Scope / Non-Goals**

* **RSVP persistence** - API not integrated (TODO)
* **Attendee list** - not shown on card
* **Event editing** - handled elsewhere
* **Calendar integration** - handled by calendar components

## **20. Related Components & System Context**

### **Sibling Components**

* `DiscussionCard` - similar pattern
* `UpdateCard` - similar pattern
* `SpaceCard` - similar pattern

### **Child Components**

* `Avatar` (primitives)
* `Badge` (primitives)
* `Icon`
* `InlineModerationControls`

### **Typical Usage Locations**

* Event listings
* Calendar views
* Space pages
* Home feed

## **21. Open Questions / Notes**

* RSVP API integration needed
* Consider showing attendee count
* May want to add ICS export button

## **22. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
| -------- | -------- | ------------- | ----- |
| `Default` | Upcoming event | Basic event data | Default state |
| `Ongoing` | Live event | Event happening now | "Live Now" badge |
| `Past` | Past event | Event in past | No RSVP |
| `WithImage` | Has photo | Event with photo | Image display |
| `Online` | Online event | `isOnline: true` | "Online Event" |
| `WithRSVP` | RSVP enabled | `showRSVP: true` | RSVP dropdown |
| `AdminView` | Admin user | Mock `useIsAdmin` true | Admin menu |
| `Bookmarked` | Bookmarked state | Set `isBookmarked` true | Filled icon |

### **Controls (Args) Required**

* `showRSVP` - boolean toggle
* `event.isOnline` - boolean toggle

### **Mocking Requirements**

* `useIsAdmin` - mock hook
* `useToast` - mock hook
* `useRouter` - mock hook
* Date utilities

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Verify dropdown keyboard navigation
* Verify bookmark button labels

### **Interaction Tests**

* RSVP selection → verify state change
* Bookmark toggle → verify toast
* Admin broadcast → verify localStorage + navigation
