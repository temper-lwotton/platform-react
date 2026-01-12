# **Endpoint: `POST /api/auth/login`**

### **Summary**

Authenticates a user with email and password, returning a JWT token for subsequent API calls.

---

## **Authentication**

* **Required:** No (this endpoint creates authentication)
* **Scope:** Public

## **Permissions**

* Anyone can attempt login
* Rate limited to prevent brute force attacks

---

## **Request**

### **Path Parameters**

*None*

### **Query Parameters**

*None*

### **Headers**

| Header | Required | Description |
|--------|----------|-------------|
| `Content-Type` | Yes | `application/json` |

### **Request Body**

```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

#### **Validation Rules**

| Field | Rules |
|-------|-------|
| `email` | Required, valid email format |
| `password` | Required, non-empty |

---

## **Response**

### **Success Response**

**Status:** `200 OK`

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 3600,
  "user": {
    "id": 123,
    "email": "user@example.com",
    "fullName": "John Doe"
  }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `token` | string | JWT access token |
| `expires_in` | number | Token lifetime in seconds |
| `user.id` | number | User's unique identifier |
| `user.email` | string | User's email address |
| `user.fullName` | string | User's display name |

### **Error Responses**

| Status | Code | When |
|--------|------|------|
| 400 | `INVALID_REQUEST` | Malformed JSON body |
| 400 | `MISSING_FIELDS` | Email or password not provided |
| 401 | `INVALID_CREDENTIALS` | Email not found or password incorrect |
| 429 | `RATE_LIMITED` | Too many login attempts |
| 500 | `SERVER_ERROR` | Internal server error |

**Error Example:**

```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Authentication failed"
  }
}
```

---

## **Backend Proxy**

This endpoint proxies to the backend Symfony API:

```
POST ${NEXT_PUBLIC_API_BASE_URL}/api/auth/user/login
```

Default: `http://localhost:8000`

---

## **Side Effects**

| Effect | Description |
|--------|-------------|
| Session created | Backend creates session/token |
| Audit log | Login attempt may be logged |

## **Idempotency**

* **Idempotent:** No
* **Retry-safe:** Yes (safe to retry on network failure)

## **Rate Limiting**

| Limit | Scope |
|-------|-------|
| 10 requests/minute | Per IP address |
| 5 failed attempts | Temporary lockout |

---

## **Related Endpoints**

* [GET /api/auth/me](./me.md) - Get current user after login

## **Frontend Notes**

* Used by login form on `/login` page
* Store token and user data in localStorage after success
* Dispatch `auth:login` event for component updates
* Redirect to home or intended destination after login
* Show generic "Authentication failed" for security (don't reveal if email exists)

### **Implementation Example**

```typescript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

if (response.ok) {
  const data = await response.json();
  localStorage.setItem('jwt_token', data.token);
  localStorage.setItem('current_user_id', String(data.user.id));
  window.dispatchEvent(new CustomEvent('auth:login'));
}
```
