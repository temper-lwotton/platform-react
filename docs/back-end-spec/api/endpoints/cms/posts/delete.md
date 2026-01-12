# **Endpoint: `DELETE /api/cms/posts/{id}`**

### **Summary**

Deletes a post. By default, archives (soft-delete). Can permanently delete with flag.

---

## **Authentication**

* **Required:** Yes
* **Scope:** Post author or Editor/Admin

## **Permissions**

* Authors can delete their own posts
* Editors/Admins can delete any post in their spaces
* Permanent deletion may require Admin role

---

## **Request**

### **Path Parameters**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `id` | number | Yes | Post ID |

### **Query Parameters**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `permanent` | boolean | No | Permanently delete (default: false) |

### **Headers**

| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Yes | `Bearer <token>` |

### **Request Body**

*None*

---

## **Response**

### **Success Response**

**Status:** `200 OK` (archive) or `204 No Content` (permanent)

Archive response:
```json
{
  "success": true,
  "message": "Post archived"
}
```

### **Error Responses**

| Status | Code | When |
|--------|------|------|
| 401 | `UNAUTHENTICATED` | Missing or invalid token |
| 403 | `NOT_AUTHOR` | Not author or editor |
| 403 | `PERMANENT_DELETE_NOT_ALLOWED` | Only admins can permanently delete |
| 404 | `POST_NOT_FOUND` | Post does not exist |

---

## **Side Effects**

| Effect | Description |
|--------|-------------|
| Post archived/deleted | Removed from listings |
| `post.archived` or `post.deleted` | Event emitted |
| Versions removed | On permanent delete |

## **Idempotency**

* **Idempotent:** Yes
* **Retry-safe:** Yes

---

## **Related Endpoints**

* [GET /api/cms/posts](./list.md) - List posts (with archived filter)
* [PUT /api/cms/posts/{id}](./update.md) - Restore by un-archiving

## **Frontend Notes**

* Use `postsAPI.delete(id, permanent)` from `@/services/cms/api/posts`
* Default behavior is archive (reversible)
* Confirm before permanent deletion
* Archived posts can be restored via update
