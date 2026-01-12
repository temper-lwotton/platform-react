# **Endpoint: `GET /api/users/{id}/connection-requests/sent`**

### **Summary**

Retrieves connection requests sent by the specified user.

---

## **Authentication**

* **Required:** Yes
* **Scope:** User themselves only

## **Permissions**

* Users can only view their own sent requests
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
      "id": 790,
      "sender": {
        "id": 123,
        "name": "John Doe",
        "email": "john@example.com",
        "photo": "https://cdn.example.com/photos/123.jpg"
      },
      "recipient": {
        "id": 789,
        "name": "Bob Wilson",
        "email": "bob@example.com",
        "photo": "https://cdn.example.com/photos/789.jpg"
      },
      "status": "PENDING",
      "createdAt": "2024-06-19 10:00:00",
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

* [GET /api/users/{id}/connection-requests/received](./get-received-requests.md) - Received requests
* [POST /api/users/{id}/connection-requests/{recipientId}](./send-connection-request.md) - Send request

## **Frontend Notes**

* Used to show pending outgoing requests
* Helps determine `connectionStatus` for user cards
* Filter by `status=PENDING` to identify awaiting responses
* Can be used to allow canceling pending requests (future)
