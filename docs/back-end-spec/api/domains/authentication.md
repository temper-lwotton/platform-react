# **API Domain Specification: Authentication**

*(Authoritative, conceptual, human-readable)*

## **API Domain: `Authentication`**

### **Description**

The Authentication domain handles user identity verification, JWT token issuance, and session management. It provides:

* Credential-based login (email/password)
* JWT token generation and validation
* Current user retrieval with full profile
* Session termination (logout)

This domain is the gateway to all authenticated functionality in the platform. All protected API calls require a valid JWT token issued by this domain.

---

## **Domain Responsibility**

### **This domain is responsible for:**

* Validating user credentials (email/password)
* Issuing JWT access tokens
* Providing current authenticated user information
* Token validation and refresh (future)
* Session management

### **Out of scope:**

* User registration (admin-only via Users domain)
* Password reset and recovery
* User profile management (see [Users](./users.md))
* Role and permission management
* OAuth/SSO integration (future)

---

## **Owned Data Models**

### **Core Entities**

#### **LoginCredentials**

```typescript
interface LoginCredentials {
  email: string;
  password: string;
}
```

#### **LoginResponse**

```typescript
interface LoginResponse {
  token: string;        // JWT access token
  expires_in: number;   // Token lifetime in seconds
  user: {
    id: number | string;
    email: string;
    fullName: string;
  };
}
```

#### **AuthUser (Stored Client-Side)**

```typescript
interface AuthUser {
  id: string;
  email: string;
  fullName: string;
}
```

#### **FullUser (from /api/auth/me)**

```typescript
interface FullUser {
  id: number;
  createdAt: string;           // ISO 8601
  externalId?: string;         // SSO identifier
  email: string;
  profile?: UserProfile;       // Full profile data
  adminSpaces: UserSpace[];    // Spaces user administers
  memberSpaces: UserSpace[];   // Spaces user belongs to
}

interface UserProfile {
  firstName?: string;
  lastName?: string;
  fullName?: string;
  companyName?: string;
  jobTitle?: string;
  dob?: string;
  telephone?: string;
  companyType?: string;
  linkedInProfile?: string;
  trigProjectTitle?: string;
  transportModesOfInterest?: string[];
  photo?: string;
}

interface UserSpace {
  id: number;
  title: string;
}
```

---

## **Business Rules**

1. **Credential Validation**: Email and password must match stored credentials
2. **Token Expiry**: Tokens expire after `expires_in` seconds (default: 24 hours)
3. **Token Storage**: Clients must store tokens; server does not maintain sessions
4. **Token Refresh**: No refresh mechanism - re-login required on expiry
5. **Invalid Token**: 401 returned on any invalid/expired token
6. **Login Required**: All protected endpoints require valid Bearer token
7. **Client Cleanup**: Client must clear stored auth data on logout or 401

---

## **Relationships & Concepts**

### **Token-Based Authentication**

The platform uses JWT (JSON Web Token) bearer authentication:

1. **Login** - User submits credentials, receives JWT token
2. **Storage** - Token stored in browser `localStorage`
3. **Usage** - Token included in `Authorization` header for all API calls
4. **Expiry** - Token expires after `expires_in` seconds
5. **Refresh** - Currently requires re-login (refresh token planned)

### **Client-Side Session**

Upon successful login, the following are stored in `localStorage`:

| Key | Value |
|-----|-------|
| `jwt_token` | JWT access token |
| `current_user_id` | User's numeric ID |
| `current_user_email` | User's email address |
| `current_user_name` | User's full name |

### **Auth Events**

The frontend dispatches custom events for auth state changes:

| Event | Trigger |
|-------|---------|
| `auth:login` | Successful login |
| `auth:logout` | Logout or token expiry |

Components can listen to these events to update their state.

### **Token Validation**

* Tokens are validated server-side on each request
* Invalid/expired tokens return `401 Unauthorized`
* The API client automatically clears auth and dispatches `auth:logout` on 401

---

## **Authentication & Permissions**

### **Authentication**

* **Login endpoint:** No authentication required
* **Me endpoint:** Valid JWT token required

### **Permission Rules**

| Action | Who Can Perform |
|--------|-----------------|
| Login | Anyone with valid credentials |
| Get current user | Any authenticated user |
| Logout | Client-side only (clear token) |

---

## **API Capabilities Overview**

The Authentication API allows consumers to:

* **Authenticate users** with email and password
* **Retrieve tokens** for subsequent API calls
* **Get current user** with full profile and space memberships
* **Validate sessions** implicitly via the me endpoint

---

## **Endpoint Groups**

| Group | Purpose | Endpoint Count |
|-------|---------|----------------|
| [Auth](../endpoints/auth/README.md) | Login and user retrieval | 2 |

Full endpoint details in the [Endpoint Reference](../endpoints/auth/README.md).

---

## **Domain Events & Side Effects**

### **Events Emitted**

| Event | Trigger | Payload |
|-------|---------|---------|
| `auth:login` (client) | Successful login | None |
| `auth:logout` (client) | Logout or 401 | None |

### **Side Effects**

| Event | Side Effect |
|-------|-------------|
| Successful login | Token stored, user data cached |
| Token expiry | All authenticated requests fail |
| Logout | Token and user data cleared |

---

## **Error Model**

Standard error envelope (see [API Conventions](../_index.md#error-codes)):

```typescript
{
  success: false,
  error: {
    code: string,
    message: string
  }
}
```

### **Domain-Specific Error Codes**

| Code | HTTP | Description |
|------|------|-------------|
| `INVALID_CREDENTIALS` | 401 | Email or password incorrect |
| `INVALID_REQUEST` | 400 | Malformed request body |
| `MISSING_FIELDS` | 400 | Required fields not provided |
| `TOKEN_EXPIRED` | 401 | JWT token has expired |
| `TOKEN_INVALID` | 401 | JWT token is malformed or invalid |

---

## **Frontend Usage Notes**

### **Primary Consumers**

| Route | Usage |
|-------|-------|
| `/login` | Login form |
| All protected routes | Token validation |

### **Service File**

```
src/lib/auth.ts
```

### **Key Functions**

| Function | Purpose |
|----------|---------|
| `login(credentials)` | Authenticate and store token |
| `logout()` | Clear auth state |
| `getToken()` | Get stored JWT token |
| `getCurrentUser()` | Get cached user data |
| `fetchCurrentUser()` | Fetch full user from API |
| `isAuthenticated()` | Check if token exists |

### **API Client Integration**

The API client (`src/lib/api-client.ts`) automatically:
* Includes `Authorization: Bearer <token>` header
* Clears auth and dispatches `auth:logout` on 401 responses
* Works with the `NEXT_PUBLIC_API_BASE_URL` environment variable

### **Token Storage**

| Storage | Key | Value |
|---------|-----|-------|
| localStorage | `jwt_token` | JWT string |
| localStorage | `current_user_id` | User ID |
| localStorage | `current_user_email` | Email |
| localStorage | `current_user_name` | Full name |

---

## **Performance & Constraints**

### **Request Volume**

| Endpoint | Expected Volume |
|----------|-----------------|
| Login | Low (once per session) |
| Me | Medium (on page load, route changes) |

### **Rate Limiting**

| Endpoint | Limit |
|----------|-------|
| Login | 10/minute per IP (prevent brute force) |
| Me | Standard authenticated limits |

### **Known Constraints**

* No refresh token mechanism (requires re-login on expiry)
* Token stored in localStorage (XSS vulnerability consideration)
* No "remember me" functionality
* No multi-factor authentication

---

## **Related Routes**

| Route | Relationship |
|-------|--------------|
| `/login` | Login page |
| `/` | Redirects to login if not authenticated |
| All `/admin/*` | Require authentication |

---

## **Related Domains**

| Domain | Relationship |
|--------|--------------|
| [Users](./users.md) | User profile data |
| [Spaces](./spaces.md) | Space membership in FullUser |

---

## **Non-Goals / Explicit Exclusions**

* **User registration** - Not self-service, admin creates users
* **Password reset** - Not currently implemented
* **OAuth/SSO** - Future enhancement
* **Multi-factor auth** - Future enhancement
* **Session invalidation** - No server-side session tracking

---

## **Stability & Change Policy**

* **Stability:** Stable
* **Breaking changes:** 30-day deprecation notice
* **Versioning:** Currently v1 (implicit)

### **Planned Enhancements**

* Refresh token mechanism
* Password reset flow
* OAuth2/SSO integration
* Multi-factor authentication
* Server-side session management

---

## **Open Questions / Notes**

* Consider moving token from localStorage to httpOnly cookie
* Need to implement refresh token for better UX
* Consider adding login attempt logging for security
* Password complexity requirements not documented
