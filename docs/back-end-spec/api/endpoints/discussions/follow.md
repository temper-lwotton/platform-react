# **Endpoint: `POST /api/discussion/{id}/follow`**

### **Summary**

Follows a discussion to receive notifications on updates and new comments.

---

## **Authentication**

* **Required:** Yes
* **Scope:** Any authenticated user

## **Permissions**

* Any authenticated user can follow discussions they have access to
* User must have access to the discussion's space

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

**Status:** `200 OK`

```json
{
  "success": true,
  "message": "Now following discussion"
}
```

### **Error Responses**

| Status | Code | When |
|--------|------|------|
| 401 | `UNAUTHENTICATED` | Missing or invalid token |
| 403 | `ACCESS_DENIED` | Not a member of private space |
| 404 | `DISCUSSION_NOT_FOUND` | Discussion does not exist |
| 409 | `ALREADY_FOLLOWING` | User already follows this discussion |

---

## **Side Effects**

| Effect | Description |
|--------|-------------|
| `discussion.followed` event | Emitted for tracking |
| `followersCount` | Incremented |
| `isFollowing` | Set to true for this user |
| Notifications enabled | User receives updates on comments |

## **Idempotency**

* **Idempotent:** No (returns 409 on duplicate)
* **Retry-safe:** Safe (409 indicates already following)

---

## **Related Endpoints**

* [DELETE /api/discussion/{id}/unfollow](./unfollow.md) - Unfollow
* [GET /api/discussion/{id}](./get.md) - Check isFollowing

## **Frontend Notes**

* Used by follow button component
* Auto-follow when creating discussion
* Auto-follow when commenting (optional)
* Update `isFollowing` optimistically
