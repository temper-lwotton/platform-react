# **Endpoint: `POST /api/users`**

### **Summary**

Creates a new user account. Admin only.

---

## **Authentication**

* **Required:** Yes
* **Scope:** Admin users only

## **Permissions**

* Only administrators can create user accounts
* Regular users cannot create accounts via API (use registration flow)

---

## **Request**

### **Path Parameters**

*None*

### **Query Parameters**

*None*

### **Headers**

| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Yes | `Bearer <token>` |
| `Content-Type` | Yes | `application/json` |

### **Request Body**

```json
{
  "email": "newuser@example.com",
  "profile": {
    "firstName": "Jane",
    "lastName": "Smith",
    "companyName": "Tech Corp",
    "jobTitle": "Engineer",
    "companyType": "Supplier",
    "bio": "Software engineer specializing in transport systems"
  }
}
```

#### **Validation Rules**

| Field | Rules |
|-------|-------|
| `email` | Required, valid email format, unique |
| `profile.firstName` | Optional, max 100 characters |
| `profile.lastName` | Optional, max 100 characters |
| `profile.companyName` | Optional, max 200 characters |
| `profile.jobTitle` | Optional, max 100 characters |
| `profile.bio` | Optional, max 2000 characters |

---

## **Response**

### **Success Response**

**Status:** `201 Created`

```json
{
  "success": true,
  "data": {
    "id": "456",
    "createdAt": "2024-06-20T14:30:00Z",
    "email": "newuser@example.com",
    "profile": {
      "firstName": "Jane",
      "lastName": "Smith",
      "fullName": "Jane Smith",
      "companyName": "Tech Corp",
      "jobTitle": "Engineer",
      "companyType": "Supplier",
      "bio": "Software engineer specializing in transport systems"
    },
    "adminSpaces": [],
    "memberSpaces": []
  },
  "message": "User created successfully"
}
```

### **Error Responses**

| Status | Code | When |
|--------|------|------|
| 401 | `UNAUTHENTICATED` | Missing or invalid token |
| 403 | `FORBIDDEN` | Non-admin user |
| 409 | `EMAIL_ALREADY_EXISTS` | Email already registered |
| 422 | `VALIDATION_ERROR` | Invalid input data |

**Validation Error Example:**

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "errors": {
      "email": ["Email is required", "Must be a valid email address"],
      "profile.bio": ["Bio must not exceed 2000 characters"]
    }
  }
}
```

---

## **Side Effects**

| Effect | Description |
|--------|-------------|
| `user.created` event | Emitted for audit logging |
| Welcome email | Sent to new user (if email service configured) |

## **Idempotency**

* **Idempotent:** No
* **Retry-safe:** No (will fail with `EMAIL_ALREADY_EXISTS` on retry)

---

## **Related Endpoints**

* [GET /api/users](./list.md) - List users
* [PATCH /api/users/{id}](./update.md) - Update user
* [DELETE /api/users/{id}](./delete.md) - Delete user

## **Frontend Notes**

* Used in admin user management interface
* Not used in standard registration flow (which uses Authentication domain)
* Validate email format client-side before submission
