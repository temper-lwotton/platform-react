# **Endpoint: `DELETE /api/users/{id}`**

### **Summary**

Deletes a user account. Admin only.

---

## **Authentication**

* **Required:** Yes
* **Scope:** Admin users only

## **Permissions**

* Only administrators can delete user accounts
* Users cannot delete their own account via API (use account settings)

---

## **Request**

### **Path Parameters**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `id` | string | Yes | User ID to delete |

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
| 403 | `FORBIDDEN` | Non-admin user |
| 404 | `USER_NOT_FOUND` | User ID does not exist |

---

## **Side Effects**

| Effect | Description |
|--------|-------------|
| `user.deleted` event | Emitted for audit logging |
| Connections removed | All user connections are removed |
| Content anonymized | User's content attributed to "Deleted User" |
| Sessions invalidated | All active sessions terminated |
| Notifications cleared | Pending notifications removed |

## **Idempotency**

* **Idempotent:** Yes (subsequent calls return 404)
* **Retry-safe:** Yes

---

## **Related Endpoints**

* [GET /api/users/{id}](./get.md) - Get user
* [POST /api/users](./create.md) - Create user
* [PATCH /api/users/{id}](./update.md) - Update user

## **Frontend Notes**

* Used in admin user management interface
* Requires confirmation dialog before deletion
* Content is anonymized, not deleted - inform admin of this behavior
* Deletion is permanent and cannot be undone
