# **Endpoint: `DELETE /api/discussion/{id}/unlike`**

### **Summary**

Removes a like from a discussion. User ID is automatically detected from JWT token.

---

## **Authentication**

* **Required:** Yes
* **Scope:** Any authenticated user

## **Permissions**

* User can only unlike discussions they have previously liked

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
  "message": "Discussion unliked"
}
```

### **Error Responses**

| Status | Code | When |
|--------|------|------|
| 400 | `NOT_LIKED` | User has not liked this discussion |
| 401 | `UNAUTHENTICATED` | Missing or invalid token |
| 404 | `DISCUSSION_NOT_FOUND` | Discussion does not exist |

---

## **Side Effects**

| Effect | Description |
|--------|-------------|
| `discussion.unliked` event | Emitted for tracking |
| `likesCount` | Decremented |
| `isLiked` | Set to false for this user |

## **Idempotency**

* **Idempotent:** No (returns 400 on duplicate)
* **Retry-safe:** Safe (400 indicates already unliked)

---

## **Related Endpoints**

* [POST /api/discussion/{id}/like](./like.md) - Like
* [GET /api/discussion/{id}/likes](./get-likes.md) - Get likers

## **Frontend Notes**

* Used by like button component
* Update UI optimistically
* Handle 400 as success (already in desired state)
* Decrement `likesCount` locally after success
