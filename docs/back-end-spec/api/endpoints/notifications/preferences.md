# **Endpoint: `GET /api/notifications/{userId}/preferences`**

### **Summary**

Retrieves notification preferences for a user.

---

## **Authentication**

* **Required:** Yes
* **Scope:** Own preferences only

## **Permissions**

* Users can only access their own preferences

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
  "data": {
    "emailNotifications": true,
    "pushNotifications": false,
    "commentReplies": true,
    "mentions": true,
    "discussionLikes": false
  }
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

* [GET /api/notifications/{userId}](./list.md) - Get notifications

## **Frontend Notes**

* Use `getNotificationPreferences(userId)` from `@/lib/notifications`
* Display in settings page
* Update preferences via user settings API
