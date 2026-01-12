# **Endpoint: `GET /api/users/{id}`**

### **Summary**

Retrieves a single user's profile by ID.

---

## **Authentication**

* **Required:** Yes
* **Scope:** Any authenticated user

## **Permissions**

* Any authenticated user can view user profiles
* Some profile fields may be restricted based on privacy settings

---

## **Request**

### **Path Parameters**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `id` | string | Yes | User ID |

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
  "data": {
    "id": "123",
    "createdAt": "2024-01-15T10:30:00Z",
    "externalId": "sso-abc123",
    "email": "john@example.com",
    "profile": {
      "firstName": "John",
      "lastName": "Doe",
      "fullName": "John Doe",
      "companyName": "Acme Corp",
      "jobTitle": "Product Manager",
      "dob": "1985-06-15",
      "telephone": "+44 7700 900000",
      "companyType": "Operator",
      "linkedInProfile": "https://linkedin.com/in/johndoe",
      "trigProjectTitle": "Urban Mobility Initiative",
      "transportModesOfInterest": "Rail, Bus",
      "photo": "https://cdn.example.com/photos/123.jpg",
      "bio": "Passionate about sustainable transport solutions...",
      "interests": ["AI", "Sustainability", "Urban Planning"]
    },
    "adminSpaces": [
      { "id": "5", "title": "Urban Transport" }
    ],
    "memberSpaces": [
      { "id": "1", "title": "AI & Machine Learning" },
      { "id": "3", "title": "Sustainable Mobility" }
    ],
    "connectionStatus": "connected"
  }
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

---

## **Related Endpoints**

* [GET /api/users](./list.md) - List all users
* [PATCH /api/users/{id}](./update.md) - Update user
* [GET /api/users/{id}/connections](./get-connections.md) - Get connections

## **Frontend Notes**

* Used by `UserProfile` component on `/users/[id]` route
* `connectionStatus` indicates relationship with authenticated user
* If viewing own profile, `connectionStatus` will be `"none"`
* Cache with medium TTL (5min), invalidate on profile update
