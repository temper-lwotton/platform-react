# **Endpoint: `PUT /api/cms/posts/{id}`**

### **Summary**

Updates post metadata. Content changes should use the versions API.

---

## **Authentication**

* **Required:** Yes
* **Scope:** Post author or Editor/Admin

## **Permissions**

* Authors can update their own posts
* Editors/Admins can update any post in their spaces

---

## **Request**

### **Path Parameters**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `id` | number | Yes | Post ID |

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
  "title": "Updated Title",
  "slug": "updated-slug",
  "parent": 10,
  "menuOrder": 5,
  "featuredImage": "https://cdn.example.com/images/new-hero.jpg",
  "terms": [10, 20, 30]
}
```

#### **Validation Rules**

| Field | Rules |
|-------|-------|
| `title` | Max 200 characters |
| `slug` | Unique within post type |
| `parent` | Must be same post type, no circular refs |
| `menuOrder` | Integer |
| `featuredImage` | Valid URL |
| `terms` | Array of valid term IDs |

---

## **Response**

### **Success Response**

**Status:** `200 OK`

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Updated Title",
    "slug": "updated-slug",
    "parent": 10,
    "menuOrder": 5,
    "featuredImage": "https://cdn.example.com/images/new-hero.jpg",
    "updatedAt": "2024-06-20T15:00:00Z"
  }
}
```

### **Error Responses**

| Status | Code | When |
|--------|------|------|
| 400 | `DUPLICATE_SLUG` | Slug already exists |
| 400 | `CIRCULAR_PARENT` | Parent creates circular reference |
| 401 | `UNAUTHENTICATED` | Missing or invalid token |
| 403 | `NOT_AUTHOR` | Not author or editor |
| 404 | `POST_NOT_FOUND` | Post does not exist |
| 422 | `VALIDATION_ERROR` | Invalid input data |

---

## **Side Effects**

| Effect | Description |
|--------|-------------|
| `post.updated` event | Emitted for tracking |

## **Idempotency**

* **Idempotent:** Yes
* **Retry-safe:** Yes

---

## **Related Endpoints**

* [POST /api/cms/posts/{id}/versions](../versions/create.md) - Update content
* [DELETE /api/cms/posts/{id}](./delete.md) - Delete post

## **Frontend Notes**

* Use `postsAPI.update(id, data)` from `@/services/cms/api/posts`
* For content changes, create a new version instead
* Title/slug changes here affect the post, not version content
