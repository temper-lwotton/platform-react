# **Authentication API Endpoints**

**Domain:** [Authentication](../../domains/authentication.md)

**Base Path:** `/api/auth`

---

## **Endpoint Index**

| Method | Path | Description |
|--------|------|-------------|
| POST | [`/api/auth/login`](./login.md) | Authenticate with email/password |
| GET | [`/api/auth/me`](./me.md) | Get current authenticated user |

---

## **Common Patterns**

### **Token Usage**

After successful login, include the token in all subsequent requests:

```
Authorization: Bearer <jwt_token>
```

### **Error Handling**

Authentication errors return:

```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Authentication failed"
  }
}
```

### **Client-Side Storage**

Upon login, store these values in localStorage:

| Key | Value |
|-----|-------|
| `jwt_token` | JWT token from response |
| `current_user_id` | `user.id` from response |
| `current_user_email` | `user.email` from response |
| `current_user_name` | `user.fullName` from response |
