# **Endpoint: `GET /api/users/{id}/connections`**

### **Summary**

Retrieves the list of users connected to the specified user (bi-directional, accepted connections).

---

## **Authentication**

* **Required:** Yes
* **Scope:** Any authenticated user

## **Permissions**

* Any authenticated user can view connection lists
* Privacy settings may restrict visibility (future enhancement)

---

## **Request**

### **Path Parameters**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `id` | string | Yes | User ID whose connections to retrieve |

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
  "data": [
    {
      "id": "456",
      "createdAt": "2024-02-10T08:00:00Z",
      "email": "jane@example.com",
      "profile": {
        "firstName": "Jane",
        "lastName": "Smith",
        "fullName": "Jane Smith",
        "companyName": "Tech Corp",
        "jobTitle": "CTO",
        "photo": "https://cdn.example.com/photos/456.jpg"
      },
      "adminSpaces": [],
      "memberSpaces": [
        { "id": "1", "title": "AI & Machine Learning" }
      ],
      "connectionStatus": "connected"
    }
  ]
}
```

### **Error Responses**

| Status | Code | When |
|--------|------|------|
| 401 | `UNAUTHENTICATED` | Missing or invalid token |
| 404 | `USER_NOT_FOUND` | User ID does not exist |

---

## **Side Effects**

*None*

## **Idempotency**

* **Idempotent:** Yes
* **Retry-safe:** Yes

## **Pagination**

* **Strategy:** Not paginated (returns full list)
* **Note:** May need pagination for power users with many connections

---

## **Related Endpoints**

* [POST /api/users/{id}/connection-requests/{recipientId}](./send-connection-request.md) - Send request
* [DELETE /api/users/{id}/connections/{connectionId}](./remove-connection.md) - Remove connection

## **Frontend Notes**

* Used on user profile "Connections" tab
* All returned users will have `connectionStatus: "connected"` relative to profile owner
* For authenticated user's perspective, re-compute `connectionStatus`
* Cache with short TTL (1min)
