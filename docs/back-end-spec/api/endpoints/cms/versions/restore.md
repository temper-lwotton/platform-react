# **Endpoint: `PUT /api/cms/posts/{id}/versions/{vid}/restore`**

### **Summary**

Restores a previous version, making it the latest version.

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
| `vid` | number | Yes | Version ID to restore |

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
    "id": 9,
    "versionNumber": 7,
    "title": "Getting Started Guide",
    "author": {
      "id": 123,
      "name": "John Doe"
    },
    "createdAt": "2024-06-20T17:00:00Z",
    "isLatest": true,
    "changeDescription": "Restored from version 3"
  }
}
```

### **Error Responses**

| Status | Code | When |
|--------|------|------|
| 401 | `UNAUTHENTICATED` | Missing or invalid token |
| 403 | `NOT_AUTHOR` | Not author or editor |
| 404 | `POST_NOT_FOUND` | Post does not exist |
| 404 | `VERSION_NOT_FOUND` | Version does not exist |

---

## **Side Effects**

| Effect | Description |
|--------|-------------|
| New version created | Copy of restored version |
| Original preserved | Old version unchanged |
| `version.restored` event | Emitted for tracking |

## **Idempotency**

* **Idempotent:** No
* **Retry-safe:** No (creates multiple versions)

---

## **Related Endpoints**

* [GET /api/cms/posts/{id}/versions/{vid}](./get.md) - View version before restoring
* [POST /api/cms/posts/{id}/publish/{vid}](./publish.md) - Publish restored version

## **Frontend Notes**

* Use `versionsAPI.restore(postId, versionId)` from `@/services/cms/api/versions`
* Creates a new version as a copy
* Original version preserved in history
* Must publish separately if desired
