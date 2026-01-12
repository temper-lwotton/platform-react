# **Endpoint: `GET /api/auth/me`**

### **Summary**

Retrieves the currently authenticated user with full profile details and space memberships.

---

## **Authentication**

* **Required:** Yes
* **Scope:** Any authenticated user

## **Permissions**

* User can only retrieve their own data
* Returns complete profile including private fields

---

## **Request**

### **Path Parameters**

*None*

### **Query Parameters**

*None*

### **Headers**

| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Yes | `Bearer <jwt_token>` |

### **Request Body**

*None*

---

## **Response**

### **Success Response**

**Status:** `200 OK`

```json
{
  "id": 123,
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
    "transportModesOfInterest": ["Rail", "Bus"],
    "photo": "https://cdn.example.com/photos/123.jpg"
  },
  "adminSpaces": [
    { "id": 5, "title": "Urban Transport" }
  ],
  "memberSpaces": [
    { "id": 1, "title": "AI & Machine Learning" },
    { "id": 3, "title": "Sustainable Mobility" }
  ]
}
```

| Field | Type | Description |
|-------|------|-------------|
| `id` | number | User's unique identifier |
| `createdAt` | string | Account creation date (ISO 8601) |
| `externalId` | string? | External SSO identifier |
| `email` | string | User's email address |
| `profile` | object | Full profile data |
| `adminSpaces` | array | Spaces user administers |
| `memberSpaces` | array | Spaces user is member of |

### **Error Responses**

| Status | Code | When |
|--------|------|------|
| 401 | `UNAUTHENTICATED` | Missing or invalid token |
| 401 | `TOKEN_EXPIRED` | Token has expired |

---

## **Side Effects**

*None*

## **Idempotency**

* **Idempotent:** Yes
* **Retry-safe:** Yes

---

## **Related Endpoints**

* [POST /api/auth/login](./login.md) - Login to get token
* [GET /api/users/{id}](../users/get.md) - Get any user's profile
* [PATCH /api/users/{id}](../users/update.md) - Update profile

## **Frontend Notes**

* Called on app initialization to validate session
* Called after login to get full user data
* Use for checking space membership/admin status
* Cache response with medium TTL (5min)
* On 401, clear auth and redirect to login

### **Usage Patterns**

**Session validation on app load:**
```typescript
useEffect(() => {
  const token = localStorage.getItem('jwt_token');
  if (token) {
    fetchCurrentUser()
      .then(user => setUser(user))
      .catch(() => {
        clearAuth();
        router.push('/login');
      });
  }
}, []);
```

**Check admin status:**
```typescript
const isSpaceAdmin = (spaceId: number) => {
  return user.adminSpaces.some(s => s.id === spaceId);
};
```
