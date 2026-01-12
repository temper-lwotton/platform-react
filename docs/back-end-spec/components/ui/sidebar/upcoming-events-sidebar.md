# **Component Specification: UpcomingEventsSidebar**

## **1. Component Name**

**`UpcomingEventsSidebar`**

## **2. Description**

A sidebar widget displaying the next 5 upcoming events.

* Shows date badges with day and month
* Displays event title, time, and location
* Links to individual events and event list
* Filters and sorts events by date

## **3. Location**

```
src/components/ui/UpcomingEventsSidebar/UpcomingEventsSidebar.tsx
```

## **4. Component Type**

**UI** – Stateless component with derived state (filtering/sorting computed from props).

## **5. Props Interface**

```typescript
interface UpcomingEventsSidebarProps {
  events: Event[];
}
```

## **6. Props**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `events` | `Event[]` | Yes | - | All events to filter from |

## **7. Data Requirements**

### **Event Type**

```typescript
// From @/lib/events
interface Event {
  id: string;
  title: string;
  eventStart: string; // ISO date
  eventEnd: string; // ISO date
  isOnline?: boolean;
  location?: string;
  space?: {
    id: string;
    name: string;
  };
}
```

## **8. Internal State**

*None – upcoming events computed from props.*

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
|-------------------|-------------|-------|
| No upcoming events | Empty state | "No upcoming events" |
| Has upcoming events | Event list | Up to 5 events |
| Event is today | "Today, [time]" | Highlighted |
| Event is tomorrow | "Tomorrow, [time]" | Highlighted |
| Event is later | "[Month] [Day], [time]" | Full date |
| `isOnline === true` | "Online" badge | Virtual event |
| Has location | Location text | With icon |
| Has space | Space name | Association shown |

## **10. Dependencies**

### **Child Components**

* `Icon` – Location marker icon

### **External Libraries**

* `next/link` – Event and view all links

## **11. Events & Callbacks**

*No external callbacks – navigation handled by Next.js Link.*

## **12. Styling**

* **Approach**: CSS Modules with SCSS
* **File**: `UpcomingEventsSidebar.module.scss`

### **CSS Classes**

* `.panel` – Main container
* `.header` – Title and view all link
* `.title` – "Upcoming Events" heading
* `.viewAll` – Link to all events
* `.eventList` – Container for events
* `.eventItem` – Individual event row
* `.dateBadge` – Compact date display
* `.dateBadge__day` – Day number
* `.dateBadge__month` – Month abbreviation
* `.eventInfo` – Title and meta
* `.eventTitle` – Event title link
* `.eventMeta` – Time and location
* `.location` – Location with icon
* `.spaceName` – Associated space
* `.emptyState` – No events message

### **Layout**

* Header with title and "View all" link
* Vertical event list
* Date badge + info per event

## **13. Accessibility Requirements**

* **Keyboard**: All event links focusable via Tab
* **ARIA**: List items properly structured
* **Screen Reader**: Announce event details

### **Improvements Needed**

* Add `aria-label` for date badges
* Add time element with datetime attribute

## **14. Error Handling**

| Error Condition | Behaviour | Fallback |
|-----------------|-----------|----------|
| No events | Empty state | "No upcoming events" |
| Invalid date | Skip event | Don't render |
| Missing title | Skip event | Don't render |
| Missing location | Hide location | Show "Online" or nothing |

## **15. Performance & Lifecycle Notes**

### **Event Filtering**

```typescript
const upcomingEvents = events
  .filter(event => new Date(event.eventEnd) >= new Date())
  .sort((a, b) =>
    new Date(a.eventStart).getTime() - new Date(b.eventStart).getTime()
  )
  .slice(0, 5);
```

### **Date Formatting**

```typescript
const formatCompactDate = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const timeStr = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const isToday = date.toDateString() === today.toDateString();
  const isTomorrow = date.toDateString() === tomorrow.toDateString();

  if (isToday) return `Today, ${timeStr}`;
  if (isTomorrow) return `Tomorrow, ${timeStr}`;

  const month = date.toLocaleDateString('en-US', { month: 'short' });
  const day = date.getDate();
  return `${month} ${day}, ${timeStr}`;
};
```

### **Memoization**

* `upcomingEvents` memoized with `useMemo`

## **16. Usage Examples**

### **In HomeSidebar**

```tsx
import { UpcomingEventsSidebar } from '@/components/ui/UpcomingEventsSidebar';

<UpcomingEventsSidebar events={allEvents} />
```

### **With Query Data**

```tsx
const { data: events } = useQuery({
  queryKey: ['events'],
  queryFn: getEvents,
});

<UpcomingEventsSidebar events={events || []} />
```

## **17. Features Summary**

### **Header**

* "Upcoming Events" title
* "View all" link → `/events`

### **Event Display**

| Element | Content |
|---------|---------|
| Date badge | Day number + month abbreviation |
| Title | Event title (linked) |
| Time | Today/Tomorrow/Date format |
| Location | Physical location or "Online" |
| Space | Associated space name |

### **Interactions**

* Click event → navigate to `/events/[id]`
* Click "View all" → navigate to `/events`

## **18. Testing Considerations**

### **Unit Tests**

* Filters past events correctly
* Sorts by start date
* Limits to 5 events
* Today/tomorrow formatting
* Location display logic
* Online event badge

### **Mocking**

* Event arrays with various dates
* Date.now() for relative tests

### **Edge Cases**

* All events past
* Events spanning midnight
* Events with same start time
* Very long event titles
* Missing optional fields

## **19. Out of Scope / Non-Goals**

* **RSVP actions**: Not inline
* **Calendar view**: Just list
* **Filtering by space**: Not supported
* **Pagination**: Fixed limit of 5

## **20. Related Components & System Context**

### **Siblings**

* `UrgentTasksSidebar`
* `NewestMembers`

### **Child Components**

* `Icon`

### **Used By**

* `HomeSidebar`
* Dashboard layouts

### **Links To**

* `/events` – All events page
* `/events/[id]` – Event detail page

## **21. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
|----------|----------|---------------|-------|
| `Default` | Multiple events | 5 upcoming | Normal state |
| `Empty` | No upcoming | [] | Empty message |
| `TodayEvent` | Event today | Today's date | "Today" format |
| `OnlineEvents` | Virtual events | isOnline: true | Online badge |
| `WithSpaces` | Space association | Has space | Space name shown |

### **Controls (Args) Required**

* `events` (object[]) – event data

### **Mocking Requirements**

* **Event data**: Various dates and locations
* **Date.now()**: For relative formatting

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Verify event list accessible
* Check date badge semantics
* Verify link accessibility

### **Interaction Tests**

* Click event link
* Click view all link
