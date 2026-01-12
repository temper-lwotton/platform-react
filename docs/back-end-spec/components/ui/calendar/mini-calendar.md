# **Component Specification: MiniCalendar**

## **1. Component Name**

**`MiniCalendar`**

## **2. Description**

A compact calendar widget showing a month view with event count indicators. Used in sidebars and dashboards for quick date selection and event overview.

* Provides compact monthly calendar view
* Shows event counts per day
* Enables quick date navigation

## **3. Location**

```
src/components/ui/MiniCalendar/MiniCalendar.tsx
```

## **4. Component Type**

* UI

## **5. Props Interface**

```ts
interface MiniCalendarProps {
  currentDate: Date;
  events: Event[];
  onDateClick: (date: Date) => void;
  onMonthChange?: (date: Date) => void;
}
```

## **6. Props**

| Prop | Type | Required | Default | Description |
| ---- | ---- | -------- | ------- | ----------- |
| `currentDate` | `Date` | Yes | - | Currently displayed month |
| `events` | `Event[]` | Yes | - | Events to show indicators for |
| `onDateClick` | `(date: Date) => void` | Yes | - | Callback when a date is clicked |
| `onMonthChange` | `(date: Date) => void` | No | - | Callback when navigating months |

## **7. Data Requirements**

### **External Data Sources**

* **Props**: `currentDate`, `events`
* **Utilities from `@/lib/calendar-utils`**:
  * `getDaysInMonth(year, month)` - Returns calendar grid days
  * `getMonthName(month)` - Month name for header
  * `getWeekdayNames(short)` - Short weekday headers
  * `getEventsForDate(events, date)` - Filter events by date

```ts
// From @/lib/events
interface Event {
  id: number;
  eventStart: string;
  // ... other properties
}

// From @/lib/calendar-utils
interface CalendarDay {
  date: Date;
  dateKey: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
}
```

### **Derived Values (Memoized)**

| Value | Derivation |
| ----- | ---------- |
| `days` | Calendar grid from `getDaysInMonth()` |
| `weekdays` | Short weekday names from `getWeekdayNames(true)` |
| `eventCounts` | Map of dateKey → event count for quick lookup |

## **8. Internal State**

None - component is fully controlled via props.

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
| ----------------- | ----------- | ----- |
| Day has events | Event count badge displayed | Shows number |
| Day is today | `.mini-calendar-day--today` class | Highlighted |
| Day is in different month | `.mini-calendar-day--other-month` class | Muted styling |
| Day has events | `.mini-calendar-day--has-events` class | Additional styling |
| Click on day | Calls `onDateClick` with date | Navigates to date |
| Click prev arrow | Calls `onMonthChange` with previous month | If callback provided |
| Click next arrow | Calls `onMonthChange` with next month | If callback provided |

## **10. Dependencies**

### **Child Components**

None - uses native HTML elements.

### **Utilities / Hooks**

* `useMemo` - Memoized event count calculation
* Calendar utilities from `@/lib/calendar-utils`

## **11. Events & Callbacks**

| Event / Callback | Trigger | Description |
| ---------------- | ------- | ----------- |
| `onDateClick` | Click on day cell | Called with clicked date |
| `onMonthChange` | Click prev/next arrow | Called with new month's first day (if prop provided) |
| `handleDayClick` | Internal handler | Calls `onDateClick(day.date)` |
| `goToPreviousMonth` | Click `‹` button | Calls `onMonthChange` with previous month |
| `goToNextMonth` | Click `›` button | Calls `onMonthChange` with next month |

## **12. Styling**

* **Styling approach**: Global CSS classes (not CSS Modules)
* **Class prefix**: `mini-calendar-*`

### **Visual States**

* **Today**: Highlighted circle/background
* **Other month**: Muted text colour
* **Has events**: Visual indicator (badge)
* **Hover**: Light background on day cells

### **Key Style Classes**

| Class | Purpose |
| ----- | ------- |
| `.mini-calendar` | Main container |
| `.mini-calendar-header` | Navigation row |
| `.mini-calendar-nav-btn` | Prev/next buttons |
| `.mini-calendar-month-name` | Month + year display |
| `.mini-calendar-grid` | Days grid |
| `.mini-calendar-weekday` | Weekday header cells |
| `.mini-calendar-day` | Day cell button |
| `.mini-calendar-day--today` | Today modifier |
| `.mini-calendar-day--other-month` | Other month modifier |
| `.mini-calendar-day--has-events` | Has events modifier |
| `.mini-calendar-day-number` | Date number text |
| `.mini-calendar-day-badge` | Event count badge |

## **13. Accessibility Requirements**

* **Navigation buttons**: Have `aria-label` ("Previous month", "Next month")
* **Day cells**: Are `<button>` elements for keyboard access
* **Day cells with events**: Have `title` attribute with event count

### **Improvements Needed**

* Add `role="grid"` to calendar grid
* Add `aria-label` to day cells with full date
* Consider `role="columnheader"` for weekday cells
* Add `aria-current="date"` for today

## **14. Error Handling**

| Condition | Behaviour |
| --------- | --------- |
| Empty events array | No badges displayed |
| `onMonthChange` not provided | Navigation buttons do nothing |
| Invalid date | Would cause rendering issues (trusts parent) |

**Not handled by this component:**
* Event loading errors
* Invalid currentDate

## **15. Performance & Lifecycle Notes**

* **Memoization**: `eventCounts` map is memoized
* **Controlled component**: No internal state, re-renders on prop changes
* **Efficient lookup**: O(1) event count lookup per day
* **No side effects**: Pure rendering component

## **16. Usage Examples**

```tsx
import { MiniCalendar } from '@/components/ui/MiniCalendar';

// Basic usage
const [currentDate, setCurrentDate] = useState(new Date());

<MiniCalendar
  currentDate={currentDate}
  events={events}
  onDateClick={(date) => {
    setSelectedDate(date);
    scrollToDate(date);
  }}
  onMonthChange={(date) => {
    setCurrentDate(date);
    fetchEventsForMonth(date);
  }}
/>

// In sidebar
<div className={styles.sidebar}>
  <h3>Calendar</h3>
  <MiniCalendar
    currentDate={viewDate}
    events={userEvents}
    onDateClick={handleDateSelect}
    onMonthChange={handleMonthChange}
  />
</div>
```

## **17. Features Summary**

* **Compact layout**: Fits in sidebar widgets
* **Month navigation**: Previous/next month arrows
* **Month/year display**: Current month and year in header
* **Today indicator**: Highlighted current date
* **Event counts**: Badge showing number of events per day
* **Other month styling**: Muted days from adjacent months
* **Click to select**: Date selection via click

## **18. Testing Considerations**

### **Unit Tests**

* Renders correct month and year in header
* Renders correct number of days
* Displays weekday headers
* Highlights today's date
* Shows event count badges for days with events
* Navigation calls `onMonthChange` with correct date
* Day click calls `onDateClick` with correct date
* Mutes other-month days

### **Mocking Required**

* Calendar utilities - can use real or mock
* `onDateClick` - mock callback
* `onMonthChange` - mock callback

### **Edge Cases**

* Month with no events
* Day with many events (badge overflow)
* February in leap year
* Navigation without `onMonthChange` prop

## **19. Out of Scope / Non-Goals**

* **Event details** - only shows counts, not event info
* **Event creation** - handled elsewhere
* **Week/day views** - only month view
* **Multi-select dates** - single date selection only
* **Selected date styling** - parent's responsibility

## **20. Related Components & System Context**

### **Sibling Components**

* `EventCalendar` - full-size calendar with more features

### **Parent Components**

* `HomeSidebar` - sidebar widget
* Dashboard pages

### **Typical Usage Locations**

* Home page sidebar
* Dashboard widgets
* Space sidebars

## **21. Open Questions / Notes**

* Consider adding selected date styling
* May want to show space colours for events
* Could add tooltip preview on hover

## **22. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
| -------- | -------- | ------------- | ----- |
| `Default` | Current month | Mock events | Basic view |
| `Empty` | No events | `events: []` | No badges |
| `ManyEvents` | Busy month | Multiple events per day | Badge overflow |
| `DifferentMonth` | Non-current month | Past/future `currentDate` | Navigation testing |
| `NoMonthChange` | Read-only navigation | No `onMonthChange` prop | Buttons disabled/hidden |

### **Controls (Args) Required**

* `currentDate` - Date picker
* `events` - Array of mock events
* `onDateClick` - Action logger
* `onMonthChange` - Action logger

### **Mocking Requirements**

* Mock events with various dates
* Action logging for callbacks

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Verify navigation buttons have labels
* Verify day cells are keyboard accessible
* Verify event counts are announced

### **Interaction Tests**

* Click day → verify `onDateClick` called with correct date
* Click prev/next → verify `onMonthChange` called with correct month
* Hover day with events → verify tooltip shows count
