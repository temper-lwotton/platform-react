# **Endpoint: `GET /api/tasks/stats`**

### **Summary**

Retrieves task statistics for the current user including points and completion rate.

---

## **Authentication**

* **Required:** Yes
* **Scope:** Own stats only

## **Permissions**

* Users see their own statistics

---

## **Request**

### **Path Parameters**

*None*

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
    "totalPoints": 325,
    "completedTasks": 8,
    "pendingTasks": 12,
    "completionRate": 40
  }
}
```

### **Error Responses**

| Status | Code | When |
|--------|------|------|
| 401 | `UNAUTHENTICATED` | Missing or invalid token |

---

## **Side Effects**

*None*

## **Idempotency**

* **Idempotent:** Yes
* **Retry-safe:** Yes

---

## **Related Endpoints**

* [GET /api/tasks](./list.md) - List tasks
* [POST /api/tasks/{id}/complete](./complete.md) - Complete task

## **Frontend Notes**

* Use `getTaskStats()` from `@/lib/tasks`
* Display in dashboard/profile
* Show completion rate as progress indicator
* Highlight total points earned
