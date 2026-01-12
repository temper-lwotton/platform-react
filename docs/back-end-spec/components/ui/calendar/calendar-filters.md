# **Component Specification: CalendarFilters**

## **1. Component Name**

**`CalendarFilters`**

## **2. Description**

A filter popover for the calendar view allowing users to filter events by location type (online/in-person), spaces, and tags. Extracts filter options dynamically from available events.

* Provides multi-criteria filtering for calendar events
* Automatically populates filter options from event data
* Shows active filter count on trigger button

## **3. Location**

```
src/components/ui/CalendarFilters/CalendarFilters.tsx
```

## **4. Component Type**

* Feature

## **5. Props Interface**

```ts
interface CalendarFiltersProps {
  events: Event[];
  onFilterChange: (filters: FilterState) => void;
}

interface FilterState {
  spaceIds: number[];
  tagIds: number[];
  isOnline: boolean | null; // null = both, true = online only, false = in-person only
}
```

## **6. Props**

| Prop | Type | Required | Default | Description |
| ---- | ---- | -------- | ------- | ----------- |
| `events` | `Event[]` | Yes | - | Events to extract filter options from |
| `onFilterChange` | `(filters: FilterState) => void` | Yes | - | Callback when any filter changes |

## **7. Data Requirements**

### **External Data Sources**

* **Props**: `events` array with space and tag data

```ts
// From @/lib/events
interface Event {
  space: Space;
  tags?: Tag[];
  isOnline: boolean;
}

interface Space {
  id: number;
  name: string;
}

interface Tag {
  id: number;
  name: string;
}
```

### **Derived Values**

| Value | Derivation |
| ----- | ---------- |
| `spaces` | Unique spaces from events, sorted alphabetically by name |
| `tags` | Unique tags from events, sorted alphabetically by name |
| `activeFilterCount` | Sum of selected spaces + selected tags + (location filter active ? 1 : 0) |

## **8. Internal State**

| State Variable | Type | Purpose |
| -------------- | ---- | ------- |
| `isOpen` | `boolean` | Popover visibility |
| `filters` | `FilterState` | Current filter selections |

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
| ----------------- | ----------- | ----- |
| `activeFilterCount === 0` | Button without badge | Default state |
| `activeFilterCount > 0` | Button with count badge | Shows number of active filters |
| `activeFilterCount > 0` | "Clear all" button visible | Appears in popover header |
| `spaces.length === 0` | Spaces section hidden | No spaces to filter |
| `tags.length === 0` | Tags section hidden | No tags to filter |
| Toggle space checkbox | Add/remove from `spaceIds` | Calls `onFilterChange` |
| Toggle tag checkbox | Add/remove from `tagIds` | Calls `onFilterChange` |
| Change location radio | Update `isOnline` value | Calls `onFilterChange` |
| Click "Clear all" | Reset all filters | Sets all to empty/null |

## **10. Dependencies**

### **Child Components**

* `Icon` - Filter icon in trigger button
* `RadioGroup` - Location filter options (from primitives)

### **Utilities / Hooks**

* `useState` - Popover and filter state
* `useMemo` - Memoized space/tag extraction

### **External Libraries**

* `@radix-ui/react-popover` - Popover container
* `@radix-ui/react-checkbox` - Checkbox components

## **11. Events & Callbacks**

| Event / Callback | Trigger | Description |
| ---------------- | ------- | ----------- |
| `handleSpaceToggle` | Toggle space checkbox | Add/remove space ID from filter, calls `onFilterChange` |
| `handleTagToggle` | Toggle tag checkbox | Add/remove tag ID from filter, calls `onFilterChange` |
| `handleLocationFilter` | Change location radio | Set `isOnline` to `true`, `false`, or `null`, calls `onFilterChange` |
| `handleClearAll` | Click "Clear all" | Reset all filters to default, calls `onFilterChange` |

## **12. Styling**

* **Styling approach**: Global CSS classes (not CSS Modules)
* **Class prefix**: `calendar-filter-*`

### **Visual States**

* **Default**: Filter button with icon and label
* **Active**: Badge showing filter count
* **Hover**: Standard button hover state

### **Key Style Classes**

| Class | Purpose |
| ----- | ------- |
| `.calendar-filter-button` | Trigger button |
| `.calendar-filter-badge` | Active filter count |
| `.calendar-filter-popover` | Popover container |
| `.calendar-filter-header` | Title and clear button row |
| `.calendar-filter-section` | Filter group container |
| `.calendar-filter-section-title` | Section heading (h4) |
| `.calendar-filter-options` | Checkbox list container |
| `.calendar-filter-option` | Label + checkbox row |
| `.calendar-filter-checkbox` | Checkbox component |
| `.calendar-filter-clear` | Clear all button |

## **13. Accessibility Requirements**

* **Filter button**: Has `aria-label="Filters"` for screen readers
* **Checkboxes**: Radix Checkbox provides accessible checkbox semantics
* **Radio group**: RadioGroup primitive handles ARIA roles
* **Keyboard navigation**: Radix handles Tab, Space, Arrow keys

### **Improvements Needed**

* Filter button could announce active filter count
* Consider `aria-live` region for filter change announcements
* Sections could use `role="group"` with `aria-labelledby`

## **14. Error Handling**

| Condition | Behaviour |
| --------- | --------- |
| Empty events array | No spaces or tags to display (sections hidden) |
| Event missing space | Skipped in space extraction |
| Event missing tags | Skipped in tag extraction |

**Not handled by this component:**
* Invalid filter state from parent (trusts `onFilterChange` callback)

## **15. Performance & Lifecycle Notes**

* **Memoization**: `spaces` and `tags` are memoized with `useMemo`
* **Re-renders**: On `events` prop change or filter state change
* **Efficient**: Only extracts unique values once per `events` change
* **No cleanup required** - Radix handles popover cleanup

## **16. Usage Examples**

```tsx
import { CalendarFilters, applyEventFilters, FilterState } from '@/components/ui/CalendarFilters';

const [filters, setFilters] = useState<FilterState>({
  spaceIds: [],
  tagIds: [],
  isOnline: null,
});

const filteredEvents = applyEventFilters(events, filters);

<CalendarFilters events={events} onFilterChange={setFilters} />
```

## **17. Features Summary**

* Filter button with active filter count badge
* Location filter (radio group):
  * All events
  * Online only
  * In-person only
* Space filter (checkboxes):
  * Lists all unique spaces from events
  * Alphabetically sorted
* Tag filter (checkboxes):
  * Lists all unique tags from events
  * Alphabetically sorted
* "Clear all" button when filters are active

## **18. Testing Considerations**

### **Unit Tests**

* Extracts unique spaces from events
* Extracts unique tags from events
* Sorts spaces and tags alphabetically
* Badge shows correct active filter count
* Space toggle adds/removes from filter
* Tag toggle adds/removes from filter
* Location radio updates filter correctly
* Clear all resets all filters
* Calls `onFilterChange` on every change

### **Mocking Required**

* Mock events with various spaces and tags
* `onFilterChange` - mock callback to verify calls

### **Edge Cases**

* Events with no spaces
* Events with no tags
* Single space/tag
* Many spaces/tags (scrolling)
* Rapid filter changes

## **19. Out of Scope / Non-Goals**

* **Persisting filters** - state managed by parent
* **Saved filter presets** - not implemented
* **Date range filtering** - handled separately
* **Free-text search** - handled by `CalendarSearch`

## **20. Related Components & System Context**

### **Sibling Components**

* `CalendarSearch` - text search for events
* `CalendarColorLegend` - space colour reference
* `CalendarDayPopover` - event details on day click

### **Child Components**

* `Icon`
* `RadioGroup` (primitives)
* Radix Checkbox (direct usage)

### **Parent Components**

* Calendar page - manages filter state

### **Exported Helper Functions**

#### `applyEventFilters(events, filters)`

Applies the filter state to an event list:
* Filters by selected space IDs (if any)
* Filters by selected tag IDs (if any, using OR logic)
* Filters by isOnline flag

## **21. Open Questions / Notes**

* Consider persisting filter preferences in localStorage
* May want AND logic option for tag filtering
* Could add "Select all" / "Deselect all" for spaces and tags

## **22. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
| -------- | -------- | ------------- | ----- |
| `Default` | No filters active | Empty filter state | Shows button without badge |
| `WithActiveFilters` | Filters selected | Pre-selected spaces/tags | Shows badge with count |
| `ManyOptions` | Many spaces/tags | Events from 10+ spaces | Check scrolling |
| `NoOptions` | No spaces/tags | Minimal events | Sections hidden |
| `Open` | Popover open | Pre-opened | Full popover visible |

### **Controls (Args) Required**

* `events` - Array of mock events with various spaces/tags
* `onFilterChange` - Action logger

### **Mocking Requirements**

* Mock events with realistic space and tag data
* Action logging for `onFilterChange` calls

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Verify checkbox/radio keyboard navigation
* Verify popover focus management
* Verify filter button has accessible name

### **Interaction Tests**

* Toggle space checkbox → verify `onFilterChange` called with updated spaceIds
* Toggle tag checkbox → verify `onFilterChange` called with updated tagIds
* Select location radio → verify `onFilterChange` called with updated isOnline
* Click "Clear all" → verify all filters reset
