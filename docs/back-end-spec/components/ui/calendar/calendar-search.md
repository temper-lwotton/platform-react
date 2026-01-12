# **Component Specification: CalendarSearch**

## **1. Component Name**

**`CalendarSearch`**

## **2. Description**

A search input component for filtering calendar events. Features debounced search, keyboard shortcuts (/ to focus, Escape to clear), and a clear button.

* Provides fast, debounced text search for events
* Supports keyboard shortcuts for power users
* Displays keyboard hint when input is empty

## **3. Location**

```
src/components/ui/CalendarSearch/CalendarSearch.tsx
```

## **4. Component Type**

* UI

## **5. Props Interface**

```ts
interface CalendarSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}
```

## **6. Props**

| Prop | Type | Required | Default | Description |
| ---- | ---- | -------- | ------- | ----------- |
| `onSearch` | `(query: string) => void` | Yes | - | Callback when search query changes (debounced) |
| `placeholder` | `string` | No | `'Search events...'` | Input placeholder text |

## **7. Data Requirements**

No external data fetching - this is a controlled input component.

### **Exported Helper Function**

The component exports a `searchEvents` helper:

```ts
function searchEvents(events: any[], query: string): any[];
```

Searches events by matching against:
* Event title
* Event content (HTML stripped)
* Location
* Space name
* Tag names

## **8. Internal State**

| State Variable | Type | Purpose |
| -------------- | ---- | ------- |
| `query` | `string` | Current search input value |
| `isFocused` | `boolean` | Input focus state for styling and keyboard hint |

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
| ----------------- | ----------- | ----- |
| `query === ''` && `!isFocused` | Keyboard hint (`/`) visible | Shows shortcut indicator |
| `query === ''` && `isFocused` | No keyboard hint | Input is active |
| `query !== ''` | Clear button (×) visible | Allows clearing search |
| `isFocused === true` | Focused styling applied | Additional CSS class |
| Press `/` key (global) | Focus input | When not in another input |
| Press `Escape` (while focused) | Clear and blur | Resets search |

## **10. Dependencies**

### **Child Components**

* `Icon` - Search icon prefix
* `Input` - Text input field (from primitives)
* `Button` - Clear button (from primitives)

### **Utilities / Hooks**

* `useState` - Query and focus state
* `useEffect` - Debounce timer and keyboard listener
* `useRef` - Input element reference for focus control

## **11. Events & Callbacks**

| Event / Callback | Trigger | Description |
| ---------------- | ------- | ----------- |
| `onSearch` | Query change (debounced 300ms) | Notifies parent of search query |
| `handleClear` | Click clear button | Clears query, refocuses input |
| `/` key | Global keydown | Focus search input (if not in input/textarea) |
| `Escape` key | While focused | Blur input and clear query |
| `onChange` | Input typing | Updates local `query` state |
| `onFocus` | Input focus | Sets `isFocused` true |
| `onBlur` | Input blur | Sets `isFocused` false |

## **12. Styling**

* **Styling approach**: CSS Modules with SCSS
* **File(s)**:
  * `CalendarSearch.module.scss`

### **Visual States**

* **Default**: Search icon + input + keyboard hint
* **Focused**: Additional `.focused` class applied to container
* **Has query**: Clear button visible, keyboard hint hidden

### **Key Style Classes**

| Class | Purpose |
| ----- | ------- |
| `.search` | Container element |
| `.focused` | Applied when input has focus |
| `.icon` | Search icon styling |
| `.input` | Input field styling |
| `.clearButton` | Clear button (×) |
| `.kbd` | Keyboard shortcut indicator |

## **13. Accessibility Requirements**

* **Input**: Has `aria-label="Search events"` for screen readers
* **Clear button**: Has `aria-label="Clear search"`
* **Keyboard shortcuts**: `/` to focus, Escape to clear (power user features)

### **Improvements Needed**

* Consider `role="search"` on container
* Announce search results count to screen readers
* Clear button could have `aria-describedby` for context

## **14. Error Handling**

No error states - search is always valid (empty string returns all events).

**Not handled by this component:**
* Search execution (parent's responsibility)
* No-results display (handled by calendar component)

## **15. Performance & Lifecycle Notes**

* **Debounce**: 300ms delay before calling `onSearch` (prevents excessive calls)
* **Global listener**: Keyboard shortcut listener added/removed on mount/unmount
* **Cleanup**: Timer cleared on unmount, event listener removed
* **Dependency array**: `onSearch` in debounce effect (should be stable callback)

## **16. Usage Examples**

```tsx
import { CalendarSearch, searchEvents } from '@/components/ui/CalendarSearch';

const [searchQuery, setSearchQuery] = useState('');
const filteredEvents = searchEvents(events, searchQuery);

<CalendarSearch onSearch={setSearchQuery} />

// With custom placeholder
<CalendarSearch
  onSearch={setSearchQuery}
  placeholder="Find events by name..."
/>
```

## **17. Features Summary**

* Search icon prefix
* Debounced search (300ms delay)
* Clear button when query is not empty
* Keyboard shortcut hint (`/`) when empty and not focused
* Focus state styling
* Global keyboard shortcuts:
  * `/` to focus search
  * `Escape` to clear and blur

## **18. Testing Considerations**

### **Unit Tests**

* Debounce: `onSearch` not called immediately on input
* Debounce: `onSearch` called after 300ms with final query
* Clear button appears when query is not empty
* Clear button clears query and refocuses input
* Keyboard hint visible when empty and unfocused
* Keyboard hint hidden when focused or has query
* `/` key focuses input (when not in another input)
* Escape clears query and blurs input

### **Mocking Required**

* `onSearch` - mock callback to verify calls and timing
* Timer mocks - for testing debounce behaviour

### **Edge Cases**

* Rapid typing (only final query should trigger search)
* Clear during debounce timer
* `/` key pressed while already focused
* Special characters in search query

## **19. Out of Scope / Non-Goals**

* **Search suggestions/autocomplete** - not implemented
* **Search history** - not stored
* **Advanced search syntax** - plain text only
* **Highlighting matches** - handled by parent/display component

## **20. Related Components & System Context**

### **Sibling Components**

* `CalendarFilters` - structured filtering
* `CalendarColorLegend` - space colour reference
* `CalendarDayPopover` - event details

### **Child Components**

* `Icon`
* `Input` (primitives)
* `Button` (primitives)

### **Parent Components**

* Calendar page - manages search state and applies filtering

### **Exported Helper Functions**

#### `searchEvents(events, query)`

Filters events by search query, matching against:
* Event title
* Event content (HTML stripped via regex)
* Location
* Space name
* Tag names

Returns original array if query is empty/whitespace.

## **21. Open Questions / Notes**

* Consider adding search suggestions/autocomplete
* Could highlight matching text in results
* May want configurable debounce delay
* Consider adding search history for quick access

## **22. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
| -------- | -------- | ------------- | ----- |
| `Default` | Empty state | Default props | Shows keyboard hint |
| `Focused` | Input focused | Focus input | Keyboard hint hidden |
| `WithQuery` | Has search text | Pre-filled query | Shows clear button |
| `CustomPlaceholder` | Custom placeholder | `placeholder="..."` | Verify text |

### **Controls (Args) Required**

* `placeholder` (string) - controllable
* `onSearch` - Action logger

### **Mocking Requirements**

* `onSearch` - action logging
* Timer control for debounce testing

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Verify input has accessible name
* Verify clear button has accessible name
* Verify focus is visible

### **Interaction Tests**

* Type query → wait 300ms → verify `onSearch` called
* Type query → click clear → verify cleared and refocused
* Press `/` → verify input focused
* Focus → press Escape → verify cleared and blurred
