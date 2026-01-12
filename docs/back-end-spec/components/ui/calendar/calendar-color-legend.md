# **Component Specification: CalendarColorLegend**

## **1. Component Name**

**`CalendarColorLegend`**

## **2. Description**

A legend component for the calendar view showing which colours correspond to which spaces. Displays space names with their colour dots and event counts.

* Provides visual reference for space-to-colour mapping
* Shows event count per space for quick overview
* Sorts spaces by event count for relevance

## **3. Location**

```
src/components/ui/CalendarColorLegend/CalendarColorLegend.tsx
```

## **4. Component Type**

* UI

## **5. Props Interface**

```ts
interface CalendarColorLegendProps {
  events: Event[];
}
```

## **6. Props**

| Prop | Type | Required | Default | Description |
| ---- | ---- | -------- | ------- | ----------- |
| `events` | `Event[]` | Yes | - | Events to extract space information from |

## **7. Data Requirements**

### **External Data Sources**

* **Props**: `events` array containing space information
* **Utility**: `groupEventsBySpace()` from `@/lib/calendar-utils`
* **Utility**: `getSpaceColor()` from `@/lib/calendar-utils`

```ts
// From @/lib/events
interface Event {
  id: number;
  space: {
    id: number;
    name: string;
  };
  // ... other event properties
}
```

### **Derived Values**

| Value | Derivation |
| ----- | ---------- |
| `spaceGroups` | Events grouped by space ID via `groupEventsBySpace()` |
| `spaces` | Unique spaces with id, name, colour, and event count, sorted by count descending |

## **8. Internal State**

None - uses memoized derived values only.

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
| ----------------- | ----------- | ----- |
| `spaces.length === 0` | `null` | Component renders nothing |
| `spaces.length > 0` | Legend with title and space items | Each item has colour dot, name, count badge |

## **10. Dependencies**

### **Child Components**

* `Badge` - Event count display (from primitives)

### **Utilities / Hooks**

* `useMemo` - Memoization of derived values
* `groupEventsBySpace` - Groups events by space ID
* `getSpaceColor` - Returns consistent colour for space ID

## **11. Events & Callbacks**

None - this is a display-only component.

## **12. Styling**

* **Styling approach**: CSS Modules with SCSS
* **File(s)**:
  * `CalendarColorLegend.module.scss`

### **Visual States**

* **Default**: Vertical list of space items

### **Key Style Classes**

| Class | Purpose |
| ----- | ------- |
| `.legend` | Container element |
| `.title` | "Spaces" heading |
| `.items` | List container |
| `.item` | Individual space row (dot + name + badge) |
| `.dot` | Colour indicator circle |
| `.name` | Space name text |

## **13. Accessibility Requirements**

* **Semantic structure**: Uses `<h3>` for title
* **Colour meaning**: Each dot is paired with text label (not colour-only information)

### **Improvements Needed**

* Consider adding `role="list"` and `role="listitem"` for screen readers
* Dots could have `aria-hidden="true"` since name provides the same info

## **14. Error Handling**

| Condition | Behaviour |
| --------- | --------- |
| Empty events array | Returns `null` |
| Event with missing space | Skipped in grouping (handled by utility) |

**Not handled by this component:**
* Invalid space IDs (handled by `getSpaceColor` fallback)

## **15. Performance & Lifecycle Notes**

* **Memoization**: Both `spaceGroups` and `spaces` are memoized with `useMemo`
* **Re-renders**: Only when `events` prop reference changes
* **Efficient**: No side effects, pure computation

## **16. Usage Examples**

```tsx
import { CalendarColorLegend } from '@/components/ui/CalendarColorLegend';

// Basic usage
<CalendarColorLegend events={allEvents} />

// In calendar sidebar
<div className={styles.sidebar}>
  <CalendarColorLegend events={filteredEvents} />
</div>
```

## **17. Features Summary**

* Groups events by space
* Displays unique spaces with their assigned colours
* Shows event count per space via Badge component
* Sorts spaces by event count (descending)
* Returns null when no spaces found (graceful empty state)

## **18. Testing Considerations**

### **Unit Tests**

* Returns null when events array is empty
* Returns null when events have no spaces
* Displays correct number of space items
* Sorts spaces by event count descending
* Displays correct event counts
* Colour dots match `getSpaceColor` output

### **Mocking Required**

* `groupEventsBySpace` - if testing in isolation
* `getSpaceColor` - if testing colour consistency

### **Edge Cases**

* Events with duplicate spaces (should consolidate)
* Single event / single space
* Many spaces (visual overflow)

## **19. Out of Scope / Non-Goals**

* **Filtering by space** - click to filter is not implemented
* **Collapsible legend** - always fully visible
* **Custom colour assignment** - uses `getSpaceColor` utility

## **20. Related Components & System Context**

### **Sibling Components**

* `CalendarFilters` - allows filtering by space
* `CalendarSearch` - text search for events
* `CalendarDayPopover` - event details on day click

### **Child Components**

* `Badge`

### **Typical Usage Locations**

* Calendar page sidebar
* Event calendar header area

## **21. Open Questions / Notes**

* Consider making spaces clickable to filter calendar
* Could add colour customization per space in settings

## **22. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
| -------- | -------- | ------------- | ----- |
| `Default` | Multiple spaces | Events from 3-4 spaces | Shows sorted list |
| `SingleSpace` | One space only | All events from same space | Minimal case |
| `Empty` | No events | `events: []` | Renders nothing (null) |
| `ManySpaces` | Overflow case | Events from 10+ spaces | Check scrolling/layout |

### **Controls (Args) Required**

* `events` - array of mock events with various spaces

### **Mocking Requirements**

* `getSpaceColor` - can use real or provide consistent mock colours
* Mock events with realistic space data

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Verify colour is not sole means of conveying information
* Verify heading structure
