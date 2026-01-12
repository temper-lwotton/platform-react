# **Endpoint: `DELETE /api/discussion/{id}/unfollow`**

### **Summary**

Unfollows a discussion to stop receiving notifications.

---

## **Authentication**

* **Required:** Yes
* **Scope:** Any authenticated user

## **Permissions**

* User can only unfollow discussions they are following

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
  "message": "Unfollowed discussion"
}
```

### **Error Responses**

| Status | Code | When |
|--------|------|------|
| 400 | `NOT_FOLLOWING` | User is not following this discussion |
| 401 | `UNAUTHENTICATED` | Missing or invalid token |
| 404 | `DISCUSSION_NOT_FOUND` | Discussion does not exist |

---

## **Side Effects**

| Effect | Description |
|--------|-------------|
| `discussion.unfollowed` event | Emitted for tracking |
| `followersCount` | Decremented |
| `isFollowing` | Set to false for this user |
| Notifications disabled | User stops receiving updates |

## **Idempotency**

* **Idempotent:** No (returns 400 on duplicate)
* **Retry-safe:** Safe (400 indicates already unfollowed)

---

## **Related Endpoints**

* [POST /api/discussion/{id}/follow](./follow.md) - Follow
* [GET /api/discussion/{id}](./get.md) - Check isFollowing

## **Frontend Notes**

* Used by follow button component
* Update `isFollowing` optimistically
* Handle 400 as success (already in desired state)
