# **Endpoint: `POST /api/cms/posts/{id}/versions`**

### **Summary**

Creates a new version (save) for a post.

---

## **Authentication**

* **Required:** Yes
* **Scope:** Post author or Editor/Admin

## **Permissions**

* User must have edit access to the post

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

```json
{
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
  "excerpt": "A comprehensive guide to getting started",
  "featuredImage": "https://cdn.example.com/images/hero.jpg",
  "versionLabel": "v1.1",
  "changeDescription": "Added troubleshooting section"
}
```

#### **Validation Rules**

| Field | Rules |
|-------|-------|
| `title` | Required, max 200 characters |
| `contentJson` | Required, valid Lexical editor state |
| `excerpt` | Optional, max 500 characters |
| `featuredImage` | Optional, valid URL |
| `versionLabel` | Optional, max 50 characters |
| `changeDescription` | Optional, max 500 characters |

---

## **Response**

### **Success Response**

**Status:** `201 Created`

```json
{
  "success": true,
  "data": {
    "id": 8,
    "versionNumber": 6,
    "versionLabel": "v1.1",
    "title": "Getting Started Guide",
    "author": {
      "id": 123,
      "name": "John Doe"
    },
    "createdAt": "2024-06-20T15:00:00Z",
    "isPublished": false,
    "isAutosave": false,
    "changeDescription": "Added troubleshooting section"
  }
}
```

### **Error Responses**

| Status | Code | When |
|--------|------|------|
| 401 | `UNAUTHENTICATED` | Missing or invalid token |
| 403 | `NOT_AUTHOR` | Not author or editor |
| 404 | `POST_NOT_FOUND` | Post does not exist |
| 422 | `VALIDATION_ERROR` | Invalid input data |

---

## **Side Effects**

| Effect | Description |
|--------|-------------|
| Version created | New version number assigned |
| Autosave cleared | Previous autosave replaced |
| `version.created` event | Emitted for tracking |

## **Idempotency**

* **Idempotent:** No
* **Retry-safe:** No (creates multiple versions)

---

## **Related Endpoints**

* [POST /api/cms/posts/{id}/autosave](./autosave.md) - Autosave
* [POST /api/cms/posts/{id}/publish/{vid}](./publish.md) - Publish

## **Frontend Notes**

* Use `versionsAPI.create(postId, data)` from `@/services/cms/api/versions`
* Create version on explicit "Save" action
* Use autosave endpoint for background saving
* Consider debouncing rapid saves
