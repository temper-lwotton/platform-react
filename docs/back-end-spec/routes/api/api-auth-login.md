# **Route Specification: API Auth Login**

## **1. Route Path**

**`POST /api/auth/login`**

## **2. Description**

Authentication endpoint that proxies login requests to the backend Symfony API. Validates credentials and returns authentication tokens.

* Credential validation
* JWT token issuance
* Backend API proxy
* Error handling

## **3. Source File**

```
src/app/api/auth/login/route.ts
```

## **4. Route Responsibility**

### **This route is responsible for:**

* Receiving login credentials
* Proxying to backend Symfony API
* Returning authentication tokens
* Handling auth errors

### **This route does not:**

* Store credentials
* Manage user sessions
* Handle password reset
* Render login UI

## **5. Authentication & Access Control**

* **Authentication Required:** No (this creates auth)
* **Allowed Roles:** Any (public endpoint)
* **Permission Rules:** None

## **6. URL Parameters & Query Params**

*None*

## **7. Request Structure**

### **Method**

`POST`

### **Headers**

| Header | Value | Required |
|--------|-------|----------|
| Content-Type | `application/json` | Yes |

### **Request Body**

```typescript
interface LoginRequest {
    email: string;    // User's email address
    password: string; // User's password
}
```

### **Example Request**

```json
{
    "email": "user@example.com",
    "password": "securepassword123"
}
```

## **8. Response Structure**

### **Success Response (200 OK)**

```typescript
interface LoginResponse {
    token: string;           // JWT authentication token
    user: {
        id: number;
        email: string;
        name: string;
        // Additional user fields from backend
    };
}
```

### **Error Responses**

| Status | Description | Body |
|--------|-------------|------|
| 400 | Invalid request body (malformed JSON) | `{ "error": "Invalid request body" }` |
| 400 | Missing required fields | `{ "error": "Email and password are required" }` |
| 401 | Invalid credentials | `{ "error": "Authentication failed" }` |
| 500 | Server/network error | `{ "error": "Login failed" }` |

## **9. Data Flow Overview**

1. Receive POST request with credentials
2. Validate request body structure
3. Check required fields present
4. Proxy request to backend API
5. Parse backend response
6. Return token and user data or error

## **10. Backend Proxy**

### **Target Endpoint**

`NEXT_PUBLIC_API_BASE_URL/api/auth/user/login`

### **Fallback**

Falls back to `http://localhost:8000` if environment variable not set.

## **11. Environment Variables**

| Variable | Purpose | Default |
|----------|---------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | Backend API base URL | `http://localhost:8000` |

## **12. Behaviour Matrix**

| Condition | Response |
|-----------|----------|
| Valid credentials | 200 with token + user |
| Invalid email/password | 401 Authentication failed |
| Malformed JSON | 400 Invalid request body |
| Missing fields | 400 Email and password required |
| Backend error | 500 Login failed |

## **13. Error Handling**

* Parses backend error messages when available
* Returns generic "Authentication failed" for unparseable errors
* Logs fetch errors for debugging

## **14. Security Considerations**

* No credential storage in frontend
* Proxies through Next.js to hide backend URL
* JWT token returned for subsequent requests

## **15. Performance & Constraints**

* **Rendering strategy:** Server-side API route
* **Caching:** None (authentication should not be cached)
* **Known constraints:**
  * Depends on backend Symfony API availability
  * Network latency affects response time

## **16. Testing Strategy**

### **Unit Tests**

* Request body validation
* Error response formatting
* Field presence checking

### **Integration Tests**

* Backend proxy behavior
* Token response handling

### **E2E Tests**

* Complete login flow

## **17. Non-Goals / Out of Scope**

* Password reset
* User registration
* Token refresh
* Session management

## **18. Related Routes**

| Route | Relationship |
|-------|--------------|
| `/login` | Login page (frontend) |
| `/api/auth/logout` | Logout endpoint |

## **19. Open Questions / Notes**

* Consider adding rate limiting
* May need token refresh endpoint
* Consider adding remember me functionality
