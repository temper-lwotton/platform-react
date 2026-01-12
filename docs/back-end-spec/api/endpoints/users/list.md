# **Endpoint: `GET /api/users`**

### **Summary**

Retrieves a paginated list of users with optional search and filtering.

---

## **Authentication**

* **Required:** Yes
* **Scope:** Any authenticated user

## **Permissions**

* Any authenticated user can list users
* Email visibility may be restricted based on user privacy settings

---

## **Request**

### **Path Parameters**

*None*

### **Query Parameters**

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `search` | string | No | - | Full-text search across name, company, bio |
| `companyType` | string | No | - | Filter by company type (e.g., "Operator", "Supplier") |
| `transportMode` | string | No | - | Filter by transport mode of interest |
| `sort` | string | No | `name` | Sort order: `name`, `newest`, `oldest` |
| `limit` | integer | No | 20 | Results per page (max 100) |
| `page` | integer | No | 1 | Page number |

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
      "id": "123",
      "createdAt": "2024-01-15T10:30:00Z",
      "email": "john@example.com",
      "profile": {
        "firstName": "John",
        "lastName": "Doe",
        "fullName": "John Doe",
        "companyName": "Acme Corp",
        "jobTitle": "Product Manager",
        "companyType": "Operator",
        "photo": "https://cdn.example.com/photos/123.jpg",
        "bio": "Passionate about sustainable transport..."
      },
      "adminSpaces": [],
      "memberSpaces": [
        { "id": "1", "title": "AI & Machine Learning" }
      ],
      "connectionStatus": "none"
    }
  ],
  "meta": {
    "total": 150,
    "page": 1,
    "limit": 20,
    "pages": 8
  }
}
```

### **Error Responses**

| Status | Code | When |
|--------|------|------|
| 401 | `UNAUTHENTICATED` | Missing or invalid token |

---

## **Side Effects**

*None*

## **Idempotency**

* **Idempotent:** Yes
* **Retry-safe:** Yes

## **Pagination**

* **Strategy:** Page-based
* **Parameters:** `page`, `limit`
* **Default page size:** 20
* **Maximum page size:** 100

---

## **Related Endpoints**

* [GET /api/users/{id}](./get.md) - Get single user
* [GET /api/users/{id}/connections](./get-connections.md) - Get user's connections

## **Frontend Notes**

* Used by `UserDirectory` component
* Results include `connectionStatus` for the authenticated user
* Handle missing profile fields (photo, bio) with defaults
* Debounce search input (300ms recommended)
