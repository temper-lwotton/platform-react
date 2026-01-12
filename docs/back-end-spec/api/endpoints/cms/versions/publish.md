# **Endpoint: `POST /api/cms/posts/{id}/publish/{vid}`**

### **Summary**

Publishes a specific version, making it the live content.

---

## **Authentication**

* **Required:** Yes
* **Scope:** Editor or Admin

## **Permissions**

* Must have Editor or Admin role
* Authors cannot publish their own content (requires approval)

---

## **Request**

### **Path Parameters**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `id` | number | Yes | Post ID |
| `vid` | number | Yes | Version ID to publish |

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
    "postId": 1,
    "publishedVersionId": 8,
    "publishedAt": "2024-06-20T16:00:00Z",
    "previousPublishedVersionId": 5
  }
}
```

### **Error Responses**

| Status | Code | When |
|--------|------|------|
| 401 | `UNAUTHENTICATED` | Missing or invalid token |
| 403 | `INSUFFICIENT_ROLE` | Not Editor or Admin |
| 404 | `POST_NOT_FOUND` | Post does not exist |
| 404 | `VERSION_NOT_FOUND` | Version does not exist |

---

## **Side Effects**

| Effect | Description |
|--------|-------------|
| Post marked published | `isPublished` becomes true |
| Version marked published | Version's `publishedAt` set |
| Previous version unmarked | Old published version updated |
| `post.published` event | Emitted for tracking |

## **Idempotency**

* **Idempotent:** Yes
* **Retry-safe:** Yes

---

## **Related Endpoints**

* [POST /api/cms/posts/{id}/unpublish](./unpublish.md) - Unpublish
* [GET /api/cms/posts/{slug}/published](../posts/get-published.md) - View published

## **Frontend Notes**

* Use `versionsAPI.publish(postId, versionId)` from `@/services/cms/api/versions`
* Show confirmation before publishing
* Update UI to reflect published state
* Can publish any version, not just latest
