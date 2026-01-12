# **Endpoint: `DELETE /api/discussion/{id}`**

### **Summary**

Deletes a discussion. Only the author or space admin can delete.

---

## **Authentication**

* **Required:** Yes
* **Scope:** Discussion author or space admin

## **Permissions**

* Discussion author can delete their own discussions
* Space admins can delete any discussion in their space

---

## **Request**

### **Path Parameters**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `id` | string | Yes | Discussion ID |

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
| 401 | `UNAUTHENTICATED` | Missing or invalid token |
| 403 | `NOT_AUTHOR` | Not author and not space admin |
| 404 | `DISCUSSION_NOT_FOUND` | Discussion does not exist |

---

## **Side Effects**

| Effect | Description |
|--------|-------------|
| `discussion.deleted` event | Emitted for tracking |
| Comments deleted | All associated comments removed |
| Likes removed | All likes on discussion removed |
| Follows removed | All follows removed |

## **Idempotency**

* **Idempotent:** Yes (subsequent calls return 404)
* **Retry-safe:** Yes

---

## **Related Endpoints**

* [GET /api/discussion/{id}](./get.md) - Get discussion
* [GET /api/discussion](./list.md) - List discussions

## **Frontend Notes**

* Requires confirmation dialog
* Redirect to space discussions after deletion
* Invalidate all related caches
* Deletion is permanent
