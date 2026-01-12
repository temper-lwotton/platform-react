# **Endpoint: `DELETE /api/users/{id}/unfollows/{followeeId}`**

### **Summary**

Removes a one-way follow relationship. The user with `{id}` will stop following the user with `{followeeId}`.

---

## **Authentication**

* **Required:** Yes
* **Scope:** User themselves only

## **Permissions**

* Users can only remove their own follows
* `{id}` must match the authenticated user's ID

---

## **Request**

### **Path Parameters**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `id` | string | Yes | Follower user ID (must be authenticated user) |
| `followeeId` | string | Yes | User ID to unfollow |

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
  "message": "Unfollowed user"
}
```

### **Error Responses**

| Status | Code | When |
|--------|------|------|
| 400 | `NOT_FOLLOWING` | Not currently following this user |
| 401 | `UNAUTHENTICATED` | Missing or invalid token |
| 403 | `FORBIDDEN` | `{id}` doesn't match authenticated user |
| 404 | `USER_NOT_FOUND` | Followee user does not exist |

---

## **Side Effects**

| Effect | Description |
|--------|-------------|
| `user.unfollowed` event | Emitted for activity tracking |
| Feed update | Followee's content removed from follower's feed |

## **Idempotency**

* **Idempotent:** No (returns 400 on duplicate)
* **Retry-safe:** Safe (400 indicates success)

---

## **Related Endpoints**

* [POST /api/users/{id}/follows/{followeeId}](./follow.md) - Follow user
* [GET /api/users/{id}/following](./get-following.md) - List following

## **Frontend Notes**

* Used by `FollowButton` component
* Toggle state optimistically for better UX
* Handle 400 as success (already in desired state)
* Invalidate following list cache after success
