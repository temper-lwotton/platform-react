# **Endpoint: `GET /api/spaces/tags`**

### **Summary**

Retrieves all available space tags for filtering and categorization.

---

## **Authentication**

* **Required:** Yes
* **Scope:** Any authenticated user

## **Permissions**

* Any authenticated user can retrieve tags
* Tags are global, not space-specific

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
    { "id": 1, "name": "Technology" },
    { "id": 2, "name": "Operations" },
    { "id": 3, "name": "Sustainability" },
    { "id": 4, "name": "Policy" },
    { "id": 5, "name": "Innovation" },
    { "id": 6, "name": "Research" }
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

---

## **Related Endpoints**

* [GET /api/spaces](./list.md) - List spaces with tag filter

## **Frontend Notes**

* Used to populate filter dropdown in space listing
* Cache with long TTL (30min) - tags rarely change
* Fetch once on app initialization
* Use tag IDs for filtering, names for display
