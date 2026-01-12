# **Component Specification: TaskList**

## **1. Component Name**

**`TaskList`**

## **2. Description**

A filterable and sortable list of tasks with controls for type, status, and sort order.

* Displays tasks using TaskItem components
* Provides type and status filter buttons
* Supports sorting by due date, points, or recent
* Handles empty state with contextual messaging

## **3. Location**

```
src/components/ui/TaskList/TaskList.tsx
```

## **4. Component Type**

**Feature** – Manages filter/sort state and renders filtered task list.

## **5. Props Interface**

```typescript
interface TaskListProps {
  tasks: Task[];
  onComplete?: (taskId: string) => void;
  onStatusChange?: (taskId: string, status: TaskStatus) => void;
}
```

## **6. Props**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `tasks` | `Task[]` | Yes | - | Array of tasks to display |
| `onComplete` | `(taskId: string) => void` | No | - | Callback when task is completed |
| `onStatusChange` | `(taskId: string, status) => void` | No | - | Callback when status changes |

## **7. Data Requirements**

### **Task Types**

```typescript
// From @/lib/tasks
type TaskType = 'platform_engagement' | 'admin_assigned';
type TaskStatus = 'pending' | 'in_progress' | 'completed';

interface Task {
  id: string;
  type: TaskType;
  status: TaskStatus;
  dueDate?: string;
  points?: number;
  createdAt: string;
  // ... other properties from TaskItem
}
```

## **8. Internal State**

| State Variable | Type | Initial | Purpose |
|----------------|------|---------|---------|
| `filterType` | `TaskType \| 'all'` | `'all'` | Type filter selection |
| `filterStatus` | `TaskStatus \| 'all'` | `'all'` | Status filter selection |
| `sortBy` | `'dueDate' \| 'points' \| 'recent'` | `'dueDate'` | Sort order selection |

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
|-------------------|-------------|-------|
| `tasks.length === 0` | Empty state | "No tasks" message |
| Filtered to empty | Empty state | Dynamic message |
| Filter: All | All tasks | Default state |
| Filter: Platform | Platform tasks only | Zap icon filter |
| Filter: Assigned | Assigned tasks only | Clipboard icon filter |
| Status: Pending | Pending only | "To Do" filter |
| Status: In Progress | In progress only | Progress filter |
| Status: Completed | Completed only | "Done" filter |
| Sort: Due Date | By due date | Earliest first, no date last |
| Sort: Points | By points | Highest first |
| Sort: Recent | By createdAt | Most recent first |

## **10. Dependencies**

### **Child Components**

* `TaskItem` – Individual task display
* `Icon` – Filter button icons

### **External Libraries**

* React (`useState`, `useMemo`)

## **11. Events & Callbacks**

| Event / Callback | Trigger | Description |
|------------------|---------|-------------|
| `setFilterType` | Click type button | Change type filter |
| `setFilterStatus` | Click status button | Change status filter |
| `setSortBy` | Change sort dropdown | Change sort order |
| `onComplete` | Task checkbox | Passed to TaskItem |
| `onStatusChange` | Task status change | Passed to TaskItem |

## **12. Styling**

* **Approach**: CSS Modules with SCSS
* **File**: `TaskList.module.scss`

### **CSS Classes**

* `.container` – Main container
* `.controls` – Filter and sort controls
* `.typeFilters` – Type filter buttons
* `.statusFilters` – Status filter buttons
* `.filterButton` – Individual filter button
* `.filterButton--active` – Active filter
* `.sortDropdown` – Sort select dropdown
* `.taskList` – Tasks container
* `.emptyState` – No tasks message
* `.emptyIcon` – Empty state icon
* `.emptyText` – Empty state text

### **Layout**

* Controls row (filters + sort)
* Task items list
* Empty state (when applicable)

## **13. Accessibility Requirements**

* **Keyboard**: All filters keyboard accessible
* **ARIA**: Filter buttons with toggle state
* **Screen Reader**: Announce filter changes

### **Improvements Needed**

* Add `aria-pressed` to filter buttons
* Add `aria-live` region for task count changes
* Group filter buttons with role="group"

## **14. Error Handling**

| Error Condition | Behaviour | Fallback |
|-----------------|-----------|----------|
| Empty tasks array | Empty state | Show "No tasks" |
| All filtered out | Empty state | Dynamic message |
| Invalid task data | Skip invalid | Continue rendering |

## **15. Performance & Lifecycle Notes**

### **Task Counts (Memoized)**

```typescript
const counts = useMemo(() => ({
  all: tasks.length,
  platform: tasks.filter(t => t.type === 'platform_engagement').length,
  admin: tasks.filter(t => t.type === 'admin_assigned').length,
  pending: tasks.filter(t => t.status === 'pending').length,
  inProgress: tasks.filter(t => t.status === 'in_progress').length,
  completed: tasks.filter(t => t.status === 'completed').length,
}), [tasks]);
```

### **Filtering & Sorting (Memoized)**

```typescript
const filteredTasks = useMemo(() => {
  let result = [...tasks];

  // Apply type filter
  if (filterType !== 'all') {
    result = result.filter(t => t.type === filterType);
  }

  // Apply status filter
  if (filterStatus !== 'all') {
    result = result.filter(t => t.status === filterStatus);
  }

  // Sort (completed always at bottom)
  result.sort((a, b) => {
    if (a.status === 'completed' && b.status !== 'completed') return 1;
    if (a.status !== 'completed' && b.status === 'completed') return -1;

    switch (sortBy) {
      case 'dueDate':
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      case 'points':
        return (b.points || 0) - (a.points || 0);
      case 'recent':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  return result;
}, [tasks, filterType, filterStatus, sortBy]);
```

## **16. Usage Examples**

### **On Tasks Page**

```tsx
import { TaskList } from '@/components/ui/TaskList';

<TaskList
  tasks={userTasks}
  onComplete={handleComplete}
  onStatusChange={handleStatusChange}
/>
```

### **Read-Only Display**

```tsx
<TaskList tasks={tasks} />
```

## **17. Features Summary**

### **Type Filter Buttons**

| Button | Filter | Icon | Shows Count |
|--------|--------|------|-------------|
| All | All types | - | Total |
| Platform | platform_engagement | zap | Platform count |
| Assigned | admin_assigned | clipboard | Assigned count |

### **Status Filter Buttons**

| Button | Filter | Shows Count |
|--------|--------|-------------|
| All | All statuses | - |
| To Do | pending | Pending count |
| In Progress | in_progress | In progress count |
| Done | completed | Completed count |

### **Sort Options**

| Option | Sort Order |
|--------|------------|
| Due date | Earliest first, no date last |
| Points | Highest first |
| Recently added | Most recent first |

### **Sorting Behavior**

* Completed tasks always sorted to bottom
* Within completed/not-completed, apply selected sort

## **18. Testing Considerations**

### **Unit Tests**

* Renders all tasks
* Type filter works correctly
* Status filter works correctly
* Combined filters work
* Sort by due date
* Sort by points
* Sort by recent
* Completed tasks at bottom
* Empty state displays
* Dynamic empty message

### **Mocking**

* Task arrays with various types/statuses
* Callback functions

### **Edge Cases**

* All tasks same type
* All tasks same status
* No tasks with due dates
* No tasks with points

## **19. Out of Scope / Non-Goals**

* **Pagination**: Not implemented
* **Search**: Not supported
* **Bulk actions**: Not here
* **Create task**: Not in this component
* **Drag reordering**: Not supported

## **20. Related Components & System Context**

### **Child Components**

* `TaskItem`
* `Icon`

### **Used By**

* Tasks page

### **Related**

* `TaskStats`

## **21. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
|----------|----------|---------------|-------|
| `Default` | Mixed tasks | Various types | Base state |
| `Empty` | No tasks | [] | Empty message |
| `PlatformOnly` | Platform filter | Type filtered | Shows filtered |
| `AssignedOnly` | Assigned filter | Type filtered | Shows filtered |
| `PendingOnly` | Pending filter | Status filtered | Shows pending |
| `CompletedOnly` | Done filter | Status filtered | Shows completed |
| `SortByPoints` | Points sort | sortBy: points | Highest first |
| `FilteredEmpty` | No matches | Filtered to 0 | Dynamic message |

### **Controls (Args) Required**

* `tasks` (object[]) – task array
* `onComplete` (action) – completion callback
* `onStatusChange` (action) – status callback

### **Mocking Requirements**

* **Task data**: Various types, statuses, dates, points
* **Callbacks**: Storybook actions

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Verify filter button accessibility
* Check dropdown accessible
* Verify list structure

### **Interaction Tests**

* Click type filters
* Click status filters
* Change sort dropdown
* Complete a task
