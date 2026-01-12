# **Endpoint: `POST /api/cms/posts/{id}/unpublish`**

### **Summary**

Unpublishes a post, removing it from public view.

---

## **Authentication**

* **Required:** Yes
* **Scope:** Editor or Admin

## **Permissions**

* Must have Editor or Admin role

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
  "message": "Post unpublished"
}
```

### **Error Responses**

| Status | Code | When |
|--------|------|------|
| 400 | `NOT_PUBLISHED` | Post is not currently published |
| 401 | `UNAUTHENTICATED` | Missing or invalid token |
| 403 | `INSUFFICIENT_ROLE` | Not Editor or Admin |
| 404 | `POST_NOT_FOUND` | Post does not exist |

---

## **Side Effects**

| Effect | Description |
|--------|-------------|
| Post marked unpublished | `isPublished` becomes false |
| Removed from public | No longer accessible via slug |
| `post.unpublished` event | Emitted for tracking |

## **Idempotency**

* **Idempotent:** No (fails if already unpublished)
* **Retry-safe:** Yes (safe to retry on network error)

---

## **Related Endpoints**

* [POST /api/cms/posts/{id}/publish/{vid}](./publish.md) - Republish
* [GET /api/cms/posts/{id}](../posts/get.md) - Still accessible in admin

## **Frontend Notes**

* Use `versionsAPI.unpublish(postId)` from `@/services/cms/api/versions`
* Confirm before unpublishing
* Post remains editable, just not public
* Can republish any version later
