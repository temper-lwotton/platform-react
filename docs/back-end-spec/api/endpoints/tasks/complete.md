# **Endpoint: `POST /api/tasks/{id}/complete`**

### **Summary**

Marks a task as completed and awards points if applicable.

---

## **Authentication**

* **Required:** Yes
* **Scope:** Own tasks only

## **Permissions**

* User must be assigned the task
* Task must have `requiresAction: true`

---

## **Request**

### **Path Parameters**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `id` | string | Yes | Task ID |

### **Query Parameters**

*None*

### **Headers**

| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Yes | `Bearer <token>` |

### **Request Body**

*None*

---

## **Response**

### **Success Response**

**Status:** `200 OK`

```json
{
  "success": true,
  "data": {
    "id": "1",
    "type": "platform_engagement",
    "category": "profile",
    "title": "Complete your profile",
    "points": 50,
    "status": "completed",
    "progress": 100,
    "completedAt": "2024-06-20T15:00:00Z",
    "createdAt": "2024-06-15T10:00:00Z",
    "requiresAction": true
  }
}
```

### **Error Responses**

| Status | Code | When |
|--------|------|------|
| 400 | `ALREADY_COMPLETED` | Task already completed |
| 400 | `AUTO_COMPLETION` | Task doesn't require manual action |
| 401 | `UNAUTHENTICATED` | Missing or invalid token |
| 403 | `NOT_ASSIGNED` | Task not assigned to user |
| 404 | `TASK_NOT_FOUND` | Task does not exist |

---

## **Side Effects**

| Effect | Description |
|--------|-------------|
| Points awarded | For platform_engagement tasks |
| Stats updated | Completion rate recalculated |
| `task.completed` event | Emitted for tracking |

## **Idempotency**

* **Idempotent:** No (fails if already completed)
* **Retry-safe:** Yes (safe to retry on network error)

---

## **Related Endpoints**

* [GET /api/tasks/stats](./stats.md) - Updated stats
* [PATCH /api/tasks/{id}/status](./update-status.md) - Change status

## **Frontend Notes**

* Use `completeTask(taskId)` from `@/lib/tasks`
* Show completion animation/celebration
* Refresh stats after completion
* Some tasks auto-complete via backend
