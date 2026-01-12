# **Endpoint: `GET /api/tasks`**

### **Summary**

Retrieves tasks for the current user with optional filtering.

---

## **Authentication**

* **Required:** Yes
* **Scope:** Own tasks only

## **Permissions**

* Users see their own tasks
* Includes platform engagement and admin-assigned tasks

---

## **Request**

### **Path Parameters**

*None*

### **Query Parameters**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `type` | string | No | `platform_engagement` or `admin_assigned` |
| `status` | string | No | `pending`, `in_progress`, or `completed` |
| `category` | string | No | `profile`, `engagement`, `community`, `learning`, `admin` |
| `limit` | number | No | Max results (default: 20) |
| `offset` | number | No | Pagination offset |

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
  "data": [
    {
      "id": "1",
      "type": "platform_engagement",
      "category": "profile",
      "title": "Complete your profile",
      "description": "Add your job title, company, and bio",
      "points": 50,
      "status": "in_progress",
      "progress": 60,
      "createdAt": "2024-06-15T10:00:00Z",
      "requiresAction": true,
      "link": "/settings/profile"
    },
    {
      "id": "11",
      "type": "admin_assigned",
      "category": "admin",
      "title": "Submit Q1 project proposal",
      "description": "Prepare and submit your project proposal",
      "status": "pending",
      "dueDate": "2024-06-27T23:59:59Z",
      "createdAt": "2024-06-19T09:00:00Z",
      "assignedBy": {
        "id": "admin-1",
        "name": "Sarah Johnson"
      },
      "requiresAction": true
    }
  ]
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

## **Pagination**

* Offset-based pagination
* Use `limit` and `offset` parameters

---

## **Related Endpoints**

* [GET /api/tasks/stats](./stats.md) - Get statistics
* [POST /api/tasks/{id}/complete](./complete.md) - Complete task

## **Frontend Notes**

* Use `getTasks(params)` from `@/lib/tasks`
* Group by type or category for display
* Show progress bar for tasks with `progress`
* Highlight overdue admin tasks
