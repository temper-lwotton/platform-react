# **Endpoint: `POST /api/cms/posts/{id}/duplicate`**

### **Summary**

Creates a copy of an existing post with a new slug.

---

## **Authentication**

* **Required:** Yes
* **Scope:** CMS users with create permission

## **Permissions**

* User must have access to the original post
* User must have Author role or higher

---

## **Request**

### **Path Parameters**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `id` | number | Yes | Post ID to duplicate |

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

**Status:** `201 Created`

```json
{
  "success": true,
  "data": {
    "id": 43,
    "title": "Getting Started Guide (Copy)",
    "slug": "getting-started-guide-copy",
    "postType": {
      "id": 1,
      "name": "article",
      "singularLabel": "Article"
    },
    "author": {
      "id": 456,
      "name": "Current User"
    },
    "isPublished": false,
    "isDraft": true,
    "createdAt": "2024-06-20T15:00:00Z"
  }
}
```

### **Error Responses**

| Status | Code | When |
|--------|------|------|
| 401 | `UNAUTHENTICATED` | Missing or invalid token |
| 403 | `ACCESS_DENIED` | No access to original post |
| 404 | `POST_NOT_FOUND` | Original post does not exist |

---

## **Side Effects**

| Effect | Description |
|--------|-------------|
| New post created | Copy of original with new ID |
| Initial version created | Latest version content copied |
| `post.duplicated` event | Emitted for tracking |

## **Idempotency**

* **Idempotent:** No
* **Retry-safe:** No (creates multiple copies)

---

## **Related Endpoints**

* [GET /api/cms/posts/{id}](./get.md) - Get duplicated post
* [POST /api/cms/posts](./create.md) - Create from scratch

## **Frontend Notes**

* Use `postsAPI.duplicate(id)` from `@/services/cms/api/posts`
* New post is assigned to current user as author
* Title appended with "(Copy)"
* Slug auto-generated with "-copy" suffix
* New post starts as draft (not published)
