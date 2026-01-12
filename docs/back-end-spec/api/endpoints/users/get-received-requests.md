# **Endpoint: `GET /api/users/{id}/connection-requests/received`**

### **Summary**

Retrieves connection requests received by the specified user.

---

## **Authentication**

* **Required:** Yes
* **Scope:** User themselves only

## **Permissions**

* Users can only view their own received requests
* `{id}` must match the authenticated user's ID

---

## **Request**

### **Path Parameters**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `id` | string | Yes | User ID (must be authenticated user) |

### **Query Parameters**

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `status` | string | No | all | Filter by status: `PENDING`, `ACCEPTED`, `DECLINED` |

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
      "status": "PENDING",
      "createdAt": "2024-06-20 14:30:00",
      "closedAt": null
    }
  ]
}
```

### **Error Responses**

| Status | Code | When |
|--------|------|------|
| 401 | `UNAUTHENTICATED` | Missing or invalid token |
| 403 | `FORBIDDEN` | `{id}` doesn't match authenticated user |

---

## **Side Effects**

*None*

## **Idempotency**

* **Idempotent:** Yes
* **Retry-safe:** Yes

---

## **Related Endpoints**

* [GET /api/users/{id}/connection-requests/sent](./get-sent-requests.md) - Sent requests
* [POST /api/users/connection-requests/{requestId}/accept](./accept-connection.md) - Accept
* [POST /api/users/connection-requests/{requestId}/decline](./decline-connection.md) - Decline

## **Frontend Notes**

* Used in notifications or connection management UI
* Filter by `status=PENDING` to show actionable requests
* Show sender profile with accept/decline actions
* Badge count can use this with `status=PENDING`
