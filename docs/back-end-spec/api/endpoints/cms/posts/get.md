# **Endpoint: `GET /api/cms/posts/{id}`**

### **Summary**

Retrieves a single post by ID with optional metadata and version info.

---

## **Authentication**

* **Required:** Yes
* **Scope:** CMS users with read access

## **Permissions**

* User must have access to the post's space
* Admins/Editors can access all posts
* Authors can access their own posts

---

## **Request**

### **Path Parameters**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `id` | number | Yes | Post ID |

### **Query Parameters**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `includeMeta` | boolean | No | Include custom meta fields |
| `includeVersions` | boolean | No | Include version list |

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
    "id": 1,
    "title": "Getting Started Guide",
    "slug": "getting-started-guide",
    "postType": {
      "id": 1,
      "name": "article",
      "singularLabel": "Article"
    },
    "author": {
      "id": 123,
      "name": "John Doe",
      "email": "john@example.com"
    },
    "space": 5,
    "parent": null,
    "menuOrder": 0,
    "featuredImage": "https://cdn.example.com/images/hero.jpg",
    "publishedVersion": {
      "id": 5,
      "versionNumber": 3
    },
    "latestVersion": {
      "id": 7,
      "versionNumber": 5
    },
    "publishedAt": "2024-06-15T10:00:00Z",
    "lastModifiedAt": "2024-06-20T14:30:00Z",
    "createdAt": "2024-06-10T09:00:00Z",
    "updatedAt": "2024-06-20T14:30:00Z",
    "archivedAt": null,
    "isPublished": true,
    "isDraft": false,
    "hasUnpublishedChanges": true,
    "terms": [
      {
        "id": 10,
        "name": "Tutorial",
        "slug": "tutorial",
        "taxonomy": { "id": 1, "name": "category" }
      }
    ]
  }
}
```

### **Error Responses**

| Status | Code | When |
|--------|------|------|
| 401 | `UNAUTHENTICATED` | Missing or invalid token |
| 403 | `ACCESS_DENIED` | No access to post |
| 404 | `POST_NOT_FOUND` | Post does not exist |

---

## **Side Effects**

*None*

## **Idempotency**

* **Idempotent:** Yes
* **Retry-safe:** Yes

---

## **Related Endpoints**

* [GET /api/cms/posts/{id}/versions](../versions/list.md) - List versions
* [PUT /api/cms/posts/{id}](./update.md) - Update post

## **Frontend Notes**

* Use `postsAPI.get(id, options)` from `@/services/cms/api/posts`
* `hasUnpublishedChanges` indicates edits since last publish
* Load versions separately for editor view
