# **Component Specification: UsersFilter**

## **1. Component Name**

**`UsersFilter`**

## **2. Description**

A filter component for the users directory with search, company type filtering, transport mode filtering, and sort options.

* Provides text search by name, company, or job title with debouncing
* Supports single-select filtering by company type
* Supports single-select filtering by transport mode of interest
* Offers sort options (Name, Newest, Oldest)
* Shows active filter count badge
* Used on the users directory page

## **3. Location**

```
src/components/ui/UsersFilter/UsersFilter.tsx
```

## **4. Component Type**

**Feature** – Manages filter state and emits debounced filter changes to parent.

## **5. Props Interface**

```typescript
interface UsersFilterProps {
  companyTypes: string[];
  transportModes: string[];
  onFilterChange: (params: UsersQueryParams) => void;
  isLoading?: boolean;
}
```

## **6. Props**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `companyTypes` | `string[]` | Yes | - | Available company types for filtering |
| `transportModes` | `string[]` | Yes | - | Available transport modes for filtering |
| `onFilterChange` | `(params: UsersQueryParams) => void` | Yes | - | Callback when filters change |
| `isLoading` | `boolean` | No | - | Disables inputs while loading |

## **7. Data Requirements**

### **External Data Sources**

* Company types and transport modes passed via props from parent page

### **UsersQueryParams Type**

```typescript
// From @/lib/users
interface UsersQueryParams {
  search?: string;
  companyType?: string;
  transportMode?: string;
  sort?: 'name' | 'newest' | 'oldest';
}
```

## **8. Internal State**

| State Variable | Type | Initial | Purpose |
|----------------|------|---------|---------|
| `search` | `string` | `''` | Search input value |
| `selectedCompanyType` | `string` | `''` | Selected company type (empty = all) |
| `selectedTransportMode` | `string` | `''` | Selected transport mode (empty = all) |
| `sortOrder` | `'name' \| 'newest' \| 'oldest'` | `'name'` | Sort option |
| `isFilterOpen` | `boolean` | `false` | Filter popover visibility |

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
|-------------------|-------------|-------|
| Default state | Search bar + sort dropdown + filter button | No filters active |
| Search has value | Clear button appears in search bar | X icon button |
| `isLoading === true` | All inputs disabled | Prevents changes during fetch |
| `activeFilterCount > 0` | Badge on filter button | Shows count |
| `isFilterOpen === true` | Popover panel visible | Radio groups |
| Both filter arrays empty | "No filters available" message | Empty state in popover |
| `companyTypes.length > 0` | Company type radio group | With "All Types" option |
| `transportModes.length > 0` | Transport mode radio group | With "All Modes" option |
| `hasActiveFilters === true` | "Clear all" button visible | In popover header |

## **10. Dependencies**

### **Radix UI**

* `@radix-ui/react-select` – Sort dropdown
* `@radix-ui/react-popover` – Filter panel
* `@radix-ui/react-radio-group` – Company type and transport mode selection
* `@radix-ui/react-label` – Section labels
* `@radix-ui/react-separator` – Visual dividers
* `@radix-ui/react-icons` – MagnifyingGlass, MixerHorizontal, Cross2, ChevronDown

### **Child Components**

* `Input` – Search input field
* `Button` – Clear search button

### **Types**

* `UsersQueryParams` from `@/lib/users`

## **11. Events & Callbacks**

| Event / Callback | Trigger | Description |
|------------------|---------|-------------|
| `emitFilterChange` | Debounced (300ms) on any state change | Calls `onFilterChange` with params |
| `handleClearFilters` | Click "Clear all" | Resets all filter state |

## **12. Styling**

* **Approach**: CSS Modules with SCSS
* **File**: `UsersFilter.module.scss`

### **Visual States**

* **Search Bar**: Icon + input + conditional clear button
* **Sort Dropdown**: Radix Select with chevron icon
* **Filter Button**: Icon + label + conditional badge
* **Popover**: Header, separator, filter sections
* **Radio Item**: Radio button + label

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
* `.radio`, `.radioIndicator` – Radio button styles
* `.radioItem`, `.radioLabel` – Radio item wrapper and label

## **13. Accessibility Requirements**

* **Keyboard**: All controls focusable via Tab
* **ARIA**: `aria-label="Clear search"` on clear button, `aria-label="Open filters"` on filter button
* **Focus**: Popover manages focus when opened
* **Screen Reader**: Radio labels associated correctly via Label primitive

### **Improvements Needed**

* Add `aria-expanded` to filter button
* Add `aria-describedby` for filter count badge
* Announce filter changes to screen readers
* Consider `role="search"` on search container

## **14. Error Handling**

| Error Condition | Behaviour | Fallback |
|-----------------|-----------|----------|
| Both filter arrays empty | Shows "No filters available" | Popover still opens |
| `onFilterChange` throws | Not caught | Would bubble to parent |

## **15. Performance & Lifecycle Notes**

### **Debouncing**

```typescript
useEffect(() => {
  const timer = setTimeout(() => {
    emitFilterChange();
  }, 300);
  return () => clearTimeout(timer);
}, [search, selectedCompanyType, selectedTransportMode, sortOrder]);
```

* 300ms debounce on all filter changes
* Prevents excessive API calls while typing
* Cleanup clears pending timeout

### **Computed Values**

* `hasActiveFilters`: Any non-default filter value
* `activeFilterCount`: Count of active filter categories

## **16. Usage Examples**

### **Basic Usage**

```tsx
import { UsersFilter } from '@/components/ui/UsersFilter';

<UsersFilter
  companyTypes={['Operator', 'Supplier', 'Consultant']}
  transportModes={['Rail', 'Bus', 'Metro', 'Tram']}
  onFilterChange={(params) => setFilterParams(params)}
  isLoading={isLoading}
/>
```

### **In Users Directory Page**

```tsx
const [filterParams, setFilterParams] = useState<UsersQueryParams>({});
const { data: users, isLoading } = useUsers(filterParams);

<UsersFilter
  companyTypes={companyTypes}
  transportModes={transportModes}
  onFilterChange={setFilterParams}
  isLoading={isLoading}
/>
<UsersList users={users} />
```

## **17. Features Summary**

* Search bar with placeholder "Search by name, company, or job title..."
* Clear search button
* Sort dropdown (Name A→Z, Newest First, Oldest First)
* Filter button with active count badge
* Filter popover with:
  * Company Type radio group with "All Types" default
  * Transport Mode radio group with "All Modes" default
  * Clear all button
* 300ms debounced filter emission
* Empty state for no filters
* Loading state disables all inputs

## **18. Testing Considerations**

### **Unit Tests**

* Search input updates state
* Company type selection updates state
* Transport mode selection updates state
* Sort order changes update state
* Clear all resets all state
* Filter count calculates correctly
* Debounced emit fires after 300ms

### **Mocking**

* `onFilterChange` callback
* Radix portal (for popover and select)
* Timer functions (for debounce testing)

### **Edge Cases**

* Both filter arrays empty
* Only company types available
* Only transport modes available
* Clear filters during loading
* Rapid typing (debounce behavior)

## **19. Out of Scope / Non-Goals**

* **Multi-select**: Single selection only for each filter type
* **Persistent Filters**: No URL sync or localStorage
* **Saved Filters**: No preset filter combinations
* **Advanced Search**: No field-specific search syntax
* **Tag Filtering**: Users don't have tags (unlike spaces)

## **20. Related Components & System Context**

### **Related Components**

* `SpacesFilter` – Similar filter pattern for spaces directory
* `CalendarFilters` – Similar pattern for calendar page

### **Used By**

* Users directory page

### **Typical Usage Location**

* Top of users directory page

## **21. Open Questions / Notes**

* Consider URL param sync for shareable filtered views
* May want to support multi-select for transport modes
* Could add location/region filtering in future

## **22. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
|----------|----------|---------------|-------|
| `Default` | No active filters | Empty state | Base state |
| `WithSearch` | Search term entered | `search: "John"` | Clear button visible |
| `WithCompanyType` | Company type selected | `selectedCompanyType: "Operator"` | Badge shows count |
| `WithTransportMode` | Transport mode selected | `selectedTransportMode: "Rail"` | Badge shows count |
| `MultipleFilters` | Multiple filters active | Multiple selections | Higher badge count |
| `Loading` | Loading state | `isLoading: true` | Disabled inputs |
| `NoFilters` | Empty filter arrays | Both arrays empty | Empty message in popover |
| `FilterOpen` | Popover visible | `isFilterOpen: true` | Full popover content |

### **Controls (Args) Required**

* `companyTypes` (string[]) – array control
* `transportModes` (string[]) – array control
* `isLoading` (boolean) – controllable

### **Mocking Requirements**

* **onFilterChange**: Action logger
* **Filter data**: Realistic string arrays
* **Portal container**: For popover and select rendering

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Verify all controls are keyboard accessible
* Check popover focus management
* Verify radio labels are associated correctly

### **Interaction Tests**

* Type in search and verify debounced callback
* Select company type and verify state updates
* Select transport mode and verify state updates
* Change sort order and verify callback
* Open/close filter popover
* Clear all filters
