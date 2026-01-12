# **Endpoint: `GET /api/notifications/{userId}/count`**

### **Summary**

Returns the count of unread notifications for badge display.

---

## **Authentication**

* **Required:** Yes
* **Scope:** Own notifications only

## **Permissions**

* Users can only access their own count

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
  "data": 5
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

* [GET /api/notifications/{userId}](./list.md) - Full list
* [POST /api/notifications/{userId}/mark-all-read](./mark-all-read.md) - Clear count

## **Frontend Notes**

* Use `getUnreadCount(userId)` from `@/lib/notifications`
* Poll periodically or use WebSocket for real-time
* Display as badge on notification icon
