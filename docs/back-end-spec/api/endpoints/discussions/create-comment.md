# **Endpoint: `POST /api/discussion/comments`**

### **Summary**

Creates a new comment on a discussion. Supports nested replies via parent parameter.

---

## **Authentication**

* **Required:** Yes
* **Scope:** Any authenticated user

## **Permissions**

* Any authenticated user can comment on discussions they have access to
* User must have access to the discussion's space

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
  "content": "Great insights! I've experienced the same in my team.",
  "author": 456,
  "discussion": 1,
  "parent": null
}
```

For a reply to another comment:

```json
{
  "content": "Thanks for your feedback!",
  "author": 123,
  "discussion": 1,
  "parent": 5
}
```

#### **Validation Rules**

| Field | Rules |
|-------|-------|
| `content` | Required, non-empty, max 5000 characters |
| `author` | Required, numeric user ID |
| `discussion` | Required, numeric discussion ID |
| `parent` | Optional, numeric comment ID for replies |

---

## **Response**

### **Success Response**

**Status:** `201 Created`

```json
{
  "success": true,
  "data": {
    "id": "10",
    "createdAt": "2024-06-20T14:30:00Z",
    "content": "Great insights! I've experienced the same in my team.",
    "level": 0,
    "author": {
      "id": "456",
      "profile": {
        "fullName": "Jane Smith",
        "photo": "https://cdn.example.com/photos/456.jpg"
      }
    }
  },
  "message": "Comment created"
}
```

### **Error Responses**

| Status | Code | When |
|--------|------|------|
| 401 | `UNAUTHENTICATED` | Missing or invalid token |
| 403 | `ACCESS_DENIED` | Not a member of private space |
| 404 | `DISCUSSION_NOT_FOUND` | Discussion does not exist |
| 404 | `COMMENT_NOT_FOUND` | Parent comment does not exist |
| 422 | `VALIDATION_ERROR` | Invalid input data |

---

## **Side Effects**

| Effect | Description |
|--------|-------------|
| `comment.created` event | Emitted for tracking |
| Notification | Sent to discussion author |
| Notification | Sent to discussion followers |
| Notification (reply) | Sent to parent comment author |
| `commentsCount` | Incremented on discussion |

## **Idempotency**

* **Idempotent:** No
* **Retry-safe:** No (creates duplicate)

---

## **Related Endpoints**

* [GET /api/discussion/{id}/comments](./get-comments.md) - Get comments
* [GET /api/discussion/{id}](./get.md) - Discussion detail

## **Frontend Notes**

* All IDs sent as numbers (not strings)
* `parent: null` for top-level comments
* `parent: commentId` for replies
* Consider auto-following discussion after commenting
* Append new comment to local state optimistically
* Refetch full comments after success for consistency
