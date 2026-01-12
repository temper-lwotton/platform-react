# **Endpoint: `POST /api/notifications/{id}/mark-read`**

### **Summary**

Marks a single notification as read.

---

## **Authentication**

* **Required:** Yes
* **Scope:** Own notifications only

## **Permissions**

* User must be the recipient of the notification

---

## **Request**

### **Path Parameters**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `id` | number | Yes | Notification ID |

### **Query Parameters**

*None*

### **Headers**

| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Yes | `Bearer <token>` |

### **Request Body**

*None* (empty object `{}`)

---

## **Response**

### **Success Response**

**Status:** `200 OK`

```json
{
  "success": true
}
```

### **Error Responses**

| Status | Code | When |
|--------|------|------|
| 401 | `UNAUTHENTICATED` | Missing or invalid token |
| 403 | `NOT_RECIPIENT` | User is not the recipient |
| 404 | `NOT_FOUND` | Notification does not exist |

---

## **Side Effects**

| Effect | Description |
|--------|-------------|
| `readAt` set | Timestamp recorded |

## **Idempotency**

* **Idempotent:** Yes (marking already-read is no-op)
* **Retry-safe:** Yes

---

## **Related Endpoints**

* [POST /api/notifications/{userId}/mark-all-read](./mark-all-read.md) - Mark all
* [GET /api/notifications/{userId}/count](./count.md) - Check count

## **Frontend Notes**

* Use `markAsRead(notificationId)` from `@/lib/notifications`
* Call when user clicks/views notification
* Update UI immediately (optimistic)
