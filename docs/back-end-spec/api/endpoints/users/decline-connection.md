# **Endpoint: `POST /api/users/connection-requests/{requestId}/decline`**

### **Summary**

Declines a pending connection request.

---

## **Authentication**

* **Required:** Yes
* **Scope:** Request recipient only

## **Permissions**

* Only the request recipient can decline
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
    "status": "DECLINED",
    "createdAt": "2024-06-20 14:30:00",
    "closedAt": "2024-06-21 09:15:00"
  },
  "message": "Connection request declined"
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
| `connection.declined` event | Emitted for activity tracking |
| No notification | Sender is typically not notified of declines |

## **Idempotency**

* **Idempotent:** No (returns 409 on duplicate)
* **Retry-safe:** Safe (409 indicates already processed)

---

## **Related Endpoints**

* [POST /api/users/connection-requests/{requestId}/accept](./accept-connection.md) - Accept
* [GET /api/users/{id}/connection-requests/received](./get-received-requests.md) - View requests

## **Frontend Notes**

* Used in connection request notification/UI
* Remove request from pending list after success
* Sender sees user as "not connected" (can re-request later)
* Consider silent decline (no notification to sender)
