# **Component Specification: UserStats**

## **1. Component Name**

**`UserStats`**

## **2. Description**

A stats card displaying community-wide statistics.

* Shows total members, new members this week, and active spaces
* Formats large numbers with commas
* Displays loading state when fetching
* Used in dashboards and user directories

## **3. Location**

```
src/components/ui/UserStats/UserStats.tsx
```

## **4. Component Type**

**UI** – Stateless presentational component receiving statistics via props.

## **5. Props Interface**

```typescript
interface UserStatsProps {
  totalUsers: number;
  newThisWeek: number;
  activeSpaces: number;
  isLoading?: boolean;
}
```

## **6. Props**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `totalUsers` | `number` | Yes | - | Total member count |
| `newThisWeek` | `number` | Yes | - | Members joined this week |
| `activeSpaces` | `number` | Yes | - | Number of active spaces |
| `isLoading` | `boolean` | No | `false` | Show loading state |

## **7. Data Requirements**

*Props provided directly by parent – no API calls within component.*

## **8. Internal State**

*None – stateless component.*

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
|-------------------|-------------|-------|
| `isLoading === true` | Loading message | "Loading stats..." |
| `isLoading === false` | Stats display | Three stat items |
| Large numbers | Comma formatted | e.g., "1,234" |
| Zero values | "0" displayed | Valid state |

## **10. Dependencies**

### **Child Components**

*None*

### **External Libraries**

*None*

## **11. Events & Callbacks**

*No events or callbacks – purely presentational.*

## **12. Styling**

* **Approach**: CSS Modules with SCSS
* **File**: `UserStats.module.scss`

### **CSS Classes**

* `.card` – Main container
* `.title` – "Community Stats" heading
* `.statsRow` – Horizontal container for stats
* `.statItem` – Individual stat container
* `.statValue` – Large number display
* `.statLabel` – Description label
* `.divider` – Vertical separator between items
* `.loading` – Loading state message

### **Layout**

```
┌─────────────────────────────────────┐
│ Community Stats                      │
├─────────────────────────────────────┤
│  1,234     │    42     │     15     │
│  Total     │  New This │  Active    │
│  Members   │  Week     │  Spaces    │
└─────────────────────────────────────┘
```

## **13. Accessibility Requirements**

* **Semantic HTML**: Use heading for title
* **Screen Reader**: Stats announced with labels
* **Live Region**: Loading state changes announced

### **Improvements Needed**

* Add `aria-label` for stats region
* Use `aria-busy` for loading state
* Add `role="status"` for dynamic content

## **14. Error Handling**

| Error Condition | Behaviour | Fallback |
|-----------------|-----------|----------|
| Invalid numbers | Display as-is | JavaScript handles |
| NaN values | Display "0" | Validation recommended |
| Negative numbers | Display as-is | Validation recommended |

## **15. Performance & Lifecycle Notes**

### **Number Formatting**

```typescript
const formatNumber = (num: number): string => {
  return num.toLocaleString();
};
```

### **Optimizations**

* Minimal re-renders (props-only dependency)
* No internal state management
* Lightweight component

## **16. Usage Examples**

### **In Dashboard**

```tsx
import { UserStats } from '@/components/ui/UserStats';

<UserStats
  totalUsers={1234}
  newThisWeek={42}
  activeSpaces={15}
  isLoading={false}
/>
```

### **With Query Data**

```tsx
const { data: stats, isLoading } = useQuery({
  queryKey: ['community-stats'],
  queryFn: getCommunityStats,
});

<UserStats
  totalUsers={stats?.totalUsers || 0}
  newThisWeek={stats?.newThisWeek || 0}
  activeSpaces={stats?.activeSpaces || 0}
  isLoading={isLoading}
/>
```

## **17. Features Summary**

### **Title**

* "Community Stats" heading

### **Stat Items**

| Stat | Label | Format |
|------|-------|--------|
| Total Members | "Total Members" | Comma formatted |
| New This Week | "New This Week" | Comma formatted |
| Active Spaces | "Active Spaces" | Comma formatted |

### **Visual Elements**

* Vertical dividers between items
* Large prominent numbers
* Subtle labels below

## **18. Testing Considerations**

### **Unit Tests**

* Renders loading state
* Displays correct numbers
* Formats large numbers with commas
* Shows all three stat items
* Handles zero values

### **Mocking**

* Numeric props with various values

### **Edge Cases**

* Very large numbers (millions)
* Zero for all stats
* Loading to loaded transition

## **19. Out of Scope / Non-Goals**

* **Historical data**: Not tracked
* **Trends/graphs**: Just numbers
* **Click actions**: Not interactive
* **Real-time updates**: Parent handles

## **20. Related Components & System Context**

### **Siblings**

* `TaskStats` (if exists)

### **Used By**

* Users directory page
* Dashboard layouts
* Admin panels

## **21. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
|----------|----------|---------------|-------|
| `Default` | Normal stats | Various numbers | Base state |
| `Loading` | Loading state | isLoading: true | Loading message |
| `LargeNumbers` | High values | 1,000,000+ | Formatting test |
| `ZeroValues` | Empty community | All zeros | Edge case |
| `SmallNumbers` | New community | Single digits | Minimal data |

### **Controls (Args) Required**

* `totalUsers` (number) – total count
* `newThisWeek` (number) – weekly count
* `activeSpaces` (number) – spaces count
* `isLoading` (boolean) – loading state

### **Mocking Requirements**

*None – stateless with numeric props*

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Verify stats region accessible
* Check heading hierarchy
* Verify loading state announced

### **Interaction Tests**

*None – no interactive elements*
