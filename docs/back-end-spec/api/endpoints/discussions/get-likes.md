# **Endpoint: `GET /api/discussion/{id}/likes`**

### **Summary**

Retrieves the list of users who have liked a discussion.

---

## **Authentication**

* **Required:** Yes
* **Scope:** Any authenticated user

## **Permissions**

* Any authenticated user can view likes
* Respects space access (private space restrictions)

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
  "data": [
    {
      "id": "456",
      "fullName": "Jane Smith",
      "profile": {
        "fullName": "Jane Smith",
        "firstName": "Jane",
        "lastName": "Smith",
        "photo": "https://cdn.example.com/photos/456.jpg"
      }
    },
    {
      "id": "789",
      "fullName": "Bob Wilson",
      "profile": {
        "fullName": "Bob Wilson",
        "photo": "https://cdn.example.com/photos/789.jpg"
      }
    }
  ]
}
```

### **Error Responses**

| Status | Code | When |
|--------|------|------|
| 401 | `UNAUTHENTICATED` | Missing or invalid token |
| 403 | `ACCESS_DENIED` | Not a member of private space |
| 404 | `DISCUSSION_NOT_FOUND` | Discussion does not exist |

---

## **Side Effects**

*None*

## **Idempotency**

* **Idempotent:** Yes
* **Retry-safe:** Yes

---

## **Related Endpoints**

* [POST /api/discussion/{id}/like](./like.md) - Like
* [DELETE /api/discussion/{id}/unlike](./unlike.md) - Unlike

## **Frontend Notes**

* Used for "Liked by" tooltip/modal
* Show avatars of recent likers
* Link to user profiles
* No pagination - returns full list
