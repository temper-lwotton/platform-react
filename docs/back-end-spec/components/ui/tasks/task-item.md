# **Component Specification: TaskItem**

## **1. Component Name**

**`TaskItem`**

## **2. Description**

A single task item component displaying task details and allowing status changes.

* Shows title, description, progress, due date, and points
* Supports completion checkbox and status changes
* Displays platform engagement and admin-assigned task types
* Links to task actions when available

## **3. Location**

```
src/components/ui/TaskItem/TaskItem.tsx
```

## **4. Component Type**

**UI** – Stateless presentational component receiving task data and callbacks via props.

## **5. Props Interface**

```typescript
interface TaskItemProps {
  task: Task;
  onComplete?: (taskId: string) => void;
  onStatusChange?: (taskId: string, status: 'pending' | 'in_progress' | 'completed') => void;
}
```

## **6. Props**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `task` | `Task` | Yes | - | Task data object |
| `onComplete` | `(taskId: string) => void` | No | - | Callback when task is completed |
| `onStatusChange` | `(taskId: string, status) => void` | No | - | Callback when status changes |

## **7. Data Requirements**

### **Task Type**

```typescript
// From @/lib/tasks
interface Task {
  id: string;
  title: string;
  description: string;
  type: 'platform_engagement' | 'admin_assigned';
  category: 'profile' | 'engagement' | 'community' | 'learning' | 'admin';
  status: 'pending' | 'in_progress' | 'completed';
  points?: number;
  progress?: number;        // 0-100 percentage
  dueDate?: string;
  completedAt?: string;
  requiresAction: boolean;
  link?: string;
  assignedBy?: {
    name: string;
    avatar?: string;
  };
}
```

## **8. Internal State**

*None – stateless component.*

## **9. Behaviour Matrix**

| Condition / State | UI Rendered | Notes |
|-------------------|-------------|-------|
| `status === 'pending'` | Unchecked checkbox | Can complete |
| `status === 'in_progress'` | Partial styling | "In Progress" badge |
| `status === 'completed'` | Checked checkbox | Completed styling |
| `requiresAction === false` | Disabled checkbox | Can't manually complete |
| `progress > 0` and not completed | Progress bar | Shows percentage |
| `points` defined | Points badge | "X pts" display |
| `dueDate` defined | Due date text | With formatting |
| Due date past | "Overdue" styling | Red text |
| Due date today | "Due today" | Highlighted |
| Due date tomorrow | "Due tomorrow" | Normal |
| `link` defined | "Take action" button | Links to task |
| `assignedBy` defined | Assigned by section | Avatar and name |

## **10. Dependencies**

### **Child Components**

* `Icon` – Category and action icons

### **External Libraries**

* `@radix-ui/react-avatar` – Assigned by avatar
* `@radix-ui/react-checkbox` – Completion checkbox

## **11. Events & Callbacks**

| Event / Callback | Trigger | Description |
|------------------|---------|-------------|
| `handleCheckboxChange` | Toggle checkbox | Calls `onComplete` or `onStatusChange` |

## **12. Styling**

* **Approach**: CSS Modules with SCSS
* **File**: `TaskItem.module.scss`

### **CSS Classes**

* `.taskItem` – Main container
* `.taskItem--completed` – Completed state
* `.taskItem--overdue` – Overdue state
* `.checkbox` – Completion checkbox
* `.content` – Title and description
* `.title` – Task title
* `.description` – Task description
* `.pointsBadge` – Points indicator
* `.progressBar` – Progress indicator
* `.progressFill` – Progress fill
* `.meta` – Due date and status
* `.dueDate` – Due date text
* `.dueDate--overdue` – Overdue styling
* `.statusBadge` – In progress badge
* `.categoryIcon` – Category indicator
* `.assignedBy` – Assigned by section
* `.actionButton` – "Take action" link

### **Layout**

* Checkbox (left)
* Content area (center)
* Meta information (right)

## **13. Accessibility Requirements**

* **Keyboard**: Checkbox focusable via Tab
* **ARIA**: Checkbox with proper label
* **Screen Reader**: Announce task title and status

### **Improvements Needed**

* Add `aria-describedby` linking to due date
* Announce overdue status to screen readers
* Add keyboard shortcut for quick completion

## **14. Error Handling**

| Error Condition | Behaviour | Fallback |
|-----------------|-----------|----------|
| Invalid progress value | Clamp to 0-100 | Display 0 |
| Invalid date | Skip due date display | Show task anyway |
| Missing callback | Checkbox disabled | No interaction |

## **15. Performance & Lifecycle Notes**

### **Due Date Formatting**

```typescript
const formatDueDate = (dateString: string): { text: string; isOverdue: boolean } => {
  const today = new Date();
  const dueDate = new Date(dateString);
  const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return { text: 'Overdue', isOverdue: true };
  if (diffDays === 0) return { text: 'Due today', isOverdue: false };
  if (diffDays === 1) return { text: 'Due tomorrow', isOverdue: false };
  if (diffDays <= 7) return { text: `Due in ${diffDays} days`, isOverdue: false };
  return { text: dueDate.toLocaleDateString(), isOverdue: false };
};
```

### **Category Icons**

| Category | Icon |
|----------|------|
| profile | user |
| engagement | comment |
| community | rocket |
| learning | lightbulb |
| admin | clipboard |

## **16. Usage Examples**

### **In TaskList**

```tsx
import { TaskItem } from '@/components/ui/TaskItem';

<TaskItem
  task={task}
  onComplete={(id) => markComplete(id)}
  onStatusChange={(id, status) => updateStatus(id, status)}
/>
```

### **Read-Only Display**

```tsx
<TaskItem task={task} />
```

## **17. Features Summary**

### **Task Display**

| Element | Content |
|---------|---------|
| Checkbox | Completion toggle |
| Title | Task title with points badge |
| Description | Task description text |
| Progress | Progress bar (0-100%) |
| Type | Platform/Assigned indicator |
| Category | Icon indicator |
| Due date | Relative date with overdue styling |
| Status | "In Progress" badge |
| Completed | Completion date display |
| Assigned by | Avatar and name |
| Action | "Take action" link button |

### **Interactions**

* Toggle checkbox → complete task or change status
* Click "Take action" → navigate to task link

## **18. Testing Considerations**

### **Unit Tests**

* Renders task details correctly
* Checkbox toggles completion
* Progress bar displays correctly
* Due date formatting
* Overdue styling applied
* Disabled checkbox when no action required
* Assigned by section renders

### **Mocking**

* Task objects with various states
* Callback functions

### **Edge Cases**

* Task without due date
* Task without points
* Progress at 0%, 50%, 100%
* Very long title/description
* Missing assignedBy

## **19. Out of Scope / Non-Goals**

* **Inline editing**: Not supported
* **Delete action**: Not here
* **Drag reordering**: Not supported
* **Subtasks**: Not displayed

## **20. Related Components & System Context**

### **Parent Component**

* `TaskList`

### **Child Components**

* `Icon`
* Radix Avatar
* Radix Checkbox

### **Used By**

* Tasks page
* Dashboard widgets

## **21. Storybook Mapping**

### **Stories Required**

| Story ID | Scenario | Props / State | Notes |
|----------|----------|---------------|-------|
| `Default` | Pending task | status: pending | Base state |
| `InProgress` | In progress | status: in_progress | With badge |
| `Completed` | Done task | status: completed | Checked |
| `WithProgress` | Has progress | progress: 50 | Progress bar |
| `Overdue` | Past due | Past dueDate | Red styling |
| `AssignedTask` | Admin assigned | With assignedBy | Avatar shown |
| `WithLink` | Has action | link defined | Action button |
| `NoAction` | Can't complete | requiresAction: false | Disabled |

### **Controls (Args) Required**

* `task` (object) – task data
* `onComplete` (action) – completion callback
* `onStatusChange` (action) – status callback

### **Mocking Requirements**

* **Task data**: Various statuses and types
* **Callbacks**: Storybook actions

### **Accessibility Check (Storybook)**

* a11y addon enabled
* Verify checkbox accessible
* Check due date announcement
* Verify link accessibility

### **Interaction Tests**

* Toggle checkbox
* Click action link
