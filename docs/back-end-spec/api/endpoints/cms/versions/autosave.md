# **Endpoint: `POST /api/cms/posts/{id}/autosave`**

### **Summary**

Creates an autosave version. Autosaves are temporary and replaced by the next save.

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
  "excerpt": "A comprehensive guide"
}
```

#### **Validation Rules**

| Field | Rules |
|-------|-------|
| `title` | Required, max 200 characters |
| `contentJson` | Required, valid Lexical editor state |
| `excerpt` | Optional, max 500 characters |

---

## **Response**

### **Success Response**

**Status:** `200 OK`

```json
{
  "success": true,
  "data": {
    "id": 100,
    "versionNumber": 6,
    "title": "Getting Started Guide",
    "createdAt": "2024-06-20T15:05:00Z",
    "isAutosave": true
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
| Autosave created/updated | Replaces previous autosave |
| No version increment | Doesn't count as real version |

## **Idempotency**

* **Idempotent:** Yes (replaces previous)
* **Retry-safe:** Yes

---

## **Related Endpoints**

* [POST /api/cms/posts/{id}/versions](./create.md) - Create real version
* [GET /api/cms/posts/{id}/versions](./list.md) - List versions

## **Frontend Notes**

* Use `versionsAPI.autosave(postId, data)` from `@/services/cms/api/versions`
* Call every 30-60 seconds while editing
* Autosaves are not shown in version history by default
* Recovered on browser crash or session restore
