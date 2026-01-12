# **Endpoint: `POST /api/cms/posts`**

### **Summary**

Creates a new post with initial content. Post is created as a draft.

---

## **Authentication**

* **Required:** Yes
* **Scope:** CMS users with create permission

## **Permissions**

* User must have Author role or higher
* Must be a member of the target space (if specified)

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
  "postType": 1,
  "title": "Getting Started Guide",
  "slug": "getting-started-guide",
  "space": 5,
  "parent": null,
  "menuOrder": 0,
  "featuredImage": "https://cdn.example.com/images/hero.jpg",
  "contentJson": {
    "root": {
      "children": [
        {
          "type": "paragraph",
          "children": [{ "type": "text", "text": "Welcome to our guide." }]
        }
      ],
      "direction": "ltr",
      "format": "",
      "indent": 0,
      "type": "root",
      "version": 1
    }
  },
  "excerpt": "A comprehensive guide to getting started.",
  "meta": {
    "customField": "value"
  },
  "terms": [10, 15]
}
```

#### **Validation Rules**

| Field | Rules |
|-------|-------|
| `postType` | Required, valid post type ID |
| `title` | Required, max 200 characters |
| `slug` | Optional, auto-generated if not provided |
| `space` | Optional, valid space ID |
| `contentJson` | Required, valid Lexical editor state |
| `terms` | Optional, array of valid term IDs |

---

## **Response**

### **Success Response**

**Status:** `201 Created`

```json
{
  "success": true,
  "data": {
    "id": 42,
    "title": "Getting Started Guide",
    "slug": "getting-started-guide",
    "postType": {
      "id": 1,
      "name": "article",
      "singularLabel": "Article"
    },
    "author": {
      "id": 123,
      "name": "John Doe"
    },
    "isPublished": false,
    "isDraft": true,
    "createdAt": "2024-06-20T14:30:00Z"
  }
}
```

### **Error Responses**

| Status | Code | When |
|--------|------|------|
| 400 | `DUPLICATE_SLUG` | Slug already exists for post type |
| 401 | `UNAUTHENTICATED` | Missing or invalid token |
| 403 | `NOT_SPACE_MEMBER` | Not a member of target space |
| 404 | `POST_TYPE_NOT_FOUND` | Invalid post type ID |
| 422 | `VALIDATION_ERROR` | Invalid input data |

---

## **Side Effects**

| Effect | Description |
|--------|-------------|
| Initial version created | First version saved automatically |
| `post.created` event | Emitted for tracking |

## **Idempotency**

* **Idempotent:** No
* **Retry-safe:** No (creates duplicates)

---

## **Related Endpoints**

* [POST /api/cms/posts/{id}/versions](../versions/create.md) - Save new version
* [POST /api/cms/posts/{id}/publish/{vid}](../versions/publish.md) - Publish

## **Frontend Notes**

* Use `postsAPI.create(data)` from `@/services/cms/api/posts`
* Posts start as drafts, must publish explicitly
* Redirect to editor after creation
* Slug auto-generated from title if not provided
