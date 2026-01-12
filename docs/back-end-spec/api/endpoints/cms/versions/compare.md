# **Endpoint: `GET /api/cms/posts/{id}/versions/compare`**

### **Summary**

Compares two versions side-by-side.

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

### **Query Parameters**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `v1` | number | Yes | First version ID |
| `v2` | number | Yes | Second version ID |

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
    "version1": {
      "id": 5,
      "versionNumber": 3,
      "title": "Getting Started Guide",
      "contentJson": {...},
      "contentHtml": "<h1>Getting Started</h1>...",
      "author": { "id": 123, "name": "John Doe" },
      "createdAt": "2024-06-15T10:00:00Z"
    },
    "version2": {
      "id": 8,
      "versionNumber": 6,
      "title": "Getting Started Guide - Updated",
      "contentJson": {...},
      "contentHtml": "<h1>Getting Started</h1>...",
      "author": { "id": 123, "name": "John Doe" },
      "createdAt": "2024-06-20T15:00:00Z"
    }
  }
}
```

### **Error Responses**

| Status | Code | When |
|--------|------|------|
| 400 | `SAME_VERSION` | v1 and v2 are the same |
| 401 | `UNAUTHENTICATED` | Missing or invalid token |
| 403 | `ACCESS_DENIED` | No access to post |
| 404 | `POST_NOT_FOUND` | Post does not exist |
| 404 | `VERSION_NOT_FOUND` | One or both versions don't exist |

---

## **Side Effects**

*None*

## **Idempotency**

* **Idempotent:** Yes
* **Retry-safe:** Yes

---

## **Related Endpoints**

* [GET /api/cms/posts/{id}/versions](./list.md) - List versions
* [PUT /api/cms/posts/{id}/versions/{vid}/restore](./restore.md) - Restore version

## **Frontend Notes**

* Use `versionsAPI.compare(postId, v1, v2)` from `@/services/cms/api/versions`
* Implement diff visualization on frontend
* Compare `contentHtml` for visual diff
* Show metadata changes (title, author, date)
