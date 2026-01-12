# **Endpoint: `POST /api/notifications/{userId}/mark-all-read`**

### **Summary**

Marks all notifications as read for a user.

---

## **Authentication**

* **Required:** Yes
* **Scope:** Own notifications only

## **Permissions**

* Users can only mark their own notifications

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
  "success": true
}
```

### **Error Responses**

| Status | Code | When |
|--------|------|------|
| 401 | `UNAUTHENTICATED` | Missing or invalid token |
| 403 | `ACCESS_DENIED` | userId doesn't match authenticated user |

---

## **Side Effects**

| Effect | Description |
|--------|-------------|
| All notifications marked read | `readAt` set on all unread |

## **Idempotency**

* **Idempotent:** Yes
* **Retry-safe:** Yes

---

## **Related Endpoints**

* [POST /api/notifications/{id}/mark-read](./mark-read.md) - Mark single
* [GET /api/notifications/{userId}/count](./count.md) - Verify cleared

## **Frontend Notes**

* Use `markAllAsRead(userId)` from `@/lib/notifications`
* Typically from "Mark all as read" button
* Reset badge to 0 immediately
