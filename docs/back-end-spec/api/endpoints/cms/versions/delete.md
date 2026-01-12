# **Endpoint: `DELETE /api/cms/posts/{id}/versions/{vid}`**

### **Summary**

Deletes a specific version. Cannot delete published or only version.

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

**Status:** `204 No Content`

*No response body*

### **Error Responses**

| Status | Code | When |
|--------|------|------|
| 400 | `CANNOT_DELETE_PUBLISHED` | Version is currently published |
| 400 | `CANNOT_DELETE_ONLY_VERSION` | Post only has one version |
| 401 | `UNAUTHENTICATED` | Missing or invalid token |
| 403 | `INSUFFICIENT_ROLE` | Not Editor or Admin |
| 404 | `POST_NOT_FOUND` | Post does not exist |
| 404 | `VERSION_NOT_FOUND` | Version does not exist |

---

## **Side Effects**

| Effect | Description |
|--------|-------------|
| Version removed | Permanently deleted |
| `version.deleted` event | Emitted for tracking |

## **Idempotency**

* **Idempotent:** Yes (subsequent calls return 404)
* **Retry-safe:** Yes

---

## **Related Endpoints**

* [GET /api/cms/posts/{id}/versions](./list.md) - List versions
* [POST /api/cms/posts/{id}/unpublish](./unpublish.md) - Unpublish first

## **Frontend Notes**

* Use `versionsAPI.delete(postId, versionId)` from `@/services/cms/api/versions`
* Confirm before deletion
* Cannot delete published version - unpublish first
* Useful for cleaning up old drafts
