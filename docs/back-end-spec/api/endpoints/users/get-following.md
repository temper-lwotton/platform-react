# **Endpoint: `GET /api/users/{id}/following`**

### **Summary**

Retrieves the list of users that the specified user is following.

---

## **Authentication**

* **Required:** Yes
* **Scope:** Any authenticated user

## **Permissions**

* Any authenticated user can view following lists
* Privacy settings may restrict visibility (future enhancement)

---

## **Request**

### **Path Parameters**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `id` | string | Yes | User ID whose following list to retrieve |

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
      "createdAt": "2024-02-10T08:00:00Z",
      "email": "jane@example.com",
      "profile": {
        "firstName": "Jane",
        "lastName": "Smith",
        "fullName": "Jane Smith",
        "companyName": "Tech Corp",
        "jobTitle": "CTO",
        "photo": "https://cdn.example.com/photos/456.jpg"
      },
      "adminSpaces": [],
      "memberSpaces": [
        { "id": "1", "title": "AI & Machine Learning" }
      ],
      "connectionStatus": "connected"
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
* **Note:** May need pagination for users with many follows

---

## **Related Endpoints**

* [GET /api/users/{id}/followers](./get-followers.md) - Get followers
* [POST /api/users/{id}/follows/{followeeId}](./follow.md) - Follow user
* [DELETE /api/users/{id}/unfollows/{followeeId}](./unfollow.md) - Unfollow user

## **Frontend Notes**

* Used on user profile "Following" tab
* `connectionStatus` is relative to authenticated user, not the profile owner
* Cache with short TTL (1min) as follow lists change frequently
