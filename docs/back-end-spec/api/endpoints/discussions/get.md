# **Endpoint: `GET /api/discussion/{id}`**

### **Summary**

Retrieves a single discussion with full content and metadata.

---

## **Authentication**

* **Required:** Yes
* **Scope:** Any authenticated user (respects space access)

## **Permissions**

* Public space discussions: Any authenticated user
* Private space discussions: Space members only

---

## **Request**

### **Path Parameters**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `id` | string | Yes | Discussion ID |

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
    "createdAt": "2024-06-15T10:30:00Z",
    "updatedAt": "2024-06-16T08:00:00Z",
    "title": "Best practices for remote collaboration",
    "excerpt": "Exploring effective strategies for distributed teams...",
    "htmlContent": "<p>In today's distributed work environment...</p>",
    "jsonContent": { "root": { "children": [...] } },
    "author": {
      "id": "123",
      "fullName": "John Doe",
      "profile": {
        "fullName": "John Doe",
        "firstName": "John",
        "lastName": "Doe",
        "photo": "https://cdn.example.com/photos/123.jpg"
      }
    },
    "space": {
      "id": "5",
      "title": "Operations Excellence"
    },
    "tags": [
      { "id": 1, "name": "Remote Work" },
      { "id": 3, "name": "Collaboration" }
    ],
    "likedBy": [
      { "id": 456, "name": "Jane Smith", "photo": "..." }
    ],
    "followedBy": [
      { "id": 789, "name": "Bob Wilson", "photo": "..." }
    ],
    "likesCount": 15,
    "commentsCount": 8,
    "followersCount": 5,
    "isPinned": false,
    "isLiked": false,
    "isFollowing": true
  }
}
```

### **Error Responses**

| Status | Code | When |
|--------|------|------|
| 401 | `UNAUTHENTICATED` | Missing or invalid token |
| 403 | `ACCESS_DENIED` | Not a member of private space |
| 404 | `DISCUSSION_NOT_FOUND` | Discussion ID does not exist |

---

## **Side Effects**

*None* (may increment view count in future)

## **Idempotency**

* **Idempotent:** Yes
* **Retry-safe:** Yes

---

## **Related Endpoints**

* [GET /api/discussion/{id}/comments](./get-comments.md) - Get comments
* [PATCH /api/discussion/{id}](./update.md) - Update discussion

## **Frontend Notes**

* Used on discussion detail page
* `htmlContent` for rendering, `jsonContent` for editor
* `isLiked` and `isFollowing` for current user
* Fetch comments separately via comments endpoint
