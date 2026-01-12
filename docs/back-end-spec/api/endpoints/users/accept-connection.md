# **Endpoint: `POST /api/users/connection-requests/{requestId}/accept`**

### **Summary**

Accepts a pending connection request, establishing a bi-directional connection between users.

---

## **Authentication**

* **Required:** Yes
* **Scope:** Request recipient only

## **Permissions**

* Only the request recipient can accept
* Request must be in `PENDING` status

---

## **Request**

### **Path Parameters**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `requestId` | string | Yes | Connection request ID |

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
    "id": 789,
    "sender": {
      "id": 456,
      "name": "Jane Smith",
      "email": "jane@example.com",
      "photo": "https://cdn.example.com/photos/456.jpg"
    },
    "recipient": {
      "id": 123,
      "name": "John Doe",
      "email": "john@example.com",
      "photo": "https://cdn.example.com/photos/123.jpg"
    },
    "status": "ACCEPTED",
    "createdAt": "2024-06-20 14:30:00",
    "closedAt": "2024-06-21 09:15:00"
  },
  "message": "Connection request accepted"
}
```

### **Error Responses**

| Status | Code | When |
|--------|------|------|
| 401 | `UNAUTHENTICATED` | Missing or invalid token |
| 403 | `NOT_REQUEST_RECIPIENT` | Authenticated user is not the recipient |
| 404 | `REQUEST_NOT_FOUND` | Request ID does not exist |
| 409 | `CONFLICT` | Request already accepted or declined |

---

## **Side Effects**

| Effect | Description |
|--------|-------------|
| `connection.accepted` event | Emitted for activity tracking |
| Connection created | Both users now connected |
| Notification | Sent to sender about acceptance |

## **Idempotency**

* **Idempotent:** No (returns 409 on duplicate)
* **Retry-safe:** Safe (409 indicates already processed)

---

## **Related Endpoints**

* [POST /api/users/connection-requests/{requestId}/decline](./decline-connection.md) - Decline
* [GET /api/users/{id}/connection-requests/received](./get-received-requests.md) - View requests
* [GET /api/users/{id}/connections](./get-connections.md) - View connections

## **Frontend Notes**

* Used in connection request notification/UI
* Update both users' connection lists after success
* Sender should see status change to "Connected"
* Invalidate all connection-related caches
