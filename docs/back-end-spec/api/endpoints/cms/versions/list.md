# **Endpoint: `GET /api/cms/posts/{id}/versions`**

### **Summary**

Lists all versions for a post, ordered by version number.

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
      "id": 7,
      "versionNumber": 5,
      "versionLabel": null,
      "title": "Getting Started Guide",
      "author": {
        "id": 123,
        "name": "John Doe"
      },
      "createdAt": "2024-06-20T14:30:00Z",
      "publishedAt": null,
      "isPublished": false,
      "isLatest": true,
      "isAutosave": false,
      "changeDescription": "Added new section"
    },
    {
      "id": 5,
      "versionNumber": 3,
      "versionLabel": "v1.0",
      "title": "Getting Started Guide",
      "author": {
        "id": 123,
        "name": "John Doe"
      },
      "createdAt": "2024-06-15T10:00:00Z",
      "publishedAt": "2024-06-15T10:00:00Z",
      "isPublished": true,
      "isLatest": false,
      "isAutosave": false
    }
  ]
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

* [GET /api/cms/posts/{id}/versions/{vid}](./get.md) - Get version detail
* [GET /api/cms/posts/{id}/versions/compare](./compare.md) - Compare versions

## **Frontend Notes**

* Use `versionsAPI.list(postId)` from `@/services/cms/api/versions`
* Show published version indicator
* Highlight latest version
* Filter out autosaves for version history display
