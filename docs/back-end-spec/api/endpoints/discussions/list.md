# **Endpoint: `GET /api/discussion`**

### **Summary**

Retrieves a paginated list of all discussions accessible to the authenticated user.

---

## **Authentication**

* **Required:** Yes
* **Scope:** Any authenticated user

## **Permissions**

* Returns discussions from spaces the user has access to
* Private space discussions only visible to members

---

## **Request**

### **Path Parameters**

*None*

### **Query Parameters**

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `limit` | integer | No | 20 | Number of results |
| `offset` | integer | No | 0 | Skip first N results |

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
      "id": "1",
      "createdAt": "2024-06-15T10:30:00Z",
      "title": "Best practices for remote collaboration",
      "excerpt": "Exploring effective strategies for distributed teams...",
      "author": {
        "id": "123",
        "profile": {
          "fullName": "John Doe",
          "photo": "https://cdn.example.com/photos/123.jpg"
        }
      },
      "space": {
        "id": "5",
        "title": "Operations Excellence"
      },
      "tags": [
        { "id": 1, "name": "Remote Work" }
      ],
      "likesCount": 15,
      "commentsCount": 8,
      "isPinned": false,
      "isLiked": false,
      "isFollowing": true
    }
  ]
}
```

### **Error Responses**

| Status | Code | When |
|--------|------|------|
| 401 | `UNAUTHENTICATED` | Missing or invalid token |

---

## **Side Effects**

*None*

## **Idempotency**

* **Idempotent:** Yes
* **Retry-safe:** Yes

## **Pagination**

* **Strategy:** Offset-based
* **Parameters:** `offset`, `limit`
* **Default limit:** 20

---

## **Related Endpoints**

* [GET /api/spaces/{spaceId}/discussions](./list-by-space.md) - Space-specific list
* [GET /api/discussion/{id}](./get.md) - Get single discussion

## **Frontend Notes**

* Used on main feed page
* Ordered by most recent (newest first)
* `isLiked` and `isFollowing` are for authenticated user
* Implement infinite scroll with offset pagination
