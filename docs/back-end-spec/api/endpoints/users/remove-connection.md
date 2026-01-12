# **Endpoint: `DELETE /api/users/{id}/connections/{connectionId}`**

### **Summary**

Removes an existing connection between two users. Either connected user can remove the connection.

---

## **Authentication**

* **Required:** Yes
* **Scope:** Either connected user

## **Permissions**

* Either user in the connection can remove it
* `{id}` must be the authenticated user
* `{connectionId}` is the other user's ID

---

## **Request**

### **Path Parameters**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `id` | string | Yes | Authenticated user's ID |
| `connectionId` | string | Yes | ID of the connected user to disconnect from |

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
  "message": "Connection removed"
}
```

### **Error Responses**

| Status | Code | When |
|--------|------|------|
| 400 | `NOT_CONNECTED` | Users are not connected |
| 401 | `UNAUTHENTICATED` | Missing or invalid token |
| 403 | `FORBIDDEN` | `{id}` doesn't match authenticated user |
| 404 | `USER_NOT_FOUND` | Connection user does not exist |

---

## **Side Effects**

| Effect | Description |
|--------|-------------|
| `connection.removed` event | Emitted for activity tracking |
| Connection removed | Both users lose connection status |
| No notification | Other user not typically notified |

## **Idempotency**

* **Idempotent:** No (returns 400 on duplicate)
* **Retry-safe:** Safe (400 indicates already removed)

---

## **Related Endpoints**

* [GET /api/users/{id}/connections](./get-connections.md) - View connections
* [POST /api/users/{id}/connection-requests/{recipientId}](./send-connection-request.md) - Re-connect

## **Frontend Notes**

* Used in connection management or profile settings
* Requires confirmation dialog (action is immediate)
* Update both users' connection status to "none"
* User can send new connection request after removal
* Invalidate all connection-related caches
