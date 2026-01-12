# **Endpoint: `GET /api/spaces`**

### **Summary**

Retrieves a list of spaces accessible to the authenticated user, with optional search and tag filtering.

---

## **Authentication**

* **Required:** Yes
* **Scope:** Any authenticated user

## **Permissions**

* Returns public spaces for all users
* Returns private spaces only for members of those spaces
* Filtering is applied server-side based on user membership

---

## **Request**

### **Path Parameters**

*None*

### **Query Parameters**

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `search` | string | No | - | Full-text search on title, subtitle, description |
| `tags[]` | number[] | No | - | Filter by tag IDs (array notation) |
| `matchAllTags` | boolean | No | `false` | `true` = AND logic, `false` = OR logic |
| `sort` | string | No | - | Sort order: `asc` or `desc` |

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
      "id": "1",
      "createdAt": "2024-01-10T09:00:00Z",
      "title": "AI & Machine Learning",
      "subtitle": "Exploring AI in transport",
      "description": "A space for discussing artificial intelligence applications...",
      "isPublic": true,
      "admins": [
        {
          "id": "123",
          "profile": {
            "fullName": "John Doe",
            "photo": "https://cdn.example.com/photos/123.jpg"
          }
        }
      ],
      "members": [
        {
          "id": "456",
          "profile": {
            "fullName": "Jane Smith",
            "photo": "https://cdn.example.com/photos/456.jpg"
          }
        }
      ],
      "tags": [
        { "id": 1, "name": "Technology" },
        { "id": 5, "name": "Innovation" }
      ]
    }
  ]
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

* **Strategy:** Not paginated (returns full list)
* **Note:** May need pagination for large deployments

---

## **Related Endpoints**

* [GET /api/spaces/{id}](./get.md) - Get single space
* [GET /api/spaces/tags](./get-tags.md) - Get available tags

## **Frontend Notes**

* Used on home page space listing
* Used in space selector dropdowns
* Filter results client-side for additional criteria
* Cache with short TTL (1min)
* Debounce search input (300ms)
