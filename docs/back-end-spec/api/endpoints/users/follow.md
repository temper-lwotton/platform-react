# **Endpoint: `POST /api/users/{id}/follows/{followeeId}`**

### **Summary**

Creates a one-way follow relationship. The user with `{id}` will follow the user with `{followeeId}`.

---

## **Authentication**

* **Required:** Yes
* **Scope:** User themselves only

## **Permissions**

* Users can only create follows from their own account
* `{id}` must match the authenticated user's ID

---

## **Request**

### **Path Parameters**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `id` | string | Yes | Follower user ID (must be authenticated user) |
| `followeeId` | string | Yes | User ID to follow |

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
  "message": "Now following user"
}
```

### **Error Responses**

| Status | Code | When |
|--------|------|------|
| 400 | `CANNOT_FOLLOW_SELF` | Attempting to follow yourself |
| 401 | `UNAUTHENTICATED` | Missing or invalid token |
| 403 | `FORBIDDEN` | `{id}` doesn't match authenticated user |
| 404 | `USER_NOT_FOUND` | Followee user does not exist |
| 409 | `ALREADY_FOLLOWING` | Already following this user |

---

## **Side Effects**

| Effect | Description |
|--------|-------------|
| `user.followed` event | Emitted for activity tracking |
| Notification | Sent to followee (if notifications enabled) |
| Feed update | Followee's content appears in follower's feed |

## **Idempotency**

* **Idempotent:** No (returns 409 on duplicate)
* **Retry-safe:** Safe (409 indicates success)

---

## **Related Endpoints**

* [DELETE /api/users/{id}/unfollows/{followeeId}](./unfollow.md) - Unfollow
* [GET /api/users/{id}/following](./get-following.md) - List following
* [GET /api/users/{id}/followers](./get-followers.md) - List followers

## **Frontend Notes**

* Used by `FollowButton` component
* Toggle state optimistically for better UX
* Handle 409 as success (already in desired state)
* Invalidate following list cache after success
