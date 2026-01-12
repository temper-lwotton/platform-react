# **Component Specification: UrgentTasksSidebar**

## **1. Component Name**

**`UrgentTasksSidebar`**

## **2. Description**

A sidebar widget displaying the 5 most urgent incomplete tasks.

* Shows task titles with due dates
* Highlights overdue tasks
* Displays points and progress
* Links to tasks page

## **3. Location**

```
src/components/ui/UrgentTasksSidebar/UrgentTasksSidebar.tsx
```

## **4. Component Type**

**UI** – Stateless component with derived state (filtering/sorting computed from props).

## **5. Props Interface**

```typescript
interface UrgentTasksSidebarProps {
  tasks: Task[];
}
```

## **6. Props**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `tasks` | `Task[]` | Yes | - | All tasks to filter from |

## **7. Data Requirements**

### **Task Type**

```typescript
// From @/lib/tasks
interface Task {
  id: string;
  title: string;
  status: 'pending' | 'in_progress' | 'completed';
  dueDate?: string; // ISO date
  points?: number;
  progress?: number; // 0-100
  link?: string;
}
```

## **8. Internal State**

*None – urgent tasks computed from props.*

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
|-------------------|-------------|-------|
| No urgent tasks | Nothing (`null`) | No render at all |
| Has urgent tasks | Task list | Up to 5 tasks |
| Task overdue | Red styling | "Overdue" text |
| Task due today | "Due today" | Highlighted |
| Task due tomorrow | "Due tomorrow" | Normal styling |
| Task due in X days | "X days" | Days remaining |
| No due date | No date shown | Task still listed |
| Has points | Points badge | With zap icon |
| Has progress | Progress bar | Percentage display |
| Task has link | Direct link | Navigate to link |
| Task no link | `/tasks` link | Navigate to tasks page |

## **10. Dependencies**

### **Child Components**

* `Icon` – Clipboard, zap, calendar, chevron icons

### **External Libraries**

* `next/link` – Task links

## **11. Events & Callbacks**

*No external callbacks – navigation handled by Next.js Link.*

## **12. Styling**

* **Approach**: CSS Modules with SCSS
* **File**: `UrgentTasksSidebar.module.scss`

### **CSS Classes**

* `.panel` – Main container
* `.header` – Title with icon
* `.title` – "Urgent Tasks" heading
* `.headerIcon` – Clipboard icon
* `.taskList` – Container for tasks
* `.taskItem` – Individual task row
* `.taskInfo` – Title and meta
* `.taskTitle` – Task title
* `.taskMeta` – Points and due date
* `.points` – Points badge
* `.dueDate` – Due date text
* `.dueDate--overdue` – Overdue styling (red)
* `.progressBar` – Progress indicator
* `.progressFill` – Progress fill
* `.actionChevron` – Link indicator
* `.footer` – View all link

### **Layout**

* Header with icon and title
* Vertical task list
* Footer with "View all tasks" link

## **13. Accessibility Requirements**

* **Keyboard**: All task links focusable via Tab
* **ARIA**: List items properly structured
* **Screen Reader**: Announce task status and urgency

### **Improvements Needed**

* Add `aria-label` for urgency level
* Add progress bar aria attributes
* Announce overdue status

## **14. Error Handling**

| Error Condition | Behaviour | Fallback |
|-----------------|-----------|----------|
| No incomplete tasks | Return null | Component hidden |
| Invalid due date | Skip date display | Show task anyway |
| Missing title | Skip task | Don't render |
| Invalid progress | Hide progress bar | Show task anyway |

## **15. Performance & Lifecycle Notes**

### **Task Filtering & Sorting**

```typescript
const urgentTasks = tasks
  .filter(task => task.status !== 'completed')
  .sort((a, b) => {
    // Prioritize tasks with due dates
    if (!a.dueDate && !b.dueDate) return 0;
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  })
  .slice(0, 5);
```

### **Due Date Formatting**

```typescript
const formatDueDate = (dateString: string): { text: string; isOverdue: boolean } => {
  const today = new Date();
  const dueDate = new Date(dateString);
  const diffTime = dueDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return { text: 'Overdue', isOverdue: true };
  if (diffDays === 0) return { text: 'Due today', isOverdue: false };
  if (diffDays === 1) return { text: 'Due tomorrow', isOverdue: false };
  if (diffDays <= 7) return { text: `${diffDays} days`, isOverdue: false };

  const formattedDate = dueDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
  return { text: formattedDate, isOverdue: false };
};
```

### **Memoization**

* `urgentTasks` memoized with `useMemo`

## **16. Usage Examples**

### **In HomeSidebar**

```tsx
import { UrgentTasksSidebar } from '@/components/ui/UrgentTasksSidebar';

<UrgentTasksSidebar tasks={userTasks} />
```

### **With Query Data**

```tsx
const { data: tasks } = useQuery({
  queryKey: ['tasks', userId],
  queryFn: () => getUserTasks(userId),
});

<UrgentTasksSidebar tasks={tasks || []} />
```

## **17. Features Summary**

### **Header**

* Clipboard icon
* "Urgent Tasks" title

### **Task Display**

| Element | Content |
|---------|---------|
| Title | Task title |
| Points | Points badge with zap icon (if set) |
| Due date | Relative or formatted date |
| Overdue | Red "Overdue" text |
| Progress | Progress bar (if in progress) |
| Action | Chevron link indicator |

### **Footer**

* "View all tasks" link → `/tasks`

### **Interactions**

* Click task → navigate to task link or `/tasks`
* Click "View all" → navigate to `/tasks`

## **18. Testing Considerations**

### **Unit Tests**

* Filters completed tasks
* Sorts by due date (soonest first)
* Tasks without dates sorted last
* Limits to 5 tasks
* Overdue styling applied
* Progress bar renders correctly
* Returns null when no tasks

### **Mocking**

* Task arrays with various statuses
* Date.now() for relative tests

### **Edge Cases**

* All tasks completed (returns null)
* All tasks overdue
* No tasks with due dates
* Task due at midnight
* Very long task titles
* Progress at 0%, 50%, 100%

## **19. Out of Scope / Non-Goals**

* **Complete task inline**: Not here
* **Edit task**: Not inline
* **Create task**: Not in widget
* **Filtering by project**: Not supported
* **Pagination**: Fixed limit of 5

## **20. Related Components & System Context**

### **Siblings**

* `UpcomingEventsSidebar`
* `NewestMembers`

### **Child Components**

* `Icon`

### **Used By**

* `HomeSidebar`
* Dashboard layouts

### **Links To**

* `/tasks` – All tasks page
* Task-specific links (if provided)

## **21. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
|----------|----------|---------------|-------|
| `Default` | Multiple tasks | 5 urgent | Normal state |
| `NoTasks` | All completed | [] incomplete | Returns null |
| `Overdue` | Overdue tasks | Past due dates | Red styling |
| `DueToday` | Due today | Today's date | Highlighted |
| `WithProgress` | In progress tasks | progress > 0 | Progress bars |
| `WithPoints` | Tasks with points | points set | Points badges |

### **Controls (Args) Required**

* `tasks` (object[]) – task data

### **Mocking Requirements**

* **Task data**: Various statuses, dates, progress
* **Date.now()**: For relative calculations

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Verify task list accessible
* Check overdue announcement
* Verify progress bar accessible

### **Interaction Tests**

* Click task link
* Click view all link
