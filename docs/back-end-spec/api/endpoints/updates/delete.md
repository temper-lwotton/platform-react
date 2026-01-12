# **Endpoint: `DELETE /api/updates/{id}`**

### **Summary**

Deletes a status update. Only the author can delete.

---

## **Authentication**

* **Required:** Yes
* **Scope:** Update author only

## **Permissions**

* Must be the author of the update

---

## **Request**

### **Path Parameters**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `id` | string | Yes | Update ID |

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
| 403 | `NOT_AUTHOR` | Not the author |
| 404 | `UPDATE_NOT_FOUND` | Update does not exist |

---

## **Side Effects**

| Effect | Description |
|--------|-------------|
| Update removed | Removed from all feeds |
| Media cleaned up | Associated media may be deleted |
| User status cleared | If this was user's current status |
| `update.deleted` event | Emitted for tracking |

## **Idempotency**

* **Idempotent:** Yes (subsequent calls return 404)
* **Retry-safe:** Yes

---

## **Related Endpoints**

* [GET /api/updates](./list.md) - Verify removal
* [POST /api/updates](./create.md) - Create new update

## **Frontend Notes**

* Confirm before deletion
* Remove from local state immediately
* Clear user status if applicable
