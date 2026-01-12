# **Component Specification: SpacesFilter**

## **1. Component Name**

**`SpacesFilter`**

## **2. Description**

A comprehensive filter component for the spaces listing page with search, tag filtering, and sort options.

* Provides text search with debouncing
* Supports multi-select tag filtering with AND/OR matching
* Offers alphabetical sort options (A→Z, Z→A)
* Shows active filter count badge
* Used on the spaces directory page

## **3. Location**

```
src/components/ui/SpacesFilter/SpacesFilter.tsx
```

## **4. Component Type**

**Feature** – Manages filter state and emits debounced filter changes to parent.

## **5. Props Interface**

```typescript
interface SpacesFilterProps {
  tags: SpaceTag[];
  onFilterChange: (params: SpacesQueryParams) => void;
  isLoading?: boolean;
}
```

## **6. Props**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `tags` | `SpaceTag[]` | Yes | - | Available tags for filtering |
| `onFilterChange` | `(params: SpacesQueryParams) => void` | Yes | - | Callback when filters change |
| `isLoading` | `boolean` | No | - | Disables inputs while loading |

## **7. Data Requirements**

### **External Data Sources**

* Tags list passed via props from parent page

### **SpaceTag Type**

```typescript
// From @/lib/spaces
interface SpaceTag {
  id: number;
  name: string;
}
```

### **SpacesQueryParams Type**

```typescript
// From @/lib/spaces
interface SpacesQueryParams {
  search?: string;
  tags?: number[];
  matchAllTags?: boolean;
  sort?: 'asc' | 'desc';
}
```

## **8. Internal State**

| State Variable | Type | Initial | Purpose |
|----------------|------|---------|---------|
| `search` | `string` | `''` | Search input value |
| `selectedTags` | `number[]` | `[]` | Selected tag IDs |
| `matchAllTags` | `boolean` | `false` | AND vs OR tag matching |
| `sortOrder` | `'asc' \| 'desc'` | `'asc'` | Sort direction |
| `isFilterOpen` | `boolean` | `false` | Filter popover visibility |

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
|-------------------|-------------|-------|
| Default state | Search bar + sort dropdown + filter button | No filters active |
| Search has value | Clear button appears in search bar | X icon button |
| `isLoading === true` | All inputs disabled | Prevents changes during fetch |
| `activeFilterCount > 0` | Badge on filter button | Shows count |
| `isFilterOpen === true` | Popover panel visible | Tag checkboxes + options |
| `tags.length === 0` | "No tags available" message | Empty state in popover |
| `selectedTags.length > 1` | Match mode options appear | AND/OR radio buttons |
| `hasActiveFilters === true` | "Clear all" button visible | In popover header |

## **10. Dependencies**

### **Radix UI**

* `@radix-ui/react-select` – Sort dropdown
* `@radix-ui/react-popover` – Filter panel
* `@radix-ui/react-checkbox` – Tag selection
* `@radix-ui/react-radio-group` – Match mode (any/all)
* `@radix-ui/react-label` – Section labels
* `@radix-ui/react-separator` – Visual dividers
* `@radix-ui/react-icons` – MagnifyingGlass, MixerHorizontal, Cross2, ChevronDown

### **Child Components**

* `Input` – Search input field
* `Button` – Clear search button

### **Types**

* `SpaceTag`, `SpacesQueryParams` from `@/lib/spaces`

## **11. Events & Callbacks**

| Event / Callback | Trigger | Description |
|------------------|---------|-------------|
| `emitFilterChange` | Debounced (300ms) on any state change | Calls `onFilterChange` with params |
| `handleTagToggle(tagId)` | Click tag checkbox | Toggles tag in `selectedTags` |
| `handleClearFilters` | Click "Clear all" | Resets all filter state |

## **12. Styling**

* **Approach**: CSS Modules with SCSS
* **File**: `SpacesFilter.module.scss`

### **Visual States**

* **Search Bar**: Icon + input + conditional clear button
* **Sort Dropdown**: Radix Select with chevron icon
* **Filter Button**: Icon + label + conditional badge
* **Popover**: Header, separator, tag list, match mode options
* **Tag Item**: Checkbox + label

### **CSS Classes**

* `.filter` – Main container
* `.search` – Search bar wrapper
* `.searchIcon` – Magnifying glass icon
* `.actions` – Sort + filter buttons container
* `.sortTrigger`, `.sortContent`, `.sortItem` – Sort dropdown styles
* `.button` – Filter trigger button
* `.badge` – Active filter count
* `.popover` – Filter panel
* `.section`, `.sectionLabel` – Section containers
* `.checkbox`, `.checkboxIndicator` – Tag checkbox styles
* `.radio`, `.radioIndicator` – Match mode radio styles

## **13. Accessibility Requirements**

* **Keyboard**: All controls focusable via Tab
* **ARIA**: `aria-label="Clear search"` on clear button, `aria-label="Open filters"` on filter button
* **Focus**: Popover manages focus when opened
* **Screen Reader**: Checkbox and radio labels associated correctly

### **Improvements Needed**

* Add `aria-expanded` to filter button
* Add `aria-describedby` for filter count badge
* Announce filter changes to screen readers
* Add keyboard shortcut for clearing all filters

## **14. Error Handling**

| Error Condition | Behaviour | Fallback |
|-----------------|-----------|----------|
| Empty tags array | Shows "No tags available" | Popover still opens |
| `onFilterChange` throws | Not caught | Would bubble to parent |

## **15. Performance & Lifecycle Notes**

### **Debouncing**

```typescript
useEffect(() => {
  const timer = setTimeout(() => {
    emitFilterChange();
  }, 300);
  return () => clearTimeout(timer);
}, [search, selectedTags, matchAllTags, sortOrder]);
```

* 300ms debounce on all filter changes
* Prevents excessive API calls while typing
* Cleanup clears pending timeout

### **Computed Values**

* `hasActiveFilters`: Any non-default filter value
* `activeFilterCount`: Count of active filter categories (not individual items)

## **16. Usage Examples**

### **Basic Usage**

```tsx
import { SpacesFilter } from '@/components/ui/SpacesFilter';

<SpacesFilter
  tags={availableTags}
  onFilterChange={(params) => setFilterParams(params)}
  isLoading={isLoading}
/>
```

### **In Spaces Page**

```tsx
const [filterParams, setFilterParams] = useState<SpacesQueryParams>({});
const { data: spaces, isLoading } = useSpaces(filterParams);

<SpacesFilter
  tags={tags}
  onFilterChange={setFilterParams}
  isLoading={isLoading}
/>
<SpacesList spaces={spaces} />
```

## **17. Features Summary**

* Search bar with clear button
* Sort dropdown (A→Z / Z→A)
* Filter button with active count badge
* Filter popover with:
  * Tag checkboxes (multi-select)
  * Match mode toggle (any/all) when multiple tags selected
  * Clear all button
* 300ms debounced filter emission
* Empty state for no tags
* Loading state disables all inputs

## **18. Testing Considerations**

### **Unit Tests**

* Search input updates state
* Tag toggle adds/removes from selection
* Match mode only shows with 2+ tags selected
* Clear all resets all state
* Filter count calculates correctly
* Debounced emit fires after 300ms

### **Mocking**

* `onFilterChange` callback
* Radix portal (for popover)
* Timer functions (for debounce testing)

### **Edge Cases**

* Empty tags array
* Single tag selected (no match mode)
* Clear filters during loading
* Rapid typing (debounce behavior)

## **19. Out of Scope / Non-Goals**

* **Persistent Filters**: No URL sync or localStorage
* **Tag Creation**: Cannot add new tags
* **Saved Filters**: No preset filter combinations
* **Advanced Search**: No field-specific search syntax

## **20. Related Components & System Context**

### **Related Components**

* `UsersFilter` – Similar filter pattern for users directory
* `CalendarFilters` – Similar pattern for calendar page

### **Used By**

* Spaces listing page

### **Typical Usage Location**

* Top of spaces directory page

## **21. Open Questions / Notes**

* Consider URL param sync for shareable filtered views
* May want to add saved/preset filter combinations
* Could add tag search within the popover for large tag lists

## **22. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
|----------|----------|---------------|-------|
| `Default` | No active filters | Empty state | Base state |
| `WithSearch` | Search term entered | `search: "tech"` | Clear button visible |
| `WithTags` | Tags selected | `selectedTags: [1, 2]` | Badge shows count |
| `MatchAll` | Multiple tags + AND mode | `matchAllTags: true` | Match mode visible |
| `Loading` | Loading state | `isLoading: true` | Disabled inputs |
| `NoTags` | Empty tags array | `tags: []` | Empty message in popover |
| `FilterOpen` | Popover visible | `isFilterOpen: true` | Full popover content |

### **Controls (Args) Required**

* `tags` (SpaceTag[]) – array control
* `isLoading` (boolean) – controllable

### **Mocking Requirements**

* **onFilterChange**: Action logger
* **Tag data**: Realistic SpaceTag objects
* **Portal container**: For popover rendering

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Verify all controls are keyboard accessible
* Check popover focus management
* Verify checkbox/radio labels are associated

### **Interaction Tests**

* Type in search and verify debounced callback
* Toggle tags and verify state updates
* Change sort order and verify callback
* Open/close filter popover
* Clear all filters
