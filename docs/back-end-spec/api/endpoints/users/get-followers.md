# **Endpoint: `GET /api/users/{id}/followers`**

### **Summary**

Retrieves the list of users following the specified user.

---

## **Authentication**

* **Required:** Yes
* **Scope:** Any authenticated user

## **Permissions**

* Any authenticated user can view follower lists
* Privacy settings may restrict visibility (future enhancement)

---

## **Request**

### **Path Parameters**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `id` | string | Yes | User ID whose followers to retrieve |

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
      "id": "789",
      "createdAt": "2024-03-05T12:00:00Z",
      "email": "bob@example.com",
      "profile": {
        "firstName": "Bob",
        "lastName": "Wilson",
        "fullName": "Bob Wilson",
        "companyName": "Transport Co",
        "jobTitle": "Operations Manager",
        "photo": "https://cdn.example.com/photos/789.jpg"
      },
      "adminSpaces": [],
      "memberSpaces": [
        { "id": "2", "title": "Operations Excellence" }
      ],
      "connectionStatus": "none"
    }
  ]
}
```

### **Error Responses**

| Status | Code | When |
|--------|------|------|
| 401 | `UNAUTHENTICATED` | Missing or invalid token |
| 404 | `USER_NOT_FOUND` | User ID does not exist |

---

## **Side Effects**

*None*

## **Idempotency**

* **Idempotent:** Yes
* **Retry-safe:** Yes

## **Pagination**

* **Strategy:** Not paginated (returns full list)
* **Note:** May need pagination for users with many followers

---

## **Related Endpoints**

* [GET /api/users/{id}/following](./get-following.md) - Get following
* [POST /api/users/{id}/follows/{followeeId}](./follow.md) - Follow user
* [DELETE /api/users/{id}/unfollows/{followeeId}](./unfollow.md) - Unfollow user

## **Frontend Notes**

* Used on user profile "Followers" tab
* `connectionStatus` is relative to authenticated user
* Can be used to show mutual follows (user follows back)
