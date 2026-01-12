# **Endpoint: `GET /api/cms/posts/{id}/versions/{vid}`**

### **Summary**

Retrieves a specific version with full content.

---

## **Authentication**

* **Required:** Yes
* **Scope:** CMS users with post access

## **Permissions**

* User must have access to the post

---

## **Request**

### **Path Parameters**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `id` | number | Yes | Post ID |
| `vid` | number | Yes | Version ID |

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
    "id": 5,
    "versionNumber": 3,
    "versionLabel": "v1.0",
    "title": "Getting Started Guide",
    "contentJson": {
      "root": {
        "children": [...],
        "direction": "ltr",
        "format": "",
        "indent": 0,
        "type": "root",
        "version": 1
      }
    },
    "contentHtml": "<h1>Getting Started</h1><p>Welcome...</p>",
    "excerpt": "A comprehensive guide",
    "featuredImage": "https://cdn.example.com/images/hero.jpg",
    "author": {
      "id": 123,
      "name": "John Doe",
      "email": "john@example.com"
    },
    "isPublished": true,
    "isAutosave": false,
    "createdAt": "2024-06-15T10:00:00Z",
    "publishedAt": "2024-06-15T10:00:00Z",
    "changeDescription": "Initial publish",
    "termsSnapshot": [
      {
        "id": 10,
        "name": "Tutorial",
        "slug": "tutorial"
      }
    ],
    "isLatest": false
  }
}
```

### **Error Responses**

| Status | Code | When |
|--------|------|------|
| 401 | `UNAUTHENTICATED` | Missing or invalid token |
| 403 | `ACCESS_DENIED` | No access to post |
| 404 | `POST_NOT_FOUND` | Post does not exist |
| 404 | `VERSION_NOT_FOUND` | Version does not exist |

---

## **Side Effects**

*None*

## **Idempotency**

* **Idempotent:** Yes
* **Retry-safe:** Yes

---

## **Related Endpoints**

* [PUT /api/cms/posts/{id}/versions/{vid}/restore](./restore.md) - Restore version
* [POST /api/cms/posts/{id}/publish/{vid}](./publish.md) - Publish version

## **Frontend Notes**

* Use `versionsAPI.get(postId, versionId)` from `@/services/cms/api/versions`
* `contentJson` for loading into editor
* `contentHtml` for preview display
* `termsSnapshot` shows terms at time of version creation
