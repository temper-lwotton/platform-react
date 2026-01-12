# **Endpoint: `POST /api/users/{id}/connection-requests/{recipientId}`**

### **Summary**

Sends a connection request from one user to another. Requires acceptance to establish connection.

---

## **Authentication**

* **Required:** Yes
* **Scope:** User themselves only

## **Permissions**

* Users can only send requests from their own account
* `{id}` must match the authenticated user's ID

---

## **Request**

### **Path Parameters**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `id` | string | Yes | Sender user ID (must be authenticated user) |
| `recipientId` | string | Yes | User ID to send request to |

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

**Status:** `201 Created`

```json
{
  "success": true,
  "data": {
    "id": 789,
    "sender": {
      "id": 123,
      "name": "John Doe",
      "email": "john@example.com",
      "photo": "https://cdn.example.com/photos/123.jpg"
    },
    "recipient": {
      "id": 456,
      "name": "Jane Smith",
      "email": "jane@example.com",
      "photo": "https://cdn.example.com/photos/456.jpg"
    },
    "status": "PENDING",
    "createdAt": "2024-06-20 14:30:00",
    "closedAt": null
  },
  "message": "Connection request sent"
}
```

### **Error Responses**

| Status | Code | When |
|--------|------|------|
| 400 | `CANNOT_CONNECT_SELF` | Attempting to connect with yourself |
| 401 | `UNAUTHENTICATED` | Missing or invalid token |
| 403 | `FORBIDDEN` | `{id}` doesn't match authenticated user |
| 404 | `USER_NOT_FOUND` | Recipient user does not exist |
| 409 | `CONNECTION_EXISTS` | Connection or pending request already exists |

---

## **Side Effects**

| Effect | Description |
|--------|-------------|
| `connection.requested` event | Emitted for activity tracking |
| Notification | Sent to recipient about pending request |

## **Idempotency**

* **Idempotent:** No (returns 409 on duplicate)
* **Retry-safe:** Safe (409 indicates request exists)

---

## **Related Endpoints**

* [POST /api/users/connection-requests/{requestId}/accept](./accept-connection.md) - Accept
* [POST /api/users/connection-requests/{requestId}/decline](./decline-connection.md) - Decline
* [GET /api/users/{id}/connection-requests/sent](./get-sent-requests.md) - View sent requests

## **Frontend Notes**

* Used by `ConnectionButton` component
* Update UI to show "Pending" state after success
* Handle 409 gracefully (request already sent)
* Invalidate connection status cache
