# **Endpoint: `GET /api/discussion/{id}/comments`**

### **Summary**

Retrieves all comments for a discussion in nested/threaded format.

---

## **Authentication**

* **Required:** Yes
* **Scope:** Any authenticated user

## **Permissions**

* Any authenticated user can view comments
* Respects space access (private space restrictions)

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
  "data": [
    {
      "id": "1",
      "createdAt": "2024-06-16T10:00:00Z",
      "content": "Great insights! I've found similar results in our team.",
      "level": 0,
      "author": {
        "id": "456",
        "profile": {
          "fullName": "Jane Smith",
          "photo": "https://cdn.example.com/photos/456.jpg"
        }
      },
      "__children": [
        {
          "id": "2",
          "createdAt": "2024-06-16T11:30:00Z",
          "content": "Thanks Jane! What specific practices worked best?",
          "level": 1,
          "author": {
            "id": "123",
            "profile": {
              "fullName": "John Doe",
              "photo": "https://cdn.example.com/photos/123.jpg"
            }
          },
          "__children": []
        }
      ]
    },
    {
      "id": "3",
      "createdAt": "2024-06-16T14:00:00Z",
      "content": "Would love to see some case studies on this topic.",
      "level": 0,
      "author": {
        "id": "789",
        "profile": {
          "fullName": "Bob Wilson",
          "photo": "https://cdn.example.com/photos/789.jpg"
        }
      },
      "__children": []
    }
  ]
}
```

### **Error Responses**

| Status | Code | When |
|--------|------|------|
| 401 | `UNAUTHENTICATED` | Missing or invalid token |
| 403 | `ACCESS_DENIED` | Not a member of private space |
| 404 | `DISCUSSION_NOT_FOUND` | Discussion does not exist |

---

## **Side Effects**

*None*

## **Idempotency**

* **Idempotent:** Yes
* **Retry-safe:** Yes

## **Pagination**

* **Not paginated** - Returns full nested tree
* May need pagination for discussions with many comments

---

## **Related Endpoints**

* [POST /api/discussion/comments](./create-comment.md) - Create comment
* [GET /api/discussion/{id}](./get.md) - Discussion with commentsCount

## **Frontend Notes**

* Transform `__children` to `replies` for consistency:

```typescript
function transformComments(comments) {
  return comments.map(c => ({
    ...c,
    replies: c.__children ? transformComments(c.__children) : []
  }));
}
```

* `level` indicates nesting depth (0 = top-level)
* Render recursively with indentation
* Order: top-level by newest first, replies by oldest first
