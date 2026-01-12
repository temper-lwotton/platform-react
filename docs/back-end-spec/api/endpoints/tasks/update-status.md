# **Endpoint: `PATCH /api/tasks/{id}/status`**

### **Summary**

Updates the status of a task (e.g., pending → in_progress).

---

## **Authentication**

* **Required:** Yes
* **Scope:** Own tasks only

## **Permissions**

* User must be assigned the task

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
| `Content-Type` | Yes | `application/json` |

### **Request Body**

```json
{
  "status": "in_progress"
}
```

#### **Validation Rules**

| Field | Rules |
|-------|-------|
| `status` | Required, one of: `pending`, `in_progress`, `completed` |

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
    "status": "in_progress",
    "progress": 60,
    "createdAt": "2024-06-15T10:00:00Z",
    "requiresAction": true
  }
}
```

### **Error Responses**

| Status | Code | When |
|--------|------|------|
| 400 | `INVALID_STATUS` | Status not valid |
| 400 | `INVALID_TRANSITION` | Status transition not allowed |
| 401 | `UNAUTHENTICATED` | Missing or invalid token |
| 403 | `NOT_ASSIGNED` | Task not assigned to user |
| 404 | `TASK_NOT_FOUND` | Task does not exist |

---

## **Side Effects**

| Effect | Description |
|--------|-------------|
| `task.status_changed` event | Emitted for tracking |

## **Idempotency**

* **Idempotent:** Yes
* **Retry-safe:** Yes

---

## **Related Endpoints**

* [POST /api/tasks/{id}/complete](./complete.md) - Mark completed
* [GET /api/tasks](./list.md) - View updated task

## **Frontend Notes**

* Use `updateTaskStatus(taskId, status)` from `@/lib/tasks`
* Use for starting a task (pending → in_progress)
* For completion, prefer `completeTask()` endpoint
