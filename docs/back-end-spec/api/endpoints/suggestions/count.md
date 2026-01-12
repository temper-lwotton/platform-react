# **Endpoint: `GET /api/suggestions/count`**

### **Summary**

Returns the total number of available suggestions grouped by type, useful for badge display.

---

## **Authentication**

* **Required:** Yes
* **Scope:** Any authenticated user

## **Permissions**

* User sees counts for their personalized suggestions

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
    "total": 47,
    "byType": {
      "user": 12,
      "space": 8,
      "event": 6,
      "discussion": 10,
      "resource": 7,
      "showcase": 4
    }
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

---

## **Related Endpoints**

* [GET /api/suggestions](./list.md) - List suggestions
* [GET /api/suggestions/{type}](./list-by-type.md) - Suggestions by type

## **Frontend Notes**

* Use for displaying badge counts in navigation
* Cache response to reduce API calls
* Refresh count after user dismisses suggestions
* Consider WebSocket updates for real-time count changes
