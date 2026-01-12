# **Endpoint: `GET /api/suggestions/{type}`**

### **Summary**

Retrieves suggestions filtered by a specific content type.

---

## **Authentication**

* **Required:** Yes
* **Scope:** Any authenticated user

## **Permissions**

* User receives suggestions based on their activity and interests

---

## **Request**

### **Path Parameters**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `type` | string | Yes | Suggestion type: user, space, event, discussion, resource, showcase |

### **Query Parameters**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `limit` | number | No | Max suggestions (default: 20, max: 50) |
| `cursor` | string | No | Pagination cursor |
| `minScore` | number | No | Minimum relevance score (0-100) |

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
      "id": "sug_123",
      "type": "user",
      "title": "Dr. Emily Chen",
      "description": "AI Research Scientist specializing in neural networks and deep learning",
      "reason": "You both have interest in Machine Learning and Neural Networks",
      "url": "/users/15",
      "image": "https://cdn.example.com/avatars/user_15.jpg",
      "entityId": "user_15",
      "entityType": "user",
      "score": 87,
      "createdAt": "2024-01-20T10:00:00Z",
      "metadata": {
        "jobTitle": "AI Research Scientist",
        "company": "TechCorp",
        "mutualConnections": 12,
        "sharedInterests": ["Machine Learning", "Neural Networks", "Python"]
      }
    },
    {
      "id": "sug_130",
      "type": "user",
      "title": "Marcus Johnson",
      "description": "Senior Data Engineer with expertise in MLOps",
      "reason": "12 mutual connections",
      "url": "/users/42",
      "image": "https://cdn.example.com/avatars/user_42.jpg",
      "entityId": "user_42",
      "entityType": "user",
      "score": 81,
      "createdAt": "2024-01-20T09:45:00Z",
      "metadata": {
        "jobTitle": "Senior Data Engineer",
        "company": "DataFlow Inc",
        "mutualConnections": 12,
        "sharedSpaces": 3,
        "sharedInterests": ["MLOps", "Data Engineering"]
      }
    },
    {
      "id": "sug_135",
      "type": "user",
      "title": "Sarah Williams",
      "description": "Product Manager focused on AI-powered products",
      "reason": "Works in similar domain as you",
      "url": "/users/67",
      "image": "https://cdn.example.com/avatars/user_67.jpg",
      "entityId": "user_67",
      "entityType": "user",
      "score": 74,
      "createdAt": "2024-01-20T09:30:00Z",
      "metadata": {
        "jobTitle": "Product Manager",
        "company": "AI Startup",
        "mutualConnections": 5,
        "sharedInterests": ["Product Management", "AI Products"]
      }
    }
  ],
  "meta": {
    "nextCursor": "eyJzY29yZSI6NzQsImlkIjoic3VnXzEzNSJ9",
    "hasMore": true,
    "totalAvailable": 12
  }
}
```

### **Error Responses**

| Status | Code | When |
|--------|------|------|
| 400 | `INVALID_TYPE` | Invalid suggestion type |
| 400 | `INVALID_SCORE` | minScore out of range |
| 401 | `UNAUTHENTICATED` | Missing or invalid token |

---

## **Side Effects**

*None*

## **Idempotency**

* **Idempotent:** Yes
* **Retry-safe:** Yes

## **Pagination**

* Cursor-based using `cursor` parameter
* Ordered by score descending

---

## **Related Endpoints**

* [GET /api/suggestions](./list.md) - All suggestions
* [GET /api/suggestions/count](./count.md) - Suggestion counts by type

## **Frontend Notes**

* Use for dedicated "People you may know" or "Spaces to explore" pages
* Implement infinite scroll for browsing
* Show type-specific metadata prominently
* Display clear reasons for each suggestion
