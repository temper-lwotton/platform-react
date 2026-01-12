# **Endpoint: `POST /api/discussion/{id}/like`**

### **Summary**

Likes a discussion. User ID is automatically detected from JWT token.

---

## **Authentication**

* **Required:** Yes
* **Scope:** Any authenticated user

## **Permissions**

* Any authenticated user can like discussions they have access to
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
| `Content-Type` | Yes | `application/json` |

### **Request Body**

```json
{}
```

*Empty body - user ID extracted from JWT token.*

---

## **Response**

### **Success Response**

**Status:** `200 OK`

```json
{
  "success": true,
  "message": "Discussion liked"
}
```

### **Error Responses**

| Status | Code | When |
|--------|------|------|
| 401 | `UNAUTHENTICATED` | Missing or invalid token |
| 403 | `ACCESS_DENIED` | Not a member of private space |
| 404 | `DISCUSSION_NOT_FOUND` | Discussion does not exist |
| 409 | `ALREADY_LIKED` | User has already liked this discussion |

---

## **Side Effects**

| Effect | Description |
|--------|-------------|
| `discussion.liked` event | Emitted for tracking |
| Notification | Sent to discussion author |
| `likesCount` | Incremented |
| `isLiked` | Set to true for this user |

## **Idempotency**

* **Idempotent:** No (returns 409 on duplicate)
* **Retry-safe:** Safe (409 indicates already liked)

---

## **Related Endpoints**

* [DELETE /api/discussion/{id}/unlike](./unlike.md) - Unlike
* [GET /api/discussion/{id}/likes](./get-likes.md) - Get likers

## **Frontend Notes**

* Used by like button component
* Update UI optimistically
* Handle 409 as success (already in desired state)
* Increment `likesCount` locally after success
