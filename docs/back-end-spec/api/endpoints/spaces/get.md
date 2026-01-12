# **Endpoint: `GET /api/spaces/{id}`**

### **Summary**

Retrieves a single space's details including members, admins, and tags.

---

## **Authentication**

* **Required:** Yes
* **Scope:** Any authenticated user (for public spaces) or members (for private)

## **Permissions**

* Public spaces: Any authenticated user
* Private spaces: Members only

---

## **Request**

### **Path Parameters**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `id` | string | Yes | Space ID |

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
    "id": "1",
    "createdAt": "2024-01-10T09:00:00Z",
    "title": "AI & Machine Learning",
    "subtitle": "Exploring AI in transport",
    "description": "A space for discussing artificial intelligence applications in the transport industry. Join us to share insights, research, and practical implementations.",
    "isPublic": true,
    "admins": [
      {
        "id": "123",
        "email": "john@example.com",
        "profile": {
          "firstName": "John",
          "lastName": "Doe",
          "fullName": "John Doe",
          "photo": "https://cdn.example.com/photos/123.jpg"
        }
      }
    ],
    "members": [
      {
        "id": "456",
        "email": "jane@example.com",
        "profile": {
          "firstName": "Jane",
          "lastName": "Smith",
          "fullName": "Jane Smith",
          "photo": "https://cdn.example.com/photos/456.jpg"
        }
      },
      {
        "id": "789",
        "profile": {
          "fullName": "Bob Wilson",
          "photo": "https://cdn.example.com/photos/789.jpg"
        }
      }
    ],
    "tags": [
      { "id": 1, "name": "Technology" },
      { "id": 5, "name": "Innovation" }
    ]
  }
}
```

### **Error Responses**

| Status | Code | When |
|--------|------|------|
| 401 | `UNAUTHENTICATED` | Missing or invalid token |
| 403 | `ACCESS_DENIED` | Not a member of private space |
| 404 | `SPACE_NOT_FOUND` | Space ID does not exist |

---

## **Side Effects**

*None*

## **Idempotency**

* **Idempotent:** Yes
* **Retry-safe:** Yes

---

## **Related Endpoints**

* [GET /api/spaces](./list.md) - List all spaces
* [GET /api/spaces/{id}/discussions](../discussions/list-by-space.md) - Space discussions

## **Frontend Notes**

* Used on `/spaces/[id]` detail page
* Members list may be large - consider client-side pagination
* Email may be hidden for some members (privacy settings)
* Cache with medium TTL (5min)
* Check `isPublic` to show appropriate UI for join/request access
