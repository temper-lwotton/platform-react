# **Route Specification: Tasks**

## **1. Route Path**

**`/tasks`**

## **2. Description**

Task management page where users can view, complete, and track their tasks.

* Displays filterable and sortable task list
* Shows gamification statistics (points, completion rate)
* Allows task completion and status changes
* Provides progress tracking

## **3. Source File**

```
src/app/(protected)/tasks/page.tsx
```

## **4. Route Responsibility**

### **This route is responsible for:**

* Rendering task list with filters and sorting
* Displaying task completion statistics
* Handling task completion actions
* Managing task status changes
* Calculating and updating statistics on changes

### **This route does not:**

* Create new tasks (admin function)
* Delete tasks
* Assign tasks to users
* Manage task categories or types

## **5. Authentication & Access Control**

* **Authentication Required:** Yes
* **Allowed Roles:** Any authenticated user
* **Permission Rules:** Users see only tasks assigned to them

## **6. URL Parameters & Query Params**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `status` | `string` | No | Filter by status (pending/in_progress/completed) |
| `type` | `string` | No | Filter by type (platform_engagement/admin_assigned) |

* **Default behaviour:** Show all tasks
* **Validation:** Invalid params ignored

## **7. Layout & Structure**

### **Layout Overview**

* Single column layout
* Stats cards at top
* Task list below

### **Structural Regions**

| Region | Purpose |
|--------|---------|
| Header | Page title and subtitle |
| Stats Section | Task statistics cards (4 cards) |
| Content Area | Filterable task list |

## **8. Components Used**

### **Layout Components**

*None - simple page structure*

### **UI / Feature Components**

| Component | Import Path | Purpose |
|-----------|-------------|---------|
| `TaskList` | `@/components/ui/TaskList` | Displays list of tasks with actions |
| `TaskStats` | `@/components/ui/TaskStats` | Shows task completion statistics |

### **Types**

| Type | Import Path | Description |
|------|-------------|-------------|
| `Task` | `@/lib/tasks` | Task data structure |
| `TaskStatus` | `@/lib/tasks` | Task status enum |
| `TaskStats` | `@/lib/tasks` | Statistics type |

## **9. Data Flow Overview**

1. Load initial task data (currently mock)
2. Load initial statistics
3. Render stats cards and task list
4. User interacts with task (complete/status change)
5. Update task in local state
6. Recalculate statistics based on change
7. Re-render with updated data

## **10. Data Fetching**

### **Standard Queries**

*Currently using mock data - will be replaced with API queries.*

| Query Key | Function | Data Type | Enable Conditions |
|-----------|----------|-----------|-------------------|
| `['tasks']` | `getTasks` | `Task[]` | Future implementation |
| `['task-stats']` | `getTaskStats` | `TaskStats` | Future implementation |

### **Static Data (Current)**

| Source | Purpose |
|--------|---------|
| `MOCK_TASKS` | Mock task data from `@/lib/tasks` |
| `MOCK_TASK_STATS` | Initial statistics from `@/lib/tasks` |

## **11. State Management**

### **Local State**

| State Variable | Type | Purpose |
|----------------|------|---------|
| `tasks` | `Task[]` | Current list of tasks |
| `stats` | `TaskStats` | Current task statistics |

### **Derived State**

*None - stats calculated on mutation*

### **Refs**

*None*

### **Stats Structure**

```typescript
interface TaskStats {
  totalPoints: number;
  completedTasks: number;
  pendingTasks: number;
  completionRate: number; // 0-100 percentage
}
```

## **12. Behaviour Matrix**

| Condition | UI Behaviour |
|-----------|--------------|
| Loading initial data | Stats and list render with mock data |
| No tasks | Empty state in TaskList |
| All tasks completed | 100% completion rate, all in "Done" |
| Task completed | Stats update, task moves to completed |
| Task uncompleted | Stats reverse, task returns to pending |
| Filter applied | TaskList filters items |

## **13. User Actions**

### **UI Interactions**

| Action | Trigger | Result |
|--------|---------|--------|
| Complete task | Toggle checkbox | Task marked completed, stats update |
| Change status | Status change in TaskItem | Task status updated, stats recalculated |
| Filter by type | Click type filter | TaskList filters |
| Filter by status | Click status filter | TaskList filters |
| Sort tasks | Change sort dropdown | TaskList re-sorts |

### **Navigation Actions**

| Action | Trigger | Destination |
|--------|---------|-------------|
| Task action link | Click "Take action" | Task-specific URL |

## **14. Infinite Scroll / Pagination**

*Not applicable - all tasks loaded at once (currently mock data).*

## **15. Error & Empty States**

* **Loading:** No loading state (uses mock data currently)
* **No tasks:** "No tasks to display" message in TaskList
* **All filtered out:** "No tasks match your filters" message
* **Error:** No error handling currently implemented

## **16. Performance & Constraints**

* **Rendering strategy:** Client-side rendering (CSR)
* **Memoisation strategy:** Stats recalculated on each mutation
* **Parallel vs sequential fetching:** N/A (mock data)
* **Known constraints:**
  * Currently uses mock data
  * No API integration yet
  * No real-time updates

## **17. Accessibility Considerations**

* **Keyboard navigation:** Tab through tasks, Space to complete
* **Focus management:** Focus stays on completed task
* **Screen reader expectations:** Announce task completion, stats changes
* **Landmark roles:** Main content area

## **18. Storybook & Testing Strategy**

### **Storybook**

* `TaskList` component with various states
* `TaskStats` component with various values
* `TaskItem` component states

### **Testing**

* **Unit test focus:** Stats calculation, completion logic
* **Integration test focus:** Task completion flow, stats update
* **E2E test focus:** Complete task journey, filter interactions

## **19. Non-Goals / Out of Scope**

* Task creation (admin feature)
* Task deletion
* Task assignment
* Due date modification
* Priority changes
* Subtasks or dependencies
* Notifications for due tasks

## **20. Related Routes**

| Route | Relationship |
|-------|--------------|
| `/calendar` | Tasks also appear on calendar |
| `/feed` | Urgent tasks shown in feed sidebar |

## **21. Open Questions / Notes**

* Need to replace mock data with real API integration
* Consider adding task creation for admins
* May need notification system for overdue tasks
* Points/gamification system needs backend support

### **Status Change Logic**

When completing a task:
- Sets status to 'completed'
- Sets completedAt timestamp
- Sets progress to 100%
- Adds task points to totalPoints
- Increments completedTasks count
- Decrements pendingTasks count
- Recalculates completionRate

When uncompleting a task:
- Reverses all the above operations
