# **Component Specification: EventCalendar**

## **1. Component Name**

**`EventCalendar`**

## **2. Description**

A full-featured month calendar view displaying events with multi-day event bars, keyboard navigation, month export, and day popovers. The primary calendar component for viewing events across a month.

* Displays monthly calendar grid with event indicators
* Supports multi-day event bar rendering
* Provides keyboard shortcuts for navigation
* Enables ICS export of monthly events

## **3. Location**

```
src/components/ui/EventCalendar/EventCalendar.tsx
```

## **4. Component Type**

* Feature

## **5. Props Interface**

```ts
interface EventCalendarProps {
  events: Event[];
  onEventClick?: (event: Event) => void;
  onDateClick?: (date: Date) => void;
}
```

## **6. Props**

| Prop | Type | Required | Default | Description |
| ---- | ---- | -------- | ------- | ----------- |
| `events` | `Event[]` | Yes | - | Events to display on calendar |
| `onEventClick` | `(event: Event) => void` | No | - | Callback when clicking an event (currently unused) |
| `onDateClick` | `(date: Date) => void` | No | - | Callback when clicking a date cell |

## **7. Data Requirements**

### **External Data Sources**

* **Props**: `events` array
* **Utilities from `@/lib/calendar-utils`**:
  * `getDaysInMonth(year, month)` - Returns calendar grid days
  * `getMonthName(month)` - Month name for display
  * `getWeekdayNames(short)` - Weekday headers
  * `getEventsForDate(events, date)` - Filter events by date
  * `getSpaceColor(spaceId)` - Event colour by space
  * `isMultiDayEvent(event)` - Check if event spans multiple days
  * `getEventDateSpan(event)` - Get date keys for multi-day event
  * `downloadICS(events, filename)` - Export events to ICS file

```ts
// From @/lib/events
interface Event {
  id: number;
  title: string;
  eventStart: string;
  eventEnd?: string;
  space: {
    id: number;
    name: string;
  };
  // ... other properties
}

// From @/lib/calendar-utils
interface CalendarDay {
  date: Date;
  dateKey: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isPast: boolean;
}
```

## **8. Internal State**

| State Variable | Type | Purpose |
| -------------- | ---- | ------- |
| `currentDate` | `Date` | Currently displayed month (year + month derived) |

### **Derived Values (Memoized)**

| Value | Derivation |
| ----- | ---------- |
| `days` | Calendar grid from `getDaysInMonth()` |
| `weekdays` | Short weekday names from `getWeekdayNames(true)` |
| `getEventsForDay` | Map of dateKey → Event[] for quick lookup |
| `multiDayEvents` | Filtered events that span multiple days |
| `eventSpans` | Map of weekRow → span positions for multi-day bars |

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
| ----------------- | ----------- | ----- |
| Day has single-day events | Coloured dots (max 3) | `+N more` if over 3 |
| Day has multi-day events | Coloured bar spanning days | Positioned in week row |
| Day is today | `.dayToday` styling | Highlighted |
| Day is in different month | `.dayOtherMonth` styling | Muted appearance |
| Day is in past | `.dayPast` styling | Subtle styling |
| Day has events | Day wrapped in `CalendarDayPopover` | Click shows event list |
| Click "Today" button | Navigate to current month | Uses `goToToday()` |
| Click "Export" button | Download ICS for current month | Filename: `{Month}-{Year}-events.ics` |
| Press `←` key | Go to previous month | Global keyboard shortcut |
| Press `→` key | Go to next month | Global keyboard shortcut |
| Press `T` key | Go to today | Global keyboard shortcut |

## **10. Dependencies**

### **Child Components**

* `CalendarDayPopover` - Event details on day click
* `MonthYearSelector` - Month/year dropdown in header
* `Icon` - Navigation and export icons

### **Utilities / Hooks**

* `useState` - Current date state
* `useMemo` - Memoized event calculations
* `useEffect` - Keyboard shortcut listener
* Calendar utility functions from `@/lib/calendar-utils`

## **11. Events & Callbacks**

| Event / Callback | Trigger | Description |
| ---------------- | ------- | ----------- |
| `goToPreviousMonth` | Click prev button or `←` key | Navigate to previous month |
| `goToNextMonth` | Click next button or `→` key | Navigate to next month |
| `goToToday` | Click Today button or `T` key | Navigate to current date's month |
| `handleMonthChange` | MonthYearSelector change | Set specific month |
| `handleYearChange` | MonthYearSelector change | Set specific year |
| `handleDayClick` | Click on day cell | Calls `onDateClick` prop if provided |
| `handleExportMonth` | Click Export button | Downloads ICS file for current month's events |

## **12. Styling**

* **Styling approach**: CSS Modules with SCSS
* **File(s)**:
  * `EventCalendar.module.scss`

### **Visual States**

* **Today**: Highlighted date cell
* **Other month**: Muted date cells
* **Past dates**: Subtle styling
* **Has events**: Event indicators visible
* **Hover**: Day cell hover effect

### **Key Style Classes**

| Class | Purpose |
| ----- | ------- |
| `.calendar` | Main container |
| `.header` | Navigation toolbar |
| `.headerTitle` | Month selector, Today, Export buttons |
| `.nav` | Prev/next navigation arrows |
| `.navBtn` | Navigation button styling |
| `.todayBtn` | "Today" button |
| `.exportBtn` | "Export" button |
| `.gridWrapper` | Grid container |
| `.grid` | Calendar grid layout |
| `.weekday` | Weekday header cells |
| `.week` | Week row container |
| `.weekGrid` | Week's day cells grid |
| `.day` | Day cell button |
| `.dayNumber` | Date number text |
| `.dayToday` | Today highlight |
| `.dayOtherMonth` | Other month styling |
| `.dayPast` | Past date styling |
| `.dayHasEvents` | Day with events |
| `.dayIndicators` | Event dot container |
| `.dayDot` | Single event dot |
| `.dayMore` | "+N more" indicator |
| `.multidayContainer` | Multi-day bar container |
| `.multidayBar` | Multi-day event bar |
| `.multidayTitle` | Event title in bar |

## **13. Accessibility Requirements**

* **Main container**: `role="region"` with `aria-label="Events calendar"`
* **Header toolbar**: `role="toolbar"` with `aria-label="Calendar navigation"`
* **Grid**: `role="grid"` with `aria-label` including month/year
* **Weekday headers**: `role="columnheader"` with `aria-label`
* **Day cells**: `aria-label` with full date and event count
* **Navigation buttons**: `aria-label` with keyboard shortcut info
* **Export button**: `aria-label="Export month to calendar"` with title tooltip

### **Keyboard Shortcuts**

| Key | Action | Notes |
| --- | ------ | ----- |
| `←` | Previous month | When not in input/textarea |
| `→` | Next month | When not in input/textarea |
| `T` / `t` | Go to today | When not in input/textarea |

### **Improvements Needed**

* Add arrow key navigation within the grid (day-to-day)
* Add Enter key to select focused date
* Consider `aria-live` for month change announcements

## **14. Error Handling**

| Condition | Behaviour |
| --------- | --------- |
| Empty events array | Calendar displays with no indicators |
| No events in current month | Export button still works (empty ICS) |
| Invalid event dates | Handled by calendar utilities |

**Not handled by this component:**
* Event loading errors (parent's responsibility)
* ICS download failures

## **15. Performance & Lifecycle Notes**

* **Memoization**: Heavy use of `useMemo` for event calculations
* **Event map**: Pre-computed map of dateKey → events for O(1) lookup
* **Multi-day calculation**: Complex span calculation done once per events change
* **Keyboard listener**: Added on mount, removed on unmount
* **Re-renders**: Only when `currentDate` or `events` change

## **16. Usage Examples**

```tsx
import { EventCalendar } from '@/components/ui/EventCalendar';

// Basic usage
<EventCalendar events={events} />

// With callbacks
<EventCalendar
  events={calendarEvents}
  onEventClick={(event) => router.push(`/events/${event.id}`)}
  onDateClick={(date) => setSelectedDate(date)}
/>

// In page layout
<div className={styles.calendarPage}>
  <CalendarFilters events={events} onFilterChange={setFilters} />
  <EventCalendar events={filteredEvents} />
  <CalendarColorLegend events={filteredEvents} />
</div>
```

## **17. Features Summary**

* **Month navigation**: Previous/next month, today button
* **Month/year selector**: Dropdown for quick navigation
* **Multi-day events**: Coloured bars spanning multiple days
* **Single-day events**: Coloured dots (max 3, then +N more)
* **Day popovers**: Click day to see event list via `CalendarDayPopover`
* **Keyboard navigation**: Arrow keys for months, T for today
* **ICS export**: Download current month's events
* **Today highlight**: Visual indicator for current date
* **ARIA support**: Semantic roles and labels for screen readers

## **18. Testing Considerations**

### **Unit Tests**

* Renders correct number of days for month
* Displays weekday headers
* Highlights today's date
* Shows event dots for days with events
* Limits dots to 3 with "+N more" indicator
* Renders multi-day event bars correctly
* Month navigation updates display
* Today button navigates to current month
* Export downloads ICS file with correct filename
* Keyboard shortcuts work (←, →, T)

### **Mocking Required**

* `downloadICS` - mock to verify calls
* Calendar utilities - can use real or mock
* `CalendarDayPopover` - mock or shallow render
* `MonthYearSelector` - mock or shallow render

### **Edge Cases**

* Month with no events
* Month starting on Sunday/Saturday
* Multi-day event spanning month boundary
* Event on last day of month
* February in leap year

## **19. Out of Scope / Non-Goals**

* **Week view** - only month view supported
* **Day view** - only month view supported
* **Event creation inline** - handled elsewhere
* **Drag and drop** - not implemented
* **Recurring events display** - shows as individual occurrences
* **Time zones** - uses local time

## **20. Related Components & System Context**

### **Child Components**

* `CalendarDayPopover` - event list on day click
* `MonthYearSelector` - month/year dropdown
* `Icon` - navigation and export icons

### **Sibling Components**

* `CalendarFilters` - filter events
* `CalendarSearch` - search events
* `CalendarColorLegend` - space colour reference
* `MiniCalendar` - compact version

### **Typical Usage Locations**

* Calendar page (main view)
* Space events page
* Dashboard widgets

## **21. Open Questions / Notes**

* Consider adding week view option
* May want to add day-to-day keyboard navigation within grid
* Could add recurring event visual indicators
* Consider drag-to-create events

## **22. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
| -------- | -------- | ------------- | ----- |
| `Default` | Current month | Mock events | Full calendar view |
| `Empty` | No events | `events: []` | Empty calendar |
| `ManyEvents` | Busy month | Many events per day | Test overflow UI |
| `MultiDayEvents` | Multi-day events | Events spanning 3-5 days | Test bar rendering |
| `MonthBoundary` | Events at month edges | Events on first/last days | Edge case testing |
| `DifferentMonth` | Non-current month | Set initial `currentDate` | Navigation testing |

### **Controls (Args) Required**

* `events` - Array of mock events
* `onDateClick` - Action logger
* `onEventClick` - Action logger

### **Mocking Requirements**

* `downloadICS` - mock with action logging
* `MonthYearSelector` - real or mock
* `CalendarDayPopover` - real or mock

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Verify grid roles and labels
* Verify navigation button labels
* Verify day cell labels include event count

### **Interaction Tests**

* Click prev/next → verify month changes
* Click Today → verify navigates to current month
* Click Export → verify download triggered
* Click day with events → verify popover opens
* Keyboard: ←/→ changes month, T goes to today
