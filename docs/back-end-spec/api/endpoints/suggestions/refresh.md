# **Endpoint: `POST /api/suggestions/refresh`**

### **Summary**

Forces regeneration of suggestions for the current user. Rate limited to prevent abuse.

---

## **Authentication**

* **Required:** Yes
* **Scope:** Any authenticated user

## **Permissions**

* User can refresh their own suggestions
* Rate limited to prevent excessive refreshes

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
  "data": {
    "refreshed": true,
    "newCount": 12,
    "nextRefreshAvailable": "2024-01-20T11:00:00Z"
  }
}
```

### **Error Responses**

| Status | Code | When |
|--------|------|------|
| 401 | `UNAUTHENTICATED` | Missing or invalid token |
| 429 | `RATE_LIMITED` | Too many refresh requests |

**Rate Limited Response:**

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMITED",
    "message": "Please wait before refreshing suggestions again",
    "nextRefreshAvailable": "2024-01-20T11:00:00Z"
  }
}
```

---

## **Side Effects**

| Effect | Description |
|--------|-------------|
| Cache invalidated | User's suggestion cache cleared |
| Regeneration queued | Background job triggered |
| New suggestions | Fresh suggestions based on current signals |
| `suggestions.refreshed` event | Emitted for tracking |

## **Idempotency**

* **Idempotent:** No (triggers regeneration each time within rate limit)
* **Retry-safe:** Yes (subsequent calls within rate limit fail gracefully)

---

## **Related Endpoints**

* [GET /api/suggestions](./list.md) - List suggestions
* [GET /api/suggestions/count](./count.md) - Get updated counts

## **Frontend Notes**

* Provide "Refresh suggestions" button in settings
* Show countdown timer when rate limited
* Display loading state during regeneration
* Refresh suggestion list after successful refresh
* Show new count badge after refresh completes
