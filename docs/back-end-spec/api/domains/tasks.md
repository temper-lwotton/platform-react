# **API Domain Specification: Tasks**

*(Authoritative, conceptual, human-readable)*

## **API Domain: `Tasks`**

### **Description**

The Tasks domain manages user tasks including platform engagement tasks (gamified onboarding) and admin-assigned tasks. It provides:

* Gamified onboarding and engagement tracking
* Points-based reward system for platform activities
* Admin-assigned task management with due dates
* Progress tracking for incremental tasks
* Task statistics and completion rates

Tasks encourage platform adoption and enable administrators to assign work to users.

---

## **Domain Responsibility**

### **This domain is responsible for:**

* Creating and managing platform engagement tasks
* Creating and managing admin-assigned tasks
* Tracking task status and progress
* Awarding points for completed engagement tasks
* Providing task statistics and completion metrics
* Supporting task filtering by type, status, and category

### **Out of scope:**

* User gamification leaderboards (future feature)
* Push notifications for task reminders (see [Notifications](./notifications.md))
* Task templates management (admin concern)
* Project/workflow management (not a PM tool)

---

## **Owned Data Models**

### **Core Entities**

#### **Task**

```typescript
interface Task {
  id: string;
  type: TaskType;
  category: TaskCategory;
  title: string;
  description: string;
  points?: number;                // For platform_engagement tasks
  status: TaskStatus;
  progress?: number;              // 0-100 for measurable tasks
  dueDate?: string;               // ISO 8601, for admin tasks
  completedAt?: string;           // ISO 8601
  createdAt: string;              // ISO 8601
  assignedBy?: TaskAssigner;      // For admin_assigned tasks
  link?: string;                  // Deep link to relevant page
  requiresAction: boolean;        // User action vs auto-completion
}

interface TaskAssigner {
  id: string;
  name: string;
  avatar?: string;
}
```

**Notes:**
* `points` only applies to `platform_engagement` tasks
* `dueDate` and `assignedBy` only apply to `admin_assigned` tasks
* `progress` is used for tasks with measurable increments (e.g., "Reply to 3 discussions")
* `requiresAction` indicates if user must take action vs automatic completion

#### **TaskStats**

```typescript
interface TaskStats {
  totalPoints: number;            // Cumulative points earned
  completedTasks: number;         // Total completed tasks
  pendingTasks: number;           // Tasks not yet completed
  completionRate: number;         // 0-100 percentage
}
```

#### **TasksQueryParams**

```typescript
interface TasksQueryParams {
  type?: TaskType;
  status?: TaskStatus;
  category?: TaskCategory;
  limit?: number;
  offset?: number;
}
```

---

## **Enumerations**

### **TaskType**

| Value | Description | Characteristics |
|-------|-------------|-----------------|
| `platform_engagement` | Auto-generated tasks for onboarding/engagement | Has points, no assigner |
| `admin_assigned` | Tasks assigned by administrators | May have due date, has assigner |

```typescript
type TaskType = 'platform_engagement' | 'admin_assigned';
```

### **TaskStatus**

| Value | Description |
|-------|-------------|
| `pending` | Task not yet started |
| `in_progress` | Task actively being worked on |
| `completed` | Task finished |

```typescript
type TaskStatus = 'pending' | 'in_progress' | 'completed';
```

### **TaskCategory**

| Value | Description | Example Tasks |
|-------|-------------|---------------|
| `profile` | Profile completion tasks | Add photo, complete bio |
| `engagement` | Content creation and interaction | Start discussion, reply to posts |
| `community` | Social and networking tasks | Join spaces, RSVP to events |
| `learning` | Educational content consumption | Watch videos, read resources |
| `admin` | Administrative and assigned tasks | Submit reports, attend meetings |

```typescript
type TaskCategory = 'profile' | 'engagement' | 'community' | 'learning' | 'admin';
```

---

## **Relationships & Concepts**

### **Task Types**

The system supports two distinct task types:

**Platform Engagement Tasks:**
* Auto-generated based on user activity and profile completion
* Award points upon completion
* Encourage platform adoption and usage
* Examples: "Complete your profile", "Join 2 spaces", "Reply to 3 discussions"

**Admin-Assigned Tasks:**
* Created by administrators for specific users
* May have due dates
* Track work assignments within the platform
* Examples: "Submit Q1 report", "Review meeting notes"

### **Progress Tracking**

Some tasks support incremental progress:
* `progress` field tracks 0-100 percentage
* Used for tasks like "Reply to 3 discussions" (33% per reply)
* Auto-updates based on platform activity

### **Status Flow**

```
pending → in_progress → completed
```

Tasks can only move forward in status. Completed tasks cannot be re-opened.

---

## **Business Rules**

1. **Auto-Assignment**: Platform engagement tasks auto-assigned based on user activity and profile state
2. **Points**: Only awarded once per task, on first completion
3. **Progress**: Some tasks track incremental progress (e.g., "Reply to 3 discussions")
4. **Due Dates**: Admin-assigned tasks may have due dates (no enforcement, informational only)
5. **Status Flow**: Tasks progress from pending → in_progress → completed
6. **No Deletion**: Tasks are not deleted, only marked completed
7. **Single User**: Each task belongs to exactly one user

---

## **Authentication & Permissions**

### **Authentication**

* **Required:** Yes (all endpoints)
* **Token:** JWT Bearer token in Authorization header

### **Permission Rules**

| Action | Who Can Perform |
|--------|-----------------|
| List own tasks | Any authenticated user |
| Get own stats | Any authenticated user |
| Complete task | Task owner only |
| Update task status | Task owner only |
| Create admin task | Admin only |
| Assign task to user | Admin only |

---

## **API Capabilities Overview**

The Tasks API allows consumers to:

* **List tasks** with filtering by type, status, and category
* **Get task statistics** including points and completion rate
* **Complete tasks** to earn points (engagement tasks)
* **Update task status** to track progress
* **View task details** including progress and due dates

---

## **Endpoint Groups**

| Group | Purpose | Endpoint Count |
|-------|---------|----------------|
| [Tasks](../endpoints/tasks/README.md) | Core task operations | 4 |

Full endpoint details in the [Endpoint Reference](../endpoints/tasks/README.md).

---

## **Domain Events & Side Effects**

### **Events Emitted**

| Event | Trigger | Payload |
|-------|---------|---------|
| `task.created` | New task assigned | `{ taskId, userId, type }` |
| `task.completed` | Task marked complete | `{ taskId, userId, pointsAwarded }` |
| `task.progress_updated` | Progress changed | `{ taskId, progress }` |

### **Events Consumed**

| Event | Source Domain | Effect |
|-------|---------------|--------|
| `discussion.created` | Discussions | May complete "Start discussion" task |
| `comment.created` | Discussions | May update "Reply to X discussions" progress |
| `space.joined` | Spaces | May update "Join X spaces" progress |
| `event.rsvp` | Events | May complete "RSVP to event" task |
| `profile.updated` | Users | May update profile completion progress |

### **Side Effects**

| Event | Side Effect |
|-------|-------------|
| `task.completed` | Points added to user total |
| `task.completed` | May trigger badge/achievement (future) |

---

## **Error Model**

Standard error envelope (see [API Conventions](../_index.md#error-codes)):

```typescript
{
  success: false,
  error: {
    code: string,
    message: string
  }
}
```

### **Domain-Specific Error Codes**

| Code | HTTP | Description |
|------|------|-------------|
| `TASK_NOT_FOUND` | 404 | Task ID does not exist |
| `NOT_TASK_OWNER` | 403 | User does not own this task |
| `TASK_ALREADY_COMPLETED` | 400 | Task is already completed |
| `INVALID_STATUS_TRANSITION` | 400 | Invalid status change |

---

## **Frontend Usage Notes**

### **Primary Consumers**

| Route | Usage |
|-------|-------|
| `/tasks` | Task list and management |
| `/dashboard` | Task widget/summary |
| Onboarding flow | Engagement task prompts |

### **Service Location**

```
src/lib/tasks.ts
```

### **Key Functions**

| Function | Purpose |
|----------|---------|
| `getTasks(params)` | List tasks with filters |
| `getTaskStats()` | Get user's task statistics |
| `completeTask(taskId)` | Mark task as completed |
| `updateTaskStatus(taskId, status)` | Update task status |

### **Pagination**

* Uses `offset` + `limit` parameters
* Default limit: 20

### **Null Fields**

* `points` - null for admin-assigned tasks
* `dueDate` - null for engagement tasks
* `assignedBy` - null for engagement tasks
* `progress` - null for non-incremental tasks
* `completedAt` - null for incomplete tasks
* `link` - null if no deep link available

### **Caching Recommendations**

| Data | Cache Strategy |
|------|----------------|
| Task list | Short TTL (1min), invalidate on status change |
| Task stats | Short TTL (1min), invalidate on completion |

---

## **Performance & Constraints**

### **Request Volume**

| Endpoint | Expected Volume |
|----------|-----------------|
| List tasks | Medium |
| Get stats | Medium |
| Complete task | Low |
| Update status | Low |

### **Pagination Limits**

* Default page size: 20
* Maximum page size: 100

### **Rate Limiting**

Standard rate limits apply (see [API Conventions](../_index.md#rate-limiting)).

### **Known Trade-offs**

* Progress tracking requires event consumption from multiple domains
* Points calculation is immediate (no batching)

---

## **Related Routes**

| Route | Relationship |
|-------|--------------|
| `/tasks` | Task management page |
| `/dashboard` | Task summary widget |
| `/onboarding` | Guided task completion |

---

## **Related Domains**

| Domain | Relationship |
|--------|--------------|
| [Users](./users.md) | Task ownership, profile tasks |
| [Discussions](./discussions.md) | Triggers engagement task progress |
| [Spaces](./spaces.md) | Triggers "join space" task progress |
| [Events](./events.md) | Triggers "RSVP" task completion |

---

## **Non-Goals / Explicit Exclusions**

* **Leaderboards** - Not part of this domain (future gamification feature)
* **Badges/Achievements** - Future enhancement, separate system
* **Task templates** - Admin configuration, not API-managed
* **Recurring tasks** - Tasks are one-time only
* **Task dependencies** - No task chains or prerequisites

---

## **Stability & Change Policy**

* **Stability:** Stable
* **Breaking changes:** 30-day deprecation notice
* **Versioning:** Currently v1 (implicit)

### **Planned Enhancements**

* Points leaderboard
* Achievement badges
* Task streaks
* Custom task creation for admins via API
* Task reminders/notifications

---

## **Open Questions / Notes**

* Consider adding task expiration for time-sensitive engagement tasks
* May need admin API for task creation and assignment
* Points economy design (what can points be used for?)
* Consider task prioritization/ordering
