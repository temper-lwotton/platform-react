# **Endpoint: `PATCH /api/users/{id}`**

### **Summary**

Updates a user's profile. Users can update their own profile; admins can update any profile.

---

## **Authentication**

* **Required:** Yes
* **Scope:** User themselves or admin

## **Permissions**

* Users can update their own profile
* Admins can update any user's profile
* Cannot change email address (requires verification flow)

---

## **Request**

### **Path Parameters**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `id` | string | Yes | User ID to update |

### **Query Parameters**

*None*

### **Headers**

| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Yes | `Bearer <token>` |
| `Content-Type` | Yes | `application/json` |

### **Request Body**

Partial update - only include fields to change:

```json
{
  "profile": {
    "jobTitle": "Senior Product Manager",
    "bio": "Updated bio with new information...",
    "interests": ["AI", "Sustainability", "Innovation"]
  }
}
```

#### **Validation Rules**

| Field | Rules |
|-------|-------|
| `profile.firstName` | Max 100 characters |
| `profile.lastName` | Max 100 characters |
| `profile.companyName` | Max 200 characters |
| `profile.jobTitle` | Max 100 characters |
| `profile.telephone` | Valid phone format |
| `profile.linkedInProfile` | Valid URL, must be linkedin.com |
| `profile.bio` | Max 2000 characters |
| `profile.interests` | Array of strings, max 20 items |

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
    "email": "john@example.com",
    "profile": {
      "firstName": "John",
      "lastName": "Doe",
      "fullName": "John Doe",
      "companyName": "Acme Corp",
      "jobTitle": "Senior Product Manager",
      "companyType": "Operator",
      "photo": "https://cdn.example.com/photos/123.jpg",
      "bio": "Updated bio with new information...",
      "interests": ["AI", "Sustainability", "Innovation"]
    },
    "adminSpaces": [],
    "memberSpaces": [
      { "id": "1", "title": "AI & Machine Learning" }
    ]
  },
  "message": "Profile updated successfully"
}
```

### **Error Responses**

| Status | Code | When |
|--------|------|------|
| 401 | `UNAUTHENTICATED` | Missing or invalid token |
| 403 | `FORBIDDEN` | Not own profile and not admin |
| 404 | `USER_NOT_FOUND` | User ID does not exist |
| 422 | `VALIDATION_ERROR` | Invalid input data |

---

## **Side Effects**

| Effect | Description |
|--------|-------------|
| `user.updated` event | Emitted with changed fields |
| Cache invalidation | User profile cache invalidated |

## **Idempotency**

* **Idempotent:** Yes
* **Retry-safe:** Yes

---

## **Related Endpoints**

* [GET /api/users/{id}](./get.md) - Get user profile
* [POST /api/users](./create.md) - Create user
* [DELETE /api/users/{id}](./delete.md) - Delete user

## **Frontend Notes**

* Used by profile edit form on `/users/[id]/edit`
* Send only changed fields to minimize payload
* Invalidate cached profile data after successful update
* Handle optimistic updates for better UX
