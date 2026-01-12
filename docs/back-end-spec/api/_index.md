# **API Documentation Index**

## **Overview**

This documentation covers the backend API for the Spaces platform. It is organized into two tiers:

| Document Type | Purpose | Location |
|---------------|---------|----------|
| **Domain Specifications** | Conceptual overview, data models, responsibilities | `/api/domains/` |
| **Endpoint References** | Precise request/response details | `/api/endpoints/` |

**Read the Domain Spec first** to understand what a domain does, then consult Endpoint References for implementation details.

---

## **API Domains**

| Domain | Description | Endpoints |
|--------|-------------|-----------|
| [Authentication](./domains/authentication.md) | Login, tokens, session management | 2 |
| [Users](./domains/users.md) | User profiles, connections, following | 13 |
| [Spaces](./domains/spaces.md) | Community spaces and membership | 4 |
| [Discussions](./domains/discussions.md) | Posts, comments, likes, follows | 10 |
| [Events](./domains/events.md) | Event management and RSVPs | 8 |
| [Media](./domains/media.md) | File uploads with AI analysis | 9 |
| [CMS Posts](./domains/cms-posts.md) | Content management system | 7 |
| [CMS Settings](./domains/cms-settings.md) | Platform configuration | 6 |
| [Forms](./domains/forms.md) | Form builder and submissions | 13 |
| [Notifications](./domains/notifications.md) | User notifications | 5 |
| [Tasks](./domains/tasks.md) | Gamification and onboarding tasks | 4 |
| [Updates](./domains/updates.md) | Platform announcements | 4 |

---

## **API Conventions**

### **Base URL**

```
Production: https://api.spaces.example.com
Development: http://localhost:8000
```

Environment variable: `NEXT_PUBLIC_API_BASE_URL`

### **Authentication**

All authenticated endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

Tokens are obtained via `POST /api/auth/login` and stored client-side.

### **Response Envelope**

All API responses follow a consistent envelope structure:

#### **Success Response (Single Resource)**

```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

#### **Success Response (Collection)**

```json
{
  "success": true,
  "data": [ ... ],
  "meta": {
    "total": 150,
    "page": 1,
    "limit": 20,
    "pages": 8
  }
}
```

#### **Error Response**

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable error message",
    "errors": {
      "email": ["Email is required", "Must be valid email"],
      "password": ["Minimum 8 characters"]
    }
  }
}
```

### **Error Codes**

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHENTICATED` | 401 | No valid token provided |
| `FORBIDDEN` | 403 | Token valid but insufficient permissions |
| `NOT_FOUND` | 404 | Resource does not exist |
| `VALIDATION_ERROR` | 422 | Request body failed validation |
| `CONFLICT` | 409 | Resource state conflict (e.g., duplicate) |
| `RATE_LIMITED` | 429 | Too many requests |
| `SERVER_ERROR` | 500 | Internal server error |

### **Pagination**

Two pagination styles are supported:

#### **Page-Based (Preferred)**

```
GET /api/users?page=2&limit=20
```

| Parameter | Type | Default | Max |
|-----------|------|---------|-----|
| `page` | integer | 1 | - |
| `limit` | integer | 20 | 100 |

Response includes:
```json
{
  "meta": {
    "total": 150,
    "page": 2,
    "limit": 20,
    "pages": 8
  }
}
```

#### **Offset-Based (Legacy)**

```
GET /api/discussions?offset=40&limit=20
```

| Parameter | Type | Default | Max |
|-----------|------|---------|-----|
| `offset` | integer | 0 | - |
| `limit` | integer | 20 | 100 |

### **Filtering**

#### **Text Search**

```
GET /api/users?search=john
```

Searches across relevant text fields (name, email, bio, etc.).

#### **Exact Filters**

```
GET /api/events?space=123&status=published
```

#### **Array Filters**

Use bracket notation for arrays:

```
GET /api/spaces?tags[]=1&tags[]=2&tags[]=3
```

#### **Match Mode**

For array filters, control AND/OR logic:

```
GET /api/spaces?tags[]=1&tags[]=2&matchAllTags=true   # AND
GET /api/spaces?tags[]=1&tags[]=2&matchAllTags=false  # OR (default)
```

### **Sorting**

#### **Simple Sort**

```
GET /api/users?sort=newest
GET /api/users?sort=oldest
GET /api/events?sort=asc
GET /api/events?sort=desc
```

#### **Field + Order**

```
GET /api/forms?orderBy=createdAt&order=desc
GET /api/forms?orderBy=title&order=asc
```

### **Date & Time**

All dates use **ISO 8601 format with UTC timezone**:

```
2024-01-15T10:30:00Z
```

Date range filtering:

```
GET /api/events?startDate=2024-01-01T00:00:00Z&endDate=2024-12-31T23:59:59Z
```

### **File Uploads**

File uploads use `multipart/form-data`:

```
POST /api/media/upload
Content-Type: multipart/form-data

file: <binary>
title: "My Image"
altText: "Description of image"
```

**Important:** Do not manually set `Content-Type` header when uploading files. Let the browser set it with the boundary.

#### **Multiple Files**

```
files[]: <binary>
files[]: <binary>
```

### **HTTP Methods**

| Method | Purpose | Idempotent |
|--------|---------|------------|
| `GET` | Retrieve resource(s) | Yes |
| `POST` | Create resource | No |
| `PUT` | Replace resource entirely | Yes |
| `PATCH` | Partial update | Yes |
| `DELETE` | Remove resource | Yes |

### **HTTP Status Codes**

| Status | Meaning | When Used |
|--------|---------|-----------|
| `200` | OK | Successful GET, PUT, PATCH |
| `201` | Created | Successful POST |
| `204` | No Content | Successful DELETE |
| `400` | Bad Request | Malformed request |
| `401` | Unauthorized | Missing/invalid token |
| `403` | Forbidden | Valid token, no permission |
| `404` | Not Found | Resource doesn't exist |
| `409` | Conflict | State conflict |
| `422` | Unprocessable Entity | Validation failed |
| `429` | Too Many Requests | Rate limited |
| `500` | Server Error | Internal error |

### **Rate Limiting**

Default limits (per authenticated user):

| Endpoint Type | Limit |
|---------------|-------|
| Read (GET) | 1000/hour |
| Write (POST/PUT/PATCH) | 100/hour |
| Delete | 50/hour |
| File Upload | 20/hour |

Rate limit headers:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 950
X-RateLimit-Reset: 1705312800
```

---

## **Frontend Integration**

### **API Client Location**

```
src/lib/api-client.ts      # Generic fetch wrapper
src/services/cms/api/      # CMS-specific Axios client
```

### **Authentication Flow**

1. User submits credentials to `POST /api/auth/login`
2. Server returns JWT token
3. Token stored in `localStorage` as `jwt_token`
4. All subsequent requests include `Authorization: Bearer <token>`
5. On 401 response, client dispatches `auth:logout` event and clears token

### **Error Handling**

The API client automatically:
- Parses error responses
- Dispatches logout on 401
- Retries on network failure (configurable)

---

## **Service File Mapping**

| Domain | Service File |
|--------|--------------|
| Authentication | `src/lib/auth.ts` |
| Users | `src/lib/users.ts` |
| Spaces | `src/lib/spaces.ts` |
| Discussions | `src/lib/discussions.ts` |
| Events | `src/lib/events.ts` |
| Media | `src/lib/media-api.ts` |
| CMS | `src/services/cms/api/*.ts` |
| Forms | `src/lib/forms.ts` |
| Notifications | `src/lib/notifications.ts` |
| Tasks | `src/lib/tasks.ts` |

---

## **Versioning & Stability**

### **Current Version**

API v1 (implicit, no version prefix)

### **Breaking Change Policy**

- Breaking changes require minimum 30-day deprecation notice
- Deprecated endpoints return `X-Deprecated: true` header
- New versions introduced via URL prefix (`/api/v2/`)

### **Stability Tiers**

| Tier | Meaning |
|------|---------|
| **Stable** | No breaking changes without major version |
| **Beta** | May change with notice |
| **Experimental** | May change without notice |

All endpoints are **Stable** unless marked otherwise in their reference.
