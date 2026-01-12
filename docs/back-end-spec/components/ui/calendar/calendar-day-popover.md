# **Component Specification: CalendarDayPopover**

## **1. Component Name**

**`CalendarDayPopover`**

## **2. Description**

A popover component that displays event details when clicking on a calendar day. Shows event list with times, titles, space info, location, and export functionality.

* Provides detailed view of events on a specific date
* Enables quick navigation to individual events
* Supports ICS export for calendar integration

## **3. Location**

```
src/components/ui/CalendarDayPopover/CalendarDayPopover.tsx
```

## **4. Component Type**

* UI

## **5. Props Interface**

```ts
interface CalendarDayPopoverProps {
  date: Date;
  events: Event[];
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}
```

## **6. Props**

| Prop | Type | Required | Default | Description |
| ---- | ---- | -------- | ------- | ----------- |
| `date` | `Date` | Yes | - | The selected calendar date |
| `events` | `Event[]` | Yes | - | Events on this date |
| `children` | `ReactNode` | Yes | - | Trigger element (calendar cell) |
| `open` | `boolean` | No | - | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | No | - | Callback when open state changes |

## **7. Data Requirements**

### **External Data Sources**

* **Props**: `date`, `events`, `children`
* **Utilities from `@/lib/calendar-utils`**:
  * `formatTime(date)` - Formats event time
  * `getMonthName(month)` - Gets month name for header
  * `getSpaceColor(spaceId)` - Gets colour for event indicator
  * `downloadEventICS(event)` - Exports single event to ICS

```ts
// From @/lib/events
interface Event {
  id: number;
  title: string;
  eventStart: string;
  isOnline: boolean;
  location?: string;
  space: {
    id: number;
    name: string;
  };
}
```

### **Derived Values**

| Value | Derivation |
| ----- | ---------- |
| `formattedDate` | `"January 15, 2024"` format from date prop |

## **8. Internal State**

None - uses controlled state from parent via `open` and `onOpenChange` props.

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
| ----------------- | ----------- | ----- |
| `events.length === 0` | Children only (no popover) | Early return, just renders trigger |
| `events.length > 0` | Popover wrapper with event list | Full popover UI |
| `event.isOnline === true` | "Online" badge shown | No location displayed |
| `event.isOnline === false && event.location` | Location with map icon | Shows physical location |
| Click on event item | Navigate to event page | Closes popover via `onOpenChange` |
| Click export button | Download ICS file | `stopPropagation` prevents navigation |

## **10. Dependencies**

### **Child Components**

* `Popover` - Container popover (from primitives)
* `Badge` - Event count, online status (from primitives)
* `Icon` - folder, mapMarker, download icons

### **Utilities / Hooks**

* `useRouter` - Navigation to event pages
* `formatTime` - Time formatting
* `getMonthName` - Month name for header
* `getSpaceColor` - Space colour lookup
* `downloadEventICS` - ICS file generation

### **External Libraries**

* `next/navigation` - Router for navigation

## **11. Events & Callbacks**

| Event / Callback | Trigger | Description |
| ---------------- | ------- | ----------- |
| `handleEventClick` | Click on event item | Navigates to `/events/{id}`, calls `onOpenChange(false)` |
| `handleExport` | Click export button | Calls `downloadEventICS()`, stops propagation |
| `onOpenChange` | Popover open/close | Controlled by parent component |

## **12. Styling**

* **Styling approach**: CSS Modules with SCSS
* **File(s)**:
  * `CalendarDayPopover.module.scss`

### **Visual States**

* **Default**: Popover with header and event list
* **Hover (event item)**: Background highlight

### **Key Style Classes**

| Class | Purpose |
| ----- | ------- |
| `.popover` | Popover container |
| `.header` | Date title and event count |
| `.title` | Formatted date heading |
| `.events` | Scrollable event list |
| `.eventItem` | Clickable event row (button element) |
| `.indicator` | Coloured dot for space |
| `.eventContent` | Time, title, meta info |
| `.eventTime` | Start time display |
| `.eventTitle` | Event title (h4) |
| `.eventMeta` | Space name and location row |
| `.eventSpace` | Folder icon + space name |
| `.eventLocation` | Map icon + location text |
| `.exportButton` | Download ICS button |

## **13. Accessibility Requirements**

* **Export button**: Has `aria-label="Export to calendar"` and `title` tooltip
* **Interactive elements**: Event items are `<button>` elements for keyboard access
* **Popover**: Uses primitives Popover which handles focus trapping

### **Improvements Needed**

* Event items could have more descriptive `aria-label` including event title and time
* Consider `aria-live` announcement when popover opens

## **14. Error Handling**

| Condition | Behaviour |
| --------- | --------- |
| Empty events array | Returns children only (no popover wrapper) |
| Missing event location | Location section not rendered |
| Missing space data | Would cause error (requires space.id and space.name) |

**Not handled by this component:**
* Navigation failures
* ICS download failures

## **15. Performance & Lifecycle Notes**

* **No side effects on mount** - popover is controlled by parent
* **Efficient rendering**: Only renders popover content when `open` is true (handled by Popover component)
* **No cleanup required** - no listeners registered

## **16. Usage Examples**

```tsx
import { CalendarDayPopover } from '@/components/ui/CalendarDayPopover';

// Controlled usage
const [isOpen, setIsOpen] = useState(false);

<CalendarDayPopover
  date={selectedDate}
  events={dayEvents}
  open={isOpen}
  onOpenChange={setIsOpen}
>
  <button className={styles.calendarDay}>
    {day}
  </button>
</CalendarDayPopover>

// In calendar grid
{days.map((day) => (
  <CalendarDayPopover
    key={day.dateKey}
    date={day.date}
    events={getEventsForDate(day.date)}
  >
    <DayCell day={day} />
  </CalendarDayPopover>
))}
```

## **17. Features Summary**

* Formatted date header (e.g., "January 15, 2024")
* Event count badge
* Event items with:
  * Colour indicator (space colour)
  * Start time
  * "Online" badge if applicable
  * Event title (clickable, navigates to event)
  * Space name with folder icon
  * Location with map marker (if not online)
  * Export to ICS button
* Graceful empty state (renders children only)

## **18. Testing Considerations**

### **Unit Tests**

* Returns children only when events array is empty
* Renders correct number of event items
* Displays formatted date correctly
* Navigates to event page on click
* Closes popover after navigation
* Downloads ICS on export click
* Shows "Online" badge for online events
* Shows location for in-person events

### **Mocking Required**

* `useRouter` - mock `push` function
* `downloadEventICS` - mock to verify calls
* Calendar utilities - `formatTime`, `getMonthName`, `getSpaceColor`

### **Edge Cases**

* Single event on date
* Many events (scrolling)
* Very long event titles
* Missing location data
* Online vs in-person events

## **19. Out of Scope / Non-Goals**

* **Event editing** - read-only display
* **Event deletion** - handled elsewhere
* **Multi-select events** - single event navigation only
* **Event preview/details** - only shows summary, full details on event page

## **20. Related Components & System Context**

### **Sibling Components**

* `CalendarFilters` - filter events
* `CalendarSearch` - search events
* `CalendarColorLegend` - space colour reference

### **Child Components**

* `Popover` (primitives)
* `Badge` (primitives)
* `Icon`

### **Parent Components**

* `EventCalendar` - wraps each day cell

### **Typical Usage Locations**

* Calendar page grid cells
* Mini calendar day cells

## **21. Open Questions / Notes**

* Consider adding event preview tooltip before opening popover
* Could show event duration (end time) in addition to start time
* May want to add "Add to calendar" for multiple events at once

## **22. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
| -------- | -------- | ------------- | ----- |
| `Default` | Multiple events | 3-4 events on date | Full UI |
| `SingleEvent` | One event | Single event | Minimal case |
| `NoEvents` | Empty state | `events: []` | Should render children only |
| `OnlineEvents` | Online events | Events with `isOnline: true` | Shows "Online" badge |
| `WithLocations` | In-person events | Events with location | Shows location row |
| `Open` | Pre-opened state | `open: true` | Shows popover immediately |

### **Controls (Args) Required**

* `date` - Date picker
* `events` - Array of mock events
* `open` - Boolean toggle

### **Mocking Requirements**

* `useRouter` - mock with action logging
* `downloadEventICS` - mock with action logging
* Calendar utilities

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Verify focus trapping in popover
* Verify keyboard navigation through events
* Verify export button has accessible name

### **Interaction Tests**

* Open popover → click event → verify navigation + popover closes
* Open popover → click export → verify download triggered + popover stays open
* Keyboard: Tab through events, Enter to select
