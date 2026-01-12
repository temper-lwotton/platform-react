# **Component Specification: TaskStats**

## **1. Component Name**

**`TaskStats`**

## **2. Description**

A statistics display component showing task-related metrics.

* Shows total points earned and task counts
* Displays completion rate with progress bar
* Uses color-coded cards for different metrics
* Provides quick overview of task progress

## **3. Location**

```
src/components/ui/TaskStats/TaskStats.tsx
```

## **4. Component Type**

**UI** – Stateless presentational component receiving statistics via props.

## **5. Props Interface**

```typescript
interface TaskStatsProps {
  stats: TaskStatsType;
}
```

## **6. Props**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `stats` | `TaskStatsType` | Yes | - | Task statistics data |

## **7. Data Requirements**

### **TaskStats Type**

```typescript
// From @/lib/tasks
interface TaskStats {
  totalPoints: number;
  completedTasks: number;
  pendingTasks: number;
  completionRate: number;  // 0-100 percentage
}
```

## **8. Internal State**

*None – stateless component.*

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
|-------------------|-------------|-------|
| All stats provided | Four stat cards | Full display |
| `totalPoints === 0` | "0" displayed | Valid state |
| `completionRate === 0` | Empty progress bar | No fill |
| `completionRate === 100` | Full progress bar | Complete fill |
| Large numbers | Formatted with commas | e.g., "1,234" |

## **10. Dependencies**

### **Child Components**

* `Icon` – Stat card icons

### **External Libraries**

*None*

## **11. Events & Callbacks**

*No events or callbacks – purely presentational.*

## **12. Styling**

* **Approach**: CSS Modules with SCSS
* **File**: `TaskStats.module.scss`

### **CSS Classes**

* `.container` – Main container
* `.statsRow` – Horizontal row of cards
* `.statCard` – Individual stat card
* `.statCard--points` – Points card variant
* `.statCard--success` – Completed card variant
* `.statCard--pending` – Pending card variant
* `.statCard--rate` – Rate card variant
* `.iconWrapper` – Icon container
* `.iconWrapper--success` – Green icon
* `.iconWrapper--pending` – Yellow icon
* `.iconWrapper--rate` – Blue icon
* `.statValue` – Large number display
* `.statLabel` – Description label
* `.progressBar` – Rate progress bar
* `.progressFill` – Progress fill

### **Layout**

* Horizontal row of four stat cards
* Icon + value + label per card
* Progress bar on completion rate card

## **13. Accessibility Requirements**

* **Semantic HTML**: Use appropriate structure
* **Screen Reader**: Stats announced with labels
* **Progress Bar**: Accessible value announcement

### **Improvements Needed**

* Add `role="img"` with `aria-label` for progress bar
* Add `aria-valuenow` for progress percentage
* Group stats with region role

## **14. Error Handling**

| Error Condition | Behaviour | Fallback |
|-----------------|-----------|----------|
| Invalid numbers | Display as-is | JavaScript handles |
| NaN values | Display "0" | Validation recommended |
| Completion > 100 | Clamp to 100% | Visual fix |

## **15. Performance & Lifecycle Notes**

### **Number Formatting**

```typescript
const formatNumber = (num: number): string => {
  return num.toLocaleString();
};
```

### **Progress Bar Width**

```typescript
const progressWidth = `${Math.min(100, Math.max(0, stats.completionRate))}%`;
```

## **16. Usage Examples**

### **On Tasks Page**

```tsx
import { TaskStats } from '@/components/ui/TaskStats';

<TaskStats
  stats={{
    totalPoints: 1250,
    completedTasks: 15,
    pendingTasks: 5,
    completionRate: 75,
  }}
/>
```

### **With Calculated Stats**

```tsx
const stats = useMemo(() => ({
  totalPoints: tasks.reduce((sum, t) => sum + (t.points || 0), 0),
  completedTasks: tasks.filter(t => t.status === 'completed').length,
  pendingTasks: tasks.filter(t => t.status !== 'completed').length,
  completionRate: Math.round(
    (tasks.filter(t => t.status === 'completed').length / tasks.length) * 100
  ),
}), [tasks]);

<TaskStats stats={stats} />
```

## **17. Features Summary**

### **Stat Cards**

| Card | Icon | Color | Value |
|------|------|-------|-------|
| Points Earned | zap | Special (gold/purple) | Total points |
| Completed | calendar | Success (green) | Completed count |
| Pending | clipboard | Pending (yellow) | Pending count |
| Completion Rate | rocket | Rate (blue) | Percentage + bar |

### **Visual Elements**

* Color-coded icon backgrounds
* Large prominent numbers
* Subtle labels below numbers
* Progress bar visualization

## **18. Testing Considerations**

### **Unit Tests**

* Renders all four stat cards
* Displays correct numbers
* Formats large numbers with commas
* Progress bar at correct width
* Handles zero values
* Handles 100% completion

### **Mocking**

* Stats objects with various values

### **Edge Cases**

* All zeros
* 100% completion
* Very large point values
* NaN or undefined values

## **19. Out of Scope / Non-Goals**

* **Historical trends**: Not tracked
* **Click actions**: Not interactive
* **Real-time updates**: Parent handles
* **Date ranges**: Not supported

## **20. Related Components & System Context**

### **Siblings**

* `TaskList`
* `TaskItem`

### **Child Components**

* `Icon`

### **Used By**

* Tasks page

## **21. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
|----------|----------|---------------|-------|
| `Default` | Normal stats | Various values | Base state |
| `NoProgress` | 0% complete | completionRate: 0 | Empty bar |
| `FullProgress` | 100% complete | completionRate: 100 | Full bar |
| `HighPoints` | Large points | 10,000+ points | Formatting |
| `NoTasks` | All zeros | All 0 | Edge case |
| `HalfComplete` | 50% done | completionRate: 50 | Mid progress |

### **Controls (Args) Required**

* `stats.totalPoints` (number)
* `stats.completedTasks` (number)
* `stats.pendingTasks` (number)
* `stats.completionRate` (number)

### **Mocking Requirements**

*None – stateless with numeric props*

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Verify stat cards accessible
* Check progress bar accessible
* Verify icon labels

### **Interaction Tests**

*None – no interactive elements*
