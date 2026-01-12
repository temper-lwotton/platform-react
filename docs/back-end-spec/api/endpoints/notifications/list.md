# **Endpoint: `GET /api/notifications/{userId}`**

### **Summary**

Retrieves all notifications for a user, ordered by creation date (newest first).

---

## **Authentication**

* **Required:** Yes
* **Scope:** Own notifications only

## **Permissions**

* Users can only access their own notifications
* `userId` must match authenticated user

---

## **Request**

### **Path Parameters**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `userId` | string | Yes | User ID |

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
  "data": [
    {
      "id": 1001,
      "type": "comment_reply",
      "payload": {
        "discussion_id": 50,
        "comment_id": 200,
        "space_id": 5
      },
      "createdAt": "2024-06-20T15:30:00Z",
      "readAt": null,
      "recipient": {
        "id": 123,
        "name": "John Doe"
      },
      "actor": {
        "id": 456,
        "name": "Jane Smith"
      }
    },
    {
      "id": 1000,
      "type": "discussion_like",
      "payload": {
        "discussion_id": 45
      },
      "createdAt": "2024-06-20T14:00:00Z",
      "readAt": "2024-06-20T14:30:00Z",
      "recipient": {
        "id": 123,
        "name": "John Doe"
      },
      "actor": {
        "id": 789,
        "name": "Bob Wilson"
      }
    }
  ]
}
```

### **Error Responses**

| Status | Code | When |
|--------|------|------|
| 401 | `UNAUTHENTICATED` | Missing or invalid token |
| 403 | `ACCESS_DENIED` | userId doesn't match authenticated user |

---

## **Side Effects**

*None*

## **Idempotency**

* **Idempotent:** Yes
* **Retry-safe:** Yes

---

## **Related Endpoints**

* [GET /api/notifications/{userId}/count](./count.md) - Unread count
* [POST /api/notifications/{id}/mark-read](./mark-read.md) - Mark as read

## **Frontend Notes**

* Use `getNotifications(userId)` from `@/lib/notifications`
* Filter unread by checking `readAt === null`
* Use helper functions for display text
