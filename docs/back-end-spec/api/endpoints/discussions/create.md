# **Endpoint: `POST /api/discussion`**

### **Summary**

Creates a new discussion in a space.

---

## **Authentication**

* **Required:** Yes
* **Scope:** Space members

## **Permissions**

* User must be a member of the target space
* Author ID must match authenticated user

---

## **Request**

### **Path Parameters**

*None*

### **Query Parameters**

*None*

### **Headers**

| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Yes | `Bearer <token>` |
| `Content-Type` | Yes | `application/json` |

### **Request Body**

```json
{
  "title": "Best practices for remote collaboration",
  "excerpt": "Exploring effective strategies for distributed teams...",
  "htmlContent": "<p>In today's distributed work environment...</p>",
  "author": 123,
  "space": 5,
  "tags": [1, 3]
}
```

#### **Validation Rules**

| Field | Rules |
|-------|-------|
| `title` | Required, max 200 characters |
| `excerpt` | Required, 30-200 characters |
| `htmlContent` | Required, non-empty |
| `author` | Required, numeric user ID |
| `space` | Required, numeric space ID |
| `tags` | Optional, array of tag IDs |

---

## **Response**

### **Success Response**

**Status:** `201 Created`

```json
{
  "success": true,
  "data": {
    "id": "42",
    "createdAt": "2024-06-20T14:30:00Z",
    "title": "Best practices for remote collaboration",
    "excerpt": "Exploring effective strategies for distributed teams...",
    "htmlContent": "<p>In today's distributed work environment...</p>",
    "author": {
      "id": "123",
      "profile": {
        "fullName": "John Doe"
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
    "likesCount": 0,
    "commentsCount": 0,
    "isPinned": false,
    "isLiked": false,
    "isFollowing": false
  },
  "message": "Discussion created"
}
```

### **Error Responses**

| Status | Code | When |
|--------|------|------|
| 401 | `UNAUTHENTICATED` | Missing or invalid token |
| 403 | `NOT_SPACE_MEMBER` | User not a member of target space |
| 404 | `SPACE_NOT_FOUND` | Space ID does not exist |
| 422 | `VALIDATION_ERROR` | Invalid input data |

---

## **Side Effects**

| Effect | Description |
|--------|-------------|
| `discussion.created` event | Emitted for activity tracking |
| Notifications | Sent to space followers |

## **Idempotency**

* **Idempotent:** No
* **Retry-safe:** No (creates duplicate)

---

## **Related Endpoints**

* [GET /api/discussion/{id}](./get.md) - View created discussion
* [PATCH /api/discussion/{id}](./update.md) - Update discussion

## **Frontend Notes**

* Used by `/posts/new` page after AI enhancement
* `author` and `space` are numeric IDs
* Redirect to discussion detail after success
* Auto-follow created discussion for notifications
