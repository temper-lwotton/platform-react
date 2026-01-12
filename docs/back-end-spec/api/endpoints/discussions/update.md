# **Endpoint: `PATCH /api/discussion/{id}`**

### **Summary**

Updates an existing discussion. Only the author or space admin can update.

---

## **Authentication**

* **Required:** Yes
* **Scope:** Discussion author or space admin

## **Permissions**

* Discussion author can update their own discussions
* Space admins can update any discussion in their space

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
| `Content-Type` | Yes | `application/json` |

### **Request Body**

Partial update - only include fields to change:

```json
{
  "title": "Updated title",
  "excerpt": "Updated excerpt...",
  "htmlContent": "<p>Updated content...</p>",
  "tags": [1, 2, 4]
}
```

#### **Validation Rules**

| Field | Rules |
|-------|-------|
| `title` | Max 200 characters |
| `excerpt` | 30-200 characters |
| `htmlContent` | Non-empty if provided |
| `tags` | Array of valid tag IDs |

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
    "updatedAt": "2024-06-20T14:30:00Z",
    "title": "Updated title",
    "excerpt": "Updated excerpt...",
    "htmlContent": "<p>Updated content...</p>",
    "author": {
      "id": "123",
      "profile": { "fullName": "John Doe" }
    },
    "space": {
      "id": "5",
      "title": "Operations Excellence"
    },
    "tags": [
      { "id": 1, "name": "Remote Work" },
      { "id": 2, "name": "Innovation" },
      { "id": 4, "name": "Best Practices" }
    ]
  },
  "message": "Discussion updated"
}
```

### **Error Responses**

| Status | Code | When |
|--------|------|------|
| 401 | `UNAUTHENTICATED` | Missing or invalid token |
| 403 | `NOT_AUTHOR` | Not author and not space admin |
| 404 | `DISCUSSION_NOT_FOUND` | Discussion does not exist |
| 422 | `VALIDATION_ERROR` | Invalid input data |

---

## **Side Effects**

| Effect | Description |
|--------|-------------|
| `discussion.updated` event | Emitted for tracking |
| `updatedAt` | Automatically set to current time |
| Notifications | May notify followers of edits |

## **Idempotency**

* **Idempotent:** Yes
* **Retry-safe:** Yes

---

## **Related Endpoints**

* [GET /api/discussion/{id}](./get.md) - Get current state
* [DELETE /api/discussion/{id}](./delete.md) - Delete discussion

## **Frontend Notes**

* Used by discussion edit page
* Only send changed fields
* Check `updatedAt` to detect concurrent edits
* Invalidate cache after update
